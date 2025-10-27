import GlobalStore from "../global/globalStore";
import { updateEngagement } from "./engagementService";

// export function processOnDestroy(
//   contact,
//   agentName,
//   newOutboundContact,
//   setNewOutboundContact
// ) {
//   console.log("[handleOnDestroy] Call Ended Started", contact);
//   console.log("Status:", contact.getStatus());
//   console.log("Queue:", contact.getQueue());
//   console.log("Attributes:", contact.getAttributes());

//   // ✅ Use Streams API getter
//   const status = contact.getStatus()?.type; // e.g. "ended"
//   console.log("Call Status(Ended):", status);

//   const channelType = contact.getType(); // "voice" | "chat"
//   const attributes = contact.getAttributes();
//   let callState = "CALL_END";

//   // Normalize status
//   let normalizedStatus = status;
//   if (status === "ended") {
//     normalizedStatus = "COMPLETED";
//   }
//   console.log(
//     "Status Changed from Ended-to-Completed & Call Status is Now:",
//     normalizedStatus
//   );

//   if (!newOutboundContact) {
//     const durationSec =
//       Math.abs(GlobalStore.recording_end_time - GlobalStore.recording_start_time) / 1000;
//     const callDuration = parseInt(durationSec, 10);

//     console.log("callDuration:", callDuration);

//     let recordingEnable = false;
//     if (
//       attributes?.recording &&
//       attributes.recording.value === "true"
//     ) {
//       recordingEnable = true;
//     }

//     const queue = contact.getQueue()?.name;

//     let obj = {
//       callId: GlobalStore.engagement_id,
//       callDuration,
//       channelType,
//       callStatus: normalizedStatus,
//       queueName: queue,
//       agentName,
//       callType: channelType === "voice" ? GlobalStore.callType?.toUpperCase() : "INBOUND",
//       contactId: contact.getContactId() || GlobalStore.engagement_body?.contactId,
//       callStartTime: GlobalStore.call_start_time,
//       isRecordingEnable: recordingEnable,
//       hubspotContactId: GlobalStore.engagement_id,
//       attributes: attributes || null,
//     };

//     if (!GlobalStore.isMissCall && GlobalStore.engagement_id) {
//       updateEngagement(obj);
//     }

//     // Reset global state
//     GlobalStore.engagement_id = null;
//     GlobalStore.multiMatch_engagementId = null;
//     GlobalStore.hubSpot_contact_id = null;
//     GlobalStore.engagement_body = {};
//     GlobalStore.contact_id = null;
//     GlobalStore.isMissCall = false;
//     GlobalStore.multiMatch = false;
//     setNewOutboundContact(false);
//   }

//   return {
//     contactId: contact.getContactId(),
//     callState: "DESTROYED",
//     destroyedTime: new Date().toISOString(),
//   };
// }


export function processOnDestroy(
  contact,
  agentName,
  newOutboundContact,
  setNewOutboundContact,
  setShowAccordion
) {
  console.log("[handleOnDestroy] Call Ended Started");
  setShowAccordion(null)
  console.log("destroy", contact.contactData);
  let status = GlobalStore.status;
  console.log("Call Status(Ended): " + status);
  // const channelType = contact.getType();
  const attributes = GlobalStore.attribute;
  GlobalStore.callState = "CALL_END";

  if ((status = "ended")) {
    status = "COMPLETED";
  }
  console.log(
    "Status Changed from Ended-to-Completed & Call Status is Now: " + status
  );
  if (!newOutboundContact) {
    let Duration = Math.abs(GlobalStore.recording_end_time - GlobalStore.recording_start_time) / 1000;
    //let callDuration = contact.contactData.contactDuration;
    console.log("Call Duration before Parsing : ", Duration);

    var callDuration = parseInt(Duration);
    console.log("callDuration : ", callDuration);
    // let attr = contact.getAttributes();
    // let recordingEnable = GlobalStore.recordingEnable;
    let recordingEnable = false;
    if (
      attributes &&
      attributes.recording &&
      attributes.recording.value === "true"
    ) {
      recordingEnable = true;
    }
    var queue = GlobalStore.queue;

    let obj = {};
    if (GlobalStore.channelType === "voice") {
      obj.callId = GlobalStore.engagement_id;
      obj.callDuration = callDuration;
      obj.channelType = GlobalStore.channelType;
      obj.callStatus = status; //"COMPLETED",
      obj.queueName = queue;
      obj.agentName = agentName;
      obj.callType = GlobalStore.callType.toUpperCase();
      obj.contactId = contact.contactId || engagement_body.contactId;
      obj.callStartTime = GlobalStore.call_start_time;
      obj.isRecordingEnable = recordingEnable;
      obj.dispositionCode = GlobalStore.disposition;
      obj.wrapupNote = GlobalStore.wrapupNote;
      obj.hubspotContactId = GlobalStore.hubSpot_contact_id;
    } else {
      obj.callId = GlobalStore.engagement_id;
      obj.channelType = GlobalStore.channelType;
      obj.callDuration = callDuration;
      obj.queueName = queue;
      obj.agentName = agentName;
      obj.callType = "INBOUND"; //callType.toUpperCase(),
      obj.contactId = contact.contactId || engagement_body.contactId;
      obj.dispositionCode = GlobalStore.disposition;
      obj.wrapupNote = GlobalStore.wrapupNote;
      obj.hubspotContactId = GlobalStore.hubSpot_contact_id;
    }
    obj.attributes = GlobalStore.attribute;

    if (!GlobalStore.isMissCall) {
      if (GlobalStore.engagement_id) {
        updateEngagement(obj);
        console.info(
          "[handleOnCallend] multimatch case there is not engagment-id"
        );
      }
    }

    // updateEngagement(obj);
    GlobalStore.engagement_id = null;
    // multiMatch_engagementId = null;
    GlobalStore.hubSpot_contact_id = null;
    engagement_body = {};
    GlobalStore.contact_id = null;
    GlobalStore.isMissCall = false;
    GlobalStore.multiMatch = false;
    GlobalStore.agentId = null;
    GlobalStore.disposition = null;
    GlobalStore.wrapupNote = null;
    setShowAccordion(null);
    // newOutboundContact = false;
    // callState = null;
  }

  return {
    contactId: contact.getContactId(),
    destroyedTime: new Date().toISOString(),
  };
}
