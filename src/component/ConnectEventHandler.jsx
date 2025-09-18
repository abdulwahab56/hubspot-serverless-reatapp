let loginWindow;
let engagement_id;
let channelType;
let hubSpot_contact_id;
let engagement_body = {};
let contact_id;
let loggedInAgent;
let hubSpotActiveURL;
let call_start_time;
let recording_end_time;
let callType;
let apiBaseURL;
let hubSpotEntityURL;
let hubSpotAppBaseUrl;
let instanceAlias;
let multiMatch_engagementId;
let isMissCall = false;
let countryCodes;
let popWindow;
let newURL = null;
let multiMatch = false;
let agentsId;
let newOutboundContact = false;
let inboundDispositions;
let outboundDispositions;
let callState = null;
let wrapupNote = '';
let disposition = '';
let wrapup_NoteToggle;
let output_activity;
let hubspotOwnerID;


export const handleOnConnecting = (contact)=>{
  callState = 'CALL_START';
  console.log('[handleOnConnecting] Call Ringing Started');
  setPanelStatus();
  contact_id = contact.contactId;
  let status = contact.getStatus();
  channelType = contact.getType();
  let callStartTime = Date.parse(status['timestamp']);
  const engagement = createEngagementBody(contact);

  let attr = contact.getAttributes();

  if (attr.contactInfo) {
    checkContactInfoInAttribute(engagement, attr);
  } else {
    searchRecord(engagement, agentsId, contact_id);
  }

  isMissCall = false;
  console.log('[handleOnConnecting] Call Ringing Completed');
}
const createEngagementBody = (contact)=>{
  let phoneNumber;
  console.log('[handleOnConnecting] Call Ringing Started');
  console.log('contact of', contact.getType());
  setPanelStatus();
  contact_id = contact.contactId;
  let status = contact.getStatus();
  channelType = contact.getType();
  let callStartTime = Date.parse(status['timestamp']);
  if (contact.getType() === 'chat') {
    const conAtt = contact.getAttributes();
    phoneNumber = conAtt.customer_phone.value;
    engagement_body = {
      phoneNumber: phoneNumber,
      callStartTime: callStartTime,
      channelType: channelType,
      callType: 'INBOUND',
      callStatus: 'CONNECTING',
      contactId: '',
      ownerId: hubspotOwnerID
    };
  } else {
    let c1 = contact.getConnections()[1];

    phoneNumber = c1.getAddress()['phoneNumber'];
    console.log('Call Status :' + status['type']);
    console.log('Call Time :' + status['timestamp']);
    callType = c1.getType();
    call_start_time = status['timestamp'];
    engagement_body = {
      channelType: channelType,
      phoneNumber: phoneNumber,
      callStartTime: callStartTime,
      callType: callType.toUpperCase(),
      callStatus: 'CONNECTING',
      contactId: '',
      ownerId: hubspotOwnerID
    };
  }

  return engagement_body;
}

function checkContactInfoInAttribute(engagement, attr) {
  console.log('attribute update', attr);
  let attributes = attr.contactInfo;

  if (attributes) {
    console.log(
      'Request to search HubSpot entity initiated. Search criteria : ' +
        attributes.value
    );
    engagement.contactId = attributes.value;
    let url = hubSpotEntityURL + '/' + attributes.value;
    newURL = url;
    createEngagement(engagement, url);
  }
}

function searchRecord(engagement, agentId, contact_id) {
  let phoneNumber = removeCountryCode(engagement.phoneNumber);
  let createContactPhone = engagement.phoneNumber;

  console.log(
    'Request to search HubSpot entity initiated. Search criteria : ' +
      phoneNumber
  );

  const apiURL =
    apiBaseURL +
    '/hubspot/contacts/' +
    phoneNumber +
    '?phoneNumber=' +
    encodeURIComponent(createContactPhone) +
    '&channelType=' +
    engagement.callType;

  $.ajax({
    url: apiURL,
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({
      phoneNumber: createContactPhone,
      agentId: agentId,
      callType: callType,
      contactId: contact_id,
    }),
  })
    .done(function (response) {
      console.log(
        'Request to search HubSpot entity completed successfully. Response: ',
        response
      );

      let hubSpoContactCount = response.length;
      if (!hubSpoContactCount) {
        newOutboundContact = true;
        return;
      } else if (hubSpoContactCount === 1) {
        engagement.contactId = response[0].vid;
        hubSpot_contact_id = response[0].vid;
        let url = hubSpotEntityURL + '/' + response[0].vid;
        newURL = url;
        newOutboundContact = false;
        createEngagement(engagement, url);
      } else if (hubSpoContactCount > 1) {
        multiMatch = true;
        newOutboundContact = false;
        showAccordion(response);
        emitSwitchEvent();
      }
    })
    .fail(function (xhr) {
      $('#btnPause').removeAttr('disabled');
      // Access the detailed error message if available
      const errorMessage =
        xhr.responseJSON?.error ||
        'Error while pausing recording. Please contact administrator!';
      console.log(
        `Request to search HubSpot entity failed. Search criteria:${phoneNumber}+"Error" ${errorMessage}`
      );
      alert(errorMessage);
    });
}

function createEngagement(obj, url) {
  console.log('Request to create engagement initiated.');
  const apiURL = apiBaseURL + '/hubspot/engagements';
  $.ajax({
    url: apiURL,
    method: 'POST',
    data: obj,
  })
    .done(function (res) {
      engagement_id = res.id;
      let missCallobj;
      if (isMissCall) {
        missCallobj = {
          callId: engagement_id,
          //callDuration: 0,
          callStatus: 'FAILED', //"COMPLETED", //["COMPLETED", "Canceled", "Busy", "Failed ", "No Answer", "Queued", "In progress"],
          contactId: obj.contactId,
          callStartTime: call_start_time,
          isRecordingEnable: 'false',
          channelType: channelType,
        };
        updateEngagement(missCallobj);
      }
      if (!newOutboundContact) emitSwitchEvent();

      console.log(`Request to create engagement completed successfully.`, res);
    })
    .fail(function (error) {
      console.log(`Request to create engagement failed. Error ${error}`);
    });
}