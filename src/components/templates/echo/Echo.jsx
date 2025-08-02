"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import MotivationBox from "@/components/modules/MotivationBox/MotivationBox";
import swal from "sweetalert";

function EchoPage() {

  const [echo, setEcho] = useState([]);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchecho = async (page = 1) => {
    const res = await axios.get(`/api/echo?page=${page}`);

    setEcho(res.data.echo);
    setTotal(res.data.total);
  };

  useEffect(() => {
    fetchecho(page);
  }, [page]);

  const submitEcho = async (e) => {
    e.preventDefault();

    console.log(message);

    const res = await fetch("api/echo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    setMessage("");
    if (res.status === 200) {
      swal({
        title: "✅",
        text: " با موفقیت ثبت شد. منتظر تائید جهت نمایش ",
        icon: "success",
        button: "باشد",
      });
      fetchecho(1)
    }
  };

  const totalPages = Math.ceil(total / 10);

  return (
    <div className="w-full mx-auto flex flex-col items-center py-8 px-4 mt-32">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">
        {" "}
        ما رو به یک جمله دعوت کن 🍀{" "}
      </h1>

      <form
        onSubmit={submitEcho}
        className="w-full mb-6 flex flex-col items-center justify-center"
      >
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className=" w-[300px] md:w-[600px] p-2 border border-gray-600 outline-none  rounded-md dark:text-white placeholder:text-gray-500 "
          placeholder="جمله خود را بنویسید..."
        ></textarea>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
        >
          ارسال ...
        </button>
      </form>

      <div className="flex flex-wrap items-center justify-center gap-5">
        {echo.map((ec) => (
          <MotivationBox
            key={ec._id}
            message={ec.message}
            userName={ec.user?.userName}
          />
        ))}
      </div>

      <div className="flex gap-2 justify-center mt-6">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-3 py-1 rounded ${
              p === page ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

export default EchoPage;
