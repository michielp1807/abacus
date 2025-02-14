import { Link } from "react-router";

import { Footer } from "app/component/footer/Footer";

import { useElection } from "@kiesraad/api";
import { t } from "@kiesraad/i18n";
import { PageTitle } from "@kiesraad/ui";

export function ElectionHomePage() {
  const { election } = useElection();

  return (
    <>
      <PageTitle title={`${t("election.title.details")} - Abacus`} />
      <header>
        <section>
          <h1>{election.name}</h1>
        </section>
      </header>
      <main>
        <article>
          <ul>
            <li>
              {t("coordinator")}:
              <ul>
                <li>
                  <Link to={`status#coordinator`}>{t("election.status")}</Link>
                </li>
                <li>
                  <Link to={`polling-stations#coordinator`}>{t("polling_station.title.plural")}</Link>
                </li>
              </ul>
            </li>
            <li>
              {t("typist")}:
              <ul>
                <li>
                  <Link to={`data-entry`}>{t("data_entry.title")}</Link>
                </li>
              </ul>
            </li>
          </ul>
        </article>
      </main>
      <Footer />
    </>
  );
}
