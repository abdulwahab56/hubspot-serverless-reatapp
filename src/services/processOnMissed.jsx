export function processOnMissed(contact) {
  return {
    contactId: contact.getContactId(),
    callState: "MISSED",
    missedTime: new Date().toISOString(),
  };
}
