// Import axios for making HTTP requests
import axios from 'axios';

// Your API base URL - REPLACE THIS with your actual API
const API_BASE_URL = 'https://d3631n9ke34438.cloudfront.net/api/v1/web_end_user/auth/getotpend?mobile_number=Mobile_Number';

// You can also use environment variables (more secure)
// const API_BASE_URL = process.env.REACT_APP_API_URL;

/**
 * Request OTP for a mobile number
 * @param {string} mobile - The mobile number
 * @returns {Promise} - API response
 */
export const requestOTP = async (mobile) => {
  try {
    // axios.post() sends a POST request
    // First parameter: URL
    // Second parameter: Data to send (body)
    const response = await axios.post(`${API_BASE_URL}/send-otp`, {
      mobile: mobile,
      countryCode: '+91'
    });
    
    // If successful, return the data
    return response.data;
    
  } catch (error) {
    // If error occurs, throw a user-friendly message
    // error.response?.data = data from server (if available)
    // The ? is optional chaining (won't crash if undefined)
    throw error.response?.data?.message || 'Failed to send OTP. Please try again.';
  }
};

/**
 * Verify OTP
 * @param {string} mobile - The mobile number
 * @param {string} otp - The OTP code
 * @returns {Promise} - API response with token
 */
export const verifyOTP = async (mobile, otp) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/verify-otp`, {
      mobile: mobile,
      otp: otp
    });
    
    // Return the response (usually contains token)
    return response.data;
    
  } catch (error) {
    throw error.response?.data?.message || 'Invalid OTP. Please try again.';
  }
};

/**
 * Resend OTP
 * @param {string} mobile - The mobile number
 * @returns {Promise} - API response
 */
export const resendOTP = async (mobile) => {
  // Reuse the requestOTP function
  return await requestOTP(mobile);
};