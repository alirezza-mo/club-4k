import Layout from "@/components/layouts/AdminPanelLayout";
import AddNews from "@/components/templates/p-admin/news/NewsSection";
import { verifyAccessToken } from "@/utils/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import AdminModel from "../../../../models/Admin"
import NewsModel from "../../../../models/News"
import NewsBox from "@/components/modules/P-admin/NewsBoxAdminPanel";

async function page() {
  const token = await cookies().get("accessToken")?.value
  if(!token){
    redirect('/register-admin')
  }
  const payload = await verifyAccessToken(token)
  const admin = await AdminModel.findById(payload.id)
  if(!admin){
    redirect('/register-admin')
  }
  const news = await NewsModel.find().populate("admin" , "gameNet")


  
  return (
    <>
      <Layout>
        <div className="w-full flex flex-col mt-20 p-5">
          <h1 className="text-2xl font-bold text-orange-600 dark:text-gold mb-6 ">
            ایجاد اخبار :
          </h1>
          <AddNews />
        </div>
        <div className="w-full flex flex-col mt-20 p-5">
          <h1 className="text-2xl font-bold text-orange-600 dark:text-gold mb-6 ">
            اخبار قبلی :
          </h1>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {
            news.map(nw => {
              if(nw.admin.gameNet === admin.gameNet ){
                return (
                  <NewsBox key={nw._id} image={nw.image} confirmed = {nw.confirmed} content = {nw.content} publishedAt = {nw.publishedAt} />
                )
              }
            })
          }
          </div>
        </div>
      </Layout>
    </>
  );
}

export default page;
