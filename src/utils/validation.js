// This file contains all our validation logic
// We separate it so we can reuse it everywhere

/**
 * Validates a mobile number
 * @param {string} mobile - The mobile number to validate
 * @returns {string|null} - Error message or null if valid
 */
export const validateMobile = (mobile) => {
  // Check if mobile is empty
  if (!mobile) {
    return 'Please enter your mobile number';
  }
  
  // Check if mobile contains only digits (0-9)
  // /^\d+$/ is a Regular Expression (regex)
  // ^ = start, \d = digit, + = one or more, $ = end
  if (!/^\d+$/.test(mobile)) {
    return 'Mobile number must contain only digits';
  }
  
  // Check if mobile has exactly 10 digits
  if (mobile.length !== 10) {
    return 'Mobile number must be exactly 10 digits';
  }
  
  // Check if mobile starts with 6, 7, 8, or 9 (Indian numbers)
  // [6-9] means any digit from 6 to 9
  if (!/^[6-9]/.test(mobile)) {
    return 'Please enter a valid Indian mobile number';
  }
  
  // If all checks pass, return null (no error)
  return null;
};

/**
 * Validates an OTP
 * @param {string} otp - The OTP to validate
 * @returns {string|null} - Error message or null if valid
 */
export const validateOTP = (otp) => {
  // Check if OTP is empty
  if (!otp) {
    return 'Please enter the OTP';
  }
  
  // Check if OTP contains only digits
  if (!/^\d+$/.test(otp)) {
    return 'OTP must contain only numbers';
  }
  
  // Check if OTP has exactly 4 digits
  if (otp.length !== 4) {
    return 'OTP must be exactly 4 digits';
  }
  
  // All checks passed
  return null;
};

/**
 * Formats mobile number for display
 * @param {string} mobile - Mobile number
 * @returns {string} - Formatted as "+91 12345 67890"
 */
export const formatMobile = (mobile) => {
  // If mobile is 10 digits, format it nicely
  if (mobile.length === 10) {
    // slice(0, 5) = first 5 digits
    // slice(5) = remaining digits
    return `+91 ${mobile.slice(0, 5)} ${mobile.slice(5)}`;
  }
  return mobile;
};