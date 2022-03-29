import Head from "next/head";

export default function PageTitle(props: { title: string }) {
  return (
    <Head>
      <title>{props.title} | GIG</title>
    </Head>
  );
}
