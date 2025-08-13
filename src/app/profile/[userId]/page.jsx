import ProfilePageTemplate from "@/components/templates/Profile/ProfilePageTemplate";

export default function Page({ params }) {
  const {userId} = params;
  return <ProfilePageTemplate userId={userId} />;
}
