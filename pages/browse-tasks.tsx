import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import PrimaryButtonCTA from "../components/buttons/PrimaryButtonCTA";
import PageHeader from "../components/common/PageHeader";
import BrowseTasksTable from "../components/tables/BrowseTasksTable";
import { TaskData } from "../components/tables/TasksTable";
import { getMyTasksTableData } from "../src/Database";

export default function Tasks() {
  const { isInitialized, Moralis } = useMoralis();
  const [data, setData] = useState<TaskData[]>([]);

  useEffect(() => {
    if (!isInitialized) return;

    getMyTasksTableData(Moralis).then((res) => {
      let tempData: TaskData[] = [];
      for (let task_ of res) {
        let task = task_ as any;
        tempData.push({
          task_id: task["objectId"],
          name: task["title"],
          reward: task["unitReward"],
          rating: task["avgRating"],
        });
      }
      setData(tempData);
    });
  }, [isInitialized]);

  return (
    <>
      <PageHeader title="Browse Tasks" />
      <PrimaryButtonCTA
        text="My Tasks →"
        size="small"
        to="/tasker/my-tasks"
        sx={{ mx: "auto" }}
      />
      <BrowseTasksTable type={1} data={data} />
    </>
  );
}
