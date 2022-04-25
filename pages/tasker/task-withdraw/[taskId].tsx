import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { Typography } from "@mui/material";
// import SecondaryButtonCTA from "../../../components/buttons/SecondaryButtonCTA";
import PageHeader from "../../../components/common/PageHeader";
// import TaskOverviewTemplate from "../../../components/task/TaskOverview";
import { getTaskOverviewData } from "../../../src/Database";
import { TaskOverviewData } from "../../../src/Types";

export default function TaskWithdraw() {
  const router = useRouter();
  const { taskId, back } = router.query;
  const { isInitialized, Moralis } = useMoralis();
  const [data, setData] = useState<TaskOverviewData>();

  useEffect(() => {
    if (!isInitialized || !taskId) return;

    getTaskOverviewData(Moralis, taskId as string).then((res) => {
      let res_ = res[0] as any;

      let tempData: TaskOverviewData = {
        task_id: taskId as string,
        name: res_["title"],
        reward: Moralis.Units.FromWei(res_["unitRewardWei"]),
        rating: res_["avgRating"],
        description: res_["description"],
        estimatedTime: res_["estCompletionTime"],
        contractAddress: res_["contractAddress"],
        requestorWallet: res_["requesterId"],
        created: res_["startDate"],
      };
      console.log("temp data");
      console.log(tempData);
      setData(tempData);
    });
  }, [isInitialized, Moralis, taskId]);

  return (
    <>
      <PageHeader title="Withdraw Crypto" />
      {console.log("data")}
      {console.log(data)}
      {/* // make sure this is when it's loaded
      contract address: {data.contractAddress} */}
      hi
    </>
  );
}
