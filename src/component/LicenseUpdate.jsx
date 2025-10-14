import React, { useEffect, useState } from "react";

const LicenseUpdate = () => {
  const [formData, setFormData] = useState({ licenseKey: "" });
  const [expDate, setExpDate] = useState("");
  const [numberOfAgents, setNumberOfAgents] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");


    const getDecryptedValue = async () => {
      try {
        const apiURL =
          "https://dxkzxrl20d.execute-api.us-east-1.amazonaws.com/dev/getdecrpytedData";

        const response = await fetch(apiURL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const resDataDecrpt = await response.json();

        const [name, number, id, condition, data] =
          resDataDecrpt.decrypted.split(":");
        setExpDate(data);
        setNumberOfAgents(number);
      } catch (error) {}
    };

  useEffect(() => {
  
    getDecryptedValue()
  }, [expDate,numberOfAgents]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSubmitMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { licenseKey } = formData;
    const apiURL =
      "https://dxkzxrl20d.execute-api.us-east-1.amazonaws.com/dev/licenseUpdate";

    if (!licenseKey.trim()) {
      setSubmitMessage("Please enter a valid license key.");
      setTimeout(() => setSubmitMessage(""), 3000);
      return;
    }

    console.log("License submitted:", licenseKey);

    try {
      const response = await fetch(apiURL, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseKey }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const res = await response.json();
      console.log("License Key updated successfully:", res);
      
      await getDecryptedValue();
      setSubmitMessage("License key updated successfully!");
      // ✅ Clear form and message after state is updated
      setTimeout(() => setSubmitMessage(""), 3000);
      setFormData({ licenseKey: "" });
      
    } catch (error) {
      console.error("Error updating license:", error);
      setSubmitMessage("Failed to update license key. Please try again.");
      setTimeout(() => setSubmitMessage(""), 3000);
    }
  };

  return (
    <div className="pt-6 px-6 md:px-16 lg:px-12 bg-gray-200 mt-28 ml-32 mr-32 rounded-xl shadow-2xl pb-6 flex flex-col">
      <h1 className="text-4xl font-bold text-indigo-700 mb-4">
        License Information
      </h1>

      <div className="text-gray-700 mb-6 flex items-start flex-col gap-2">
        <span>
          <strong>Expire Date:</strong> {expDate}
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
              className="block text-gray-700 text-start font-bold mb-2"
            >
              License Key
            </label>

            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2">
              <input
                type="text"
                id="licenseKey"
                name="licenseKey"
                value={formData.licenseKey}
                required
                onChange={handleChange}
                placeholder="Enter your License Key"
                className="w-full px-4 py-2 rounded text-[13.5px] border border-gray-300 bg-gray-100 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-400 outline-none transition duration-300 ease-in-out"
              />

              <button
                onClick={handleSubmit}
                className=" sm:w-auto text-[13.5px] sm:min-w-[130px] bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-3 rounded shadow-md transition duration-300 ease-in-out"
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
