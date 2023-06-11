// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
// import Link from "next/link";
import Image from "next/image";
import { type RouterOutputs, api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { LoadingPage } from "~/components/loading";

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();

  // console.log(`user obj -> ${JSON.stringify(user, null, 5)}`);

  if (!user) return null;

  return (
    <div className="flex gap-3 w-full">
      <Image
        width={50} height={50}
        src={user.profileImageUrl}
        alt="Profile Image"
        className="rounded-full"
      />
      <input
        type="text" placeholder="What's on your mind?"
        className="bg-transparent grow outline-none"
      />
    </div>
  );
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number]

const PostView = (props: PostWithUser) => {
  const { post, author } = props;

  return (
    <div className="p-4 border-b border-slate-400 flex gap-3" key={post.id}>
      <Image
        width={50} height={50}
        src={author.profileImageUrl}
        alt={`@${author.username}'s profile picture`}
        className="rounded-full"
      />
      <div className="flex flex-col">
        <div className="flex text-slate-300 gap-2">
          <span>{`@${author.username}`}</span> <span className="font-thin">{` · ${dayjs(post.createdAt).fromNow()}`}</span>
        </div>
        <span>{post.content}</span>
      </div>
    </div>
  );
}

const Feed = () => {
  const { data, isLoading: postsLoaded } = api.posts.getAll.useQuery();

  if (postsLoaded) return <LoadingPage spinnerSize={40} />;

  if (!data) return <div>Something went wrong</div>;

  return (
    <div className="flex flex-col">
      {
        [...data, ...data]?.map((fullPost: PostWithUser) => (
          <PostView {...fullPost} key={fullPost.post.id}/>
        ))
      }
    </div>
  );
}

const Home: NextPage = () => {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });

  const { isLoaded: userLoaded, isSignedIn } = useUser();

  api.posts.getAll.useQuery();

  // -> Return emptoy div if both aren't loaded, since user tends to load faster
  if (!userLoaded) return <div></div>;



  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center h-screen"> {/* #15162c */}
        <div className="w-full md:max-w-2xl border-x border-slate-400">
          <div className="flex border-b border-slate-400 p-4">
            {!isSignedIn && (
              <div className="flex justify-center"><SignInButton /></div>
            )}
            {/* <SignOutButton /> */}
            {isSignedIn && (
              <CreatePostWizard />
            )}
          </div>
          <Feed />
        </div>
      </main>
    </>
  );
};

export default Home;
