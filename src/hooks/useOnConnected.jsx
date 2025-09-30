import React from 'react'
import { useConnect } from '../context/ConnectContext';
import { processOnConnected } from '../services/processOnConnected';
import GlobalStore from '../global/globalStore';

const useOnConnected = () => {
    const { updateContacts } = useConnect();
    // console.log("call connected", contact)

  return (contact) => {
    GlobalStore.recording_start_time = new Date();
    const result = processOnConnected(contact);

    updateContacts(result.contactId, {
      callState: result.callState,
      connectedTime: result.connectedTime,
      contactId: result.contactId,
    });
  };
}

export default useOnConnected
