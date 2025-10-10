import React, {useState} from 'react'

const DynamicForm = ({fields, onSubmit, buttonText = "submit"}) => {
  const initialState = fields.reduce((acc,field)=>{
    acc[field.name] ="";
    return acc;
  }, {})
  const [formData, setFormData] = useState(initialState);
  const [submitMessage, setSubmitMessage] = useState("");

 const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("Field:", name, "Value:", value);
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSubmitMessage("");
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
     try {
      const response = await fetch("https://dxkzxrl20d.execute-api.us-east-1.amazonaws.com/dev/noMatchConfiguration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update setting");
      const data = await response.json();
      console.log("Setting updated:", data);
       setSubmitMessage("Field updated successfully!")
    } catch (err) {
      console.error("Error toggling setting:", err);
    }
   
    if (onSubmit) {
      onSubmit(formData);
    }
    setFormData(initialState);
  };

  return (
    <>
      <div className='rounded-2xl py-4 w-full flex items-center justify-between gap-2'>
        {
          fields.map((field)=>(
            <div key={field.name} className='w-full'>
              <label htmlFor={field.name} className='block text-gray-700 font-medium mb-2'>
                {field.label}
              </label>
              <input
              type={field.type || "text"}
              id={field.name}
              name={field.name}
              autoComplete="off"
              value={formData[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder || `Enter your ${field.label.toLowerCase()}`}
              required={field.required || false}
              className="w-full px-4 py-3 rounded-xl border  border-gray-300 bg-gray-100 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-400 outline-none transition duration-300 ease-in-out"
            />
            </div>
            
          ))
        }
        
        <button
          onClick={handleSubmit}
          className="w-[390px] mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-md transition duration-300 ease-in-out"
        >
          {buttonText}
        </button>
        
      </div>
       {submitMessage && (
              <div
                className={`mt-4 p-3 rounded-xl ${
                  submitMessage.includes("successfully")
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {submitMessage}
              </div>
            )}
    </>
  )
}

export default DynamicForm
