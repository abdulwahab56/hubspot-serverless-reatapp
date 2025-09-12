import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";

const ConnectContext = createContext();

// top of the module (outside component)
let ccpInitialized = false;

export const ConnectProvider = ({ children }) => {
  const containerRef = useRef(null);
  const [agent, setAgent] = useState(null);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    // safety for SSR
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
      // remove only if it's not the iframe we are about to create (optional)
      // this is just a cleanup if duplicates already exist
      f.remove();
    });

    // const instanceURL = "https://oblab2.my.connect.aws/ccp-v2/";

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

        // auto logout after 12h
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

        contact.onEnded(() => {
          setContacts((prev) =>
            prev.filter((c) => c.getContactId() !== contact.getContactId())
          );
        });
      });

     
    };

    loadConfig();
  }, []);

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

  return (
    <ConnectContext.Provider value={{ agent, contacts }}>
        <div className="w-[350px] bg-[#121212] p-1.5">
        <span>Octavebytes</span>
      </div>
      <div ref={containerRef} style={{ width: "350px", height: "600px" }} />
      {children}
    </ConnectContext.Provider>
  );
};

export const useConnect = () => useContext(ConnectContext);
