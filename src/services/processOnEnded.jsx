export function processOnEnded(contact) {
  console.log("onended", contact.contactData)
  return {
    contactId: contact.getContactId(),
    callState: "ENDED",
    endTime: new Date().toISOString(),
  };
}
