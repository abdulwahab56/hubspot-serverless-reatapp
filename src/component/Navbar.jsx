import React, { useState } from "react";
import { Link, useNavigate,NavLink } from "react-router";
import { useAuth } from "../context/AuthContext";
import logoImage from "../assets/logo.png"

const Navbar = () => {
     const { logout } = useAuth();
    const navigate = useNavigate();

     const handleLogout = () => {
    logout();
    navigate("/login");
  };


  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className=" bg-gradient-to-r from-purple-500 to-indigo-600  cursor-pointer w-[248px] rounded"><img src={logoImage}/></div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 font-medium">
          <li>
            <Link to="/admin/home" className="hover:text-gray-200 transition-colors">Home</Link>
          </li>
          <li>
            <Link to="/admin/setting" className="hover:text-gray-200 transition-colors">Setting</Link>
          </li>
          <li>
            <Link to="/admin/license-update" className="hover:text-gray-200 transition-colors">License Update</Link>
          </li>
          <li>
            <Link to="/admin/login-agent" className="hover:text-gray-200 transition-colors">Login Agent</Link>
          </li>
        </ul>
        <button onClick={handleLogout} className=" sm:w-auto text-[13.5px] cursor-pointer sm:min-w-[120px] bg-indigo-600 hover:bg-indigo-700 text-white font-semibold  py-2 px-3 rounded shadow-md transition duration-300 ease-in-out">Logout</button>

        {/* Mobile Toggle */}
        {/* <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button> */}
      </div>

      {/* Mobile Menu */}
      {/* {isOpen && (
        <ul className="md:hidden bg-indigo-700 px-6 py-4 space-y-3 font-medium">
          <li><Link to="/" className="block py-2 hover:text-gray-200" onClick={() => setIsOpen(false)}>Home</Link></li>
          <li><Link to="/setting" className="block py-2 hover:text-gray-200" onClick={() => setIsOpen(false)}>Setting</Link></li>
          <li><Link to="/license-update" className="block py-2 hover:text-gray-200" onClick={() => setIsOpen(false)}>License Update</Link></li>
          <li><Link to="/login-agent" className="block py-2 hover:text-gray-200" onClick={() => setIsOpen(false)}>Login Agent</Link></li>
        </ul>
      )} */}
    </nav>
  );
};

export default Navbar;
