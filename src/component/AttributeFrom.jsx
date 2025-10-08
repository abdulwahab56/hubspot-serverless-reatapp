import React, { useState } from "react";

const AttributeForm = () => {
  const [formData, setFormData] = useState({ attribute: "" });
  const [attributes, setAttributes] = useState([]);
  const [selectedAttribute, setSelectedAttribute] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("attribute:", name);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.attribute.trim()) {
      setAttributes((prev) => [...prev, formData.attribute]);
      console.log("Form submitted:", formData);
      setFormData({ attribute: "" });
    }
  };

  const handleDropdownChange = (e) => {
    setSelectedAttribute(e.target.value);
  };

  return (
    <div className="flex items-start justify-between mt-4 gap-6 py-4">
      <div className="w-1/2">
        <div className="rounded-2xl gap-4">
           <label
              htmlFor="attribute"
              className="block text-gray-700 text-start font-medium mb-2"
            >
              Attribute
            </label>
          <div className="w-full flex items-center justify-between gap-2">
            <input
              type="text"
              id="attribute"
              name="attribute"
              value={formData.attribute}
              onChange={handleChange}
              placeholder="Enter your attribute"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-400 outline-none transition duration-300 ease-in-out"
            />
            <button
            onClick={handleSubmit}
            className="w-[250px] bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-md transition duration-300 ease-in-out"
          >
            Submit
          </button>
          </div>

          
        </div>
      </div>

      <div className="w-1/2">
        <label
          htmlFor="attributeDropdown"
          className="block text-gray-700 font-medium mb-2"
        >
          Select Attribute
        </label>
        <select
          id="attributeDropdown"
          value={selectedAttribute}
          onChange={handleDropdownChange}
          className="w-full px-6 py-3 rounded-xl border border-gray-300 bg-gray-100 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-400 outline-none transition duration-300 ease-in-out"
        >
          <option value="">Show attribute</option>
          {attributes.map((attr, index) => (
            <option key={index} value={attr}>
              {attr}
            </option>
          ))}
        </select>

        {selectedAttribute && (
          <div className="mt-4 p-4 bg-indigo-50 rounded-xl">
            <p className="text-gray-700">
              <span className="font-semibold">Selected:</span> {selectedAttribute}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttributeForm;
