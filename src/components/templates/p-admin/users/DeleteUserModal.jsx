"use client";

export default function DeleteUserModal({ user, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-[#111] text-gray-800 dark:text-yellow-100 w-full max-w-sm rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-bold text-red-600 dark:text-gold mb-4">
          حذف کاربر
        </h2>

        <p className="mb-6">
          آیا از حذف کاربر{" "}
          <span className="font-semibold text-orange-600 dark:text-gold">
            {user.name}
          </span>{" "}
          اطمینان دارید؟ این عملیات قابل بازگشت نیست.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gold hover:bg-gray-300 dark:hover:bg-yellow-700 rounded"
          >
            لغو
          </button>
          <button
            onClick={() => {
              onConfirm(user.id);
              onClose();
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
          >
            حذف کاربر
          </button>
        </div>
      </div>
    </div>
  );
}
