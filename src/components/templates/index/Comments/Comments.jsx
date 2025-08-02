import Comment from "@/components/modules/Comment/Comment";
import Link from "next/link";
import React from "react";
import { FaRegComments } from "react-icons/fa";
import CommentModel from "../../../../../models/Comment";
import connectToDb from "../../../../../configs/db";

async function Comments() {
  await connectToDb();
  const comments = await CommentModel.find()
    .limit(6)
    .populate("user", "userName")
    .lean();

  return (
    <>
      <section className="mt-20 w-full ">
        <div className="w-full flex justify-between items-center text-xl sm:text-2xl">
          <h3 className=" dark:text-white dark:border-gold font-bold flex items-center gap-2 border-b-4 border-orange-600 pb-2 hover:border-none ">
            {" "}
            نظرات کاربران
            <FaRegComments />
          </h3>
          <Link
            href={"/comment"}
            className=" text-lg p-2 rounded-lg dark:bg-gold dark:text-white bg-orange-600 text-white transition-all hover:bg-transparent active:bg-transparent hover:text-orange-600 active:text-orange-600 dark:hover:bg-transparent dark:active:bg-transparent dark:hover:text-gold dark:active:text-gold"
          >
            {" "}
            مشاهده همه ...{" "}
          </Link>
        </div>
        <div className="mt-14 w-full rounded-lg flex items-center justify-center lg:justify-between gap-5 flex-wrap">
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              userName={comment.user.userName}
              date={comment.createdAt}
              message={comment.message}
            />
          ))}
        </div>
      </section>
    </>
  );
}

export default Comments;
