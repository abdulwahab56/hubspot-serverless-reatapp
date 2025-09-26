import GlobalStore from "../global/globalStore";
import { updateEngagement } from "../services/engagementService"; // make sure this exists

export function processOnMissed(
  contact,
  isMissCall,
  setIsMissCall,
  newOutboundContact
) {
  console.log("[handleOnMissed] Call Missed Started");

  // Mark call as missed
  setIsMissCall(true);

  // Get current status
  let status = contact.getStatus().type;
  console.log("Call Status(handleOnMissed): " + status);

  // Normalize FAILED status
  if (status === "Error") {
    status = "FAILED";
  }
  console.log("Status Missed to FAILED & Call Status is Now: " + status);

  // Build update object
  const obj = {
    callId: GlobalStore.engagement_id,
    callStatus: status,
    contactId: contact.contactId,
    callStartTime: GlobalStore.callStartTime,
    isRecordingEnable: "false",
    channelType: contact.getType(), // ✅ get directly from contact
  };

  // Update engagement only if it exists and not outbound
  if (GlobalStore.engagement_id && !newOutboundContact) {
    updateEngagement(obj);
  } else {
    console.info("[handleOnMissed] No engagement_id available to update");
  }

  console.log("[handleOnMissed] Call Missed Completed", obj);

  // Return UI/context info
  return {
    contactId: contact.getContactId(),
    callState: "MISSED",
    missedTime: new Date().toISOString(),
  };
}
