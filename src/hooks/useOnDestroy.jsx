import { useConnect } from "../context/ConnectContext";
import { processOnDestroy } from "../services/processOnDestroy";

const useOnDestroy = () => {
  const { removeContact } = useConnect();

  return (contact) => {
    const result = processOnDestroy(contact);

    removeContact(result.contactId); // cleanup destroyed contact
  };
};

export default useOnDestroy;
