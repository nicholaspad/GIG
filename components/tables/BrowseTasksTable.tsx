import { TaskData } from "./TasksTable";
import TasksTableWrapper, { TableType } from "./TasksTableWrapper";

export default function BrowseTasksTable(props: {
  type: TableType;
  data: TaskData[];
}) {
  return <TasksTableWrapper type={props.type} data={props.data} />;
}
