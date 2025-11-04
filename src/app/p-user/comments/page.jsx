import React from "react";
import Layout from "@/components/layouts/UserPanelLayout";
import UserPanelComments from "@/components/templates/p-user/comments/UserPanelComments";
import Link from "next/link";

// This page is now a server wrapper that renders a client-driven comments component.
export default function Page() {
  return (
    <Layout>
      <div className="mt-16 flex flex-col items-center">
        <UserPanelComments />
        <Link
          href={"/randomsentence"}
          className="my-10 px-10 py-2 rounded-lg bg-green-600 text-white text-2xl"
        >
          افزودن یک جمله
        </Link>
      </div>
    </Layout>
  );
}