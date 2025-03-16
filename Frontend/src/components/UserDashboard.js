// UserDashboard.js - Updated to use real user data
import React, { useState, useEffect, useContext } from "react";
import { authHeader, API_URL } from "../services/authService";
import { AuthContext } from "../context/AuthContext";

const UserDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Try to fetch from API
        const response = await fetch(`${API_URL}/user/profile`, {
          headers: {
            ...authHeader(),
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err.message);
        // Use data from auth context as fallback
        if (currentUser) {
          setUserData({
            email: currentUser.email,
            role: currentUser.role,
            fullName: "User"  // We don't have this in the context
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">User Dashboard</h2>
      {error && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          {error} (Using available user data)
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Profile Information</h3>
          <p>
            <strong>Email:</strong> {userData?.email}
          </p>
          <p>
            <strong>Role:</strong> {userData?.role?.replace("ROLE_", "")}
          </p>
          {userData?.fullName && (
            <p>
              <strong>Name:</strong> {userData.fullName}
            </p>
          )}
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Account Status</h3>
          <p>
            <strong>Status:</strong> Active
          </p>
          <p>
            <strong>Account Type:</strong> {userData?.role?.includes("ADMIN") ? "Administrator" : "Regular User"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
