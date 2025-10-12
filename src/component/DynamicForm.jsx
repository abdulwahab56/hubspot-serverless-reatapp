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
  const [inboundDisposition, setInboundDisposition] = useState();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [outboundDisposition, setOutboundDisposition] = useState();
  const [dropdownOpens, setDropdownOpens] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false); 

  const getDispositionFromDB = async () => {
    setIsLoading(true);
    setLoading(true)
    try {
      const apiURL =
        "https://dxkzxrl20d.execute-api.us-east-1.amazonaws.com/dev/getdecrpytedData";

      const response = await fetch(apiURL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const resData = await response.json();
      const inbound = resData.config.INBOUND_DISPOSITIONS;
      const outbound = resData.config.OUTBOUND_DISPOSITIONS;
      setIsLoading(false)
      setLoading(false)
      setInboundDisposition(inbound)
      setOutboundDisposition(outbound)
      console.log("responseData", resData)
    } catch (error) {
      console.log("error", error)
    }
  };

  useEffect(() => {

    getDispositionFromDB()
  }, []);



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
      await getDispositionFromDB();
    } catch (err) {
      console.error("Error toggling setting:", err);
      setTimeout(() => setSubmitMessage(""), 3000);
    }

    if (onSubmit) {
      onSubmit(formData);
    }
    setFormData(initialState);
  };


  const handleRemoveOutbound = async (attrToRemove) => {
    let apiURL = "https://dxkzxrl20d.execute-api.us-east-1.amazonaws.com/dev/settingRemoveItem"
    setLoading(true)
    try {
      const response = await fetch(apiURL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(attrToRemove)
      })
      if (!response.ok) throw new Error("Failed to remove setting");
      const resData = response.json();
      console.log("remove setting from the DB", resData)
      await getDispositionFromDB();
      setLoading(false)
      setSubmitMessage(`${data.message}`)
      setTimeout(() => setSubmitMessage(""), 3000);

    } catch (error) {
      console.log("Fail to remove attribute", error)
      setTimeout(() => setSubmitMessage(""), 3000);

    }
  };
  const handleRemoveInbound = async (attrToRemove) => {
    let apiURL = "https://dxkzxrl20d.execute-api.us-east-1.amazonaws.com/dev/settingRemoveItem"
    try {
      const response = await fetch(apiURL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(attrToRemove)
      })
      if (!response.ok) throw new Error("Failed to remove setting");
      const resData = response.json();
      console.log("remove setting from the DB", resData)
      await getDispositionFromDB()
      setSubmitMessage(`${data.message}`)
      setTimeout(() => setSubmitMessage(""), 3000);

    } catch (error) {
      console.log("Fail to remove attribute", error)
      setTimeout(() => setSubmitMessage(""), 3000);

    }
  };

  return (
    <>
      <div className='rounded-2xl py-4 w-full h-full flex items-center justify-between gap-2 h-fit'>
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
        <div className="flex flex-col md:flex-row items-start justify-between gap-2 w-[89%]">
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
                      {isLoading ?
                        <div role="status">
                          <svg aria-hidden="true" class="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                          </svg>
                          <span className="sr-only">Loading...</span>
                        </div>
                        : <button
                          onClick={() => handleRemoveInbound(attr)}
                          className="ml-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg cursor-pointer text-xs"
                        >
                          ✕
                        </button>}
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
                      {loading ?
                        <div role="status">
                          <svg aria-hidden="true" class="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                          </svg>
                          <span className="sr-only">Loading...</span>
                        </div>
                        : <button
                          onClick={() => handleRemoveOutbound(attr)}
                          className="ml-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg cursor-pointer text-xs"
                        >
                          ✕
                        </button>}
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
