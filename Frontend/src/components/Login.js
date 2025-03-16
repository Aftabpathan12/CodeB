import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
// import "../styles/Auth.css"; // Import CSS for styling

const Login = () => {
  const [activeTab, setActiveTab] = useState("user"); // "user" or "admin"
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(AuthContext);

  const switchTab = (tab) => {
    setActiveTab(tab);
    setError(""); // Clear any errors when switching tabs
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

    try {
      const data = await login(formData);
      const userRole = data.role.replace("ROLE_", "");
      const isAdmin = userRole === "ADMIN";

      if ((activeTab === "admin" && !isAdmin) || (activeTab === "user" && isAdmin)) {
        setError(`You're trying to login as ${activeTab}, but your account is ${isAdmin ? "an admin" : "a regular user"}`);
        setLoading(false);
        return;
      }

      setCurrentUser({ token: data.token, role: data.role, email: data.email });

      navigate(isAdmin ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Sign In</h2>

        {/* Tab Navigation */}
        <div className="tab-container">
          <button className={`tab ${activeTab === "user" ? "active" : ""}`} onClick={() => switchTab("user")}>
            User Login
          </button>
          <button className={`tab ${activeTab === "admin" ? "active" : ""}`} onClick={() => switchTab("admin")}>
            Admin Login
          </button>
        </div>

        {/* Error Message */}
        {error && <div className="error-message">{error}</div>}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : activeTab === "admin" ? "Login as Admin" : "Login as User"}
          </button>
        </form>

        <div className="mt-4 text-sm">
       <Link to="/forgot-password" style={{ color: "#1877F2" }}>
          Forgot Password?
       </Link>
        </div>

        <div className="mt-2 text-sm">
          Don't have an account?{" "}
          <Link to="/register" style={{color:"#1877F2 " }}>
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
