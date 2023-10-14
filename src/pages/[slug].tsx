import Head from "next/head";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { type NextPage } from "next";

const ProfilePage: NextPage = () => {

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center h-screen">
        <div>Profile View</div>
      </main>
    </>
  );
}

export default ProfilePage
