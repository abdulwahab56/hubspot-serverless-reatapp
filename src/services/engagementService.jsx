// services/EngagementService.js
let hubSpotEntityURL;
let engagement_id;
let newURL;
let call_start_time;

// export function setHubSpotEntityURL(url) {
//   hubSpotEntityURL = url;
// }

export const createEngagement = async (obj, url, newOutboundContact, isMissCall) => {
  console.log("Request to create engagement initiated.");
  const apiURL =
    "https://dxkzxrl20d.execute-api.us-east-1.amazonaws.com/dev/createEngagement";
  try {
    const response = await fetch(apiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const res = await response.json();
    engagement_id = res.engagementId;
    let missCallobj;
    if (isMissCall) {
      missCallobj = {
        callId: engagement_id,
        //callDuration: 0,
        callStatus: "FAILED", //"COMPLETED", //["COMPLETED", "Canceled", "Busy", "Failed ", "No Answer", "Queued", "In progress"],
        contactId: obj.contactId,
        callStartTime: call_start_time,
        isRecordingEnable: "false",
        channelType: channelType,
      };
      updateEngagement(missCallobj, newOutboundContact,url);
    }
    if (!newOutboundContact) emitSwitchEvent(url);
    console.log(`Request to create engagement completed successfully.`, res);
  } catch (error) {
    console.log(`Request to create engagement failed. Error ${error}`);
  }
};

export const updateEngagement = async (obj, newOutboundContact,url) => {
  console.log("Request to update engagement initiated.");
  const apiURL =
    "https://dxkzxrl20d.execute-api.us-east-1.amazonaws.com/dev/updateEngagement";
  try {
    const response = await fetch(apiURL, {
      method: "PUT",
      headers: {
        "Contact-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const res = await response.json();
    console.log(`Request to update engagement completed successfully. ${res}`);
    if (!newOutboundContact) emitSwitchEvent(url);
  } catch (error) {
    console.log(`Request to update engagement failed. Error ${error}`);
  }
};


export function emitSwitchEvent(url) {
  var event = new CustomEvent("INBOUND_CALL", {
    detail: {
      message: "RINGING",
      data: url,
    },
  });
  document.dispatchEvent(event);
}