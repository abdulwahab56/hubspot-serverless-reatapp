import { useConnect } from "../context/ConnectContext";
import { processOnEnded } from "../services/processOnEnded";
import GlobalStore from "../global/globalStore";

const useOnEnded = () => {
  const { removeContact } = useConnect();

  return (contact) => {
    GlobalStore.attribute = contact.getAttributes();
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
