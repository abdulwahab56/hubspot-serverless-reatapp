// src/component/Admin.jsx
import React from "react";
import { Routes, Route, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import Navbar from "./navbar";
import Setting from "./Setting";
import LoginAgent from "./LoginAgent";
import Home from "./Home";
import LicenseUpdate from "./LicenseUpdate";

const Admin = () => {

  return (
    <>
      <Navbar />

      {/* Page content changes here */}
      <div className="p-8 bg-gray-50 min-h-screen pt-14">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/license-update" element={<LicenseUpdate />} />
          <Route path="/login-agent" element={<LoginAgent />} />
        </Routes>
      </div>
    </>
  );
};

export default Admin;
