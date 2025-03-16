import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa"; // User icon
import logo from "../assets/man.png"; // Ensure the correct path
import "../styles/Navbar.css"; // Import CSS file

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isAdmin = () => currentUser?.role?.includes("ADMIN");

  return (
    <nav className="navbar">
      <div className="container">
        {/* Logo Section */}
        <Link to="/home" className="logo">
          <img src={logo} alt="Logo" className="logo-img" />
          <span>Auth Demo</span>
        </Link>

        {/* Navigation Links */}
        <div className="nav-links">
          <Link to="/home">Home</Link>

          {currentUser ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              {isAdmin() && <Link to="/admin" className="admin-link">Admin Panel</Link>}
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="register-btn">Register</Link>
            </>
          )}

          {/* User Icon */}
          {currentUser && <FaUserCircle className="user-icon" />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
