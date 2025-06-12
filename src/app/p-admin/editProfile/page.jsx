import Layout from "@/components/layouts/AdminPanelLayout";
import AdminProfileEditForm from "@/components/templates/p-admin/editProfile/EditProfile";
import React from "react";

function page() {
  return (
    <Layout>
      <div className="w-full flex items-center justify-center mt-36 p-2">
        <AdminProfileEditForm />
      </div>
    </Layout>
  );
}

export default page;
