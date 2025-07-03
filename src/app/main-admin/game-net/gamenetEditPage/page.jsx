import EditGameNetForm from "@/components/templates/p-mainAdmin/gameNet/EditGameNetForm";


export default function page() {
  
  const gameNetData = {
    id: "gn1",
    name: "گیم‌نت آراد",
    code: "ARAD123",
    ownerName: "رضا صادقی",
    ownerPhone: "09121234567",
    status: "active",
  };

  return (
    <div className="p-4">
      <EditGameNetForm gameNet={gameNetData} />
    </div>
  );
}
