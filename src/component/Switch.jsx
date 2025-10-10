import React, { useEffect, useState } from "react";

const Switch = ({ label = "", settingName }) => {
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_BASE =
    "https://dxkzxrl20d.execute-api.us-east-1.amazonaws.com/dev/toggleSetting";

  // ✅ Fetch current state from DynamoDB
  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const response = await fetch(`${API_BASE}?settingName=${settingName}`);
        if (!response.ok) throw new Error("Failed to fetch setting");
        const data = await response.json();
        console.log("Fetched state:", data);
        setChecked(data.value);
      } catch (err) {
        console.error("Error fetching setting:", err);
      } 
      // finally {
      //   setLoading(false);
      // }
    };

    fetchSetting();
  }, [settingName]);

  // ✅ Handle toggle change
  const handleChange = async () => {
    const newValue = !checked;
    setChecked(newValue);
    try {
      const response = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settingName, enabled: newValue }),
      });

      if (!response.ok) throw new Error("Failed to update setting");
      const data = await response.json();
      console.log("Setting updated:", data);
    } catch (err) {
      console.error("Error toggling setting:", err);
    }
  };

  // if (loading) return <p>Loading {label}...</p>;

  return (
    <div className="flex items-center justify-between space-x-4 bg-white shadow-lg py-4 px-6 rounded-2xl gap-4 sm:gap-8 md:gap-12 lg:gap-34">
      {label && <span className="text-gray-800 font-medium">{label}</span>}

      <label className="relative inline-block w-12 h-[20px] cursor-pointer select-none">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          className="peer hidden"
        />

        <div className="absolute inset-0 rounded-full border-4 border-gray-300 bg-gradient-to-b from-gray-300 to-gray-400 shadow-inner peer-checked:from-green-300 peer-checked:to-green-500 transition-all duration-300" />

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
