import { useConnect } from "../context/ConnectContext";
import { processOnACW } from "../services/processOnACW";

const useOnACW = () => {
  const { updateContacts } = useConnect();

  return (contact) => {
    const result = processOnACW(contact);

    updateContacts(result.contactId, {
      callState: result.callState,
      acwStartTime: result.acwStartTime,
      contactId: result.contactId,
    });
  };
};

export default useOnACW;
