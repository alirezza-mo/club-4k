import React from "react";
import { FaEye, FaTrash } from "react-icons/fa";

function TicketsSection() {
  return (
    <>
      <div className="">
        <div className="flex items-center justify-around flex-wrap gap-5">
          <h1 className="text-3xl font-bold dark:text-gold text-orange-600">
            {" "}
            تمام تیکت ها{" "}
          </h1>
          <div className="flex items-center justify-center gap-5">
            <select
              
              name="ticket"
              id="ticket"
              className="outline-none p-2 dark:bg-gray-700 dark:text-white bg-gray-100 rounded-lg "
            >
              <option value="all"> همه </option>
              <option value="dragon">دراگون</option>
              <option value="alfa">آلفا</option>
              <option value="game land">گیم لند</option>
            </select>
            <input
              type="search"
              name="challenge"
              className="dark:bg-gray-600 dark:text-white bg-gray-100 text-gray-500  p-2 rounded-lg md:w-96 outline-none  "
              placeholder="گیم نت یا کاربر مورد نظر خود را تایپ کنید ..."
            />
          </div>
        </div>
        <div className=" overflow-x-auto  flex flex-col items-center justify-center mt-20 rounded-lg">
          <table className="w-full text-xs md:text-sm overflow-x-auto">
            <thead className="bg-orange-600 text-white dark:bg-gold">
              <tr className="">
                <th className="p-1">#</th>
                <th className="p-1"> نام</th>
                <th className="p-1"> گیم نت </th>
                <th className="p-1"> متن پیام</th>
                <th className="p-1"> وضعیت </th>
                <th className="p-1"> عملیات</th>
              </tr>
            </thead>
            <tbody className="dark:bg-gray-700 dark:text-white p-2  ">
              <tr className="text-center">
                <td className="p-1"> 1 </td>
                <td className="p-1"> رضا مرادی </td>
                <td className="p-1"> دراگون</td>
                <td className="p-1 text-ellipsis "> مشکل در احراز هویت و عدم ارسال پیامک جهت ورود به سایت و پنل کاربری</td>
                <td className="p-1 text-yellow-500"> باز</td>
                <td className="p-1 flex items-center gap-2 justify-center"> 
                  <button className="text-base hover:scale-105 cursor-pointer text-blue-500">
                    <FaEye/>
                  </button>
                  <button className="text-base hover:scale-105 cursor-pointer text-red-500">
                    <FaTrash/>
                  </button>
                   </td>
              </tr>
              <tr className="text-center">
                <td className="p-1"> 2 </td>
                <td className="p-1">  جان ویک 2008 </td>
                <td className="p-1"> آلفا   </td>
                <td className="p-1 text-ellipsis"> عدم دسترسی به پنل کاربری خود </td>
                <td className="p-1 text-red-500"> بسته شده ... </td>
                <td className="p-1 flex items-center gap-2 justify-center">
                  <button className="text-base hover:scale-105 cursor-pointer text-red-500">
                    <FaTrash/>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default TicketsSection;
