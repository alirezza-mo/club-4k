import React from "react";

function ChallengeSection() {
  return (
    <>
      <div className="">
        <div className="flex items-center justify-around flex-wrap gap-5">
          <h1 className="text-3xl font-bold dark:text-gold text-orange-600">
            {" "}
            چلنج ها{" "}
          </h1>
          <div className="flex items-center justify-center gap-5">
            <select
              
              name="cars"
              id="cars"
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
          <table className="w-full text-xs md:text-sm ">
            <thead className="bg-orange-600 text-white dark:bg-gold">
              <tr className="">
                <th className="p-1">#</th>
                <th className="p-1"> اسامی </th>
                <th className="p-1"> گیم نت </th>
                <th className="p-1"> تاریخ </th>
                <th className="p-1"> وضعیت </th>
                <th className="p-1"> نتیجه </th>
              </tr>
            </thead>
            <tbody className="dark:bg-gray-700 dark:text-white p-2  ">
              <tr className="text-center">
                <td className="p-1"> 1 </td>
                <td className="p-1"> براندون VS مونتانا </td>
                <td className="p-1"> دراگون VS دراگون </td>
                <td className="p-1"> 1403/02/11 20:30 </td>
                <td className="p-1 text-green-500"> در حال اجرا </td>
                <td className="p-1"> مونتانا </td>
              </tr>
              <tr className="text-center">
                <td className="p-1"> 2 </td>
                <td className="p-1"> کارلوس توز VS جان ویک 2008 </td>
                <td className="p-1"> آلفا VS دراگون </td>
                <td className="p-1"> 1403/02/11 20:30 </td>
                <td className="p-1 text-yellow-500"> در انتظار... </td>
                <td className="p-1"> - </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default ChallengeSection;
