import React, { createContext, useContext, useState, useReducer } from "react";

const ConnectContext = createContext();
export const ConnectProvider = ({ children }) => {
  const [agent, setAgent] = useState(null);
  const [hasToken, setHasToken] = useState(null);
  const [contacts, setContacts] = useState(new Map());
  const [newOutboundContact, setNewOutboundContact] = useState(false);
  const [isMissCall, setIsMissCall] = useState(false);

  // Helper: set or update a contact
  const updateContact = (contactId, data) => {
    setContacts((prev) => {
      const newContacts = new Map(prev);
      newContacts.set(contactId, {
        ...(newContacts.get(contactId) || {}),
        ...data,
      });
      console.log("updateContact", newContacts)
      return newContacts;
    });
  };

  // Helper: remove a contact
  const removeContact = (contactId) => {
    setContacts((prev) => {
      const newContacts = new Map(prev);
      newContacts.delete(contactId);
      return newContacts;
    });
  };

  return (
    <ConnectContext.Provider
      value={{
        agent,
        setAgent,
        contacts,
        setContacts,
        hasToken,
        setHasToken,
        updateContact,
        removeContact,
        newOutboundContact,
        setNewOutboundContact,
        isMissCall,
        setIsMissCall
      }}
    >
      {children}
    </ConnectContext.Provider>
  );
};

export const useConnect = () => {
  const context = useContext(ConnectContext);
  if (!context) {
    throw new Error("useConnect must be used within a ConnectProvider");
  }
  return context;
};
