import { useConnect } from "../context/ConnectContext";
import { processOnDestroy } from "../services/processOnDestroy";

const useOnDestroy = () => {
  const { removeContact,newOutboundContact, setNewOutboundContact, setShowAccordion } = useConnect();

  return (contact) => {
      let agentName = null;
    connect.agent((agent) => {
      agentName = agent.getName();
    });
    console.log("agent naem on destroy :", agentName);
    console.log("destroy", contact.contactData);

    const result = processOnDestroy(contact, agentName, newOutboundContact, setNewOutboundContact, setShowAccordion);

    removeContact(result.contactId); // cleanup destroyed contact
  };
};

export default useOnDestroy;
