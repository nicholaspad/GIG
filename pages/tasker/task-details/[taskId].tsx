import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import PrimaryButtonCTA from "../../../components/buttons/PrimaryButtonCTA";
import SecondaryButtonCTA from "../../../components/buttons/SecondaryButtonCTA";
import PageHeader from "../../../components/common/PageHeader";
import TaskOverviewTemplate from "../../../components/task/TaskOverview";
import { getTaskOverviewData, taskerClaimTask } from "../../../src/Database";
import { TaskOverviewData } from "../../../src/Types";
import LoadingOverlay from "../../../components/common/LoadingOverlay";

export default function TaskDetails() {
  const router = useRouter();
  const { taskId } = router.query;
  const { isInitialized, Moralis } = useMoralis();
  const [openLoading, setOpenLoading] = useState(false);
  const [showClaimCTA, setShowClaimCTA] = useState(true);
  const [data, setData] = useState<TaskOverviewData>();

  const handleClaimTask = async () => {
    if (!taskId) return;
    if (
      !isInitialized ||
      !confirm(`Are you sure you want to claim task "${data?.name}"?`)
    )
      return;

    setOpenLoading(true);

    const res = await taskerClaimTask(Moralis, taskId as string);

    setOpenLoading(false);

    if (!res.success) {
      setShowClaimCTA(false);
      alert(res.message);
      return;
    }

    alert(res.message);
    router.push(`/tasker/task/${taskId}`);
  };

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
    <>
      <PageHeader title="Task Details" />
      <LoadingOverlay open={openLoading} />
      <TaskOverviewTemplate
        data={data}
        title="Task Details"
        subtitle="Confirm your task selection."
      >
        <Box mr={showClaimCTA ? 4 : 0}>
          <SecondaryButtonCTA text="Back" size="big" to="/browse-tasks" />
        </Box>
        {showClaimCTA && (
          <PrimaryButtonCTA
            text="Claim"
            size="big"
            onClick={() => {
              handleClaimTask();
            }}
          />
        )}
      </TaskOverviewTemplate>
    </>
  );
}
