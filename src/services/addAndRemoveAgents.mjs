

export const addAgents = async (obj,instanceAlias) => {
  console.log("Request to add agent login initiated");
  console.log("[addAgent] - Agent Data:", obj);

  const apiURL = "https://dxkzxrl20d.execute-api.us-east-1.amazonaws.com/dev/agentLogin";

  try {
    const response = await fetch(apiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj), // ✅ must be a string
    });

    const resData = await response.json(); // ✅ must await .json()

    console.log("Request to add agent completed successfully:", resData);

    // ✅ Adjust logic depending on your backend response shape
    if (
  resData.message === "Agent logged in successfully" ||
  resData.message === "Agent already logged in"
) {
  console.log("✅ Agent login valid:", resData.message);
} else {
  alert("⚠️ Your license is expired or invalid. Please contact Octavebytes administrator.");
  const logoutURL = `https://${instanceAlias}.my.connect.aws/logout`;
  window.location.replace(logoutURL);
}


    return resData;
  } catch (error) {
    console.error("Request to add agent failed:", error);
    throw error;
  }
};




export const removeAgent = async (obj) => {
  console.log("Request to add agent login initiated");
  console.log("[addAgent] - Agent Data:", obj);

  const apiURL = "https://dxkzxrl20d.execute-api.us-east-1.amazonaws.com/dev/agentLogout";

  try {
    const response = await fetch(apiURL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj), // ✅ must be a string
    });

    const resData = await response.json(); // ✅ must await .json()

    console.log(`Request to remove agent completed successfully.`, resData)

    return resData;
  } catch (error) {
    console.error("Request to add agent failed:", error);
    throw error;
  }
};