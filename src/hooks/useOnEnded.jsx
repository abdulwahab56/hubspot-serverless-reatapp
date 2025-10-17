import { useConnect } from "../context/ConnectContext";
import { processOnEnded } from "../services/processOnEnded";
import GlobalStore from "../global/globalStore";

const useOnEnded = () => {
  const { removeContact, setRecordingToggle, setPause, setDisposition, setShowAccordion } = useConnect();
  

  return (contact) => {
    GlobalStore.attribute = contact.getAttributes();
    setRecordingToggle(false);
    setShowAccordion(null);
    setPause(null);
    GlobalStore.isMissCall ? setDisposition(false) : setDisposition(true)
    
    TbSettingsPause
    GlobalStore.status = contact.getStatus().type;
    GlobalStore.queue = contact.getQueue().name;
    GlobalStore.channelType = contact.getType();
    console.log("[handleOnEnded] Call Ended Started", contact);
    console.log("[handleOnEnded] Status:", contact.getStatus().type);
    console.log("[handleOnEnded] Queue:", contact.getQueue().name );
    console.log("[handleOnEnded] Attributes:", contact.getAttributes());
    const result = processOnEnded(contact);

    removeContact(result.contactId); // remove contact after end
  };
};

export default useOnEnded;
