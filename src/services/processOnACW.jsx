export function processOnACW(contact) {
  return {
    contactId: contact.getContactId(),
    acwStartTime: new Date().toISOString(),
  };
}
