use super::{
    Admin, AdminOrCoordinator, SECURE_COOKIES, SESSION_COOKIE_NAME, SESSION_LIFE_TIME,
    error::AuthenticationError,
    role::Role,
    session::Sessions,
    user::{User, Users},
};
use crate::{
    APIError, AppState, ErrorResponse,
    audit_log::{AuditEvent, AuditService, UserLoggedInDetails, UserLoggedOutDetails},
};
use axum::{
    extract::{Path, State},
    http::HeaderValue,
    response::{IntoResponse, Json, Response},
};
use axum_extra::{TypedHeader, extract::CookieJar, headers::UserAgent};
use cookie::{Cookie, SameSite};
use hyper::{StatusCode, header::SET_COOKIE};
use serde::{Deserialize, Serialize};
use sqlx::Error;
use tracing::{debug, info};
use utoipa::ToSchema;
use utoipa_axum::{router::OpenApiRouter, routes};

pub fn router() -> OpenApiRouter<AppState> {
    OpenApiRouter::default()
        .routes(routes!(login))
        .routes(routes!(whoami))
        .routes(routes!(account_update))
        .routes(routes!(logout))
        .routes(routes!(user_list))
        .routes(routes!(user_create))
        .routes(routes!(user_get))
        .routes(routes!(user_update))
        .routes(routes!(user_delete))
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct Credentials {
    pub username: String,
    pub password: String,
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Eq, ToSchema)]
pub struct LoginResponse {
    pub user_id: u32,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[schema(value_type = String, nullable = false)]
    pub fullname: Option<String>,
    pub username: String,
    pub role: Role,
    pub needs_password_change: bool,
}

impl From<&User> for LoginResponse {
    fn from(user: &User) -> Self {
        Self {
            user_id: user.id(),
            fullname: user.fullname().map(|u| u.to_string()),
            username: user.username().to_string(),
            role: user.role(),
            needs_password_change: user.needs_password_change(),
        }
    }
}

/// Set default session cookie properties
pub(super) fn set_default_cookie_properties(cookie: &mut Cookie) {
    cookie.set_path("/");
    cookie.set_http_only(true);
    cookie.set_secure(SECURE_COOKIES);
    cookie.set_same_site(SameSite::Strict);
}

/// Login endpoint, authenticates a user and creates a new session + session cookie
#[utoipa::path(
    post,
    path = "/api/user/login",
    request_body = Credentials,
    responses(
        (status = 200, description = "The logged in user id and user name", body = LoginResponse),
        (status = 401, description = "Invalid credentials", body = ErrorResponse),
        (status = 500, description = "Internal server error", body = ErrorResponse),
    ),
)]
async fn login(
    user_agent: Option<TypedHeader<UserAgent>>,
    State(users): State<Users>,
    State(sessions): State<Sessions>,
    jar: CookieJar,
    audit_service: AuditService,
    Json(credentials): Json<Credentials>,
) -> Result<impl IntoResponse, APIError> {
    let Credentials { username, password } = credentials;

    // Check the username + password combination, do not leak information about usernames etc.
    let user = users
        .authenticate(&username, &password)
        .await
        .map_err(|e| match e {
            AuthenticationError::UserNotFound => AuthenticationError::InvalidUsernameOrPassword,
            AuthenticationError::InvalidPassword => AuthenticationError::InvalidUsernameOrPassword,
            e => e,
        })?;

    // Remove expired sessions, we do this after a login to prevent the necessity of periodical cleanup jobs
    sessions.delete_expired_sessions().await?;
    let user_agent = user_agent.map(|ua| ua.to_string()).unwrap_or_default();

    // Create a new session and cookie
    let session = sessions.create(user.id(), SESSION_LIFE_TIME).await?;

    // Log the login event
    audit_service
        .with_user(user.clone())
        .log_success(
            &AuditEvent::UserLoggedIn(UserLoggedInDetails {
                user_agent,
                logged_in_users_count: sessions.count().await?,
            }),
            None,
        )
        .await?;

    // Add the session cookie to the response
    let mut cookie = session.get_cookie();
    set_default_cookie_properties(&mut cookie);
    let updated_jar = jar.add(cookie);

    Ok((updated_jar, Json(LoginResponse::from(&user))))
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct AccountUpdateRequest {
    pub username: String,
    pub password: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[schema(value_type = String, nullable = false)]
    pub fullname: Option<String>,
}

/// Get current logged-in user endpoint
#[utoipa::path(
  get,
  path = "/api/user/whoami",
  responses(
      (status = 200, description = "The current user name and id", body = LoginResponse),
      (status = 401, description = "Invalid user session", body = ErrorResponse),
      (status = 500, description = "Internal server error", body = ErrorResponse),
  ),
)]
async fn whoami(user: Option<User>) -> Result<impl IntoResponse, APIError> {
    let user = user.ok_or(AuthenticationError::UserNotFound)?;

    Ok(Json(LoginResponse::from(&user)))
}

/// Update the user's account with a new password and optionally new fullname
#[utoipa::path(
  put,
  path = "/api/user/account",
  request_body = AccountUpdateRequest,
  responses(
      (status = 200, description = "The logged in user", body = LoginResponse),
      (status = 500, description = "Internal server error", body = ErrorResponse),
  ),
)]
async fn account_update(
    user: User,
    State(users): State<Users>,
    audit_service: AuditService,
    Json(account): Json<AccountUpdateRequest>,
) -> Result<impl IntoResponse, APIError> {
    if user.username() != account.username {
        return Err(AuthenticationError::UserNotFound.into());
    }

    // Update the password
    let result = users
        .update_password(user.id(), &account.username, &account.password)
        .await;

    // Register audit event if the password update failed
    if let Err(e) = result {
        audit_service
            .with_user(user.clone())
            .log_error(&AuditEvent::UserAccountUpdateFailed, None)
            .await?;

        return Err(e.into());
    }

    // Update the fullname
    if let Some(fullname) = account.fullname {
        users.update_fullname(user.id(), &fullname).await?;
    }

    let Some(updated_user) = users.get_by_username(user.username()).await? else {
        return Err(AuthenticationError::UserNotFound.into());
    };

    audit_service
        .with_user(updated_user.clone())
        .log_error(&AuditEvent::UserAccountUpdateSuccess, None)
        .await?;

    Ok(Json(LoginResponse::from(&updated_user)))
}

/// Logout endpoint, deletes the session cookie
#[utoipa::path(
    post,
    path = "/api/user/logout",
    responses(
        (status = 200, description = "Successful logout, or user was already logged out"),
        (status = 500, description = "Internal server error", body = ErrorResponse),
    ),
)]
async fn logout(
    State(sessions): State<Sessions>,
    State(users): State<Users>,
    audit_service: AuditService,
    jar: CookieJar,
) -> Result<impl IntoResponse, APIError> {
    let Some(mut cookie) = jar.get(SESSION_COOKIE_NAME).cloned() else {
        // no cookie found, return OK
        return Ok((jar, StatusCode::OK));
    };

    // Get the session key from the cookie
    let session_key = cookie.value();

    // Log audit event when a valid session exists
    if let Some(session) = sessions.get_by_key(session_key).await.ok().flatten() {
        if let Some(user) = users.get_by_id(session.user_id()).await.ok().flatten() {
            // Log the logout event
            audit_service
                .with_user(user)
                .log_success(
                    &AuditEvent::UserLoggedOut(UserLoggedOutDetails {
                        session_duration: session.duration().as_secs(),
                    }),
                    None,
                )
                .await?;
        }
    }

    // Remove session from the database
    sessions.delete(session_key).await?;

    // Set cookie parameters, these are not present in the request, and have to match in order to clear the cookie
    set_default_cookie_properties(&mut cookie);
    let updated_jar = jar.remove(cookie);

    Ok((updated_jar, StatusCode::OK))
}

/// Middleware to extend the session lifetime
pub async fn extend_session(
    State(users): State<Users>,
    State(sessions): State<Sessions>,
    jar: CookieJar,
    audit_service: AuditService,
    mut response: Response,
) -> Response {
    let Some(session_cookie) = jar.get(SESSION_COOKIE_NAME) else {
        return response;
    };

    let mut expires = None;

    // extend lifetime of session and set new cookie if the session is still valid and will soon be expired
    if let Ok(Some(session)) = sessions.extend_session(session_cookie.value()).await {
        info!("Session extended for user {}", session.user_id());

        if let Some(user) = users.get_by_id(session.user_id()).await.ok().flatten() {
            let _ = audit_service
                .with_user(user)
                .log_success(&AuditEvent::UserSessionExtended, None)
                .await;

            let mut cookie = session.get_cookie();
            set_default_cookie_properties(&mut cookie);

            debug!("Setting cookie: {:?}", cookie);

            if let Ok(header_value) = cookie.encoded().to_string().parse() {
                response.headers_mut().append(SET_COOKIE, header_value);
            }
        }

        expires = Some(session.expires_at());
    } else if let Ok(Some(session)) = sessions.get_by_key(session_cookie.value()).await {
        expires = Some(session.expires_at());
    }

    if let Some(expires) = expires.and_then(|e| HeaderValue::from_str(&e.to_rfc3339()).ok()) {
        response
            .headers_mut()
            .append("X-Session-Expires-At", expires);
    }

    response
}

#[derive(Serialize, Deserialize, ToSchema)]
pub struct UserListResponse {
    pub users: Vec<User>,
}

/// Lists all users
#[utoipa::path(
    get,
    path = "/api/user",
    responses(
        (status = 200, description = "User list", body = UserListResponse),
        (status = 401, description = "Unauthorized", body = ErrorResponse),
        (status = 500, description = "Internal server error", body = ErrorResponse),
    ),
)]
async fn user_list(
    _user: AdminOrCoordinator,
    State(users_repo): State<Users>,
) -> Result<Json<UserListResponse>, APIError> {
    Ok(Json(UserListResponse {
        users: users_repo.list().await?,
    }))
}

#[derive(Serialize, Deserialize, ToSchema)]
pub struct CreateUserRequest {
    pub username: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[schema(nullable = false)]
    pub fullname: Option<String>,
    pub temp_password: String,
    pub role: Role,
}

#[derive(Serialize, Deserialize, ToSchema)]
#[serde(deny_unknown_fields)]
pub struct UpdateUserRequest {
    #[serde(skip_serializing_if = "Option::is_none")]
    #[schema(nullable = false)]
    pub fullname: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[schema(nullable = false)]
    pub temp_password: Option<String>,
}

/// Create a new user
#[utoipa::path(
    post,
    path = "/api/user",
    request_body = CreateUserRequest,
    responses(
        (status = 201, description = "User created", body = User),
        (status = 401, description = "Unauthorized", body = ErrorResponse),
        (status = 409, description = "Conflict (username already exists)", body = ErrorResponse),
        (status = 500, description = "Internal server error", body = ErrorResponse),
    ),
)]
pub async fn user_create(
    admin: Admin,
    State(users_repo): State<Users>,
    audit_service: AuditService,
    Json(create_user_req): Json<CreateUserRequest>,
) -> Result<(StatusCode, Json<User>), APIError> {
    let user = users_repo
        .create(
            &create_user_req.username,
            create_user_req.fullname.as_deref(),
            &create_user_req.temp_password,
            create_user_req.role,
        )
        .await?;

    audit_service
        .with_user(admin.0)
        .log_success(&AuditEvent::UserCreated(LoginResponse::from(&user)), None)
        .await?;

    Ok((StatusCode::CREATED, Json(user)))
}

/// Get a user
#[utoipa::path(
    get,
    path = "/api/user/{user_id}",
    responses(
        (status = 200, description = "User found", body = User),
        (status = 401, description = "Unauthorized", body = ErrorResponse),
        (status = 404, description = "User not found", body = ErrorResponse),
        (status = 500, description = "Internal server error", body = ErrorResponse),
    ),
    params(
        ("user_id" = u32, description = "User id"),
    ),
)]
async fn user_get(
    _user: Admin,
    State(users_repo): State<Users>,
    Path(user_id): Path<u32>,
) -> Result<Json<User>, APIError> {
    let user = users_repo.get_by_id(user_id).await?;
    Ok(Json(user.ok_or(Error::RowNotFound)?))
}

/// Update a user
#[utoipa::path(
    put,
    path = "/api/user/{user_id}",
    request_body = UpdateUserRequest,
    responses(
        (status = 200, description = "User updated", body = User),
        (status = 401, description = "Unauthorized", body = ErrorResponse),
        (status = 404, description = "User not found", body = ErrorResponse),
        (status = 500, description = "Internal server error", body = ErrorResponse),
    ),
)]
pub async fn user_update(
    admin: Admin,
    State(users_repo): State<Users>,
    State(session_repo): State<Sessions>,
    audit_service: AuditService,
    Path(user_id): Path<u32>,
    Json(update_user_req): Json<UpdateUserRequest>,
) -> Result<Json<User>, APIError> {
    if let Some(fullname) = update_user_req.fullname {
        users_repo.update_fullname(user_id, &fullname).await?
    };

    if let Some(temp_password) = update_user_req.temp_password {
        users_repo
            .set_temporary_password(user_id, &temp_password)
            .await?;

        session_repo.delete_user_session(user_id).await?;
    };

    let user = users_repo
        .get_by_id(user_id)
        .await?
        .ok_or(Error::RowNotFound)?;

    audit_service
        .with_user(admin.0)
        .log_success(&AuditEvent::UserUpdated(LoginResponse::from(&user)), None)
        .await?;

    Ok(Json(user))
}

/// Delete a user
#[utoipa::path(
    delete,
    path = "/api/user/{user_id}",
    responses(
        (status = 200, description = "User deleted successfully"),
        (status = 401, description = "Unauthorized", body = ErrorResponse),
        (status = 404, description = "User not found", body = ErrorResponse),
        (status = 500, description = "Internal server error", body = ErrorResponse),
    ),
)]
async fn user_delete(
    _user: Admin,
    State(users_repo): State<Users>,
    Path(user_id): Path<u32>,
) -> Result<StatusCode, APIError> {
    let deleted = users_repo.delete(user_id).await?;

    if deleted {
        Ok(StatusCode::OK)
    } else {
        Ok(StatusCode::NOT_FOUND)
    }
}
