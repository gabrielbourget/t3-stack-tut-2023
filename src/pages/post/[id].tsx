import { useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
// import Link from "next/link";
import Image from "next/image";
import { api } from "~/utils/api";

const SinglePostPage: NextPage = () => {

  const { isLoaded: userLoaded, isSignedIn } = useUser();

  api.posts.getAll.useQuery();

  // -> Return emptoy div if both aren't loaded, since user tends to load faster
  if (!userLoaded) return <div></div>;

  return (
    <>
      <Head>
        <title>Post</title>
        <meta name="description" content="🤔" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center h-screen"> {/* #15162c */}
        <div>
          Post View
        </div>
      </main>
    </>
  );
};

export default SinglePostPage;