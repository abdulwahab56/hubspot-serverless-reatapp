export function processOnConnected(contact) {
  return {
    contactId: contact.getContactId(),
    connectedTime: new Date().toISOString(),
  };
}
