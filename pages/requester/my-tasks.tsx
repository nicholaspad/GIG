import PageHeader from "../../components/common/PageHeader";
import MyTasksTable from "../../components/tables/MyTasksTable";
import {
  CreatedTaskStatus,
  TaskData,
} from "../../components/tables/TasksTable";

export default function MyTasks() {
  const data: TaskData[] = [1.5, 2.5, 3, 4.5, 5, 6.5, 7, 8.5, 9, 10, 10.5].map(
    (e, i) => {
      return {
        task_id: String(e),
        name: `Task ${i + 1}`,
        status: (i % 3) as CreatedTaskStatus,
        reward: e,
        completedTasks: Math.floor(Math.random() * 50),
        totalTasks:
          Math.floor(Math.random() * 50) + Math.floor(Math.random() * 50),
      };
    }
  );

  return (
    <>
      <PageHeader title="Requester Created Tasks" />
      <MyTasksTable type={2} data={data} />
    </>
  );
}
