import { Dispatch, ReactNode, SetStateAction } from "react";

import { Badge, Icon, InputField, Spinner } from "@/components/ui";
import { t, tx } from "@/lib/i18n";
import { IconError, IconWarning } from "@/lib/icon";
import { cn, removeLeadingZeros } from "@/lib/util";

import { PollingStationUserStatus, PollingStationWithStatus } from "../utils/util";
import cls from "./DataEntryChoice.module.css";

interface FeedbackMessageProps {
  messageType: "notify" | "warning" | "error" | "success";
  content: ReactNode;
  icon?: ReactNode;
}

const FeedbackMessage = ({ messageType, content, icon }: FeedbackMessageProps) => (
  <div id="pollingStationSelectorFeedback" className={cn(cls.message, cls[messageType])}>
    {icon && (
      <span className={cls.icon}>
        <Icon
          icon={icon}
          color={messageType === "error" ? "error" : messageType === "warning" ? "warning" : undefined}
        />
      </span>
    )}
    {content}
  </div>
);

export interface PollingStationSelectorProps {
  pollingStationNumber: string;
  setPollingStationNumber: Dispatch<SetStateAction<string>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  currentPollingStation: PollingStationWithStatus | undefined;
  setAlert: Dispatch<SetStateAction<string | undefined>>;
  handleSubmit: () => void;
}

export function PollingStationSelector({
  pollingStationNumber,
  setPollingStationNumber,
  loading,
  currentPollingStation,
  setAlert,
  handleSubmit,
}: PollingStationSelectorProps) {
  const renderWarningMessage = (content: ReactNode) => (
    <FeedbackMessage
      messageType="warning"
      content={content}
      icon={<IconWarning aria-label={t("contains_warning")} />}
    />
  );

  const getFeedbackContent = () => {
    if (loading) {
      return (
        <FeedbackMessage
          messageType="notify"
          content={<>{t("polling_station_choice.searching")} &hellip;</>}
          icon={<Spinner size="md" />}
        />
      );
    }

    if (currentPollingStation) {
      switch (currentPollingStation.userStatus) {
        case PollingStationUserStatus.InProgressOtherUser:
          return renderWarningMessage(
            tx("polling_station_choice.assigned_to_different_user", undefined, {
              nr: currentPollingStation.number,
            }),
          );
        case PollingStationUserStatus.SecondEntryNotAllowed:
          return renderWarningMessage(
            tx("polling_station_choice.second_entry_not_allowed", undefined, {
              nr: currentPollingStation.number,
            }),
          );
        case PollingStationUserStatus.Finished:
          return renderWarningMessage(
            tx("polling_station_choice.has_already_been_filled_twice", undefined, {
              nr: currentPollingStation.number,
              name: currentPollingStation.name,
            }),
          );
        default:
          return (
            <FeedbackMessage
              messageType="success"
              content={
                <>
                  <span className="bold">{currentPollingStation.name}</span>
                  <Badge type={currentPollingStation.statusEntry.status} showIcon />
                </>
              }
            />
          );
      }
    }

    return (
      <FeedbackMessage
        messageType="error"
        content={t("polling_station_choice.no_polling_station_found_with_number", {
          nr: removeLeadingZeros(pollingStationNumber),
        })}
        icon={<IconError aria-label={t("contains_error")} />}
      />
    );
  };

  return (
    <div className={cls.container}>
      <InputField
        id="pollingStation"
        className={cn(cls.input, "font-number")}
        name="number"
        value={pollingStationNumber}
        label={t("polling_station_choice.insert_number")}
        fieldWidth="narrow"
        maxLength={6}
        autoFocus={true}
        onChange={(e) => {
          setAlert(undefined);
          setPollingStationNumber(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.shiftKey && e.key === "Enter") {
            handleSubmit();
          }
        }}
      />

      {pollingStationNumber.trim() !== "" && getFeedbackContent()}
    </div>
  );
}
