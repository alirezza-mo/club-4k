import Layout from "@/components/layouts/UserPanelLayout";
import ChallengesDone from "@/components/templates/p-user/challenge/ChallengesDone";
import Requests from "@/components/templates/p-user/challenge/Requests";
import React from "react";
import connectToDb from "../../../../configs/db";
import ChallengeModel from "../../../../models/Challenge";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/utils/auth";
import Users from "../../../../models/Users";
import { redirect } from "next/navigation";
import { checkAndExpireChallenges } from "@/utils/challengeExpiration";

async function page() {
  await connectToDb();
  
  // بررسی و انقضای چالش‌های منقضی شده
  await checkAndExpireChallenges();
  
  const token = await cookies().get("accessToken")?.value;

  if (!token) {
    redirect("/");
  }

  let user = null;
  if (token) {
    const payload = verifyAccessToken(token);
    if (payload) {
      const rawUser = await Users.findById(payload.id)
        .select("-password")
        .lean();
      user = JSON.parse(JSON.stringify(rawUser));
    }
  }
  if (!user) {
    redirect("/login");
  }
  let challengesReq = await ChallengeModel.find({ status: "pending" })
    .populate("inviter invited location")
    .sort({ fightTime: -1 })
    .lean();
  if (Array.isArray(challengesReq)) {
    challengesReq = challengesReq.filter(
      (challenge) =>
        challenge.invited &&
        challenge.invited._id.toString() === user._id.toString()
    );
  }
  
  const serializedChallengesReq = JSON.parse(JSON.stringify(challengesReq));
  

  const challengesDone = await ChallengeModel.find({ status: "accepted" })
    .populate("inviter invited location")
    .sort({ fightTime: -1 })
    .lean();
  
  const serializedChallengesDone = JSON.parse(JSON.stringify(challengesDone));
  return (
    <>
      <Layout>
        <div className="mt-5">
          <div>
            <Requests challengesReq={serializedChallengesReq} />
          </div>
          <div className="mt-5">
            <ChallengesDone
              user={user}
              challengesDone={serializedChallengesDone}
            />
          </div>
        </div>
      </Layout>
    </>
  );
}

export default page;
