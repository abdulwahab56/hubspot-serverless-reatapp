import {
  createEngagement,
  emitSwitchEvent,
} from "../services/engagementService";

import GlobalStore from "../global/globalStore";

export function processOnConnecting(
  contact,
  agentId,
  envConfig,
  newOutboundContact,
  setNewOutboundContact,
  isMissCall,
  setIsMissCall,
  setShowAccordion,
  updateAttribute,
  setUpdateAttribute
) {
  console.log("agentId", agentId);
  console.log("env", envConfig);

  // ✅ Store HubSpot URL globally
  GlobalStore.hubSpotEntityURL = envConfig.HUBSPOT_ENTITY_URL;

  GlobalStore.contact_id = contact.contactId;
  const status = contact.getStatus();
  const channelType = contact.getType();

  // ✅ Save callStartTime globally
  GlobalStore.callStartTime = Date.parse(status.timestamp);

  const engagement = createEngagementBody(
    contact,
    status,
    channelType,
    GlobalStore.callStartTime
  );

  console.log("[handleOnConnecting]", {
    status,
    channelType,
    callStartTime: GlobalStore.callStartTime,
    engagement,
  });

  let attr = contact.getAttributes();

  if (attr.contactInfo) {
    checkContactInfoInAttribute(engagement, attr);
  } else {
    searchRecord(
      engagement,
      agentId,
      GlobalStore.contact_id,
      newOutboundContact,
      setNewOutboundContact,
      isMissCall,
      setIsMissCall,
      setShowAccordion,
      updateAttribute,
      setUpdateAttribute
    );
  }

  GlobalStore.isMissCall = false;
  console.log("[handleOnConnecting] Call Ringing Completed");

  return {
    callStartTime: GlobalStore.callStartTime,
    callState: "CALL_START",
    engagement_id: GlobalStore.engagement_id,
    channelType,
  };
}

function createEngagementBody(contact, status, channelType, callStartTime) {
  let phoneNumber;

  console.log("[handleOnConnecting] Call Ringing Started");

  if (contact.getType() === "chat") {
    const conAtt = contact.getAttributes();
    phoneNumber = conAtt.customer_phone.value;

    GlobalStore.engagement_body = {
      phoneNumber,
      callStartTime,
      channelType,
      callType: "INBOUND",
      callStatus: "CONNECTING",
      contactId: "",
    };
  } else {
    let c1 = contact.getConnections()[1];
    phoneNumber = c1.getAddress().phoneNumber;

    console.log("Call Status :", status.type);
    console.log("Call Time :", status.timestamp);

    GlobalStore.callType = c1.getType();

    // ✅ Save to GlobalStore instead of local
    GlobalStore.call_start_time = status.timestamp;

    GlobalStore.engagement_body = {
      channelType,
      phoneNumber,
      callStartTime,
      callType: GlobalStore.callType.toUpperCase(),
      callStatus: "CONNECTING",
      contactId: "",
    };
  }

  console.log(
    "[handleOnConnecting] Call Ringing Started",
    GlobalStore.engagement_body
  );

  return GlobalStore.engagement_body;
}

async function searchRecord(
  engagement,
  agentId,
  contactId,
  newOutboundContact,
  setNewOutboundContact,
  isMissCall,
  setIsMissCall,
  setShowAccordion,
  updateAttribute,
  setUpdateAttribute
) {
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
        agentId,
        callType,
        contactId,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const resData = await response.json();
    let hubSpoContactCount = resData.length;

    if (!hubSpoContactCount) {
      setNewOutboundContact(true);
      return;
    } else if (hubSpoContactCount === 1) {
      engagement.contactId = resData[0].vid;
      GlobalStore.hubSpot_contact_id = resData[0].vid;
      console.log("engagement id from.....");
      GlobalStore.newURL = GlobalStore.hubSpotEntityURL + "/" + resData[0].vid;

      setNewOutboundContact(false);
      console.log("engagementbody", engagement);
      createEngagement(
        engagement,
        GlobalStore.newURL,
        newOutboundContact,
        isMissCall
      );
    } else if (hubSpoContactCount > 1) {
      GlobalStore.multiMatch = true;
      setNewOutboundContact(false);
      setShowAccordion(resData);
      // updateAttributeContact(updateAttribute);
      // emitSwitchEvent();
    }
  } catch (error) {
    console.log(
      `Request to search HubSpot entity failed. Search criteria:${createContactPhone} Error: ${error}`
    );
  }
}

export const updateAttributeContact = async (updateAttribute) => {
  const contactId = updateAttribute;
  UpdateContactAttribute(contactId);
  let url = GlobalStore.hubSpotEntityURL + "/" + contactId;
  GlobalStore.newURL = url;
  let oldContactId = GlobalStore.engagement_body.contactId;
  GlobalStore.engagement_body.contactId = contactId;
  GlobalStore.hubSpot_contact_id = contactId;
  if (oldContactId !== contactId) {
    createEngagement(GlobalStore.engagement_body, url);
  } else {
    GlobalStore.engagement_id = contactId;
    updateCallLink(oldContactId, contactId, GlobalStore.engagement_id, url);
  }
};

const UpdateContactAttribute = async (contactId) => {
  const apiURL =
    "https://dxkzxrl20d.execute-api.us-east-1.amazonaws.com/dev/updateContactAttribute";
  //let contactInfo = contactId;
  let obj = {
    initialContactId: GlobalStore.contact_id,
    contactInfo: contactId,
  };

  try {
    const response = fetch(apiURL, {
      method: "POST",
      body: JSON.stringify(obj),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const resData = await response.json();
    console.log(
      `Request to update contact attributes completed successfully. ${resData}`
    );
  } catch (error) {
    console.log(`Request to update contact attributes failed. Error ${error}`);
  }
};

const updateCallLink = async (oldContactId, contactId, callId, url) => {
  console.log("Request to update call link initiated.");
  const apiURL =
    "https://dxkzxrl20d.execute-api.us-east-1.amazonaws.com/dev/updateCallLink";
  let obj = {
    oldContactId: oldContactId,
    contactId: contactId,
    callId: callId,
  };
  try {
    const response = fetch(apiURL, {
      method: "PUT",
      body: JSON.stringify(obj),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const resData = await response.json();
  } catch (error) {
    console.log(`Request to update contact attributes failed. Error ${error}`);
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

    // ✅ Save globally
    GlobalStore.newURL = GlobalStore.hubSpotEntityURL + "/" + attributes.value;

    createEngagement(engagement, GlobalStore.newURL);
  }
};

// Event listener remains the same
document.addEventListener("INBOUND_CALL", function (e) {
  console.log("Call State:", e.detail.message);
  console.log("Contact URL:", e.detail.data);
  window.open(e.detail.data, "_blank");
});

export const resumeRecording = async (agentId) => {
  let apiURL =
    "https://dxkzxrl20d.execute-api.us-east-1.amazonaws.com/dev/recordingResume";
  console.log(
    `Request to resume recording initiated. Contact Id :${GlobalStore.contact_id} `
  );
  let obj = {
    contactId: GlobalStore.contact_id,
    initialContactId: GlobalStore.contact_id,
    agentId,
  };

  try {
    const response = fetch(apiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // ✅ Required
      },
      body: JSON.stringify(obj),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const resData = await response.json();
    console.log(
      `Request to resume recording completed successfully. Contact Id :${GlobalStore.contact_id}`
    );
  } catch (error) {
    console.log(
      `Request to resume recording failed. Contact ID :${GlobalStore.contact_id}`
    );
  }
};

export const pauseRecording = async (agentId) => {
  const apiURL =
    "https://dxkzxrl20d.execute-api.us-east-1.amazonaws.com/dev/recordingPause";

  const obj = {
    contactId: GlobalStore.contact_id,
    initialContactId: GlobalStore.contact_id,
    agentId,
  };

  console.log(`Request to pause recording initiated. Contact Id: ${GlobalStore.contact_id}`);

  try {
    const response = await fetch(apiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // ✅ Required
      },
      body: JSON.stringify(obj),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const resData = await response.json();
    console.log(
      `Request to pause recording completed successfully. Contact Id: ${GlobalStore.contact_id}`,
      resData
    );
  } catch (error) {
    console.error(
      `Request to pause recording failed. Contact ID: ${GlobalStore.contact_id}`,
      error.message
    );
  }
};
