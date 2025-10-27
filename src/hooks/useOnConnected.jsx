import React , {useEffect} from "react";
import { useConnect } from "../context/ConnectContext";
import { processOnConnected } from "../services/processOnConnected";
import GlobalStore from "../global/globalStore";
import { pauseRecording, resumeRecording } from "../services/ProcessOnConnecting";

const useOnConnected = () => {
  const { updateContacts, recordingToggle, setRecordingToggle, pause, setPause } =
    useConnect();
    let agentId
  // console.log("call connected", contact)
  useEffect(() => {
    if (!GlobalStore.agentId) return;
    console.log("connected recording Toggle", recordingToggle)
    if (pause) {

      resumeRecording(GlobalStore.agentId);
    } else {
      pauseRecording(GlobalStore.agentId);
    }
  }, [pause]);

  return (contact) => {
   let attr = contact.getAttributes();
   if(attr && attr.recording && attr.recording.value === 'true'){
     setPause(false)
    setRecordingToggle((prev) => !prev);
   }
   


    GlobalStore.recording_start_time = new Date();

    
    const result = processOnConnected(contact);

    updateContacts(result.contactId, {
      connectedTime: result.connectedTime,
      contactId: result.contactId,
    });
  };
};

export default useOnConnected;
