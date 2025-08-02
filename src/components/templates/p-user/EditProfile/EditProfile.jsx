"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import swal from "sweetalert";

export default function EditProfileForm() {
  const router = useRouter();

  const [bio, setBio] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState(null);

  const validateForm = () => {
    if (bio.length > 150) {
       swal({
          title: "❌",
          text: "بیو حداکثر ۱۵۰ کاراکتر می‌تواند باشد",
          icon: "error",
          button: "باشد",
        });
      return false;
    }
    return true;
  };

  const handleImageChange = (e, setFile, setPreview) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      swal({
          title: "❌",
          text: "فایل باید JPG یا PNG باشد",
          icon: "error",
          button: "باشد",
        });
      return;
    }

    setFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();

    formData.append("bio", bio);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("age", age);

    if (avatar) formData.append("avatar", avatar);
    if (coverPhoto) formData.append("cover", coverPhoto);

    try {
      const res = await fetch("/api/profile/edit", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const idUser = data.savedUser._id;

      if (!res.ok) throw new Error(data.message || "خطا در ذخیره اطلاعات");

      if (res.status === 401) {
        swal({
          title: "اخطار",
          text: "توکنی ارسال نشد",
          icon: "error",
          button: "باشد",
        });
      }
      if (res.status === 404) {
        swal({
          title: "اخطار",
          text: "کاربری یافت نشد",
          icon: "error",
          button: "باشد",
        });
      }

      if (res.status === 200 || res.status === 201) {
        swal({
          title: "✅",
          text: "اطلاعات با موفقیت تغییر یافت",
          icon: "success",
          button: "باشد",
        });
        router.push(`/profile/${idUser}`);
      }
    } catch (err) {
      swal({
        title: "اخطار",
        text: err.message,
        icon: "error",
        button: "باشد",
      });
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "خطا در دریافت اطلاعات");

        setBio(data.bio || "");
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setAge(data.age || "");

        setAvatarPreview(
          data.avatar ? `${process.env.GET_LIARA}/${data.avatar}` : ""
        );
        setCoverPhotoPreview(
          data.profile ? `${process.env.GET_LIARA}/${data.profile}` : ""
        );
      } catch (err) {
        swal({
          title: "❌",
          text: "خطا در بارگذاری اطلاعات کاربر",
          icon: "error",
          button: "باشد",
        }); 
        
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white shadow-xl rounded-2xl space-y-8"
    >
      {/* Cover Photo */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">
          تصویر کاور
        </label>
        <div className="relative rounded-xl overflow-hidden border border-dashed border-gray-300 hover:border-orange-500 transition duration-300">
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={(e) =>
              handleImageChange(e, setCoverPhoto, setCoverPhotoPreview)
            }
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
            aria-label="آپلود تصویر کاور"
          />
          {coverPhotoPreview ? (
            <img
              src={coverPhotoPreview}
              alt="پیش‌نمایش کاور"
              className="w-full h-48 object-cover transition-all duration-300 ease-in-out"
            />
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400">
              انتخاب تصویر کاور
            </div>
          )}
        </div>
      </div>

      {/* Avatar */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">آواتار</label>
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24 rounded-full border-2 border-gray-300 shadow-md overflow-hidden">
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={(e) =>
                handleImageChange(e, setAvatar, setAvatarPreview)
              }
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              aria-label="آپلود آواتار"
            />
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="آواتار"
                className="w-full h-full object-cover transition-all duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                انتخاب آواتار
              </div>
            )}
          </div>
          <span className="text-sm text-gray-500">
            حداکثر ۲ مگابایت - PNG/JPG
          </span>
        </div>
      </div>

      {/* Bio */}
      <div>
        <label className="text-sm font-semibold text-gray-700 mb-1 block">
          بیو
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="بیو (حداکثر ۱۵۰ کاراکتر)"
          maxLength={150}
          rows={4}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
        />
      </div>

      {/* First Name */}
      <div>
        <label className="text-sm font-semibold text-gray-700 mb-1 block">
          نام
        </label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="نام"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
        />
      </div>

      {/* Last Name */}
      <div>
        <label className="text-sm font-semibold text-gray-700 mb-1 block">
          نام خانوادگی
        </label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="نام خانوادگی"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
        />
      </div>

      {/* Age */}
      <div>
        <label className="text-sm font-semibold text-gray-700 mb-1 block">
          سن
        </label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="سن"
          min="13"
          max="100"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl text-lg font-semibold hover:shadow-lg transition duration-300"
      >
        ذخیره تغییرات
      </button>
    </form>
  );
}
