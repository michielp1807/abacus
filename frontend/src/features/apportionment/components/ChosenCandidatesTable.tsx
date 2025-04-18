import { Candidate } from "@/api";
import { Table } from "@/components/ui";
import { t } from "@/lib/i18n";
import { cn, getCandidateFullNameWithGender } from "@/lib/util";

import cls from "./Apportionment.module.css";

interface ChosenCandidatesTableProps {
  chosenCandidates: Candidate[];
}

export function ChosenCandidatesTable({ chosenCandidates }: ChosenCandidatesTableProps) {
  return (
    <Table id="chosen-candidates-table" className={cn(cls.table)}>
      <Table.Header>
        <Table.HeaderCell>{t("candidate.title")}</Table.HeaderCell>
        <Table.HeaderCell>{t("candidate.locality")}</Table.HeaderCell>
      </Table.Header>
      <Table.Body>
        {chosenCandidates.map((candidate) => {
          return (
            <Table.Row key={`${candidate.number}-${candidate.last_name}`}>
              <Table.Cell>{getCandidateFullNameWithGender(candidate)}</Table.Cell>
              <Table.Cell>{candidate.locality}</Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
}
