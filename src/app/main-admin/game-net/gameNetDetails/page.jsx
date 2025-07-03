import Layout from "@/components/layouts/MainAdminLayout";
import GameNetDetails from "@/components/templates/p-mainAdmin/gameNet/GameNetDetails";

export default function page() {
  const gameNetData = {
    id: "gn1",
    name: "گیم‌نت آراد",
    code: "ARAD123",
    ownerName: "رضا صادقی",
    ownerPhone: "09121234567",
    createdAt: "1403/04/12",
    status: "active",
    userCount: 128,
    sessionsCount: 342,
    gameTimes : 4000
  };

  return (
    <Layout>
      <div className="p-4 w-full mt-20">
        <GameNetDetails gameNet={gameNetData} />
      </div>
    </Layout>
  );
}
