import { TaskData } from "./TasksTable";
import TasksTableWrapper from "./TasksTableWrapper";

export default function MyTasksTable(props: { 
  type: 0 | 1 | 2;
  data: TaskData[];
}) {
  return <TasksTableWrapper type={props.type} data={props.data} />;
}
