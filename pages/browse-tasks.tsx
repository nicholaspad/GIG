import MoralisType from "moralis";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import PrimaryButtonCTA from "../components/buttons/PrimaryButtonCTA";
import PageHeader from "../components/common/PageHeader";
import BrowseTasksTable from "../components/tables/BrowseTasksTable";
import { TaskData } from "../components/tables/TasksTable";
import {
  getBrowseTasksTableData,
  getTaskerClaimedTaskIds,
} from "../src/Database";

export default function Tasks() {
  const { isInitialized, Moralis } = useMoralis();
  const [data, setData] = useState<TaskData[]>([]);
  const [userData, setUserData] = useState<MoralisType.Object>();

  useEffect(() => {
    if (!isInitialized || !userData) return;

    getBrowseTasksTableData(Moralis).then(async (res) => {
      const res_ = await getTaskerClaimedTaskIds(
        Moralis,
        userData.get("ethAddress")
      );

      // filter out tasks the users has claimed
      const claimedTaskIds: { [key: string]: number } = {};
      res_.map((task) => {
        claimedTaskIds[(task as any)["taskId"]] = 1;
      });

      let tempData: TaskData[] = [];
      for (let task_ of res) {
        let task = task_ as any;
        // skip tasks that the user has already claimed
        if (task["objectId"] in claimedTaskIds) continue;
        // skip tasks for which the user is the requester
        if (task["requesterId"] === userData.get("ethAddress")) continue;
        tempData.push({
          task_id: task["objectId"],
          name: task["title"],
          reward: task["unitReward"],
          rating: task["avgRating"],
        });
      }
      setData(tempData);
    });
  }, [isInitialized, userData]);

  return (
    <>
      <PageHeader title="Browse Tasks" customSetUserData={setUserData} />
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
