import React from 'react'
import { useConnect } from '../context/ConnectContext';

const useOnMissed = () => {
 const { updateContacts } = useConnect();

  return (contact) => {
    const result = processOnMissed(contact);

    updateContacts(result.contactId, {
      callState: result.callState,
      missedTime: result.missedTime,
      contactId: result.contactId,
    });
  };
}

export default useOnMissed
