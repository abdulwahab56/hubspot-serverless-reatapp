import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [submitMessage, setSubmitMessage] = useState("");
   const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(()=>{
     const token = localStorage.getItem("adminToken");
    const userData = localStorage.getItem("adminUser");
    
    if (token && userData) {
     navigate("/admin/home")
    }

  },[])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    const apiURL = "https://dxkzxrl20d.execute-api.us-east-1.amazonaws.com/dev/loginUser";
    try {
      const response = await fetch(apiURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(formData)
      })
      if (!response.ok) throw new Error("Failed to login");
      const resData = await response.json();
      login(resData.username, resData.token);
      navigate("/admin/home");
      setSubmitMessage(resData.message)
      setFormData({
        username: "",
        password: "",
      })
      setTimeout(() => setSubmitMessage(""), 3000);
      console.log("Login Successful", resData)

    } catch (error) {
      console.log("error", error)

    }
    // Add your authentication logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-4">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-8 transform transition-all hover:scale-[1.01]">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome Back
        </h2>
        <p className=" text-gray-500 mb-8">
          Please login to your account
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full text-gray-700 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full text-gray-700 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 transition-all"
          >
            Login
          </button>
        </form>
        {submitMessage && (
          <div
            className={`mt-4 p-3 rounded-xl ${submitMessage.includes("successfully")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
              }`}
          >
            {submitMessage}
          </div>
        )}
      </div>

    </div>
  );
};

export default LoginPage;
