import React, { useEffect, useState } from "react";
import { useConnect } from "../context/ConnectContext";
import { processOnConnecting } from "../services/ProcessOnConnecting";
import useConfig from "./useConfig";

const useOnConnecting = () => {
  const { updateContact } = useConnect();
  const envConfig = useConfig()


  return (contact) => {

    let currentAgent = null;
    connect.agent((a) => {
      currentAgent = a;
    });
    const agentId = currentAgent.getConfiguration().agentARN.split("/")[3];
    console.log("agentId at onConnecting:", agentId);

    const result = processOnConnecting(contact, agentId,envConfig);
    console.log("connecting.....", result);

    // now safe to update context
    updateContact(result.contactId, {
      callState: result.callState,
      callStartTime: result.callStartTime,
      contactId: result.contactId,
    });
  };
};

export default useOnConnecting;
