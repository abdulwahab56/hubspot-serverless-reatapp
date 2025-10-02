import { useConnect } from "../context/ConnectContext";
import { processOnConnecting, updateAttributeContact } from "../services/ProcessOnConnecting";
import useConfig from "./useConfig";
import { useEffect } from "react";
const useOnConnecting = () => {
  const {
    updateContact,
    newOutboundContact,
    setNewOutboundContact, 
    isMissCall,
    setIsMissCall,
    setShowAccordion,
    updateAttribute, 
    setUpdateAttribute,
    setRecordingToggle
  } = useConnect();
  const envConfig = useConfig();
   setRecordingToggle(true)

   useEffect(() => {
    if (updateAttribute) {
      console.log("Contact selected from accordion:", updateAttribute);
      updateAttributeContact(updateAttribute);
    }
  }, [updateAttribute]);
  return (contact) => { 
    let currentAgent = null;
    connect.agent((a) => {
      currentAgent = a;
    });
    const agentId = currentAgent.getConfiguration().agentARN.split("/")[3];
    console.log("agentId at onConnecting:", agentId);

    const result = processOnConnecting(
      contact,
      agentId,
      envConfig,
      newOutboundContact,
      setNewOutboundContact,
      isMissCall,
      setIsMissCall,
      setShowAccordion,
      updateAttribute, 
      setUpdateAttribute
    );
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
