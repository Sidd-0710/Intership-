import React, { useState, useRef } from 'react';
import './LoginFlow.css';
import CarIcon from './car-icon.png'; // <--- Import the new icon here!


// The PhoneInputScreen and OtpVerificationScreen sub-components now accept an `isLoading` prop
// to disable the button during the API call.

// Sub-component for the phone number input screen
const PhoneInputScreen = ({ onSubmit, isLoading }) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (phoneNumber.length === 10) {
      onSubmit(phoneNumber);
    } else {
      alert('Please enter a valid 10-digit mobile number.');
    }
  };

  return (
    <div className="login-card">
      <div className="icon-circle">
        {/* Replace the emoji with the <img> tag for your new icon */}
        <img src={CarIcon} alt="Car" className="icon-image" /> 
      </div>
      <h2>Get Started</h2>
      <p className="subtitle">We'll send a one-time password to your mobile number.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="phone-input-container">
          <span className="country-code">+91</span>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="Your mobile number"
            maxLength="10"
            className="phone-input"
            autoFocus
          />
        </div>
        <button type="submit" className="primary-button" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Request OTP'}
        </button>
      </form>
    </div>
  );
}

const OtpVerificationScreen = ({ phoneNumber, onVerify, onBack, onChangeNumber, isLoading }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef([]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };
  
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length === 4) {
      onVerify(enteredOtp);
    } else {
      alert("Please enter the complete 4-digit OTP.");
    }
  };

  return (
    <div className="login-card">
        <button onClick={onBack} className="back-arrow">&lt;</button>
        <div className="icon-circle">
          <span role="img" aria-label="lock" className="icon-emoji">🔒</span>
        </div>
        <h2>Verify OTP</h2>
        <p className="subtitle">Enter the 4-digit code sent to you at<br/><b>+91 {phoneNumber}</b></p>
        
        <form onSubmit={handleSubmit}>
            <div className="otp-input-container">
            {otp.map((data, index) => (
                <input
                    key={index} type="text" className="otp-input" maxLength="1"
                    value={data}
                    onChange={e => handleChange(e.target, index)}
                    onKeyDown={e => handleKeyDown(e, index)}
                    onFocus={e => e.target.select()}
                    ref={el => (inputRefs.current[index] = el)}
                />
            ))}
            </div>
            <p className="resend-text">Didn't receive the code? <button type="button" className="link-button">Resend OTP</button></p>
            <button type="submit" className="primary-button" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
        </form>
        <button onClick={onChangeNumber} className="link-button change-number">Change Mobile Number</button>
    </div>
  );
};


// Main parent component
const LoginFlow = () => {
  const [screen, setScreen] = useState('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  // 1. Add state for loading indicators
  const [isLoading, setIsLoading] = useState(false);

  // 2. Update the handleRequestOtp function to be async and call your API
   const handleRequestOtp = async (number) => {
    setIsLoading(true);
    try {
      // Construct the URL with the mobile number as a query parameter
      const apiUrl = `https://d3631n9ke34438.cloudfront.net/api/v1/web_end_user/auth/getotpend?mobile_number=${number}`;

      const response = await fetch(apiUrl, {
        method: 'GET', // <-- Changed to GET
        // No headers or body are needed for this GET request
      });

      if (!response.ok) {
        // If the server responds with an error, handle it here
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to request OTP.');
      }

      // If the request is successful:
      console.log('OTP requested successfully!');
      setPhoneNumber(number);
      setScreen('otp');

    } catch (error) {
      console.error('API Error:', error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 3. Update the handleVerifyOtp function as well
  const handleVerifyOtp = async (otp) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://your-api.com/verify-otp', { // <-- ⚠️ REPLACE WITH YOUR API ENDPOINT
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          // ⚠️ Adjust the body to match what your API expects
          body: JSON.stringify({ mobileNumber: phoneNumber, otp: otp }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid OTP. Please try again.');
      }

      const data = await response.json();
      console.log('Verification successful:', data); // e.g., { token: "..." }
      alert(`OTP ${otp} verified successfully!`);
      // On success, you would typically save the auth token and redirect the user
      
    } catch (error) {
        console.error('API Error:', error);
        alert(error.message);
    } finally {
        setIsLoading(false);
    }
  };

  const handleChangeNumber = () => {
      setPhoneNumber('');
      setScreen('phone');
  };

  return (
    <div className="login-container">
      {screen === 'phone' ? (
        <PhoneInputScreen onSubmit={handleRequestOtp} isLoading={isLoading} />
      ) : (
        <OtpVerificationScreen 
            phoneNumber={phoneNumber}
            onVerify={handleVerifyOtp}
            onBack={() => setScreen('phone')}
            onChangeNumber={handleChangeNumber}
            isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default LoginFlow;