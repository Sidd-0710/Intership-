import React, { useState, useEffect } from "react";
import "./index.css";

function App() {
  const [step, setStep] = useState("login");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setStep("home");
      const parsed = JSON.parse(user);
      setMobile(parsed.mobile);
    }
  }, []);

  // ✅ Send OTP API
  const handleGetOtp = async () => {
    setError("");
    if (mobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (mobile !== "9028610795") {
      setError("Invalid number. Please use a registered number.");
      return;
    }

    setLoading(true);
    try {
      await fetch(
        `https://d3631n9ke34438.cloudfront.net/api/v1/web_end_user/auth/getotpend?mobile_number=${mobile}`
      );
      setStep("otp");
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Verify OTP API
  const handleVerifyOtp = async () => {
    setError("");
    const otpCode = otp.join("");

    if (otpCode.length !== 4) {
      setError("Please enter a 4-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      // Always treat 1234 as valid OTP
      if (mobile === "9028610795" && otpCode === "1234") {
        await fetch(
          `https://d3631n9ke34438.cloudfront.net/api/v1/web_end_user/auth/verify_otp_end?mobile_number=${mobile}&otp=${otpCode}&workshop_id=4317`,
          { method: "POST" }
        );

        localStorage.setItem("user", JSON.stringify({ mobile }));
        setStep("home");
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("Invalid OTP or verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 3) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setStep("login");
    setMobile("");
    setOtp(["", "", "", ""]);
  };

  return (
    <div className="container">
      {step === "login" && (
        <div className="card">
          <h2>Login</h2>
          <p>Enter your mobile number to receive OTP</p>
          <input
            type="text"
            maxLength="10"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Enter Mobile Number"
          />
          {error && <div className="error">{error}</div>}
          <button onClick={handleGetOtp} disabled={loading}>
            {loading ? "Sending..." : "Get OTP"}
          </button>
        </div>
      )}

      {step === "otp" && (
        <div className="card">
          <h2>Verify OTP</h2>
          <p>
            Enter the 4-digit code sent to <b>+91 {mobile}</b>
          </p>
          <div className="otp-inputs">
            {otp.map((d, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                maxLength="1"
                value={d}
                onChange={(e) => handleOtpChange(e.target.value, i)}
              />
            ))}
          </div>
          {error && <div className="error">{error}</div>}
          <p className="resend">
            Didn’t get the code? <span onClick={handleGetOtp}>Resend OTP</span>
          </p>
          <button onClick={handleVerifyOtp} disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
          <p className="change" onClick={() => setStep("login")}>
            Change Mobile Number
          </p>
        </div>
      )}

      {step === "home" && (
        <div className="card success">
          <h2>Welcome 🎉</h2>
          <p>You are logged in with +91 {mobile}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default App;
