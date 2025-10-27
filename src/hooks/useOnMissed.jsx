import React from "react";
import { useConnect } from "../context/ConnectContext";
import { processOnMissed } from "../services/processOnMissed";

const useOnMissed = () => {
  const { updateContacts, isMissCall, setIsMissCall, newOutboundContact} = useConnect();

  return (contact) => {
    const result = processOnMissed(contact, isMissCall, setIsMissCall, newOutboundContact);
    console.log("call on missed call state")
    

    updateContacts(result.contactId, {
      missedTime: result.missedTime,
      contactId: result.contactId,
    });
  };
};

export default useOnMissed;
