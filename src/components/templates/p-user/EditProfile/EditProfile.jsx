
'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaUser, FaImage, FaSave, FaFileAlt, FaBirthdayCake } from 'react-icons/fa';

export default function EditProfileForm({ user }) {
    const handleUpdateProfile = (updatedData) => {
    // فقط UI: به‌روزرسانی استیت
    setUserData((prev) => ({ ...prev, ...updatedData }));
  };

  const [formData, setFormData] = useState({
    username: user.username || '',
    bio: user.bio || '',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    age: user.age || '',
    avatar: user.avatar || '/images/default-avatar.png',
    coverPhoto: user.coverPhoto || '/images/default-cover.png',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username || formData.username.length < 3) {
      newErrors.username = 'نام کاربری باید حداقل ۳ کاراکتر باشد';
    }
    if (formData.bio && formData.bio.length > 150) {
      newErrors.bio = 'بیو حداکثر ۱۵۰ کاراکتر می‌تواند باشد';
    }
    if (formData.age && (formData.age < 13 || formData.age > 100)) {
      newErrors.age = 'سن باید بین ۱۳ تا ۱۰۰ باشد';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('فقط فایل‌های تصویری مجاز هستند!');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error('حجم فایل باید کمتر از ۲ مگابایت باشد!');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('لطفاً خطاها را برطرف کنید!');
      return;
    }
    // فقط UI: فراخوانی onUpdate برای شبیه‌سازی ذخیره
    handleUpdateProfile(formData);
    toast.success('تغییرات ذخیره شد!');
  };

  return (
    <form onSubmit={handleSubmit} className="relative bg-white dark:bg-gray-800 rounded-lg p-6 mx-auto max-w-md md:max-w-lg gradient-border-card shadow-yellow-glow animate-fadeIn">
      <div className="absolute inset-0 rounded-lg gradient-border-card" />
      <div className="relative flex flex-col gap-6">
        {/* Cover Photo */}
        <div>
          <label className="font-vazir text-gray-700 dark:text-gray-200 flex items-center gap-2 mb-2">
            <FaImage /> تصویر کاور
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png"
            id="coverPhoto"
            onChange={(e) => handleImageChange(e, 'coverPhoto')}
            className="hidden"
            aria-label="آپلود تصویر کاور"
          />
          <label
            htmlFor="coverPhoto"
            className="block w-full h-32 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer overflow-hidden border-2 border-orange-600 dark:border-yellow-400 shadow-yellow-glow"
          >
            {formData.coverPhoto && (
              <img
                src={formData.coverPhoto}
                alt="پیش‌نمایش کاور"
                className="w-full h-full object-cover"
              />
            )}
          </label>
          {errors.coverPhoto && (
            <p className="font-vazir text-red-500 text-sm mt-1">{errors.coverPhoto}</p>
          )}
        </div>

        {/* Avatar */}
        <div>
          <label className="font-vazir text-gray-700 dark:text-gray-200 flex items-center gap-2 mb-2">
            <FaImage /> آواتار
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png"
            id="avatar"
            onChange={(e) => handleImageChange(e, 'avatar')}
            className="hidden"
            aria-label="آپلود آواتار"
          />
          <label
            htmlFor="avatar"
            className="block w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full cursor-pointer overflow-hidden border-4 border-orange-600 dark:border-yellow-400 shadow-yellow-glow mx-auto"
          >
            {formData.avatar && (
              <img
                src={formData.avatar}
                alt="پیش‌نمایش آواتار"
                className="w-full h-full object-cover rounded-full"
              />
            )}
          </label>
          {errors.avatar && (
            <p className="font-vazir text-red-500 text-sm mt-1 text-center">{errors.avatar}</p>
          )}
        </div>

        {/* Username */}
        <div>
          <label className="font-vazir text-gray-700 dark:text-gray-200 flex items-center gap-2">
            <FaUser /> نام کاربری
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="font-vazir mt-2 w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-orange-600 dark:border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-yellow-400 shadow-yellow-glow"
            placeholder="نام کاربری"
            aria-label="نام کاربری"
          />
          {errors.username && (
            <p className="font-vazir text-red-500 text-sm mt-1">{errors.username}</p>
          )}
        </div>

        {/* Bio */}
        <div>
          <label className="font-vazir text-gray-700 dark:text-gray-200 flex items-center gap-2">
            <FaFileAlt /> بیو
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="font-vazir mt-2 w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-orange-600 dark:border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-yellow-400 shadow-yellow-glow"
            placeholder="یه بیو خفن بنویس!"
            rows="4"
            aria-label="بیو"
          />
          {errors.bio && (
            <p className="font-vazir text-red-500 text-sm mt-1">{errors.bio}</p>
          )}
        </div>

        {/* First Name */}
        <div>
          <label className="font-vazir text-gray-700 dark:text-gray-200 flex items-center gap-2">
            <FaUser /> نام
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="font-vazir mt-2 w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-orange-600 dark:border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-yellow-400 shadow-yellow-glow"
            placeholder="نام"
            aria-label="نام"
          />
          {errors.firstName && (
            <p className="font-vazir text-red-500 text-sm mt-1">{errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="font-vazir text-gray-700 dark:text-gray-200 flex items-center gap-2">
            <FaUser /> نام خانوادگی
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="font-vazir mt-2 w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-orange-600 dark:border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-yellow-400 shadow-yellow-glow"
            placeholder="نام خانوادگی"
            aria-label="نام خانوادگی"
          />
          {errors.lastName && (
            <p className="font-vazir text-red-500 text-sm mt-1">{errors.lastName}</p>
          )}
        </div>

        {/* Age */}
        <div>
          <label className="font-vazir text-gray-700 dark:text-gray-200 flex items-center gap-2">
            <FaBirthdayCake /> سن
          </label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="font-vazir mt-2 w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-orange-600 dark:border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-yellow-400 shadow-yellow-glow"
            placeholder="سن"
            min="13"
            max="100"
            aria-label="سن"
          />
          {errors.age && (
            <p className="font-vazir text-red-500 text-sm mt-1">{errors.age}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-orange-600 dark:bg-yellow-400 text-white dark:text-gray-900 font-vazir px-6 py-2 rounded-lg shadow-yellow-glow hover:shadow-bronze-glow hover:bg-orange-700 dark:hover:bg-yellow-500 transition duration-300 flex items-center justify-center gap-2 mt-4"
          aria-label="ذخیره تغییرات"
        >
          <FaSave /> ذخیره تغییرات
        </button>
      </div>
    </form>
  );
}
