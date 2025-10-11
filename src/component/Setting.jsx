import React, { useState } from "react";
import Switch from "./Switch";
import AttributeFrom from "./AttributeFrom.jsx";
import DynamicForm from "./DynamicForm.jsx";

const Setting = () => {
  const noMatchFields = [
    { name: "firstname", label: "Firstname", type: "text", required: true },
    { name: "lastname", label: "Lastname", type: "text", required: true },
  ];
  const disposition = [
    { name: "inboundname", label: "Inbound Disposition", type: "text", required: true },
    { name: "outboundname", label: "Outbound Disposition", type: "text", required: true },
  ];
  const handleFormSubmit = () => { }

  // const handleToggle = (value) => {
  //   console.log("Switch state:", value);
  // };
  return (
    <main className="pt-6 px-6 md:px-16 lg:px-32 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">Settings</h1>
      <div className="flex items-center justify-between">
        <Switch label="Outbound Activity Creation" settingName="Outbound_Activity" />
        <Switch label="Queue Selection" settingName="Queue_Selection" />
        <Switch label="Wrap-Up Notes" settingName="Wrap_Up_Notes" />
      </div>
      <section>
        <h1 className="text-3xl mt-6 font-bold text-indigo-700">
          No Match Configuration
        </h1>
        <DynamicForm
          fields={noMatchFields}
          onSubmit={handleFormSubmit}
          buttonText="Submit"
        />
      </section>
      <section>
        <h1 className="text-3xl mt-6 font-bold text-indigo-700">
          Engagement Configuration
        </h1>
        <AttributeFrom />
      </section>
      <section>
        <h1 className="text-3xl mt-6 font-bold text-indigo-700">
          Disposition Configuration
        </h1>
        <DynamicForm
          fields={disposition}
          onSubmit={handleFormSubmit}
          buttonText="Submit"
          dynamicField={true}

        />
      </section>
    </main>
  );
};

export default Setting;
