export function processOnConnected(contact) {
  return {
    contactId: contact.getContactId(),
    callState: "CONNECTED",
    connectedTime: new Date().toISOString(),
  };
}
