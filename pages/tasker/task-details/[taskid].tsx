import MoralisType from "moralis";
import { Backdrop, Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import PrimaryButtonCTA from "../../../components/buttons/PrimaryButtonCTA";
import SecondaryButtonCTA from "../../../components/buttons/SecondaryButtonCTA";
import PageHeader from "../../../components/common/PageHeader";
import TaskOverviewTemplate from "../../../components/task/TaskOverview";
import { getTaskOverviewData, taskerClaimTask } from "../../../src/Database";
import { TaskOverviewData } from "../../../src/Types";

export default function TaskDetails() {
  const router = useRouter();
  const { taskId } = router.query;
  const { isInitialized, Moralis } = useMoralis();
  const [openLoading, setOpenLoading] = useState(false);
  const [showClaimCTA, setShowClaimCTA] = useState(true);
  const [data, setData] = useState<TaskOverviewData>();
  const [userData, setUserData] = useState<MoralisType.Object>();

  const handleClaimTask = async () => {
    if (!userData || !taskId) return;

    setOpenLoading(true);

    const res = await taskerClaimTask(
      Moralis,
      userData.get("ethAddress"),
      taskId as string
    );

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
      <PageHeader title="Task Details" customSetUserData={setUserData} />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openLoading}
      >
        <CircularProgress color="secondary" />
      </Backdrop>
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
