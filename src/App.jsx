// src/App.jsx
import React, { useState, useEffect } from "react";
import { ConnectProvider } from "./context/ConnectContext";
import CCPComponent from "./component/CCPComponent";
import { useConnect } from "./context/ConnectContext";
import { Route, Routes } from "react-router";
import Install from "./component/Install";
import OauthCallback from "./component/OauthCallback";

// Example component that uses the global connect context
const AgentStatus = () => {
  const { agent, contacts } = useConnect();
  console.log("Agent state:", agent?.getState()?.name);
  if (!agent) {
    console.log("agents gettt......", agent);
    return <div>No agent connected</div>;
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold">Agent Status</h3>
      <p>Agent State: {agent.getState().name}</p>
      <p>Active Contacts: {contacts.length}</p>
    </div>
  );
};

const API_BASE = "https://dxkzxrl20d.execute-api.us-east-1.amazonaws.com/dev/getDataDynamodb";

const App = () => {
 const {hasToken, setHasToken} = useConnect();

  useEffect(() => {
    fetch(API_BASE)
      .then((res) => res.json())
      .then((data) => {
        setHasToken(data.hasToken);
        console.log("data",data)
      })
      .catch((error) => console.log(error));
  }, []);
   if (hasToken === null) {
    return <p>Loading...</p>; // 👈 no flicker, just loader
  }
  return (
    <>
      <Routes>
        <Route path="/app/oauth-callback" element={<OauthCallback />} />
        {hasToken ? (
          <Route path="/*" element={<CCPComponent />} />
        ) : (
          <Route path="/*" element={<Install />} />
        )}
      </Routes>

    </>
  );
};

export default App;
