import React, { createContext, useContext, useState, useReducer } from "react";

const ConnectContext = createContext();
export const ConnectProvider = ({ children }) => {
  const [agent, setAgent] = useState(null);
  const [contacts, setContacts] = useState([]);


  return (
    <ConnectContext.Provider value={{ 
      agent, 
      setAgent, 
      contacts, 
      setContacts 
    }}>
      {children}
    </ConnectContext.Provider>
  );
};

export const useConnect = () => {
  const context = useContext(ConnectContext);
  if (!context) {
    throw new Error('useConnect must be used within a ConnectProvider');
  }
  return context;
};