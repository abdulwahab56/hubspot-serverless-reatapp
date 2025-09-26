import React from "react";
import { useConnect } from "../context/ConnectContext";
import { processOnMissed } from "../services/processOnMissed";

const useOnMissed = () => {
  const { updateContacts, isMissCall, setIsMissCall, newOutboundContact} = useConnect();

  return (contact) => {
    const result = processOnMissed(contact, isMissCall, setIsMissCall, newOutboundContact);

    updateContacts(result.contactId, {
      callState: result.callState,
      missedTime: result.missedTime,
      contactId: result.contactId,
    });
  };
};

export default useOnMissed;
