"use client";

import { useState } from "react";
import Image from "next/image";
import swal from "sweetalert";

export default function AddNews() {
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      swal({
        title: "❌",
        text: " متن خبر را وارد نمایید ",
        icon: "error",
        button: "باشد",
      });
      return;
    }

    const formData = new FormData();
    formData.append("content", content);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      setLoading(true);
      const res = await fetch("/api/news", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "خطایی رخ داده است");
      if (res.status === 400) {
        swal({
          title: "❌",
          text: " توکنی وجود ندارد. ",
          icon: "error",
          button: "باشد",
        });
      }
      if (res.status === 401) {
        swal({
          title: "❌",
          text: " توکن صحیح نیست ",
          icon: "error",
          button: "باشد",
        });
      }
      if (res.status === 402) {
        swal({
          title: "❌",
          text: " عدم وجود ادمین ",
          icon: "error",
          button: "باشد",
        });
      }
      if (res.status === 403) {
        swal({
          title: "❌",
          text: "متن خبر را وارد نمایید",
          icon: "error",
          button: "باشد",
        });
      }

      if (res.status === 201) {
        swal({
          title: "✅",
          text: " خبر با موفقیت ارسال شد ",
          icon: "success",
          button: "باشد",
        });
      }
      setContent("");
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      swal({
        title: "❌",
        text: "با خطایی مواجه شدیم",
        icon: "error",
        button: "باشد",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" w-full mx-auto p-6 mt-10 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-orange-600 dark:text-gold">
        افزودن خبر جدید
      </h2>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="متن خبر را وارد کنید..."
        rows={5}
        className="w-full p-3 rounded-xl dark:text-white dark:placeholder:text-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-right"
      />

      <div className="mt-4">
        <label className="block mb-2 font-semibold dark:text-gray-300">تصویر خبر (اختیاری):</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold dark:file:bg-indigo-700 dark:file:text-white file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
      </div>

      {imagePreview && (
        <div className="mt-4">
          <Image
            src={imagePreview}
            alt="پیش‌نمایش تصویر"
            width={400}
            height={300}
            className="rounded-lg border"
          />
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-6 w-full bg-orange-600 hover:bg-orange-700 cursor-pointer text-white py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50"
      >
        {loading ? "در حال ارسال..." : "ثبت خبر"}
      </button>
    </div>
  );
}
