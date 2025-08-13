"use client";

import { useEffect, useState } from "react";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import swal from "sweetalert";
import { FaPaperPlane } from "react-icons/fa";

export default function ChallengeForm({
  onChallengeCreated,
  inviterId,
}) {
  const [invited, setInvited] = useState("");
  const [location, setLocation] = useState("");
  const [game, setGame] = useState("");
  const [message, setMessage] = useState("");
  const [fightTime, setFightTime] = useState(null);
  const [status, setStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [gameNet, setGameNet] = useState([]);
  const [user, setUser] = useState([]);

  useEffect(() => {
    const fetchGameNet = async () => {
      try {
        const res = await fetch("/api/gameNet");
        const data = await res.json();
        setGameNet(data);
      } catch (err) {
        console.error("Error fetching game nets:", err);
      }
    };
    fetchGameNet();
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUser();
  }, []);
  const filteredLocations =
    gameNet?.filter((loc) =>
      loc.gameNet.toLowerCase().includes(locationSearch.toLowerCase())
    ) || [];
  const filteredUsers = user.filter((user) =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validateForm = () => {
  if (!invited) return "حریف را انتخاب کنید.";
  if (!location) return "گیم‌نت را انتخاب کنید.";
  if (!game) return "بازی را انتخاب کنید.";
  if (!fightTime) return "تاریخ و زمان را وارد کنید.";

  if (invited === inviterId) return "نمی‌توانید خودتان را به چالش دعوت کنید.";

  const selectedDate = fightTime ? fightTime.toDate() : null;
  const now = new Date();
  if (selectedDate && selectedDate < now) return "تاریخ انتخابی باید در آینده باشد.";

  if (message && message.length < 3) return "پیام دعوت خیلی کوتاه است.";

  const allowedGames = ["FIFA 23", "eFootball 21"];
  if (!allowedGames.includes(game)) return "بازی انتخابی معتبر نیست.";

  return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setStatus({ type: "error", message: error });
      swal({
        title: "اخطار",
        text: error,
        icon: "error",
        button: "باشه",
      });
      return;
    }
    setStatus({ type: "loading", message: "در حال ارسال دعوت..." });
    const selectedDate = fightTime.toDate();
    const now = new Date();
    if (selectedDate < now) {
      return swal({
        title: "اخطار",
        text: " زمان انتخابی صحیح نمی باشد چون در گذشته است. ",
        icon: "error",
        button: "باشد",
      });
    }
    try {
      const res = await fetch("/api/challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inviter: inviterId,
          invited,
          location,
          game,
          message,
          fightTime: fightTime ? fightTime.toDate() : "",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: "success", message: "دعوت با موفقیت ارسال شد!" });
        if (onChallengeCreated) onChallengeCreated(data);
      } else {
        setStatus({
          type: "error",
          message: data.error || "خطا در ارسال دعوت",
        });
      }
    } catch (err) {
      setStatus({ type: "error", message: "ارتباط با سرور برقرار نشد." });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg mx-auto font-vazir"
    >
      <div className="mb-4">
        <label
          htmlFor="invited"
          className="block text-gray-700 dark:text-gray-200 mb-2"
        >
          حریف
        </label>
        <input
          type="text"
          placeholder="جستجو..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full mb-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-orange-600 dark:border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-yellow-400"
        />
        <select
          id="invited"
          name="invited"
          value={invited}
          onChange={(e) => setInvited(e.target.value)}
          className="w-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-orange-600 dark:border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-yellow-400 shadow-yellow-glow transition duration-300"
          aria-label="حریف"
        >
          <option value="" disabled>
            انتخاب حریف
          </option>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <option key={user._id} value={user.userName}  > 
                {user.userName} {user.gameNet ? ` - ${user.gameNet}` : ""}
              </option>
            ))
          ) : (
            <option disabled>هیچ نتیجه‌ای یافت نشد</option>
          )}
        </select>
      </div>
      <div className="mb-4">
        <label
          htmlFor="location"
          className="block text-gray-700 dark:text-gray-200 mb-2"
        >
          گیم‌نت
        </label>
        <input
          type="text"
          placeholder="جستجو گیم‌نت..."
          value={locationSearch}
          onChange={(e) => setLocationSearch(e.target.value)}
          className="w-full mb-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-orange-600 dark:border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-yellow-400"
        />
        <select
          id="location"
          name="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-orange-600 dark:border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-yellow-400 shadow-yellow-glow transition duration-300"
          aria-label="گیم‌نت"
        >
          <option value="" disabled>
            انتخاب گیم‌نت
          </option>
          {filteredLocations.length > 0 ? (
            filteredLocations.map((loc) => (
              <option key={loc._id} value={loc.gameNet}>
                {loc.gameNet}
              </option>
            ))
          ) : (
            <option disabled>هیچ گیم‌نتی یافت نشد</option>
          )}
        </select>
      </div>
      <div className="mb-4">
        <label
          htmlFor="game"
          className="block text-gray-700 dark:text-gray-200 mb-2"
        >
          بازی
        </label>
        <select
          id="game"
          name="game"
          value={game}
          onChange={(e) => setGame(e.target.value)}
          className="w-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-orange-600 dark:border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-yellow-400 shadow-yellow-glow transition duration-300"
          aria-label="بازی"
        >
          <option value="" disabled>
            انتخاب بازی
          </option>
          <option value="FIFA 23">FIFA 23</option>
          <option value="eFootball 21">eFootball 21</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-200 mb-2">
          تاریخ و زمان (شمسی)
        </label>
        <DatePicker
          className="purple"
          value={fightTime}
          onChange={setFightTime}
          format="YYYY/MM/DD HH:mm"
          calendar={persian}
          locale={persian_fa}
          calendarPosition="bottom-right"
          plugins={[<TimePicker />]}
          hideOnScroll
          placeholder="جهت وارد کردن تاریخ و زمان رقابت کلیک کنید."
          inputClass="w-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-orange-600 dark:border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-yellow-400 shadow-yellow-glow transition duration-300"

        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="message"
          className="block text-gray-700 dark:text-gray-200 mb-2"
        >
          پیام دعوت
        </label>
        <textarea
          id="message"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-orange-600 dark:border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-yellow-400 shadow-yellow-glow transition duration-300"
          rows="3"
          placeholder="مثال: آماده‌ای ببازی؟"
          aria-label="پیام دعوت"
        />
      </div>
      {status && (
        <div className="text-center mb-4">
          <p
            className={
              status.type === "error" ? "text-red-500" : "text-green-500"
            }
          >
            {status.message}
          </p>
        </div>
      )}
      <button
        type="submit"
        className="w-full bg-orange-600 dark:bg-yellow-400 text-white dark:text-gray-900 font-vazir px-6 py-3 rounded-lg shadow-yellow-glow hover:shadow-bronze-glow hover:bg-orange-700 dark:hover:bg-yellow-500 transition duration-300 flex items-center justify-center gap-2"
        disabled={status?.type === "loading"}
      >
        <FaPaperPlane />
        ارسال دعوت
      </button>
    </form>
  );
}
