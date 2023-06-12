// import { useUser } from "@clerk/nextjs";
import { type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import { PageLayout } from "~/components/layout";
// import Link from "next/link";
import Image from "next/image";
import { api } from "~/utils/api";
import { LoadingPage } from "~/components/loading";
import { PostView } from "~/components/postView";
// import { createProxySSGHelpers } from "@trpc/react-query/ssg";
// import { appRouter } from "~/server/api/root";
// import { prisma } from "~/server/db"
// import superjson from "superjson";

const ProfileFeed = (props: { userId: string }) => {
  const { data, isLoading } = api.posts.getPostsByUserId.useQuery({ userId: props.userId });

  if (isLoading) return <LoadingPage spinnerSize={40} />;

  if (!data || data.length === 0) return <div>User has not posted yet.</div>;
  
  return (
    <div className="flex flex-col">
      {
        data ? (
          data.map((fullPost) => (
            <PostView key={fullPost.post.id} {...fullPost} />
          ))
        ) : undefined
      }
    </div>
  );
}

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {

  const { data, isLoading } = api.profile.getUserByUsername.useQuery({ username });

  if (isLoading) return <div>Loading...</div>;

  if (!data) return <div>Problem loading profile information...</div>

  return (
    <>
      <Head>
        <title>{data.username}</title>
        <meta name="description" content="🤔" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageLayout>
        <div className="relative h-36 border-slate-400 bg-slate-600">
          <Image
            width={128} height={128}
            src={data.profileImageUrl}
            alt={`${data.username ?? ""}'s profile`}
            className="rounded-full -mb-[64px] absolute bottom-0 left-0 ml-4 border-4 border-black bg-black"
          />
        </div>
        <div className="h-[64px]"></div>
        <div className="p-4 text-2xl font-bold">
          {`@${data.username!}`} 
        </div>
        <div className="border-b border-slate-400 w-full" />
        <ProfileFeed userId={data.id} />
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = (context) => {
  // const ssg = createProxySSGHelpers({
  //   router: appRouter,
  //   ctx: { prisma, userId: null },
  //   transformer: superjson,
  // });

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug");

  const username = slug.replace("@", ""); 

  // await ssg.profile.getUserByUsername.prefetch({ username });

  return {
    props: {
      // trpcState: ssg.dehydrate(),
      username
    },
  };
};

export const getStaticPaths = () => ({
  paths: [],
  fallback: "blocking"
});

export default ProfilePage;