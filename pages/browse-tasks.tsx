import MoralisType from "moralis";
import router from "next/router";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import PageHeader from "../components/common/PageHeader";
import BrowseTasksTable from "../components/tables/BrowseTasks";
import { TaskData } from "../components/tables/TasksTable";
import { makeOrGetNewUser } from "../src/Database";

export default function Tasks() {
  const { user, isAuthenticated, isUnauthenticated, authError, Moralis } =
    useMoralis();
  const [userData, setUserData] = useState<MoralisType.Object>();

  useEffect(() => {
    if (isUnauthenticated) router.push("/");
  }, [isUnauthenticated]);

  useEffect(() => {
    if (!isAuthenticated || authError || !user) return;

    makeOrGetNewUser(Moralis, user.get("ethAddress")).then(
      (res: MoralisType.Object) => setUserData(res)
    );
  }, [isAuthenticated]);

  // TODO @nicholaspad hard-coded for now
  const data: TaskData[] = [1.5, 2.5, 3, 4.5, 5, 6.5, 7, 8.5, 9, 10, 10.5].map(
    (e, i) => {
      return {
        task_id: e,
        name: `Task ${i + 1}`,
        rating: e % 6,
        reward: e,
      };
    }
  );

  return (
    <>
      <PageHeader
        title={"Browse Tasks"}
        walletAddress={userData?.get("ethAddress")}
        isConnected={isAuthenticated}
        username={userData?.get("displayName")}
      />
      <BrowseTasksTable data={data} />
    </>
  );
}
