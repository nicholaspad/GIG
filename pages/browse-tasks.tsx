import PrimaryButtonCTA from "../components/buttons/PrimaryButtonCTA";
import PageHeader from "../components/common/PageHeader";
import BrowseTasksTable from "../components/tables/BrowseTasks";
import { TaskData } from "../components/tables/TasksTable";

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

  return (
    <>
      <PageHeader title={"Browse Tasks"} />
      <PrimaryButtonCTA
        text="My Tasks →"
        size="small"
        to="/tasker/my-tasks"
        sx={{ mx: "auto" }}
      />
      <BrowseTasksTable data={data} />
    </>
  );
}
