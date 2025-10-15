const API_BASE_URL = 'https://d3631n9ke34438.cloudfront.net/api/v1/web_end_user/auth';

// Get OTP for mobile number
export const getOTP = async (mobileNumber) => {
  try {
    const response = await fetch(`${API_BASE_URL}/getotpend?mobile_number=${mobileNumber}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      // Check if response has content
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          const data = await response.json();
          return { success: true, data };
        } catch (jsonError) {
          return { success: true, data: {} };
        }
      } else {
        // Response is not JSON, treat as success
        return { success: true, data: {} };
      }
    } else {
      // Handle error response
      const contentType = response.headers.get('content-type');
      let errorMessage;
      
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || 'Failed to send OTP';
        } catch (jsonError) {
          errorMessage = `Failed to send OTP (Status: ${response.status})`;
        }
      } else {
        try {
          const textError = await response.text();
          errorMessage = textError || `Failed to send OTP (Status: ${response.status})`;
        } catch (textError) {
          errorMessage = `Failed to send OTP (Status: ${response.status})`;
        }
      }
      
      return { success: false, error: errorMessage };
    }
  } catch (error) {
    return { success: false, error: 'Network error. Please try again.' };
  }
};

// Verify OTP
export const verifyOTP = async (mobileNumber, otp, workshopId = '4317') => {
  try {
    const response = await fetch(`${API_BASE_URL}/verify_otp_end?mobile_number=${mobileNumber}&otp=${otp}&workshop_id=${workshopId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      // Check if response has content
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          const data = await response.json();
          return { success: true, data };
        } catch (jsonError) {
          return { success: true, data: {} };
        }
      } else {
        // Response is not JSON, treat as success
        return { success: true, data: {} };
      }
    } else {
      // Handle error response
      const contentType = response.headers.get('content-type');
      let errorMessage;
      
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || 'Invalid OTP';
        } catch (jsonError) {
          errorMessage = `Invalid OTP (Status: ${response.status})`;
        }
      } else {
        try {
          const textError = await response.text();
          errorMessage = textError || `Invalid OTP (Status: ${response.status})`;
        } catch (textError) {
          errorMessage = `Invalid OTP (Status: ${response.status})`;
        }
      }
      
      return { success: false, error: errorMessage };
    }
  } catch (error) {
    return { success: false, error: 'Network error. Please try again.' };
  }
};
