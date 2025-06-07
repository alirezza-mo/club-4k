
'use client';

import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

export default function RankFilterSelect({title , optionsFilter}) {
  const [selectedValue, setSelectedValue] = useState('highest-score'); // مقدار پیش‌فرض

  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedValue(value);
    console.log(`فیلتر انتخاب شد: ${value}`); // برای تست (بعداً به API وصل کن)
  };

  return (
    <div className="relative w-full max-w-xs mx-auto font-vazir">
      <select
        value={selectedValue}
        onChange={handleChange}
        className="w-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-orange-600 dark:border-yellow-400 rounded-lg px-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-yellow-400 shadow-yellow-glow hover:shadow-bronze-glow transition duration-300 cursor-pointer"
      >
        <option value="" disabled>
          {title}
        </option>
        {/* <option value="highest-score">بیشترین امتیاز</option>
        <option value="lowest-score">کمترین امتیاز</option> */}
        {
          optionsFilter.map( option => (
            <option key={option.id} value={option.label }> {option.label} </option>
          ) )
        }
      </select>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <FaChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      </div>
    </div>
  );
}
