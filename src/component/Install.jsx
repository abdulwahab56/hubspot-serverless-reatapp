import React from 'react'
import installimgae from "../assets/OB-Cloud-2-1.png"

const Install = () => {
  return (
<div className="h-screen w-full flex items-center justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300 p-8 ">
    <a
      href="https://dxkzxrl20d.execute-api.us-east-1.amazonaws.com/dev/install"
      className="flex flex-col items-center w-full"
    >
      <img
        src={installimgae}
        alt="Octavebytes"
        className="mb-4 object-contain"
      />
      <button className="text-xl sm:text-2xl cursor-pointer font-semibold text-gray-800 hover:text-blue-600 text-center">
        Install the app
      </button>
    </a>
  </div>
</div>



  )
}

export default Install
