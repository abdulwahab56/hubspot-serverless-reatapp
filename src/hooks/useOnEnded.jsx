import { useConnect } from "../context/ConnectContext";
import { processOnEnded } from "../services/processOnEnded";

const useOnEnded = () => {
  const { removeContact } = useConnect();

  return (contact) => {
    const result = processOnEnded(contact);

    removeContact(result.contactId); // remove contact after end
  };
};

export default useOnEnded;
