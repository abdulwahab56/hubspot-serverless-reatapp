import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useConnect } from "../context/ConnectContext";

const ShowAccordionComponent = ({showAccordion}) => {
  const [isOpen, setIsOpen] = useState(true);
  const {setUpdateAttribute} = useConnect();
  console.log("showAccordion", showAccordion)

  const onContactSelected = (contactId)=>{
    console.log("onConatctSelect", contactId)
    setUpdateAttribute(contactId)

  }

  return (
    <div className="relative w-full">
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-4 py-3 text-white font-semibold bg-[#1e1e1e] z-20 relative"
      >
        <span>Contacts</span>
        <IoIosArrowDown
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* Accordion Content (overlay on top of CCP iframe) */}
      <div
        className={`absolute left-0 right-0 bg-black shadow-lg transition-all duration-500 ease-in-out z-30 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <table className="w-full border-collapse">
          <thead className="bg-blue-300">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
                Name
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
                Phone
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
                Email
              </th>
            </tr>
          </thead>
          <tbody>
            {showAccordion && showAccordion.map((contact, index) => (
                <tr className="hover:bg-blue-300 cursor-pointer" key={contact.vid || index}>
                  <td className="px-4 py-2 border-b text-sm">
                    <button
                      className="contact-link"
                      onClick={() => onContactSelected(contact.vid)}
                    >
                      {contact.properties?.firstname?.value || "N/A"}
                    </button>
                  </td>
                  <td className="px-4 py-2 border-b text-sm">{contact.properties?.phone?.value || "N/A"}</td>
                  <td className="px-4 py-2 border-b text-sm">{contact.properties?.email?.value || "N/A"}</td>
                </tr>
              ))}
            {/* <tr className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b text-sm">Alice</td>
              <td className="px-4 py-2 border-b text-sm">+1234567890</td>
              <td className="px-4 py-2 border-b text-sm">alice@example.com</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b text-sm">Bob</td>
              <td className="px-4 py-2 border-b text-sm">N/A</td>
              <td className="px-4 py-2 border-b text-sm">bob@example.com</td>
            </tr> */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShowAccordionComponent;
