import { TaskData } from "./TasksTable";
import TasksTableWrapper from "./TasksTableWrapper";

export default function BrowseTasksTable(props: { data: TaskData[] }) {
  return <TasksTableWrapper type="Tasks" data={props.data} />;
}