import MoralisType from "moralis";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import PrimaryButtonCTA from "../../components/buttons/PrimaryButtonCTA";
import PageHeader from "../../components/common/PageHeader";
import MyTasksTable from "../../components/tables/MyTasksTable";
import { TaskData, TaskStatus } from "../../components/tables/TasksTable";
import { getTaskerMyTasksTableData } from "../../src/Database";

export default function MyTasks() {
  const { isInitialized, Moralis } = useMoralis();
  const [data, setData] = useState<TaskData[]>([]);
  const [userData, setUserData] = useState<MoralisType.Object>();

  useEffect(() => {
    if (!isInitialized || !userData) return;

    getTaskerMyTasksTableData(Moralis, userData.get("ethAddress")).then(
      (res) => {
        let tempData: TaskData[] = [];
        for (let task_ of res) {
          let task = task_ as any;
          if (task["tasks"].length < 1) continue;
          tempData.push({
            task_id: task["taskId"],
            name: task["tasks"][0]["title"],
            reward: task["tasks"][0]["unitReward"],
            status: task["status"] as TaskStatus,
          });
        }
        setData(tempData);
      }
    );
  }, [isInitialized, userData]);

  return (
    <>
      <PageHeader title="My Tasks" customSetUserData={setUserData} />
      <PrimaryButtonCTA
        text="Browse Tasks →"
        size="small"
        to="/browse-tasks"
        sx={{ mx: "auto" }}
      />
      <MyTasksTable type={0} data={data} />
    </>
  );
}
