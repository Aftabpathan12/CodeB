import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";

const Register = () => {
  const [activeTab, setActiveTab] = useState("user"); // "user" or "admin"
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    passwordHash: "",
    confirmPassword: "",
    role: "USER" // Default role
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");
  const navigate = useNavigate();

  // Switch tab and update role
  const switchTab = (tab) => {
    setActiveTab(tab);
    setFormData({
      ...formData,
      role: tab === "admin" ? "ADMIN" : "USER"
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setVerificationMessage("");

    // Validate passwords match
    if (formData.passwordHash !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Create registration object (excluding confirmPassword)
    const { confirmPassword, ...registrationData } = formData;

    try {
      await register(registrationData);
      // Show verification message instead of immediately navigating
      setVerificationMessage(
        `${activeTab === "admin" ? "Admin" : "User"} registration successful. Please check your email to verify your account.`
      );
      // Clear form data
      setFormData({
        fullName: "",
        email: "",
        passwordHash: "",
        confirmPassword: "",
        role: activeTab === "admin" ? "ADMIN" : "USER"
      });
    } catch (err) {
      setError("Registration failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md fade-in">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
      
      {/* Tab Navigation */}
      <div className="tab-container">
        <button 
          className={`tab ${activeTab === "user" ? "active" : ""}`}
          onClick={() => switchTab("user")}
        >
          User Account
        </button>
        <button 
          className={`tab ${activeTab === "admin" ? "active" : ""}`}
          onClick={() => switchTab("admin")}
        >
          Admin Account
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {verificationMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {verificationMessage}
        </div>
      )}
      
      {!verificationMessage && (
        <form onSubmit={handleSubmit} className={activeTab === "admin" ? "border-t-4 border-purple-500" : "border-t-4 border-blue-500"}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="fullName">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="passwordHash">
              Password
            </label>
            <input
              type="password"
              name="passwordHash"
              id="passwordHash"
              value={formData.passwordHash}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          
          {/* Hidden role field - set by tab selection */}
          <input type="hidden" name="role" value={formData.role} />
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              activeTab === "admin" 
                ? "bg-purple-500 hover:bg-purple-600 text-white" 
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {loading ? "Processing..." : activeTab === "admin" ? "Register as Admin" : "Register as User"}
          </button>
          
          <div className="mt-4 text-center text-sm text-gray-600">
            {activeTab === "admin" ? (
              <p>Registering as an admin may require additional verification</p>
            ) : (
              <p>Create an account to get started</p>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default Register;