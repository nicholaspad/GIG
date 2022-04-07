import { Container } from "@mui/material";
import CustomizableGrayCard from "../common/CustomizableGrayCard";
import TaskerPageHeader from "../common/TaskerPageHeader";
import TasksTable, { TaskData } from "./TasksTable";

/*
  0: Tasker - My Tasks table
  1: Browse Tasks table
  2: Requester - My Tasks table
*/
export type TableType = 0 | 1 | 2;

const tableTitleMap = {
  0: "My Tasks",
  1: "Browse Tasks",
  2: "Created Tasks",
};

const tableSubtitleMap = {
  0: "View & continue your claimed tasks.",
  1: "Find your next task.",
  2: "View your created tasks here.",
};

export default function TasksTableWrapper(props: {
  type: TableType;
  data: TaskData[];
}) {
  return (
    <Container maxWidth="lg">
      <TaskerPageHeader
        title={tableTitleMap[props.type as TableType]}
        subtitle={tableSubtitleMap[props.type as TableType]}
      />
      <CustomizableGrayCard sx={{ px: 5, py: 2.5 }}>
        {/* TODO @nicholaspad replace button links with proper routes */}
        <TasksTable type={props.type} data={props.data} />
      </CustomizableGrayCard>
    </Container>
  );
}
