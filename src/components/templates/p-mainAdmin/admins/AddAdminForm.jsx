// components/admin-panel/AddAdminForm.tsx
'use client';

import { useState } from 'react';
import Select from 'react-select';

const gameNetOptions = [
  { value: 'gamenet-1', label: 'گیم‌نت پلاس' },
  { value: 'gamenet-2', label: 'ایران گیم' },
  { value: 'gamenet-3', label: 'اکس گیم' },
];

export default function AddAdminForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    phone: '',
    gameNet: null,
    code: '',
    image: null 
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // اینجا می‌تونی ارسال به API رو انجام بدی
    console.log('Admin Data:', formData);
  };

  return (
    <section className="p-4 font-vazir">
      <h2 className="text-lg font-bold mb-4 text-orange-600 dark:text-gold">ثبت ادمین جدید</h2>

      <form onSubmit={handleSubmit} className="dark:text-white grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-neutral-900 p-4 rounded-lg shadow-md">
        <div>
          <label className="block mb-1 text-sm font-medium">نام و نام خانوادگی</label>
          <input
            type="text"
            required
            className="w-full border rounded px-4 py-2 dark:bg-neutral-800 dark:text-white"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">شماره تماس</label>
          <input
            type="tel"
            required
            className="w-full border rounded px-4 py-2 dark:bg-neutral-800 dark:text-white"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">سن</label>
          <input
            type="number"
            required
            className="w-full border rounded px-4 py-2 dark:bg-neutral-800 dark:text-white"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">انتخاب گیم‌نت</label>
          <Select
            instanceId="add-admin-select"
            inputId="add-admin-input"
            options={gameNetOptions}
            placeholder="گیم‌نت مورد نظر را انتخاب کنید"
            value={formData?.gameNet}
            onChange={(value) => setFormData({ ...formData, gameNet: value })}
            className="dark:text-black"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">کد گیم‌نت (اختیاری)</label>
          <input
            type="text"
            className="w-full border rounded px-4 py-2 dark:bg-neutral-800 dark:text-white"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">تصویر پروفایل</label>
          <input
            type="file"
            accept="image/*"
            className="w-full"
            onChange={(e) =>
              setFormData({
                ...formData,
                image: e.target.files ? e.target.files[0] : null,
              })
            }
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="bg-orange-600 dark:bg-gold text-white dark:text-black px-6 py-2 rounded hover:opacity-90"
          >
            ثبت ادمین
          </button>
        </div>
      </form>
    </section>
  );
}
