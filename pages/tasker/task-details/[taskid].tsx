import { Box } from "@mui/material";
import { useRouter } from "next/router";
import PrimaryButtonCTA from "../../../components/buttons/PrimaryButtonCTA";
import SecondaryButtonCTA from "../../../components/buttons/SecondaryButtonCTA";
import TaskOverviewTemplate, {
  TaskOverviewData,
} from "../../../components/task/TaskOverview";

export default function TaskDetails() {
  const router = useRouter();
  const { taskId } = router.query;

  // TODO @nicholaspad hard-coded for now
  const data: TaskOverviewData = {
    task_id: "1",
    name: "Task 1",
    reward: 0.01343234,
    rating: 3.5,
    description: "Please complete my task!",
    estimatedTime: 8,
    requestorWallet: "0xBe09286A6F8763296066578B5E58d73b6f77b54e",
    created: new Date(),
  };

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
