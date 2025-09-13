// src/App.jsx
import React from "react";
import { ConnectProvider } from "./context/ConnectContext";
import CCPComponent from "./component/CCPComponent";
import { useConnect } from "./context/ConnectContext";

// Example component that uses the global connect context
const AgentStatus = () => {
  const { agent, contacts } = useConnect();
  console.log("Agent state:", agent?.getState()?.name);
  if (!agent) {
    console.log("agents gettt......",agent)
    return <div>No agent connected</div>;
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold">Agent Status</h3>
      <p>Agent State: {agent.getState().name}</p>
      <p>Active Contacts: {contacts.length}</p>
      {contacts.map((contact, index) => (
        <div key={contact.getContactId()} className="mt-2">
          <p>Contact {index + 1}: {contact.getState().name}</p>
        </div>
      ))}
    </div>
  );
};


const App = () => {
  return (
    <>
      <div className="">
        
        <div className="flex gap-6">
          {/* CCP Component */}
          <div className="flex-shrink-0">
            <CCPComponent />
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1 space-y-6">
            <AgentStatus />
          </div>
        </div>
      </div>
    </>
  );
};

export default App;