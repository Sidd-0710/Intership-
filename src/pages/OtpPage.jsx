import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOTP, getOTP } from "../services/api";
import "./LoginOtp.css";

function OtpPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const mobile = location.state?.mobile || "";
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (otp.join("").length !== 4) {
      setError("Please enter all 4 digits of OTP");
      return;
    }

    setLoading(true);
    
    try {
      const result = await verifyOTP(mobile, otp.join(""));
      
      if (result.success) {
        alert("OTP Verified Successfully!");
        navigate("/");
      } else {
        setError(result.error || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError("");
    setResendLoading(true);
    
    try {
      const result = await getOTP(mobile);
      
      if (result.success) {
        alert("OTP sent successfully!");
        setOtp(["", "", "", ""]);
      } else {
        setError(result.error || "Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Verify OTP</h2>
        <p>Enter the 4-digit code sent to +91 {mobile}</p>
        <form onSubmit={handleSubmit}>
          <div className="otp-boxes">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                disabled={loading}
              />
            ))}
          </div>
          {error && <div className="error-message">{error}</div>}
          <p className="resend-text">
            Didn't get the code? 
            <span 
              onClick={handleResendOTP}
              style={{ cursor: resendLoading ? 'not-allowed' : 'pointer', opacity: resendLoading ? 0.6 : 1 }}
            >
              {resendLoading ? "Sending..." : "Resend OTP"}
            </span>
          </p>
          <button type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
          <button
            type="button"
            className="back-btn"
            onClick={() => navigate("/")}
            disabled={loading}
          >
            Change Mobile Number
          </button>
        </form>
      </div>
    </div>
  );
}

export default OtpPage;
