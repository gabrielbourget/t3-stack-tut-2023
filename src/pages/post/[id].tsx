// import { useUser } from "@clerk/nextjs";
import { type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import { PageLayout } from "~/components/layout";
import { api } from "~/utils/api";
import { PostView } from "~/components/postView";

const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {

  const { data, isLoading } = api.posts.getById.useQuery({ id });

  if (isLoading) return <div>Loading...</div>;

  if (!data) return <div>Problem loading post information...</div>

  return (
    <>
      <Head>
        <title>{`${data.post.content} - ${data.author.username}`}</title>
      </Head>
      <PageLayout>
        <PostView {...data} />
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = (context) => {
  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("no id");

  console.log(`post id -> ${id}`)

  // await ssg.profile.getUserByUsername.prefetch({ username });

  return {
    props: {
      // trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => ({
  paths: [],
  fallback: "blocking"
});

export default SinglePostPage;