import React from 'react'
import { useConnect } from '../context/ConnectContext';
import { processOnConnected } from '../services/processOnConnected';

const useOnConnected = () => {
    const { updateContacts } = useConnect();

  return (contact) => {
    const result = processOnConnected(contact);

    updateContacts(result.contactId, {
      callState: result.callState,
      connectedTime: result.connectedTime,
      contactId: result.contactId,
    });
  };
}

export default useOnConnected
