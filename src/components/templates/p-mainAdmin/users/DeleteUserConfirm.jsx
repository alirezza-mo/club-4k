"use client";
export default function DeleteUserConfirm({ user, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg text-center">
        <h3 className="text-lg text-red-600 font-bold mb-4">
          آیا مطمئن هستید که می‌خواهید کاربر {user.fullName} را حذف کنید؟
        </h3>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg"
          >
            انصراف
          </button>
          <button
            onClick={() => onConfirm(user.id)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            حذف
          </button>
        </div>
      </div>
    </div>
  );
}
