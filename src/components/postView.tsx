// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs";
import { type NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import { type RouterOutputs, api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export type PostWithUser = RouterOutputs["posts"]["getAll"][number]

export const PostView = (props: PostWithUser) => {
  const { post, author } = props;

  return (
    <div className="p-4 border-b border-slate-400 flex gap-3" key={post.id}>
      <Image
        width={60} height={60}
        src={author.profileImageUrl}
        alt={`@${author.username}'s profile picture`}
        className="rounded-full"
      />
      <div className="flex flex-col">
        <div className="flex text-slate-300 gap-2">
          <Link href={`/@${author.username}`}>
            <span>{`@${author.username}`}</span>
          </Link>
          <Link href={`/post/${post.id}`}>
            <span className="font-thin">{` · ${dayjs(post.createdAt).fromNow()}`}</span>
          </Link>
        </div>
        <span className="text-2xl">{post.content}</span>
      </div>
    </div>
  );
};
