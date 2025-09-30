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
  setIsMissCall
) {
  console.log("agentId", agentId);
  console.log("env", envConfig);

  // ✅ Store HubSpot URL globally
  GlobalStore.hubSpotEntityURL = envConfig.HUBSPOT_ENTITY_URL;

  const contactId = contact.contactId;
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
    contactId,
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
      contactId,
      newOutboundContact,
      setNewOutboundContact,
      isMissCall,
      setIsMissCall
    );
  }

  GlobalStore.isMissCall = false;
  console.log("[handleOnConnecting] Call Ringing Completed");

  return {
    contactId,
    callStartTime: GlobalStore.callStartTime,
    callState: "CALL_START",
    engagement_id: GlobalStore.engagement_id,
    channelType,
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
    };
  } else {
    let c1 = contact.getConnections()[1];
    phoneNumber = c1.getAddress().phoneNumber;

    console.log("Call Status :", status.type);
    console.log("Call Time :", status.timestamp);

    GlobalStore.callType = c1.getType();

    // ✅ Save to GlobalStore instead of local
    GlobalStore.call_start_time = status.timestamp;

    engagement_body = {
      channelType,
      phoneNumber,
      callStartTime,
      callType: GlobalStore.callType.toUpperCase(),
      callStatus: "CONNECTING",
      contactId: "",
    };
  }

  console.log("[handleOnConnecting] Call Ringing Started", engagement_body);

  return engagement_body;
}

async function searchRecord(
  engagement,
  agentId,
  contactId,
  newOutboundContact,
  setNewOutboundContact,
  isMissCall,
  setIsMissCall
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
      console.log("engagement id from.....")
      GlobalStore.newURL = GlobalStore.hubSpotEntityURL + "/" + resData[0].vid;

      setNewOutboundContact(false);
      createEngagement(
        engagement,
        GlobalStore.newURL,
        newOutboundContact,
        isMissCall
      );
    } else if (hubSpoContactCount > 1) {
      setNewOutboundContact(false);
      showAccordion(resData);
      emitSwitchEvent(GlobalStore.newURL);
    }
  } catch (error) {
    console.log(
      `Request to search HubSpot entity failed. Search criteria:${createContactPhone} Error: ${error}`
    );
  }
}

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
