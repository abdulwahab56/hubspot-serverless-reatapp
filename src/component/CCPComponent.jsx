import React, { useEffect, useRef, useState } from "react";
import { MdOutlinePausePresentation } from "react-icons/md";
import { BsPlayBtn } from "react-icons/bs";
import { HiOutlineStop } from "react-icons/hi";
import { useConnect } from "../context/ConnectContext";
import useOnConnecting from "../hooks/useOnConnecting";
import useOnConnected from "../hooks/useOnConnected";
import useOnMissed from "../hooks/useOnMissed";
import useOnACW from "../hooks/useOnACW";
import useOnEnded from "../hooks/useOnEnded";
import useOnDestroy from "../hooks/useOnDestroy";
import useConfig from "../hooks/useConfig";
import ShowAccordionComponent from "../component/ShowAccordionComponent";
import { addAgents, removeAgent } from "../services/addAndRemoveAgents.mjs";
import GlobalStore from "../global/globalStore";
import DipositionWrapUpNotes from "./DipositionWrapUpNotes";
import QueueSelectionOutBoundCall from "./QueueSelectionOutBoundCall"

// Module-level flag to prevent multiple initializations
let ccpInitialized = false;
let instanceAlias;

const CCPComponent = () => {
  const containerRef = useRef(null);
  const [agentsLists, setAgentsLists] =useState("");
  const {
    agent,
    setAgent,
    setContacts,
    showAccordion,
    recordingToggle,
    pause,
    setPause,
    disposition,
    outBoundCall
  } = useConnect();
  const envConfig = useConfig();

  // our handler hook
  const onConnecting = useOnConnecting();
  const onConnected = useOnConnected();
  const onMissed = useOnMissed();
  const onACW = useOnACW();
  const onEnded = useOnEnded();
  const onDestroy = useOnDestroy();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!containerRef.current) return;

    if (ccpInitialized) {
      console.log("CCP already initialized — skipping init.");
      return;
    }
    ccpInitialized = true;

    // clean up old iframes
    document
      .querySelectorAll('iframe[src*="connect.aws/ccp"], iframe[src*="ccp-v2"]')
      .forEach((f) => f.remove());

    const loadConfig = async () => {
      try {
        instanceAlias = envConfig.CONNECT_ALIAS;
        initCCP(instanceAlias);
      } catch (err) {
        console.error("Failed to load config:", err);
      }
    };

    const initCCP = (instanceAlias) => {
      const ccpURL = `https://${instanceAlias}.my.connect.aws/ccp-v2#`;
      const loginURL = `https://${instanceAlias}.my.connect.aws/login`;

      connect.core.initCCP(containerRef.current, {
        ccpUrl: ccpURL,
        loginPopup: false,
        softphone: { allowFramedSoftphone: true },
      });

      connect.core.initSoftphoneManager({ allowFramedSoftphone: true });

      // ACK_TIMEOUT handler
      connect.core
        .getEventBus()
        .subscribe(connect.EventType.ACK_TIMEOUT, () => {
          console.warn("ACK_TIMEOUT occurred, attempting login popup.");

          let width = 500;
          let height = 600;
          let left = window.screen.width / 2 - width / 2;
          let top = window.screen.height / 2 - height / 2;

          let loginWindow = window.open(
            loginURL,
            "_blank",
            `width=${width},height=${height},left=${left},top=${top},menubar=no,status=no,toolbar=no`
          );

          connect.core
            .getEventBus()
            .subscribe(connect.EventType.ACKNOWLEDGE, () => {
              if (loginWindow) loginWindow.close();
            });
        });

      // TERMINATED handler
      // connect.core.getEventBus().subscribe(connect.EventType.TERMINATED, () => {
      //   console.log("Logged out / session terminated");
      //   let logOutAgent;
      //   let agentLogout = connect.agent((agent) => {
      //      logOutAgent = agent.getName();
      //     console.log("Agent Logout: ", logOutAgent);
      //   });
      //   let Obj = {
      //     agentName: logOutAgent,
      //   };
      //   console.log("Agent name is ", Obj.agentName);
      //   removeAgent(Obj);
      //   setAgent(null);
      //   setContacts([]);
      // });
      // Handle logout requests (from external frame)
      connect.core.getEventBus().subscribe(connect.EventType.TERMINATE, () => {
        console.log("TERMINATE event received - performing logout cleanup");

        if (agent) {
          const Obj = {
            agentName: agent.getName(),
            userName: agent._getData().configuration.username,
          };
          console.log("Removing agent:", Obj);
          removeAgent(Obj);
        }

        setAgent(null);
        setContacts([]);
      });

      // Handle CCP self-termination
      connect.core.getEventBus().subscribe(connect.EventType.TERMINATED, () => {
        console.log("TERMINATED event received - CCP session ended");
        if (agent) {
          const Obj = {
            agentName: agent.getName(),
            userName: agent._getData().configuration.username,
          };
          removeAgent(Obj);
        }

        setAgent(null);
        setContacts([]);
      });

      // Agent listener
      connect.agent((newAgent) => {
        GlobalStore.loggedInAgent = newAgent;
        console.log("Agent connected:", newAgent);
        setAgent(newAgent);

        let Obj = {
          agentName: newAgent.getName(),
          userName: newAgent._getData().configuration.username,
        };
        console.log("agent name", Obj);
        addAgents(Obj, instanceAlias);
        const agentsProfile = newAgent.getRoutingProfile();
        const list = agentsProfile.queues.filter((queue)=> queue.name !== null)
        setAgentsLists(list);

        // const {phoneNumber, selectedOption} = outBoundCall;
        //  let endpoint = this.connect.Endpoint.byPhoneNumber(phoneNumber);
        //  newAgent.connect(endpoint, {
        //   queueARN: selectedOption,
        //   success: function(data){
        //     console.log("Make call success", data)
        //   },
        //   failure: function(error){
        //     console.error('MakeCall failed ', error);
        //   }
        //  })

        newAgent.onStateChange(() => setAgent(newAgent));
        newAgent.onRefresh(() => setAgent(newAgent));

        // Auto logout after 12h
        setTimeout(() => {
          console.log("Auto-logout after 12h");

          removeAgent(Obj);
          fetch(`https://${instanceAlias}.my.connect.aws/logout`, {
            credentials: "include",
            mode: "no-cors",
          }).finally(() => {
            const eventBus = connect.core.getEventBus();
            eventBus.trigger(connect.EventType.TERMINATE);
          });
        }, 12 * 60 * 60 * 1000);
      });

      // Contact listener
      connect.contact((contact) => {
        console.log("New contact:", contact);

        // subscribe to events
        subscribeToContactEvents(contact);
      });
    };

    loadConfig();
  }, [setAgent, setContacts, onConnecting]);

  useEffect(() => {
    if (!agent) return;

    function handleBeforeUnload() {
      const states = agent.getAgentStates();
      const offlineState = states.find((s) => s.name === "Offline");

      if (offlineState) {
        agent.setState(offlineState, {
          success: () => console.log("Agent set to Offline before unload"),
          failure: (err) => console.error("Failed to set Offline:", err),
        });
      }

      const instanceAlias = "oblab2";
      fetch(`https://${instanceAlias}.my.connect.aws/logout`, {
        credentials: "include",
        mode: "no-cors",
      }).finally(() => {
        const eventBus = connect.core.getEventBus();
        eventBus.trigger(connect.EventType.TERMINATE);
        console.log("Agent logged out before unload");
      });
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [agent]);
  const subscribeToContactEvents = (contact) => {
    console.log("Subscribing to events for contact:", contact.getContactId());

    contact.onConnecting(() => {
      console.log("React - onConnecting - contactData:", contact.contactData);
      onConnecting(contact);
    });
    contact.onConnected(() => {
      console.log("React - onConnected - contactData:", contact.contactData);
      onConnected(contact);
    });
    contact.onMissed(() => {
      console.log("React - onMissed - contactData:", contact.contactData);
      onMissed(contact);
    });
    contact.onACW(() => {
      console.log("React - onACW - contactData:", contact.contactData);
      onACW(contact);
    });
    contact.onEnded(() => {
      console.log("React - onEnded - contactData:", contact.contactData);
      onEnded(contact);
    });
    contact.onDestroy(() => {
      console.log("React - onDestroy - contactData:", contact.contactData);
      onDestroy(contact);
    });
  };

  useEffect(() => {
    window.addEventListener(
      "message",
      function (e) {
        if (e.data.type == "DIAL_REQUEST") {
          if (GlobalStore.loggedInAgent) {
            console.log("Message Received");
            console.log("Dialing..........");
            console.log(e.data.phoneNumber);
            if (e.data.phoneNumber) MakeCall(e.data.phoneNumber);
          } else {
            alert("The Calling widget is initializing");
            let payLoad = { type: "OUTBOUND_FAILED", phone: number };
            window.postMessage(payLoad, "*");
          }
        }
        if (e.data.type == "ENGAGEMENT_CREATED") {
          console.log("ENGAGEMENT_CREATED ID " + e.data.data.engagementId);
          engagement_id = e.data.data.engagementId;
        }
        // if (e.data.hubspotOid.type === "hubspotOid") {
        //   hubspotOwnerID = e.data.hubspotOid.data;
        //   console.log("Received HubSpot Owner ID:", hubspotOwnerID);
        // }
      },
      false
    );

    function MakeCall(number) {
      console.log(" Going to dial : " + number);
      /**
       * Takes an endpoint
       * connects to that endpoint
       */
      let endpoint = this.connect.Endpoint.byPhoneNumber(number);

      const agent = GlobalStore.loggedInAgent;
      agent.connect(endpoint, {
        success: function (data) {
          console.log("MakeCall success ", data);
          let payLoad = { type: "OUTBOUND_STARTED", phone: number };
          window.postMessage(payLoad, "*");
        },
        failure: function (error) {
          alert(JSON.parse(error).message);
          let payLoad = { type: "OUTBOUND_FAILED", phone: number };
          window.postMessage(payLoad, "*");
          console.error("MakeCall failed ", error);
        },
      });
    }
  });

  return (
    <div>
      {agent ? (
        <div className="w-[350px] bg-[#121212] px-1.5 flex items-center justify-between py-2">
          <span className="size-5">Octavebytes</span>
          <span className="flex mr-6 gap-1.5">
            <button
              disabled={pause !== false} // enable only if call is active + not already paused
              onClick={() => setPause(true)}
              className="p-2 rounded bg-amber-500 hover:bg-amber-600 
                     disabled:bg-amber-900 disabled:cursor-not-allowed"
            >
              <MdOutlinePausePresentation className="size-5 text-white" />
            </button>

            {/* Play Button */}
            <button
              disabled={pause !== true} // enable only if paused
              onClick={() => setPause(false)}
              className="p-2 rounded bg-amber-500 hover:bg-amber-600 
                     disabled:bg-amber-900 disabled:cursor-not-allowed"
            >
              <BsPlayBtn className="size-5 text-white" />
            </button>
            <span className="p-2 rounded bg-amber-900">
              <HiOutlineStop
                className={`size-5 ${
                  recordingToggle ? "text-red-600 animate-pulse" : "text-white"
                }`}
              />
            </span>
          </span>
        </div>
      ) : (
        <div className="w-[350px] bg-[#121212] px-1.5 flex items-center justify-center py-2">
          <span className="text-white text-sm">Connecting...</span>
        </div>
      )}
      {showAccordion === null ? (
        ""
      ) : (
        <ShowAccordionComponent showAccordion={showAccordion} />
      )}
      {disposition ? <DipositionWrapUpNotes /> : ""}
      <QueueSelectionOutBoundCall agentsLists={agentsLists} />
      <div
        ref={containerRef}
        className="w-[350px] h-[90vh] max-h-[600px] min-h-[400px]"
      />
    </div>
  );
};

export default CCPComponent;
