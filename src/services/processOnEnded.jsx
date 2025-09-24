export function processOnEnded(contact) {
  return {
    contactId: contact.getContactId(),
    callState: "ENDED",
    endTime: new Date().toISOString(),
  };
}
