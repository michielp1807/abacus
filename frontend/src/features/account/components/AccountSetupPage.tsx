import { Navigate, useNavigate } from "react-router";

import { LoginResponse, useApiState } from "@/api";
import { PageTitle } from "@/components/ui";
import { t } from "@/lib/i18n";

import { AccountSetupForm } from "./AccountSetupForm";

export function AccountSetupPage() {
  const navigate = useNavigate();

  const { user, setUser } = useApiState();

  if (!user) {
    return <Navigate to="/account/login" />;
  }

  function handleSaved(user: LoginResponse) {
    setUser(user);
    void navigate("/elections#new-account");
  }

  return (
    <>
      <PageTitle title={`${t("account.account_setup")} - Abacus`} />
      <header>
        <section>
          <h1>{t("account.account_setup")}</h1>
        </section>
      </header>
      <main>
        <article className="no_footer">
          <AccountSetupForm user={user} onSaved={handleSaved} />
        </article>
      </main>
    </>
  );
}
