import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './index.css';

// --------------------------------------------------
// localStorage helpers & auth utilities
// --------------------------------------------------
const STORAGE_KEY = 'loggedInUser';

const saveUserToStorage = (userObj) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userObj));
    console.log('Saved user to localStorage:', userObj);
    // if there's a token, set axios default Authorization header
    if (userObj?.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${userObj.token}`;
    }
  } catch (e) {
    console.error('Failed to save user to localStorage', e);
  }
};

const getUserFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (e) {
    console.error('Failed to parse user from localStorage', e);
    return null;
  }
};

const removeUserFromStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    delete axios.defaults.headers.common['Authorization'];
    console.log('Removed user from localStorage');
  } catch (e) {
    console.error('Failed to remove user from localStorage', e);
  }
};

// --------------------------------------------------
// --- SVG Icon Components ---
// --------------------------------------------------
const VehicleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" className="w-16 h-16 text-red-500">
    <path
      fill="currentColor"
      d="M19 20H5v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V11l2.48-5.788A2 2 0 0 1 6.32 4h11.36a2 2 0 0 1 1.838 1.212L22 11v10a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1zm1-7H4v5h16zM4.176 11h15.648l-2.143-5H6.32zM6.5 17a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3m11 0a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3"
    ></path>
  </svg>
);


const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 text-red-500">
    <rect x="7" y="10" width="10" height="8" rx="2" ry="2"></rect>
    <path d="M9 10V7a3 3 0 0 1 6 0v3"></path>
    <path d="M5 20V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z"></path>
  </svg>
);

const BackArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </svg>
);

// --- Loading spinner ---
const LoadingSpinner = () => (
  <div className="absolute inset-0 bg-white bg-opacity-75 flex justify-center items-center rounded-2xl z-10">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
  </div>
);

// --------------------------------------------------
// --- Screen Components ---
// --------------------------------------------------
const GetStartedScreen = ({ setScreen, phoneNumber, setPhoneNumber }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setPhoneNumber(value);
      setError(null);
    }
  };

  const handleRequestOtp = async () => {
    const isValidPhoneNumber = /^[6-9]\d{9}$/.test(phoneNumber);
    if (!isValidPhoneNumber) {
      setError("Please enter a valid mobile number starting with 6, 7, 8, or 9.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const url = `https://d3631n9ke34438.cloudfront.net/api/v1/web_end_user/auth/getotpend?mobile_number=${phoneNumber}`;
      const response =  await axios.get(url);
      if (response.data?.success) {
        setScreen('verifyOtp');
        console.log('OTP Request Message:', response.data.data.otp);
      }
      console.log('OTP Request Response:', response);
      
    //   setScreen('verifyOtp');

      
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to request OTP.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-sm mx-auto text-center p-8 bg-white rounded-2xl shadow-xl transition-all">
      {isLoading && <LoadingSpinner />}
      <div className="flex justify-center mb-8">
        <div className="bg-red-200 rounded-full p-6">
          <VehicleIcon />
        </div>
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Get Started</h1>
      <p className="text-gray-500 mb-8">We'll send a one-time password to your mobile number.</p>
      <div className="flex items-center border border-gray-300 rounded-lg p-3 w-full mb-6 focus-within:border-red-600 focus-within:ring-1 focus-within:ring-red-600 transition-all">
        <span className="text-gray-500 px-3 border-r border-gray-300">+91</span>
        <input
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          placeholder="Your mobile number"
          className="flex-1 pl-4 bg-transparent outline-none text-gray-800 tracking-wider"
        />
      </div>
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      <button
        onClick={handleRequestOtp}
        className="w-full bg-red-600 text-white font-bold py-3.5 rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 disabled:bg-red-300 disabled:cursor-not-allowed"
        disabled={phoneNumber.length !== 10 || isLoading}
      >
        Request OTP
      </button>
    </div>
  );
};

const VerifyOtpScreen = ({ setScreen, phoneNumber, onVerified }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRefs = useRef([...Array(4)].map(() => React.createRef()));

  useEffect(() => {
    inputRefs.current[0].current.focus();
  }, []);

  const handleOtpChange = (index, value) => {
    if (error) setError(null);
    const newOtp = [...otp];
    newOtp[index] = value.replace(/\D/g, '');
    setOtp(newOtp);
    if (newOtp[index] && index < 3) {
      inputRefs.current[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].current.focus();
    }
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    setError(null);
    const otpCode = otp.join('');
    const workshopId = 4317;

    try {
      const url = `https://d3631n9ke34438.cloudfront.net/api/v1/web_end_user/auth/verify_otp_end?mobile_number=${phoneNumber}&otp=${otpCode}&workshop_id=${workshopId}`;
      const response = await axios.post(url, {});
      console.log('OTP Verification Response:', response);
        if (response.data?.success) {
            const data = response.data.data;
            localStorage.setItem('user',JSON.stringify(data));
             setScreen('dashboard');
        }

        
      
    } catch (err) {
      let displayError = 'An unknown error occurred. Please try again.';
      if (err.response?.data?.message) {
        displayError = err.response.data.message;
      } else if (typeof err.response?.data === 'string') {
        displayError = err.response.data;
      } else if (err.message) {
        displayError = err.message;
      }
      setError(displayError);
    } finally {
      setIsLoading(false);
    }
  };

  const isOtpComplete = otp.every(digit => digit.length === 1);

  return (
    <div className="relative w-full max-w-sm mx-auto text-center p-8 bg-white rounded-2xl shadow-xl transition-all">
      {isLoading && <LoadingSpinner />}
      <button onClick={() => setScreen('getStarted')} className="absolute top-6 left-6 text-gray-500 hover:text-gray-800">
        <BackArrowIcon />
      </button>
      <div className="flex justify-center mb-6 mt-4">
        <div className="bg-red-200 rounded-full p-6">
          <LockIcon />
        </div>
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Verify OTP</h1>
      <p className="text-gray-500 mb-8 leading-relaxed">
        Enter the 4-digit code sent to you at
        <br />
        <span className="font-semibold text-gray-700">+91 {phoneNumber}</span>
      </p>
      <div className="flex justify-center space-x-3 mb-6">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={inputRefs.current[index]}
            type="tel"
            maxLength="1"
            value={digit}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={`w-14 h-14 text-center border rounded-lg text-2xl font-bold outline-none transition-colors ${
              error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-600 focus:border-red-600'
            }`}
          />
        ))}
      </div>
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      <p className="text-sm text-gray-500 mb-8">
        Didn't receive the code?{' '}
        <button className="font-semibold text-red-600 hover:underline">Resend OTP</button>
      </p>
      <button
        onClick={handleVerifyOtp}
        className="w-full bg-red-600 text-white font-bold py-3.5 rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 disabled:bg-red-300 disabled:cursor-not-allowed"
        disabled={!isOtpComplete || isLoading}
      >
        Verify OTP
      </button>
      <button onClick={() => setScreen('getStarted')} className="mt-4 text-sm font-semibold text-gray-500 hover:text-gray-600">
        Change Mobile Number
      </button>
    </div>
  );
};

const DashboardScreen = ({ phoneNumber, setScreen, setPhoneNumber }) => {

  const handleLogout = () => {
    // Clear from localStorage on logout
    removeUserFromStorage();

    setPhoneNumber(''); // Clear the phone number from state
    setScreen('getStarted'); // Go back to the login screen
  };

  return (
    <div className="w-full max-w-md mx-auto text-center p-8 bg-white rounded-2xl shadow-xl">
      <div className="flex justify-center mb-6">
        <div className="bg-green-100 rounded-full p-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 text-green-600"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        </div>
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Login Successful!</h1>
      <p className="text-gray-500 mb-8">
        Welcome! Logged in with <span className="font-medium text-gray-700">+91 {phoneNumber}</span>.
      </p>
      <button
        onClick={handleLogout}
        className="w-full bg-red-600 text-white font-bold py-3.5 rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
      >
        Logout
      </button>
    </div>
  );
};

// --------------------------------------------------
// --- Main App Component ---
// --------------------------------------------------
export default function App() {
  // Start with a 'loading' state to check localStorage
  const [screen, setScreen] = useState('loading');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Check localStorage on initial app load
  useEffect(() => {
    const saved = getUserFromStorage();
    if (saved) {
      if (saved.phone) setPhoneNumber(saved.phone);
      // If token exists, ensure axios has the header
      if (saved.token) axios.defaults.headers.common['Authorization'] = `Bearer ${saved.token}`;
      console.log('Loaded user from storage:', saved);
      setScreen('dashboard');
    } else {
      setScreen('getStarted');
    }
  }, []);

  // onVerified callback to receive user object from VerifyOtpScreen
  const handleVerified = (userObj) => {
    if (userObj?.phone) setPhoneNumber(userObj.phone);
    // axios header already set in saveUserToStorage
  };

  return (
    <main className="bg-gray-50 min-h-screen flex items-center justify-center p-4 font-sans">
      {/* Show a loading indicator while checking storage */}
      {screen === 'loading' && (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500"></div>
        </div>
      )}

      {screen === 'getStarted' && (
        <GetStartedScreen
          setScreen={setScreen}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
        />
      )}
      {screen === 'verifyOtp' && (
        <VerifyOtpScreen
          setScreen={setScreen}
          phoneNumber={phoneNumber}
          onVerified={handleVerified}
        />
      )}
      {screen === 'dashboard' && (
        <DashboardScreen 
          phoneNumber={phoneNumber} 
          setScreen={setScreen} 
          setPhoneNumber={setPhoneNumber} 
        />
      )}
    </main>
  );
}
