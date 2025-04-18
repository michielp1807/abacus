import { ErrorReference } from "@/api";
import { Error } from "@/components/error";
import { Footer } from "@/components/footer/Footer";
import { NavBar } from "@/components/navbar/NavBar";
import { AppLayout } from "@/components/ui";
import { t, tx } from "@/lib/i18n";

import { isDevelopment } from "@kiesraad/util";

interface FatalErrorPageProps {
  message: string;
  reference?: ErrorReference;
  code?: number;
  error?: Error;
}

export function FatalErrorPage({ message, code, reference, error }: FatalErrorPageProps) {
  return (
    <AppLayout>
      {/* Show NavBar for / to avoid call to useElection outside ElectionProvider */}
      <NavBar location={{ pathname: "/" }} />
      <Error title={t("error.title")} error={error}>
        {(code || reference) && (
          <p>
            {code && <strong>{code}</strong>}
            &nbsp;
            {reference && <strong>{t(`error.api_error.${reference}`)}</strong>}
          </p>
        )}
        {message && <p>{message}</p>}
        {isDevelopment && (
          <>
            <h4>{t("error.instruction.title")}</h4>
            <p>
              {tx("error.instruction.content", {
                link: (content) => (
                  <a href="https://github.com/kiesraad/abacus" target="_blank">
                    {content}
                  </a>
                ),
              })}
            </p>
          </>
        )}
      </Error>
      <Footer />
    </AppLayout>
  );
}
