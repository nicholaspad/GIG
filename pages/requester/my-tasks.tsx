import MoralisType from "moralis";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import PageHeader from "../../components/common/PageHeader";
import MyTasksTable from "../../components/tables/MyTasksTable";
import {
  CreatedTaskStatus,
  TaskData,
} from "../../components/tables/TasksTable";
import { getRequesterCreatedTasksTableData } from "../../src/Database";

export default function MyTasks() {
  const { isInitialized, Moralis } = useMoralis();
  const [data, setData] = useState<TaskData[]>([]);
  const [userData, setUserData] = useState<MoralisType.Object>();

  useEffect(() => {
    if (!isInitialized || !userData) return;

    getRequesterCreatedTasksTableData(Moralis, userData.get("ethAddress")).then(
      (res) => {
        let tempData: TaskData[] = [];

        for (let task_ of res) {
          let task = task_ as any;
          tempData.push({
            task_id: task["objectId"],
            name: task["title"],
            reward: task["unitReward"],
            maxReward: task["maxReward"],
            numResponses: task["numResponses"],
            maxResponses: task["maxResponses"],
            status: task["status"] as CreatedTaskStatus,
          });
        }
        setData(tempData);
      }
    );
  }, [isInitialized, userData]);

  return (
    <>
      <PageHeader
        title="Requester Created Tasks"
        customSetUserData={setUserData}
      />
      <MyTasksTable type={2} data={data} />
    </>
  );
}
