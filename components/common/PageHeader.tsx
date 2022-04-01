import Head from "next/head";
import Navbar from "../navbar/Navbar";

export default function PageHeader(props: {
  title: string;
  walletAddress: string;
  isConnected: boolean;
  username: string;
}) {
  return (
    <>
      <Head>
        <title>{props.title} | GIG</title>
      </Head>
      <Navbar
        walletAddress={props.walletAddress}
        isConnected={props.isConnected}
        username={props.username}
      />
    </>
  );
}
