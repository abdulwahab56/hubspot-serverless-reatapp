import React, { useState, useRef, useEffect } from "react";

const DynamicForm = ({ fields, onSubmit, buttonText = "submit", dynamicField }) => {
  const dropdownRef = useRef(null);
  const dropdownsRef = useRef(null);
  const initialState = fields.reduce((acc, field) => {
    acc[field.name] = "";
    return acc;
  }, {})
  const [formData, setFormData] = useState(initialState);
  const [submitMessage, setSubmitMessage] = useState("");
  const [inboundDisposition, setInboundDisposition] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [outboundDisposition, setOutboundDisposition] = useState([]);
  const [dropdownOpens, setDropdownOpens] = useState(false);


  const handleChange = (e) => {

    const { name, value } = e.target;
    console.log("Field:", name, "Value:", value);
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSubmitMessage("");
  };
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (
  //       dropdownRef.current &&
  //       !dropdownRef.current.contains(event.target)
  //     ) {
  //       setDropdownOpen(false);
  //     }
  //     if (
  //       dropdownsRef.current &&
  //       !dropdownsRef.current.contains(event.target)
  //     ) {
  //       setDropdownOpens(false);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    try {
      const response = await fetch("https://dxkzxrl20d.execute-api.us-east-1.amazonaws.com/dev/noMatchConfiguration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update setting");
      const data = await response.json();
      console.log("Setting updated:", data);
      setSubmitMessage(`${data.message}`)
      setTimeout(() => setSubmitMessage(""), 3000);
    } catch (err) {
      console.error("Error toggling setting:", err);
      setTimeout(() => setSubmitMessage(""), 3000);
    }

    if (onSubmit) {
      onSubmit(formData);
    }
    setFormData(initialState);
  };

  return (
    <>
      <div className='rounded-2xl py-4 w-full flex items-center justify-between gap-2'>
        {
          fields.map((field) => (
            <div key={field.name} className='w-full'>
              <label htmlFor={field.name} className='block text-gray-700 font-medium mb-2'>
                {field.label}
              </label>
              <input
                type={field.type || "text"}
                id={field.name}
                name={field.name}
                autoComplete="off"
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder || `Enter your ${field.label.toLowerCase()}`}
                required={field.required || false}
                className="w-full px-4 py-3 rounded-xl border  border-gray-300 bg-gray-100 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-400 outline-none transition duration-300 ease-in-out"
              />
            </div>

          ))
        }

        <button
          onClick={handleSubmit}
          className="w-[235px] mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-md transition duration-300 ease-in-out"
        >
          {buttonText}
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
      {dynamicField && (
       <div className="flex flex-col md:flex-row items-start justify-between gap-2 py-4 w-[89%]">
      {/* Inbound Dropdown */}
      <div className="w-full md:w-1/2 relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="w-full flex justify-between items-center px-6 py-3 rounded-xl border border-gray-300 bg-gray-100 text-gray-600 hover:bg-white focus:ring-2 focus:ring-indigo-400 transition"
        >
          Inbound Disposition List
          <span className="ml-2 text-gray-500">▼</span>
        </button>

        {dropdownOpen && (
          <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
            {inboundDisposition.length === 0 ? (
              <p className="text-gray-500 text-center py-3">
                No Inbound Disposition available
              </p>
            ) : (
              inboundDisposition.map((attr, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center px-4 py-2 hover:bg-indigo-50 cursor-pointer"
                >
                  <span className="flex-1 text-gray-700">{attr}</span>
                  <button
                    onClick={() => handleRemoveInbound(attr)}
                    className="ml-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Outbound Dropdown */}
      <div className="w-full md:w-1/2 relative" ref={dropdownsRef}>
        <button
          type="button"
          onClick={() => setDropdownOpens((prev) => !prev)}
          className="w-full flex justify-between items-center px-6 py-3 rounded-xl border border-gray-300 bg-gray-100 text-gray-600 hover:bg-white focus:ring-2 focus:ring-indigo-400 transition"
        >
          Outbound Disposition List
          <span className="ml-2 text-gray-500">▼</span>
        </button>

        {dropdownOpens && (
          <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
            {outboundDisposition.length === 0 ? (
              <p className="text-gray-500 text-center py-3">
                No Outbound Disposition available
              </p>
            ) : (
              outboundDisposition.map((attr, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center px-4 py-2 hover:bg-indigo-50 cursor-pointer"
                >
                  <span className="flex-1 text-gray-700">{attr}</span>
                  <button
                    onClick={() => handleRemoveOutbound(attr)}
                    className="ml-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
      )}

    </>
  )
}

export default DynamicForm
