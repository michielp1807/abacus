import { ReactNode } from "react";

import { ApiClient } from "./ApiClient";
import { ApiProviderContext, ApiState } from "./ApiProviderContext";
import { ApiResult } from "./ApiResult";
import { LoginResponse, Role } from "./gen/openapi";

interface TestUserProviderProps {
  userRole: Role | null;
  children: ReactNode;
  overrideExpiration?: Date;
}

export function TestUserProvider({ userRole, children, overrideExpiration }: TestUserProviderProps) {
  let expiration = new Date();
  expiration.setMinutes(expiration.getMinutes() + 30);

  if (overrideExpiration) {
    expiration = overrideExpiration;
  }

  const apiState: ApiState = {
    client: new ApiClient(),
    setUser: () => {},
    user: userRole
      ? {
          user_id: 1,
          role: userRole,
          needs_password_change: false,
          fullname: "Test User",
          username: "test",
        }
      : null,
    logout: async () => {},
    login: async () => {
      return Promise.resolve({} as ApiResult<LoginResponse>);
    },
    loading: false,
    expiration,
    extendSession: function (): Promise<void> {
      expiration.setMinutes(expiration.getMinutes() + 30);

      return Promise.resolve();
    },
  };

  return <ApiProviderContext.Provider value={apiState}>{children}</ApiProviderContext.Provider>;
}
