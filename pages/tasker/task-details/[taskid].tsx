import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import PrimaryButtonCTA from "../../../components/buttons/PrimaryButtonCTA";
import SecondaryButtonCTA from "../../../components/buttons/SecondaryButtonCTA";
import TaskOverviewTemplate, {
  TaskOverviewData,
} from "../../../components/task/TaskOverview";
import { getTaskOverviewData } from "../../../src/Database";

export default function TaskDetails() {
  const router = useRouter();
  const { taskId } = router.query;
  const { isInitialized, Moralis } = useMoralis();
  const [data, setData] = useState<TaskOverviewData>();

  useEffect(() => {
    if (!isInitialized || !taskId) return;

    getTaskOverviewData(Moralis, taskId as string).then((res) => {
      let res_ = res[0] as any;

      let tempData: TaskOverviewData = {
        task_id: taskId as string,
        name: res_["title"],
        reward: res_["unitReward"],
        rating: res_["avgRating"],
        description: res_["description"],
        estimatedTime: res_["estCompletionTime"],
        requestorWallet: res_["requesterId"],
        created: res_["startDate"],
      };

      setData(tempData);
    });
  }, [isInitialized, taskId]);

  return (
    <TaskOverviewTemplate
      data={data}
      title="Task Details"
      subtitle="Confirm your task selection."
    >
      <Box mr={4}>
        <SecondaryButtonCTA text="Back" size="big" to="/browse-tasks" />
      </Box>
      <PrimaryButtonCTA text="Claim" size="big" to={`/tasker/task/${taskId}`} />
    </TaskOverviewTemplate>
  );
}
