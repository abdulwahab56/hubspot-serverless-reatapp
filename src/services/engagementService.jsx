import GlobalStore from "../global/globalStore";
export const createEngagement = async (
  obj,
  url,
  newOutboundContact,
  isMissCall
) => {
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
    GlobalStore.engagement_id = res.engagementId;
    console.log(
      "engagement id from create engagement",
      GlobalStore.engagement_id
    );
    let missCallobj;
    if (isMissCall) {
      missCallobj = {
        callId: GlobalStore.engagement_id,
        //callDuration: 0,
        callStatus: "FAILED", //"COMPLETED", //["COMPLETED", "Canceled", "Busy", "Failed ", "No Answer", "Queued", "In progress"],
        contactId: obj.contactId,
        callStartTime: call_start_time,
        isRecordingEnable: "false",
        channelType: channelType,
      };
      updateEngagement(missCallobj, newOutboundContact, url);
    }
    if (!newOutboundContact) emitSwitchEvent(url);
    console.log(`Request to create engagement completed successfully.`, res);
  } catch (error) {
    console.log(`Request to create engagement failed. Error ${error}`);
  }
};

export const updateEngagement = async (obj, newOutboundContact, url) => {
  console.log("Request to update engagement initiated.");
  const apiURL =
    "https://dxkzxrl20d.execute-api.us-east-1.amazonaws.com/dev/updateEngagement";
  try {
    const response = await fetch(apiURL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const res = await response.json();
    console.log(`Request to update engagement completed successfully. ${res}`);
    if (!newOutboundContact) emitSwitchEvent(GlobalStore.newURL);
    GlobalStore.newURL = null;
    GlobalStore.callState = null;
  } catch (error) {
    console.log(`Request to update engagement failed. Error ${error}`);
  }
};

export function emitSwitchEvent(url) {
  var event = new CustomEvent("INBOUND_CALL", {
    detail: {
      message: GlobalStore.callState,
      data: url,
    },
  });
  document.dispatchEvent(event);
}
