import React from "react";

function MotivationBox({message , userName}) {
  return (
    <>
      <div className="w-96 h-36 p-3 rounded-lg">
        <div className="w-full flex items-center justify-between ">
          <h4 className="text-orange-600 dark:text-gold font-bold "> {userName} </h4>
        </div>
        <div className=" mt-4 ">
          <h4 className=" w-full h-20 p-1 break-words whitespace-pre-wrap text-gray-500 ">
            {message}
          </h4>
        </div>
      </div>
    </>
  );
}

export default MotivationBox;
