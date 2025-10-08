import React, { useState } from "react";

const LicenseUpdate = () => {
  const [formData, setFormData] = useState({ licenseKey: "" });
  const [expiryDate] = useState("Wed, Oct 08, 2025");
  const [numberOfAgents] = useState(5);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSubmitMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.licenseKey.trim()) {
      console.log("License submitted:", formData);
      setSubmitMessage("License key updated successfully!");
      setTimeout(() => {
        setSubmitMessage("");
      }, 3000);
    } else {
      setSubmitMessage("Please enter a valid license key.");
    }
    setFormData({ licenseKey: "" });
  };

  return (
    <div className="pt-6 px-6 md:px-16 lg:px-12 bg-gray-200 mt-2 ml-32 mr-32 rounded-2xl shadow-2xl pb-6">
      <h1 className="text-4xl font-bold text-indigo-700 mb-4">
        License Information
      </h1>

      <div className="text-gray-700 mb-6 flex items-start flex-col gap-2">
        <span>
          <strong>Expire Date:</strong> {expiryDate}
        </span>
        <span>
          <strong>No. of Agents:</strong> {numberOfAgents}
        </span>
      </div>

      <div className="flex items-start justify-between mt-4 gap-6 py-4">
        <div className="w-full">
          <div className="rounded-2xl">
            <label
              htmlFor="licenseKey"
              className="block text-gray-700 text-start font-medium mb-2"
            >
              License Key
            </label>
            
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2">
              <input
                type="text"
                id="licenseKey"
                name="licenseKey"
                value={formData.licenseKey}
                onChange={handleChange}
                placeholder="Enter your License Key"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-400 outline-none transition duration-300 ease-in-out"
              />
              
              <button
                onClick={handleSubmit}
                className=" sm:w-auto sm:min-w-[150px] bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition duration-300 ease-in-out"
              >
                Submit
              </button>
            </div>

            {submitMessage && (
              <div
                className={`mt-4 p-3 rounded-xl ${
                  submitMessage.includes("successfully")
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {submitMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LicenseUpdate;