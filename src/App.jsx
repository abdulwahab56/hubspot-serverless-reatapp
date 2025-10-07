// src/App.jsx
import React, { useState, useEffect } from "react";
import { ConnectProvider } from "./context/ConnectContext";
import CCPComponent from "./component/CCPComponent";
import { useConnect } from "./context/ConnectContext";
import { Route, Routes } from "react-router";
import Install from "./component/Install";
import OauthCallback from "./component/OauthCallback";
import LoginPage from "./component/LoginPage";
import Admin from "./component/Admin";



const API_BASE =
  "https://dxkzxrl20d.execute-api.us-east-1.amazonaws.com/dev/getDataDynamodb";

const App = () => {
  const { hasToken, setHasToken } = useConnect();

  useEffect(() => {
    fetch(API_BASE)
      .then((res) => res.json())
      .then((data) => {
        setHasToken(data.hasToken);
        console.log("data", data);
      })
      .catch((error) => console.log(error));
  }, []);
  if (hasToken === null) {
    return <p>Loading...</p>; // 👈 no flicker, just loader
  }
  return (
    <>
      <Routes>
        <Route path="/app/oauth-callback" element={<OauthCallback />} />
        {hasToken ? (
          <Route path="/*" element={<CCPComponent />} />
        ) : (
          <Route path="/*" element={<Install />} />
        )}

        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/*" element={<Admin />} />
      </Routes>
    </>
  );
};

export default App;
