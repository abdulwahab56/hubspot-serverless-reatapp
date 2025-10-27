export function processOnEnded(contact) {
  console.log("onended", contact.contactData)
  return {
    contactId: contact.getContactId(),
    endTime: new Date().toISOString(),
  };
}
