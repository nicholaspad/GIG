import PageTitle from "../../components/common/PageTitle";
import MyTasksTable from "../../components/tables/MyTasksTable";
import { TaskData, TaskStatus } from "../../components/tables/TasksTable";

export default function MyTasks() {
  const data: TaskData[] = [1.5, 2.5, 3, 4.5, 5, 6.5, 7, 8.5, 9, 10, 10.5].map(
    (e, i) => {
      return {
        task_id: e,
        name: `Task ${i + 1}`,
        status: (i % 4) as TaskStatus,
        reward: e,
        completedTasks: Math.floor(Math.random() * 50),
        totalTasks: Math.floor(Math.random() * 50) + Math.floor(Math.random() * 50),
      };
    }
  );

  return (
    <>
      <PageTitle title={"Requester Created Tasks"} />
      <MyTasksTable type={2} data={data} />
    </>
  );
}
