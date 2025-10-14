// import React, { useState } from "react";
// import Switch from "./Switch";
// import AttributeFrom from "./AttributeFrom.jsx";
// import DynamicForm from "./DynamicForm.jsx";

// const Setting = () => {
//   const noMatchFields = [
//     { name: "firstname", label: "Firstname", type: "text", required: true },
//     { name: "lastname", label: "Lastname", type: "text", required: true },
//   ];
//   const disposition = [
//     { name: "inboundname", label: "Inbound Disposition", type: "text", required: true },
//     { name: "outboundname", label: "Outbound Disposition", type: "text", required: true },
//   ];
//   const handleFormSubmit = () => { }

//   // const handleToggle = (value) => {
//   //   console.log("Switch state:", value);
//   // };
//   return (
//     <main className="pt-6 min-h-screen px-6 md:px-14 lg:px-32 bg-gray-50">
//       <h1 className="text-3xl font-bold mb-6 text-indigo-700">Settings</h1>
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <Switch label="Outbound Activity Creation" settingName="Outbound_Activity" />
//         <Switch label="Queue Selection" settingName="Queue_Selection" />
//         <Switch label="Wrap-Up Notes" settingName="Wrap_Up_Notes" />
//       </div>
//       <section>
//         <h1 className="text-3xl mt-6 font-bold text-indigo-700">
//           No Match Configuration
//         </h1>
//         <DynamicForm
//           fields={noMatchFields}
//           onSubmit={handleFormSubmit}
//           buttonText="Submit"
//         />
//       </section>
//       <section>
//         <h1 className="text-3xl mt-6 font-bold text-indigo-700">
//           Engagement Configuration
//         </h1>
//         <AttributeFrom />
//       </section>
//       <section>
//         <h1 className="text-3xl mt-6 font-bold text-indigo-700">
//           Disposition Configuration
//         </h1>
//         <DynamicForm
//           fields={disposition}
//           onSubmit={handleFormSubmit}
//           buttonText="Submit"
//           dynamicField={true}

//         />
//       </section>
//     </main>
//   );
// };

// export default Setting;

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
  const handleFormSubmit = () => { };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col px-6 md:px-14 lg:px-32 py-8">
      <h1 className="text-2xl font-bold mb-4 text-indigo-700 text-center md:text-left">Settings</h1>

      {/* Switch Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <Switch label="Outbound Activity" settingName="Outbound_Activity" />
        <Switch label="Queue Selection" settingName="Queue_Selection" />
        <Switch label="Wrap-Up Notes" settingName="Wrap_Up_Notes" />
      </div>

      {/* No Match Configuration */}
      <section className="w-full">
        <h1 className="text-xl md:text-xl font-bold text-indigo-700 mb-4">
          No Match Configuration
        </h1>
        <DynamicForm fields={noMatchFields} onSubmit={handleFormSubmit} buttonText="Submit" />
      </section>

      {/* Engagement Configuration */}
      <section className="w-full mb-2">
        <h1 className="text-xl md:text-xl font-bold text-indigo-700 mt-4">
          Engagement Configuration
        </h1>
        <AttributeFrom />
      </section>

      {/* Disposition Configuration */}
      <section className="w-full mb-20">
        <h1 className="text-xl md:text-xl font-bold text-indigo-700 mb-2">
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

