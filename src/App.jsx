// src/App.jsx
import React from "react";
import { useConnect } from "./context/ConnectContext";

const App = () => {
  const { agent, contacts } = useConnect();

  return (
    <div className="p-4">
      <h1>Amazon Connect Demo</h1>
    </div>
  );
};

export default App;
