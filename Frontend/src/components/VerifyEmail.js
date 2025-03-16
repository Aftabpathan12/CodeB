import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyEmail } from "../services/authService";

const VerifyEmail = () => {
  const [verificationStatus, setVerificationStatus] = useState({
    success: false,
    message: "Verifying your email..."
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    if (!token) {
      setVerificationStatus({
        success: false,
        message: "Invalid verification link."
      });
      return;
    }

    const performEmailVerification = async () => {
      try {
        await verifyEmail(token);
        setVerificationStatus({
          success: true,
          message: "Email verified successfully! Redirecting to login..."
        });

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (error) {
        setVerificationStatus({
          success: false,
          message: error.message || "Email verification failed."
        });
      }
    };

    performEmailVerification();
  }, [location, navigate]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-bold mb-6">
        {verificationStatus.success ? "Email Verified" : "Verification"}
      </h2>
      <div 
        className={`p-4 rounded ${
          verificationStatus.success 
            ? "bg-green-100 text-green-700" 
            : "bg-red-100 text-red-700"
        }`}
      >
        {verificationStatus.message}
      </div>
      {!verificationStatus.success && (
        <button
          onClick={() => navigate("/register")}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Back to Registration
        </button>
      )}
    </div>
  );
};

export default VerifyEmail;