import Layout from "@/components/layouts/AdminPanelLayout";
import AdminUsersPage from "@/components/templates/p-admin/users/Users";
import React from "react";

function page() {
  return (
    <>
      <Layout>
        <div className="w-full flex flex-col mt-20 p-5">
          <h1 className="text-2xl font-bold text-orange-600 dark:text-gold mb-6 ">
            کاربران
          </h1>
          <AdminUsersPage/>
        </div>
      </Layout>
    </>
  );
}

export default page;
