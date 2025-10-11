import React, { useState, useRef, useEffect } from "react";

const CustomDropdown = () => {
  const [formData, setFormData] = useState({ attribute: "" });
  const [attributes, setAttributes] = useState();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const [submitMessage, setSubmitMessage] = useState("");

  const dropdownRef = useRef(null);
  const getAttributeFromDB = async () => {
    try {
      const apiURL =
        "https://dxkzxrl20d.execute-api.us-east-1.amazonaws.com/dev/getdecrpytedData";

      const response = await fetch(apiURL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const resData = await response.json();
      const attribute = resData.config.ATTRIBUTES
      setAttributes(attribute)
      console.log("responseData", resData)
    } catch (error) { }
  };

  useEffect(() => {

    getAttributeFromDB()
  }, [attributes]);

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.attribute.trim()) {
      try {
        const response = await fetch("https://dxkzxrl20d.execute-api.us-east-1.amazonaws.com/dev/settingAttributes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error("Failed to update setting");
        const data = await response.json();
        console.log("Setting updated:", data);
        setSubmitMessage(`${data.message}`)
        setFormData({ attribute: "" });
        setTimeout(() => setSubmitMessage(""), 3000);
      } catch (err) {
        console.error("Error toggling setting:", err);
        setFormData({ attribute: "" });
        setTimeout(() => setSubmitMessage(""), 3000);
      }


      // if (!attributes.includes(formData.attribute)) {
      //   setAttributes((prev) => [...prev, formData.attribute]);
      // }

    }
  };

  const handleRemoveAttribute = (attrToRemove) => {
    setAttributes((prev) => prev.filter((attr) => attr !== attrToRemove));
    if (selectedAttribute === attrToRemove) setSelectedAttribute(null);
  };

  const handleSelect = (attr) => {
    setSelectedAttribute(attr);
    setDropdownOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row items-start justify-between mt-4 gap-6 py-4">
      {/* Left side — input */}
      <div className="w-full md:w-1/2">
        <label className="block text-gray-700 text-start font-medium mb-2">
          Attribute
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            name="attribute"
            value={formData.attribute}
            onChange={(e) =>
              setFormData({ ...formData, attribute: e.target.value })
            }
            placeholder="Enter your attribute"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-400 outline-none transition"
          />
          <button
            onClick={handleSubmit}
            className="w-[102px] bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition"
          >
            Submit
          </button>
        </div>
        {submitMessage && (
          <div
            className={`mt-4 p-3 rounded-xl ${submitMessage.includes("successfully")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
              }`}
          >
            {submitMessage}
          </div>
        )}
      </div>


      {/* Right side — dropdown */}
      <div className="w-full md:w-1/2 relative" ref={dropdownRef}>
        <label className="block text-gray-700 font-medium mb-2">
          Select Attribute
        </label>
        <button
          type="button"
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="w-full flex justify-between items-center px-6 py-3 rounded-xl border border-gray-300 bg-gray-100 text-gray-900 hover:bg-white focus:ring-2 focus:ring-indigo-400 transition"
        >
          {selectedAttribute || "Select attribute"}
          <span className="ml-2 text-gray-500">▼</span>
        </button>

        {dropdownOpen && (
          <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
            {attributes.length === 0 ? (
              <p className="text-gray-500 text-center py-3">
                No attributes available
              </p>
            ) : (
              attributes.map((attr, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center px-4 py-2 hover:bg-indigo-50 cursor-pointer"
                >
                  <span
                    onClick={() => handleSelect(attr)}
                    className="flex-1 text-gray-700"
                  >
                    {attr}
                  </span>
                  <button
                    onClick={() => handleRemoveAttribute(attr)}
                    className="ml-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {selectedAttribute && (
          <div className="mt-4 p-4 bg-indigo-50 rounded-xl">
            <p className="text-gray-700">
              <span className="font-semibold">Selected:</span>{" "}
              {selectedAttribute}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomDropdown;
