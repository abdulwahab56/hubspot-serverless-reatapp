import React, { useEffect, useState } from "react";

const LoginAgent = () => {
  const [agents, setAgents] = useState([]);

  const getAgents = async()=>{
    try {
      const apiURL = "https://dxkzxrl20d.execute-api.us-east-1.amazonaws.com/dev/getAgents";

      const response = await fetch(apiURL);
       if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const resData = await response.json();
      setAgents(resData.agents)
    } catch (error) {
      console.log("error to getting agents",error)
    }
  }


  useEffect(()=>{
    getAgents()

  },[agents])

  const handleDelete = async(agent) => {
    console.log("Delete agent:", agent);
    try {
      const apiURL = "https://dxkzxrl20d.execute-api.us-east-1.amazonaws.com/dev/agentLogout";

     const response = await fetch(apiURL,{
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(agent), // ✅ send as object
        })
        const resData = await response.json()
        console.log("remove agent successfully from the",resData)
        
      
    } catch (error) {
       console.log("error reove agents",error)
    }
  };


  return (
    <div className="pt-6 px-6 md:px-16 lg:px-32 bg-gray-50">
      <div className="">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Agent Management</h1>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Sr</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Agent Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {agents.length > 0 ? (
                agents.map((agent, index) => (
                  <tr
                    key={agent.id}
                    className="hover:bg-gray-50 transition duration-150"
                  >
                    <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {agent.agentName}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(agent)}
                          className="px-3 py-1 bg-red-500 hover:bg-red-600 cursor-pointer text-white rounded-md transition duration-200"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                    No agents found. Add some agents to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Total Agents: <span className="font-semibold">{agents.length}</span>
        </div>
      </div>
    </div>
  );
};

export default LoginAgent;