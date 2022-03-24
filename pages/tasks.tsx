import { TaskData } from "../components/tables/TasksTable";
import TasksTableWrapper from "../components/tables/TasksTableWrapper";

export default function Tasks() {
  // TODO @nicholaspad hard-coded for now
  const data: TaskData[] = [1.5, 2.5, 3, 4.5, 5, 6.5, 7, 8.5, 9, 10, 10.5].map(
    (e, i) => {
      return {
        task_id: e,
        name: `Task ${i + 1}`,
        rating: e % 6,
        reward: e,
      };
    }
  );

  return <TasksTableWrapper type="Tasks" data={data} />;
}
