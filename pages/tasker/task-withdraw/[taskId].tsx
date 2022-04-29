import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import PageHeader from "../../../components/common/PageHeader";
import TaskWithdrawTemplate from "../../../components/task/TaskWithdraw";
import { getTaskOverviewData } from "../../../src/Database";
import { TaskOverviewData } from "../../../src/Types";

export default function TaskWithdraw() {
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
        reward: Moralis.Units.FromWei(res_["unitRewardWei"]),
        rating: res_["avgRating"],
        description: res_["description"],
        estimatedTime: res_["estCompletionTime"],
        contractAddress: res_["contractAddress"],
        requestorWallet: res_["requesterId"],
        created: res_["startDate"],
      };
      setData(tempData);
    });
  }, [isInitialized, Moralis, taskId]);

  return (
    <>
      <PageHeader title="Withdraw Crypto" />
      <TaskWithdrawTemplate data={data} />
    </>
  );
}
