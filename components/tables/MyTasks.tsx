import { TaskData } from "./TasksTable";
import TasksTableWrapper from "./TasksTableWrapper";

export default function MyTasksTable(props: { data: TaskData[] }) {
  return <TasksTableWrapper type="MyTasks" data={props.data} />;
}
