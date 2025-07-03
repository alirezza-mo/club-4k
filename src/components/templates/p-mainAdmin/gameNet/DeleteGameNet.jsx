"use client";

import { useState } from "react";

export default function DeleteGameNetButton({id}) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/gamenets/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("خطا در حذف");

      alert("✅ گیم‌نت با موفقیت حذف شد");
      // مثلا ریدایرکت یا رفرش لیست
      window.location.href = "/admin/gamenets";
    } catch (error) {
      alert("❌ حذف انجام نشد");
    } finally {
      setIsLoading(false);
      setIsConfirming(false);
    }
  };

  return (
    <div>
      {isConfirming ? (
        <div className="flex gap-3 items-center">
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            {isLoading ? "در حال حذف..." : "تأیید حذف"}
          </button>
          <button
            onClick={() => setIsConfirming(false)}
            className="text-gray-600 dark:text-gray-300 hover:underline"
          >
            انصراف
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsConfirming(true)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          حذف گیم‌نت
        </button>
      )}
    </div>
  );
}
