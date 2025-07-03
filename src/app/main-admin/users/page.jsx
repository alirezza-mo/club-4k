import Layout from "@/components/layouts/MainAdminLayout";
import UsersPage from "@/components/templates/p-mainAdmin/users/UsersTable";
import React from "react";

function page() {
  return (
    <Layout>
      <div className="mt-20 p-4 w-full">
        <UsersPage/>
      </div>
    </Layout>
  );
}

export default page;
