import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import GlobalStore from "../global/globalStore";

// Ensure Amazon Connect Streams is globally available
// <script src="https://connect-cdn.atlassian.io/connect-streams.js"></script> should be loaded in index.html

const DipositionWrapUpNotes = ({ agentsLists = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isCalling, setIsCalling] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
    console.log("arn", selectedOption)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phoneNumber) {
      setStatusMessage("❗ Please enter a phone number.");
      return;
    }

    try {
      setIsCalling(true);
      setStatusMessage("📞 Initiating call...");

      // Ensure Amazon Connect is initialized
      if (typeof connect === "undefined" || !connect.core) {
        setStatusMessage("⚠️ Amazon Connect not initialized.");
        setIsCalling(false);
        return;
      }

      // Get the current agent
      const agent = GlobalStore.loggedInAgent;

      if (!agent) {
        setStatusMessage("⚠️ Agent not available in Connect session.");
        setIsCalling(false);
        return;
      }
    const endpoint = connect.Endpoint.byPhoneNumber(phoneNumber);
    const queueARN = selectedOption; // Selected queue from dropdown

    agent.connect(endpoint, {
    queueARN: queueARN,
    success: function (data) {
      console.log('MakeCall success ', data);
      let payLoad = { type: 'OUTBOUND_STARTED', phone: number };
      window.postMessage(payLoad, '*');
    },
    failure: function (error) {
      alert(JSON.parse(error).message);
      let payLoad = { type: 'OUTBOUND_FAILED', phone: number };
      window.postMessage(payLoad, '*');
      console.error('MakeCall failed ', error);
    },
  });

      // Optionally: Log disposition/notes
      console.log({
        disposition: selectedOption,
        phone: phoneNumber,
      });
      setPhoneNumber("");
      setSelectedOption("");
      setStatusMessage("");
      setIsOpen(false)
    } catch (error) {
      console.error("Error initiating call:", error);
      setStatusMessage("❌ Error initiating call.");
    } finally {
      setIsCalling(false);
    }
  };

  return (
    <div className="relative w-[350px]">
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex text-[13.5px] justify-between items-center px-4 py-2 text-white font-light bg-[#1e1e1e] z-20 relative"
      >
        <span>Wrap-Up Notes</span>
        <IoIosArrowDown
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* Accordion Content */}
      <div
        className={`absolute left-0 right-0 bg-black shadow-lg transition-all duration-500 ease-in-out z-30 ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <form className="p-3 space-y-4" onSubmit={handleSubmit}>
          {/* 🎯 Disposition Dropdown */}
          <div>
            <label className="block text-[13.5px] text-sm font-medium text-gray-300 mb-2">
              Select a Disposition
            </label>
            <select
              value={selectedOption}
              onChange={handleSelectChange}
              className="w-full px-3 py-2 text-[13.5px] bg-[#1e1e1e] text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select an option</option>
              {Array.isArray(agentsLists) &&
                agentsLists.map((item, index) => (
                  <option key={index} value={item.queueARN}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>

          {/* 📞 Dial Phone Number Input */}
          <div>
            <label className="block text-[13.5px] font-medium text-gray-300 mb-2">
              Dial Phone Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number"
              className="w-full px-3 py-2 text-[13.5px] bg-[#1e1e1e] text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* 💾 Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isCalling}
              className={`px-3 py-2 text-[13.5px] rounded-md text-white font-semibold ${
                isCalling
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isCalling ? "Calling..." : "Call"}
            </button>
          </div>

          {/* 🟡 Status Message */}
          {statusMessage && (
            <p className="text-[13px] text-gray-300 mt-2">{statusMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default DipositionWrapUpNotes;
