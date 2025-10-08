import React, { useState } from "react";

const Switch = ({ label = "", onToggle }) => {
  const [checked, setChecked] = useState(false);

  const handleChange = () => {
    const newValue = !checked;
    setChecked(newValue);
    if (onToggle) onToggle(newValue);
  };

  return (
    <div className="flex items-center justify-between space-x-4 bg-white shadow-lg py-4 px-6 rounded-2xl gap-4 sm:gap-8 md:gap-12 lg:gap-34">
      {label && <span className="text-gray-800 font-medium">{label}</span>}

      <label className="relative inline-block w-12 h-[20px] cursor-pointer select-none">
        {/* Hidden Checkbox */}
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          className="peer hidden"
        />

        {/* Background Track */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-300 bg-gradient-to-b from-gray-300 to-gray-400 shadow-inner peer-checked:from-green-300 peer-checked:to-green-500 transition-all duration-300" />

        {/* Glowing End Circles */}
        <span
          className={`absolute top-1/2 -translate-y-1/2 left-[-34%] h-3 w-3 rounded-full border ${
            checked
              ? "bg-gray-400 border-gray-700 shadow-[0_0_6px_rgba(0,0,0,0.4)]"
              : "bg-red-400 border-red-700 shadow-[0_0_8px_rgba(255,50,50,0.6)]"
          } transition-all duration-300`}
        ></span>

        <span
          className={`absolute top-1/2 -translate-y-1/2 right-[-33%] h-3 w-3 rounded-full border ${
            checked
              ? "bg-green-400 border-green-700 shadow-[0_0_8px_rgba(0,255,0,0.6)]"
              : "bg-gray-400 border-gray-700 shadow-[0_0_6px_rgba(0,0,0,0.4)]"
          } transition-all duration-300`}
        ></span>

        {/* Slider Handle */}
        <div
          className={`absolute top-[2px] left-1 w-[20px] h-[16px] rounded-full border border-gray-700 shadow-[0_0_2px_rgba(0,0,0,0.5)_inset] bg-gradient-to-b from-gray-500 to-gray-800 transition-all duration-300 ${
            checked ? "translate-x-[20px]" : ""
          }`}
        >
          <div className="absolute inset-1 flex">
            <div className="w-[16px] h-[8px] rounded-l-full bg-gradient-to-r from-gray-600/40 to-gray-800/40 shadow-inner" />
            <div className="flex-1" />
            <div className="w-[16px] h-[8px] rounded-r-full bg-gradient-to-l from-gray-600/40 to-gray-800/40 shadow-inner" />
          </div>
        </div>
      </label>
    </div>
  );
};

export default Switch;
