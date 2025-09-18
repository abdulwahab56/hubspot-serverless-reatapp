import React from 'react'
import installimgae from "../assets/OB-Cloud-2-1.png"

const Install = () => {
  return (
   <div className="h-screen w-full bg-white">
  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
    <a
      href="https://dxkzxrl20d.execute-api.us-east-1.amazonaws.com/dev/install"
      className="flex flex-col items-center p-6 bg-white shadow-lg hover:shadow-xl transition duration-300 w-full"
    >
      <img
        src={installimgae}
        alt="Octavebytes"
        className="w-48 sm:w-40 h-auto mb-4"
      />
      <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 hover:text-blue-600 text-center">
        Install the app
      </h3>
    </a>
  </div>
</div>


  )
}

export default Install
