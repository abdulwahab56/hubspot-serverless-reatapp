import React, { useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useConnect } from "../context/ConnectContext";
import GlobalStore from "../global/globalStore";

const DipositionWrapUpNotes = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedOption, setSelectedOption] = useState("");
  const [dispositionList, setDispositionList] = useState([]);
  const [wrapUpNotes, setWrapUpNotes] = useState("");

  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
    console.log("Selected option:", e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    console.log({
      selectedOption,
      wrapUpNotes
    });
    GlobalStore.disposition = selectedOption;
    GlobalStore.wrapupNote = wrapUpNotes;
    setWrapUpNotes(" ");
    setSelectedOption(" ");
    setIsOpen(false);
  };

  const getDataFromDB = async () => {
    let wrapUpNoteShow;
      try {
        const apiURL =
          "https://dxkzxrl20d.execute-api.us-east-1.amazonaws.com/dev/getdecrpytedData";
  
        const response = await fetch(apiURL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const resData = await response.json();
        if(GlobalStore.callType === "inbound"){
            wrapUpNoteShow = resData.config.INBOUND_DISPOSITIONS
            setDispositionList(wrapUpNoteShow)
        }

        if(GlobalStore.callType === "outbound"){
            wrapUpNoteShow = resData.config.OUTBOUND_DISPOSITIONS
            setDispositionList(wrapUpNoteShow)
        }
        console.log("responseData from disposition", resData)
      } catch (error) {
        console.log("error", error)
      }
    };
  
    useEffect(() => {
  
      getDataFromDB()
    }, []);

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
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <form className="p-1 space-y-4" onSubmit={handleSubmit}>
          {/* Disposition Dropdown */}
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
              {dispositionList.map((item,index)=> <option key={index} value={item}>{item}</option>)}
              {/* <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="France">France</option>
              <option value="Germany">Germany</option> */}
            </select>
          </div>

          {/* Notes Field */}
          <div className="text-[13.5px]">
            <label className="block text-[13.5px] font-medium text-gray-300 mb-2">
              Wrap-Up Notes
            </label>
            <textarea
              placeholder="Enter wrap-up notes here..."
              value={wrapUpNotes}
              onChange={(e) => setWrapUpNotes(e.target.value)}
              className="w-full px-3 py-2 tex-[13.5px] bg-[#1e1e1e] text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              rows={4}
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-3 py-2 text-[13.5px] bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
            >
              Save Notes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DipositionWrapUpNotes;
