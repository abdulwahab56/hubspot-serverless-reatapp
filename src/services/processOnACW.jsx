export function processOnACW(contact) {
  return {
    contactId: contact.getContactId(),
    callState: "ACW", // After Call Work
    acwStartTime: new Date().toISOString(),
  };
}
