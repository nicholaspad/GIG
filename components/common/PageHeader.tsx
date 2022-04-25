import Head from "next/head";
import MoralisType from "moralis";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import Navbar from "../navbar/Navbar";
import { makeOrGetNewUser } from "../../src/Database";
import router from "next/router";

export default function PageHeader(props: {
  title: string;
  disableAuthFunc?: boolean;
  customSetUserData?: Function;
}) {
  const { title, disableAuthFunc, customSetUserData } = props;
  const {
    user,
    isAuthenticated,
    isUnauthenticated,
    authError,
    Moralis,
    isInitialized,
  } = useMoralis();
  const [userData, setUserData] = useState<MoralisType.Object>();

  useEffect(() => {
    if (isUnauthenticated) router.push("/");
  }, [isUnauthenticated]);

  useEffect(() => {
    if (
      !isInitialized ||
      disableAuthFunc ||
      !isAuthenticated ||
      authError ||
      !user
    )
      return;

    makeOrGetNewUser(Moralis).then((res) => {
      setUserData(res);
      if (customSetUserData) customSetUserData(res);
    });
  }, [
    isAuthenticated,
    authError,
    Moralis,
    user,
    disableAuthFunc,
    customSetUserData,
    isInitialized,
  ]);

  return (
    <>
      <Head>
        <title>{title} | GIG</title>
      </Head>
      <Navbar
        walletAddress={user?.get("ethAddress")}
        isConnected={isAuthenticated}
        username={userData?.get("displayName")}
      />
    </>
  );
}
