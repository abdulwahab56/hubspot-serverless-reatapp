import { useConnect } from "../context/ConnectContext";
import { pauseRecording, processOnConnecting, resumeRecording, updateAttributeContact } from "../services/ProcessOnConnecting";
import useConfig from "./useConfig";
import { useEffect } from "react";
import GlobalStore from "../global/globalStore";
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
  } = useConnect();
  const envConfig = useConfig();
  
   

   useEffect(() => {
    if (!updateAttribute) return; 
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
    GlobalStore.agentId = currentAgent.getConfiguration().agentARN.split("/")[3];

    console.log("agentId at onConnecting:", GlobalStore.agentId);

    const result = processOnConnecting(
      contact,
      GlobalStore.agentId,
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
