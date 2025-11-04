import React from "react";
import Layout from "@/components/layouts/UserPanelLayout";
import ChallengesDone from "@/components/templates/p-user/challenge/ChallengesDone";
import Requests from "@/components/templates/p-user/challenge/Requests";
// import connectToDb from "@/configs/db";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/utils/auth";
import Users from "../../../../models/Users";
import Challenge from "../../../../models/Challenge";
import connectToDb from "../../../../configs/db";

export default async function Page() {
  await connectToDb();

  const token = cookies().get("accessToken")?.value;
  const payload = token ? verifyAccessToken(token) : null;
  if (!payload) return <div>Unauthorized</div>;
  const user = await Users.findById(payload.id).select("-password").lean();

  let challengesReq = await Challenge.find({ status: "pending" })
    .populate("inviter invited location")
    .sort({ fightTime: -1 })
    .lean();
  if (Array.isArray(challengesReq)) {
    challengesReq = challengesReq.filter(
      (challenge) =>
        challenge.invited && challenge.invited._id.toString() === user._id.toString()
    );
  }

  const challengesDone = await Challenge.find({
    $or: [{ inviter: user._id }, { invited: user._id }],
    status: "accepted",
  })
    .populate("inviter invited location")
    .sort({ fightTime: -1 })
    .lean();

  return (
    <Layout>
      <div className="mt-10">
        <ChallengesDone challenges={challengesDone} />
      </div>
      <div className="mt-10">
        <Requests requests={challengesReq} />
      </div>
    </Layout>
  );
}
