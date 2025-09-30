import { useConnect } from "../context/ConnectContext";
import GlobalStore from "../global/globalStore";
import { processOnACW } from "../services/processOnACW";

const useOnACW = () => {
  const { updateContacts } = useConnect();
  // console.log('[handleOnACW] Call Ended-ACW Started', contact);

  return (contact) => {
    GlobalStore.recording_end_time = new Date();
    const result = processOnACW(contact);

    updateContacts(result.contactId, {
      callState: result.callState,
      acwStartTime: result.acwStartTime,
      contactId: result.contactId,
    });
  };
};

export default useOnACW;
