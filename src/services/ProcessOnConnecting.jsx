let hubSpotEntityURL;
let newOutboundContact;
let engagement_id;
let isMissCall;
let newURL;
let call_start_time;

export function processOnConnecting(contact, agentId, envConfig) {
  console.log("agentId", agentId);
  console.log("env",envConfig)
  hubSpotEntityURL= envConfig.HUBSPOT_ENTITY_URL;
  const contactId = contact.contactId;
  const status = contact.getStatus();
  const channelType = contact.getType();
  const callStartTime = Date.parse(status.timestamp);

  const engagement = createEngagementBody(
    contact,
    status,
    channelType,
    callStartTime
  );

  console.log("[handleOnConnecting]", {
    contactId,
    status,
    channelType,
    callStartTime,
    engagement,
  });

  let attr = contact.getAttributes();

  if (attr.contactInfo) {
    checkContactInfoInAttribute(engagement, attr);
  } else {
    searchRecord(engagement, agentId, contactId);
  }

  isMissCall = false;
  console.log("[handleOnConnecting] Call Ringing Completed");

  // return what UI/context should update
  return {
    contactId,
    callStartTime,
    callState: "CALL_START",
    engagement_id,
    channelType
  };
}

function createEngagementBody(contact, status, channelType, callStartTime) {
  let phoneNumber;
  let engagement_body;
  console.log("[handleOnConnecting] Call Ringing Started");
  if (contact.getType() === "chat") {
    const conAtt = contact.getAttributes();
    phoneNumber = conAtt.customer_phone.value;
    engagement_body = {
      phoneNumber,
      callStartTime,
      channelType,
      callType: "INBOUND",
      callStatus: "CONNECTING",
      contactId: "",
      ownerId: hubspotOwnerID,
    };
  } else {
    let c1 = contact.getConnections()[1];
    phoneNumber = c1.getAddress().phoneNumber;
    console.log("Call Status :", status.type);
    console.log("Call Time :", status.timestamp);
    let callType = c1.getType();
    call_start_time = status['timestamp'];
    engagement_body = {
      channelType,
      phoneNumber,
      callStartTime,
      callType: callType.toUpperCase(),
      callStatus: "CONNECTING",
      contactId: "",
      // ownerId: hubspotOwnerID,
    };
  }
  console.log("[handleOnConnecting] Call Ringing Started", engagement_body);

  return engagement_body;
}

// ⬇ keep your checkContactInfoInAttribute, searchRecord, createEngagement as they are
// const removeCountryCode = (phoneNumber) => {
//   const country_codes = countryCodes.split(",");
//   for (let code of country_codes) {
//     if (phoneNumber.startsWith(code)) {
//       return phoneNumber.slice(code.length);
//     }
//   }
//   return phoneNumber;
// };

async function searchRecord(engagement, agentId, contact_id) {
  // let phoneNumber = removeCountryCode(engagement.phoneNumber);
  let createContactPhone = engagement.phoneNumber;
  let callType = engagement.callType;

  console.log(
    "Request to search HubSpot entity initiated. Search criteria : " +
      createContactPhone
  );

  const apiURL =
    "https://dxkzxrl20d.execute-api.us-east-1.amazonaws.com/dev/searchRecordByPhoneNumber";

  try {
    const response = await fetch(apiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phoneNumber: createContactPhone,
        agentId: agentId,
        callType,
        contactId: contact_id,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const resData = await response.json();
    let hubSpoContactCount = resData.length;
    if (!hubSpoContactCount) {
      newOutboundContact = true;
      return;
    } else if (hubSpoContactCount === 1) {
      engagement.contactId = resData[0].vid;
      let hubSpot_contact_id = resData[0].vid;
      let url = hubSpotEntityURL + "/" + resData[0].vid;
      newURL = url;
      newOutboundContact = false;
      createEngagement(engagement, url);
    } else if (hubSpoContactCount > 1) {
      multiMatch = true;
      newOutboundContact = false;
      showAccordion(resData);
      emitSwitchEvent();
    }
  } catch (error) {
    console.log(
      `Request to search HubSpot entity failed. Search criteria:${createContactPhone}+"Error" ${errorMessage}`
    );
  }
}

const createEngagement = async (obj, url) => {
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
      updateEngagement(missCallobj);
    }
    if (!newOutboundContact) emitSwitchEvent();
    console.log(`Request to create engagement completed successfully.`, res);
  } catch (error) {
    console.log(`Request to create engagement failed. Error ${error}`);
  }

};

const updateEngagement = async (obj) => {
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
    if (!newOutboundContact) emitSwitchEvent();
  } catch (error) {
    console.log(`Request to update engagement failed. Error ${error}`);
  }

};

const checkContactInfoInAttribute = async (engagement, attr) => {
  console.log("attribute update", attr);
  let attributes = attr.contactInfo;

  if (attributes) {
    console.log(
      "Request to search HubSpot entity initiated. Search criteria : " +
        attributes.value
    );
    engagement.contactId = attributes.value;
    let url = hubSpotEntityURL + "/" + attributes.value;
    newURL = url;
    createEngagement(engagement, url);
  }
};

// When phone rings, this function triggers
function emitSwitchEvent() {
  var event = new CustomEvent('INBOUND_CALL', {
    detail: {
      message: 'RINGING',
      data: newURL
    },
  });
  document.dispatchEvent(event);
}

// Other components listen for this event
document.addEventListener('INBOUND_CALL', function(e) {
  console.log('Call State:', e.detail.message);  // 'RINGING'
  console.log('Contact URL:', e.detail.data);    // HubSpot URL
  
  // Open HubSpot contact automatically
  window.open(e.detail.data, '_blank');
});