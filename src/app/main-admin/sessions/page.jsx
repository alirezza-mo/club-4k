import Layout from "@/components/layouts/MainAdminLayout";
import GameNetSessionPage from "@/components/templates/p-mainAdmin/sessions/Sessions";
import UsersPage from "@/components/templates/p-mainAdmin/users/UsersTable";
import React from "react";

function page() {
  return (
    <Layout>
      <div className="mt-20 p-4 w-full">
        <GameNetSessionPage/>
      </div>
    </Layout>
  );
}

export default page;
