import React, { useState } from "react";
import axios from "axios";
import { useUser } from "../context/userContext";

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    bloodGroup: "",
    contact: "",
    email: "",
    password: "",
    emergencyName: "",
    emergencyRelation: "",
    emergencyPhone: "",
  });

  const {signin} = useUser();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // console.log("formdata : ",formData);
      
      const url = isSignUp ? "/api/signup" : signin(formData);
    } catch (err) {
      alert("Error: " + err.response.data.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">{isSignUp ? "Sign Up" : "Sign In"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <input type="text" name="name" placeholder="Name" onChange={handleChange} className="w-full p-2 border rounded" required />
              <input type="number" name="age" placeholder="Age" onChange={handleChange} className="w-full p-2 border rounded" required />
              <input type="text" name="gender" placeholder="Gender" onChange={handleChange} className="w-full p-2 border rounded" required />
              <input type="text" name="bloodGroup" placeholder="Blood Group" onChange={handleChange} className="w-full p-2 border rounded" required />
              <input type="text" name="contact" placeholder="Contact" onChange={handleChange} className="w-full p-2 border rounded" required />
              <input type="text" name="emergencyName" placeholder="Emergency Contact Name" onChange={handleChange} className="w-full p-2 border rounded" />
              <input type="text" name="emergencyRelation" placeholder="Relation" onChange={handleChange} className="w-full p-2 border rounded" />
              <input type="text" name="emergencyPhone" placeholder="Emergency Phone" onChange={handleChange} className="w-full p-2 border rounded" />
            </>
          )}
          <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border rounded" required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full p-2 border rounded" required />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">{isSignUp ? "Sign Up" : "Sign In"}</button>
        </form>
        <p className="text-center mt-4">
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <span onClick={() => setIsSignUp(!isSignUp)} className="text-blue-500 cursor-pointer">
            {isSignUp ? "Sign In" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
