"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
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
      toast.error("بیو حداکثر ۱۵۰ کاراکتر می‌تواند باشد");
      return false;
    }
    if (age && (age < 13 || age > 100)) {
      toast.error("سن باید بین ۱۳ تا ۱۰۰ باشد");
      return false;
    }
    return true;
  };

  const handleImageChange = (e, setFile, setPreview) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.error("فایل باید JPG یا PNG باشد");
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

      if (!res.ok) throw new Error(data.message || "خطا در ذخیره اطلاعات")

        if( res.status ===401 ){
          swal({
          title: "اخطار",
          text: "توکنی ارسال نشد",
          icon: "error",
          button: "باشد",
        });
        }
        if( res.status ===404 ){
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
      toast.error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 space-y-6">
      {/* Cover Photo */}
      <div>
        <label className="block mb-1 font-semibold">تصویر کاور</label>
        <input
          type="file"
          accept="image/jpeg,image/png"
          onChange={(e) =>
            handleImageChange(e, setCoverPhoto, setCoverPhotoPreview)
          }
          className="mb-2"
          aria-label="آپلود تصویر کاور"
        />
        {coverPhotoPreview && (
          <img
            src={coverPhotoPreview}
            alt="پیش‌نمایش کاور"
            className="w-full h-40 object-cover rounded-md"
          />
        )}
      </div>

      {/* Avatar */}
      <div>
        <label className="block mb-1 font-semibold">آواتار</label>
        <input
          type="file"
          accept="image/jpeg,image/png"
          onChange={(e) => handleImageChange(e, setAvatar, setAvatarPreview)}
          className="mb-2"
          aria-label="آپلود آواتار"
        />
        {avatarPreview && (
          <img
            src={avatarPreview}
            alt="پیش‌نمایش آواتار"
            className="w-24 h-24 object-cover rounded-full"
          />
        )}
      </div>

      <div>
        <label className="block mb-1 font-semibold">بیو</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="بیو (حداکثر ۱۵۰ کاراکتر)"
          className="w-full p-2 border rounded"
          rows={4}
          maxLength={150}
          aria-label="بیو"
        />
      </div>

      {/* First Name */}
      <div>
        <label className="block mb-1 font-semibold">نام</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="نام"
          className="w-full p-2 border rounded"
          aria-label="نام"
        />
      </div>

      {/* Last Name */}
      <div>
        <label className="block mb-1 font-semibold">نام خانوادگی</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="نام خانوادگی"
          className="w-full p-2 border rounded"
          aria-label="نام خانوادگی"
        />
      </div>

      {/* Age */}
      <div>
        <label className="block mb-1 font-semibold">سن</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="سن"
          min="13"
          max="100"
          className="w-full p-2 border rounded"
          aria-label="سن"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-orange-600 text-white p-3 rounded hover:bg-orange-700 transition"
        aria-label="ذخیره تغییرات"
      >
        ذخیره تغییرات
      </button>
    </form>
  );
}
