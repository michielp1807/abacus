import * as React from "react";

import { DataEntryStatusName, Election, ElectionStatusResponseEntry, PollingStation, User } from "@/api";
import {
  Badge,
  Button,
  Circle,
  PercentageAndColorClass,
  Progress,
  ProgressBar,
  ProgressBarColorClass,
  Table,
} from "@/components/ui";
import { t } from "@/lib/i18n";
import { IconPlus } from "@/lib/icon";
import { formatDateTime } from "@/lib/util";

import cls from "./ElectionStatus.module.css";

const statusCategories = [
  "errors_and_warnings",
  "in_progress",
  "first_entry_finished",
  "definitive",
  "not_started",
] as const;
type StatusCategory = (typeof statusCategories)[number];

export interface ElectionStatusProps {
  statuses: ElectionStatusResponseEntry[];
  election: Required<Election>;
  pollingStations: PollingStation[];
  navigate: (path: string) => void;
  users: User[];
}

interface PollingStationWithStatusAndTypist extends PollingStation, Partial<ElectionStatusResponseEntry> {
  typist?: string;
}

function getTypistName(users: User[], status: ElectionStatusResponseEntry | undefined) {
  if (status === undefined || users.length === 0) {
    return "";
  }

  let typistId: number | undefined;
  switch (status.status) {
    case "first_entry_in_progress":
    case "second_entry_not_started":
      typistId = status.first_entry_user_id;
      break;
    case "second_entry_in_progress":
      typistId = status.second_entry_user_id;
      break;
    default:
      break;
  }
  if (typistId === undefined) {
    return "";
  }

  const user = users.find((user) => user.id === typistId);
  return user?.fullname ?? user?.username ?? "";
}

export function ElectionStatus({ statuses, election, pollingStations, navigate, users }: ElectionStatusProps) {
  const categoryCounts: Record<StatusCategory, number> = React.useMemo(
    () =>
      Object.fromEntries(statusCategories.map((cat) => [cat, statusCount(statuses, cat)])) as Record<
        StatusCategory,
        number
      >,
    [statuses],
  );

  const progressBarData: PercentageAndColorClass[] = React.useMemo(() => {
    const total = statuses.length;
    // Reverse the categories and make sure not started is at the end of the progress bar
    const [notStarted, ...data] = statusCategories
      .map((cat) => ({
        percentage: total > 0 ? Math.round((categoryCounts[cat] / total) * 100) : 0,
        class: categoryColorClass[cat],
      }))
      .reverse();
    if (notStarted) {
      data.push(notStarted);
    }
    return data;
  }, [statuses, categoryCounts]);

  const pollingStationWithStatusAndTypist = pollingStations.map((ps) => {
    const status = statuses.find((element) => element.polling_station_id === ps.id);
    return {
      ...ps,
      ...status,
      typist: getTypistName(users, status),
    } satisfies PollingStationWithStatusAndTypist;
  });

  const tableCategories = statusCategories.filter((cat) => categoryCounts[cat] !== 0);

  return (
    <>
      <div className={cls.container}>
        <div className={cls.statusTitle}>
          <h2 id="status-title">{t("election_status.main_title")}</h2>
          <div className={cls.buttons}>
            <Button
              size="md"
              variant="secondary"
              leftIcon={<IconPlus />}
              onClick={() => {
                navigate(`/elections/${election.id}/polling-stations`);
              }}
            >
              {t("election_status.add_polling_station")}
            </Button>
          </div>
        </div>
        <div className={cls.statusSection}>
          <Progress>
            <div id="polling-stations-per-status" className="column">
              <h3 className="mb-0 heading-lg">{t("election_status.polling_stations_per_status")}</h3>
              {statusCategories.map((cat) => {
                return (
                  <span
                    className="item"
                    key={`item-progress-${categoryColorClass[cat]}`}
                    id={`item-progress-${categoryColorClass[cat]}`}
                  >
                    <Circle size="xxs" color={categoryColorClass[cat]} />
                    {t(`status.${cat}`)} ({categoryCounts[cat]})
                  </span>
                );
              })}
            </div>
            <div id="progress" className="column">
              <h3 className="mb-0 heading-lg">{t("progress")}</h3>
              <ProgressBar key="all" id="all" data={progressBarData} spacing="small" />
            </div>
          </Progress>
          <article className={cls.statusArticle}>
            {pollingStations.length === 0 ? (
              <p>{t("election_status.no_polling_stations")}</p>
            ) : (
              tableCategories.map((cat) => {
                return (
                  <div key={`item-table-${categoryColorClass[cat]}`}>
                    <span className="item">
                      <Circle size="xs" color={categoryColorClass[cat]} />
                      <h3 className="mb-0 heading-lg">
                        {t(`status.${cat}`)} <span className="normal">({categoryCounts[cat]})</span>
                      </h3>
                    </span>
                    <Table id={cat} key={cat}>
                      {getTableHeaderForCategory(cat)}
                      <Table.Body key={cat} className="fs-sm">
                        {pollingStationWithStatusAndTypist
                          .filter((ps) => ps.status !== undefined && statusesForCategory[cat].includes(ps.status))
                          .map((ps) => getTableRowForCategory(cat, ps))}
                      </Table.Body>
                    </Table>
                  </div>
                );
              })
            )}
          </article>
        </div>
      </div>
    </>
  );
}

const categoryColorClass: Record<StatusCategory, ProgressBarColorClass> = {
  errors_and_warnings: "errors-and-warnings",
  in_progress: "in-progress",
  first_entry_finished: "first-entry-finished",
  definitive: "definitive",
  not_started: "not-started",
};

const statusesForCategory: Record<StatusCategory, DataEntryStatusName[]> = {
  errors_and_warnings: ["entries_different"],
  in_progress: ["first_entry_in_progress", "second_entry_in_progress"],
  first_entry_finished: ["second_entry_not_started"],
  definitive: ["definitive"],
  not_started: ["first_entry_not_started"],
};

function getTableHeaderForCategory(category: StatusCategory): React.ReactNode {
  function CategoryHeader({ children }: { children?: React.ReactNode[] }) {
    return (
      <Table.Header key={category} className="bg-gray">
        <Table.HeaderCell key={`${category}-number`} className="text-align-r">
          {t("number")}
        </Table.HeaderCell>
        <Table.HeaderCell key={`${category}-name`}>{t("polling_station.title.singular")}</Table.HeaderCell>
        {children}
      </Table.Header>
    );
  }

  const finishedAtColumn = (
    <Table.HeaderCell key={`${category}-time`} className="w-14">
      {t("finished_at")}
    </Table.HeaderCell>
  );

  const progressColumn = (
    <Table.HeaderCell key={`${category}-progress`} className="w-14">
      {t("progress")}
    </Table.HeaderCell>
  );

  const typistColumn = (
    <Table.HeaderCell key={`${category}-typist`} className="w-14">
      {t("typist")}
    </Table.HeaderCell>
  );

  switch (category) {
    case "in_progress":
      return <CategoryHeader>{[typistColumn, progressColumn]}</CategoryHeader>;
    case "first_entry_finished":
      return <CategoryHeader>{[typistColumn, finishedAtColumn]}</CategoryHeader>;
    case "definitive":
      return <CategoryHeader>{[finishedAtColumn]}</CategoryHeader>;
    default:
      return <CategoryHeader />;
  }
}

function getTableRowForCategory(
  category: StatusCategory,
  polling_station: PollingStationWithStatusAndTypist,
): React.ReactNode {
  const showBadge: DataEntryStatusName[] = ["first_entry_in_progress", "second_entry_in_progress", "entries_different"];

  function CategoryPollingStationRow({ children }: { children?: React.ReactNode[] }) {
    return (
      <Table.Row>
        <Table.NumberCell key={`${polling_station.id}-number`}>{polling_station.number}</Table.NumberCell>
        <Table.Cell key={`${polling_station.id}-name`}>
          <span>{polling_station.name}</span>
          {polling_station.status && showBadge.includes(polling_station.status) && (
            <Badge type={polling_station.status} />
          )}
        </Table.Cell>
        {children}
      </Table.Row>
    );
  }

  const typistCell = <Table.Cell key={`${polling_station.id}-typist`}>{polling_station.typist}</Table.Cell>;
  const finishedAtCell = (
    <Table.Cell key={`${polling_station.id}-time`}>
      {polling_station.finished_at ? formatDateTime(new Date(polling_station.finished_at)) : ""}
    </Table.Cell>
  );
  const progressCell = (
    <Table.Cell key={`${polling_station.id}-progress`}>
      <ProgressBar
        id={`${polling_station.id}-progressbar`}
        data={{
          percentage: polling_station.second_entry_progress ?? polling_station.first_entry_progress ?? 0,
          class: "default",
        }}
        showPercentage
      />
    </Table.Cell>
  );
  switch (category) {
    case "in_progress":
      return (
        <CategoryPollingStationRow key={polling_station.id}>{[typistCell, progressCell]}</CategoryPollingStationRow>
      );
    case "first_entry_finished":
      return (
        <CategoryPollingStationRow key={polling_station.id}>{[typistCell, finishedAtCell]}</CategoryPollingStationRow>
      );
    case "definitive":
      return <CategoryPollingStationRow key={polling_station.id}>{[finishedAtCell]}</CategoryPollingStationRow>;
    default:
      return <CategoryPollingStationRow key={polling_station.id} />;
  }
}

function statusCount(entries: ElectionStatusResponseEntry[], category: StatusCategory): number {
  return entries.filter((s) => statusesForCategory[category].includes(s.status)).length;
}
