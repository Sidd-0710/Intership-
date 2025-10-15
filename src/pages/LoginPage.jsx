import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOTP } from "../services/api";
import "./LoginOtp.css";

function LoginPage() {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (mobile.length !== 10) {
      setError("Please enter a valid 10-digit number");
      return;
    }

    setLoading(true);
    
    try {
      const result = await getOTP(mobile);
      
      if (result.success) {
        navigate("/otp", { state: { mobile } });
      } else {
        setError(result.error || "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <label>Mobile Number</label>
          <input
            type="number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Enter your 10-digit number"
            disabled={loading}
          />
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
