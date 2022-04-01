import Head from "next/head";
import MoralisType from "moralis";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import Navbar from "../navbar/Navbar";
import { makeOrGetNewUser } from "../../src/Database";
import router from "next/router";

export default function PageHeader(props: { title: string }) {
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

  return (
    <>
      <Head>
        <title>{props.title} | GIG</title>
      </Head>
      <Navbar
        walletAddress={userData?.get("ethAddress")}
        isConnected={isAuthenticated}
        username={userData?.get("displayName")}
      />
    </>
  );
}
