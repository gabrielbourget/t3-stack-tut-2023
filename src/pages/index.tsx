// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { type RouterOutputs, api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { type ChangeEvent, useState } from "react";
import toast from "react-hot-toast";
import { PageLayout } from "~/components/layout";
import { PostView, type PostWithUser } from "~/components/postView";

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();

  const [input, setInput] = useState("");

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errMessage = e.data?.zodError?.fieldErrors.content;
      if (errMessage && errMessage[0]) {
        toast.error(errMessage[0]);
      } else {
        toast.error("Failed to post!");
      }
    }
  });

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
        // eslint-disable-next-line react/jsx-no-duplicate-props
        value={input}
        disabled={isPosting}
        onChange={(evt: ChangeEvent<HTMLInputElement>) => setInput(evt.target.value)}
        onKeyDown={(evt) => {
          if (evt.key === "Enter") {
            evt.preventDefault()
            if (input !== "") mutate({ content: input });
          }
        }}
      />
      {
        (input !== "" && !isPosting) ? (
          <button disabled={isPosting} onClick={() => mutate({ content: input })}>Post</button>
        ) : undefined
      }
      {
        isPosting ? (
          <div className="flex items-center justify-center">
            <LoadingSpinner size={20} />
          </div>
        ) : undefined
      }
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: postsLoaded } = api.posts.getAll.useQuery();

  if (postsLoaded) return <LoadingPage spinnerSize={40} />;

  if (!data) return <div>Something went wrong</div>;

  return (
    <div className="flex flex-col">
      {
        data.map((fullPost: PostWithUser) => (
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
        <title>Chirp</title>
        <meta name="description" content="🤔" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageLayout>
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
      </PageLayout>
    </>
  );
};

export default Home;
