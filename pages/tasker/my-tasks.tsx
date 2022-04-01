import router from "next/router";
import { useEffect } from "react";
import { useMoralis } from "react-moralis";
import PageHeader from "../../components/common/PageHeader";
import MyTasksTable from "../../components/tables/MyTasks";
import { TaskData, TaskStatus } from "../../components/tables/TasksTable";

export default function MyTasks() {
  const { isUnauthenticated } = useMoralis();

  useEffect(() => {
    if (isUnauthenticated) router.push("/");
  }, [isUnauthenticated]);

  // TODO @nicholaspad hard-coded for now
  const data: TaskData[] = [1.5, 2.5, 3, 4.5, 5, 6.5, 7, 8.5, 9, 10, 10.5].map(
    (e, i) => {
      return {
        task_id: e,
        name: `Task ${i + 1}`,
        status: (i % 4) as TaskStatus,
        reward: e,
      };
    }
  );

  return (
    <>
      <PageHeader title={"My Tasks"} />
      <PrimaryButtonCTA
        text="Browse Tasks →"
        size="small"
        to="/browse-tasks"
        sx={{ mx: "auto" }}
      />
      <MyTasksTable data={data} />
    </>
  );
}
