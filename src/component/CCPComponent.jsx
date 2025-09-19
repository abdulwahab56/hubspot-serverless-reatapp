import React, { useEffect, useRef } from "react";
import { MdOutlinePausePresentation } from "react-icons/md";
import { BsPlayBtn } from "react-icons/bs";
import { ImStop } from "react-icons/im";
import { useConnect } from "../context/ConnectContext";
import { handleOnConnecting } from "./ConnectEventHandler";

// Module-level flag to prevent multiple initializations
let ccpInitialized = false;

const CCPComponent = () => {
  const containerRef = useRef(null);
  const { agent, setAgent, contacts, setContacts } = useConnect();

  

  useEffect(() => {
    // Safety for SSR
    if (typeof window === "undefined") return;
    if (!containerRef.current) return;

    // If already initialized, skip (module var persists across mounts)
    if (ccpInitialized) {
      console.log("CCP already initialized — skipping init.");
      return;
    }

    // Set the flag BEFORE calling init so StrictMode race won't call init twice
    ccpInitialized = true;

    // Optional safety: remove leftover CCP iframes from previous bad inits
    const existing = document.querySelectorAll(
      'iframe[src*="connect.aws/ccp"], iframe[src*="ccp-v2"]'
    );
    existing.forEach((f) => {
      f.remove();
    });

    // Load config from backend
    const loadConfig = async () => {
      try {
        // const res = await fetch("/app/loadConfig");
        // const response = await res.json();
        // setConfig(response);
        initCCP("oblab2");
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
      connect.core.getEventBus().subscribe(connect.EventType.TERMINATED, () => {
        console.log("Logged out / session terminated");
        setAgent(null);
        setContacts([]);
      });

      // Agent listener
      connect.agent((newAgent) => {
        console.log("Agent connected:", newAgent);
        setAgent(newAgent);

        newAgent.onStateChange(() => setAgent(newAgent));
        newAgent.onRefresh(() => setAgent(newAgent));

        // Auto logout after 12h
        setTimeout(() => {
          console.log("Auto-logout after 12h");
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
        setContacts((prev) => [...prev, contact]);
        contact.onConnecting(()=>{handleOnConnecting(contact)})


        subscribeToContactEvents(contact);

        // contact.onEnded(() => {
        //   setContacts((prev) =>
        //     prev.filter((c) => c.getContactId() !== contact.getContactId())
        //   );
        // });
      });
    };

    loadConfig();
  }, [setAgent, setContacts]);

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

      const instanceAlias = "oblab2"; // replace with config/env if needed
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

   // Function to subscribe to all contact events
  const subscribeToContactEvents = (contact) => {
    console.log('Subscribing to events for contact:', contact.getContactId());
    
    contact.onConnecting(() => handleOnConnecting(contact));
    contact.onMissed(() => handleOnMissed(contact));
    contact.onConnected(() => handleOnConnected(contact));
    contact.onACW(() => handleOnACW(contact));
    contact.onEnded(() => handleOnEnded(contact, setContacts));
    contact.onDestroy(() => handleOnDestroy(contact));
  };

  return (
   <div>
    {agent ? (
      // Show header when agent is connected
      <div className="w-[350px] bg-[#121212] px-1.5 flex items-center justify-between py-2">
        <span className="size-5">Octavebytes</span>
        <span className="flex mr-6 gap-1.5">
          <MdOutlinePausePresentation className="size-5" />
          <BsPlayBtn className="size-5" />
          <ImStop className="size-5" />
        </span>
      </div>
    ) : (
      // Show loading state while CCP initializes
      <div className="w-[350px] bg-[#121212] px-1.5 flex items-center justify-center py-2">
        <span className="text-white text-sm">Connecting...</span>
      </div>
    )}
    <div ref={containerRef} className="w-[350px] h-[90vh] max-h-[600px] min-h-[400px]" />
  </div>
  );
};

export default CCPComponent;