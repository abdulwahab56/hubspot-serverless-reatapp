import React, { useEffect, useRef } from "react";
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

// Module-level flag to prevent multiple initializations
let ccpInitialized = false;
let instanceAlias;

const CCPComponent = () => {
  const containerRef = useRef(null);
  const {
    agent,
    setAgent,
    setContacts,
    showAccordion,
    recordingToggle,
    pause,
    setPause,
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
        console.log("Agent connected:", newAgent);
        setAgent(newAgent);

        let Obj = {
          agentName: newAgent.getName(),
          userName: newAgent._getData().configuration.username,
        };
        console.log("agent name", Obj);
        addAgents(Obj, instanceAlias);

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

            <HiOutlineStop
              className={`size-5 ${
                recordingToggle ? "text-red-600 animate-pulse" : "text-gray-400"
              }`}
            />
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
      <div
        ref={containerRef}
        className="w-[350px] h-[90vh] max-h-[600px] min-h-[400px]"
      />
    </div>
  );
};

export default CCPComponent;
