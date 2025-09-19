// src/component/OauthCallback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useConnect } from "../context/ConnectContext";

const API_BASE = "https://dxkzxrl20d.execute-api.us-east-1.amazonaws.com/dev";

export default function OauthCallback() {
  const navigate = useNavigate();
  const {setHasToken} = useConnect();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      fetch(`${API_BASE}/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }), 
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error ${res.status}`);
          }
          console.log("response", res)
          return res.json();
        })
        .then(() => {
          // After tokens are stored in DynamoDB, refresh app
          setHasToken(true);
          navigate("/");
        })
        .catch((err) => console.error("OAuth callback error:", err));
    }
  }, [navigate]);

  return <p>Connecting HubSpot... Please wait.</p>;
}
