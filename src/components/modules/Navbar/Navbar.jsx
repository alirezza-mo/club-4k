import { CiSearch } from "react-icons/ci";
import { FaMoon } from "react-icons/fa";

function Navbar() {
  return (
    <>
      <nav className="flex items-center justify-between ">
        <div>
          <ul className="flex items-center justify-center gap-5">
            <li className="transition-all cursor-pointer hover:text-gray-500">
              {" "}
              خانه{" "}
            </li>
            <li className="transition-all cursor-pointer hover:text-gray-500">
              {" "}
              نفرات برتر{" "}
            </li>
            <li className="transition-all cursor-pointer hover:text-gray-500">
              {" "}
              درباره ما{" "}
            </li>
            <li className="transition-all cursor-pointer hover:text-gray-500">
              {" "}
              ارتباط با ما{" "}
            </li>
          </ul>
        </div>
        <div className="flex items-center justify-center gap-5">
          <button className="px-1 py-2 bg-orange-600 text-gray-100 transition-all cursor-pointer hover:bg-orange-700 hover:text-white rounded-lg ">
            {" "}
            ثبت نام | عضویت{" "}
          </button>
          <div className="flex items-center justify-center gap-2">
            <span>
              <CiSearch className="text-3xl transition-all cursor-pointer hover:text-gray-600" />
            </span>
            <span>
              <FaMoon className="text-3xl transition-all cursor-pointer hover:text-yellow-500" />
            </span>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
