"use client";
import { useState } from "react";

export default function SelectDropdown({ title, options, onSelectChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(title);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (value) => {
    setSelectedValue(value);
    setIsOpen(false);
    onSelectChange?.(value);
  };

  return (
    <div className="relative w-full max-w-xs mx-auto">
      <button
        onClick={toggleDropdown}
        className="w-full bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border border-orange-600 dark:border-gold rounded-lg px-4 py-2 flex justify-between items-center shadow-yellow-glow hover:shadow-bronze-glow transition duration-300"
      >
        <span>{selectedValue}</span>
        <svg
          className={`w-5 h-5 transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-orange-600 dark:border-gold rounded-lg shadow-lg animate-fadeIn">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
              className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-orange-100 dark:hover:bg-yellow-600/20 cursor-pointer transition duration-200"
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
