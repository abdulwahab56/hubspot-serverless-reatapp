let callState;

export function processOnMissed(contact) {
  callState = "CALL_END";
  isMissCall = true;
  console.log("[handleOnMissed] Call Missed Started");
  var status = contact.getStatus().type;
  console.log("Call Status(handleOnMissed): " + status);

  console.log("[handleOnMissed] Call Missed Completed");
  if ((status = "Error")) {
    status = "FAILED";
  }
  console.log("Status Missed to FAILED & Call Status is Now: " + status);
  let obj = {
    callId: engagement_id,
    callStatus: status,
    contactId: contact.contactId,
    callStartTime: call_start_time,
    isRecordingEnable: "false",
    channelType: channelType,
  };
  if (engagement_id && !newOutboundContact) {
    updateEngagement(obj);
    // missCallupdateEngagement(obj);
    console.info("[handleOnMissed] multimatch case there is not engagment-id");
  }
  console.log("[handleOnMissed] Call Missed Completed", obj);

  return {
    contactId: contact.getContactId(),
    callState: "MISSED",
    missedTime: new Date().toISOString(),
  };
}
