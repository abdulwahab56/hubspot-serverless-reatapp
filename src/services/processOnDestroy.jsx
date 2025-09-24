export function processOnDestroy(contact) {
  return {
    contactId: contact.getContactId(),
    callState: "DESTROYED",
    destroyedTime: new Date().toISOString(),
  };
}
