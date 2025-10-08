// Import React and hooks
import React, { useState } from 'react';

// Import our validation function
import { validateMobile } from '../utils/validation';

// Import our API function
import { requestOTP } from '../services/api';

// Import icon
import { Train } from 'lucide-react';

/**
 * GetStarted Component - First screen where user enters mobile
 * @param {Function} onSuccess - Called when OTP is sent successfully
 */
export default function GetStarted({ onSuccess }) {
  // STATE MANAGEMENT
  // useState creates a reactive variable
  // When it changes, component re-renders
  
  // Mobile number state
  const [mobile, setMobile] = useState('');
  // mobile = current value
  // setMobile = function to update it
  // '' = initial value (empty string)
  
  // Error message state
  const [error, setError] = useState('');
  
  // Loading state (true when API is calling)
  const [loading, setLoading] = useState(false);

  /**
   * Handles mobile number input changes
   * @param {Event} e - The input event
   */
  const handleMobileChange = (e) => {
    // Get the value from input
    let value = e.target.value;
    
    // Remove any non-digit characters
    // /\D/g means "all non-digits globally"
    value = value.replace(/\D/g, '');
    
    // Limit to 10 digits
    if (value.length <= 10) {
      setMobile(value);  // Update mobile state
      setError('');      // Clear any errors
    }
  };

  /**
   * Handles form submission (Request OTP button click)
   */
  const handleSubmit = async () => {
    // STEP 1: Validate the mobile number
    const validationError = validateMobile(mobile);
    
    // If validation failed, show error and stop
    if (validationError) {
      setError(validationError);
      return; // Stop execution
    }

    // STEP 2: Call API to send OTP
    setLoading(true);  // Show loading state
    
    try {
      // Wait for API call to complete
      const response = await requestOTP(mobile);
      
      console.log('OTP sent successfully:', response);
      
      // Call the parent's onSuccess function
      // This will move to the next screen
      onSuccess(mobile);
      
    } catch (err) {
      // If API call failed, show error
      setError(err);
      
    } finally {
      // This runs whether success or error
      setLoading(false);  // Hide loading state
    }
  };

  /**
   * Handles Enter key press
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // RENDER - What appears on screen
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 
        min-h-screen = minimum height is full screen
        bg-gray-50 = light gray background
        flex = use flexbox layout
        flex-col = stack children vertically
      */}
      
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/*
          flex-1 = take up remaining space
          items-center = center horizontally
          justify-center = center vertically
          px-6 = padding left/right 24px
          py-12 = padding top/bottom 48px
        */}
        
        <div className="w-full max-w-md">
          {/* max-w-md = maximum width 448px (medium) */}
          
          {/* ICON SECTION */}
          <div className="flex justify-center mb-8">
            {/* mb-8 = margin-bottom 32px */}
            
            <div className="relative">
              {/* Outer circle - light pink */}
              <div className="w-40 h-40 rounded-full bg-red-100 flex items-center justify-center">
                {/*
                  w-40 = width 160px
                  h-40 = height 160px
                  rounded-full = perfect circle
                  bg-red-100 = light red background
                */}
                
                {/* Inner circle - medium pink */}
                <div className="w-32 h-32 rounded-full bg-red-200 flex items-center justify-center">
                  {/* Train icon */}
                  <Train className="w-16 h-16 text-red-600" strokeWidth={2.5} />
                  {/*
                    w-16 = width 64px
                    text-red-600 = red color
                    strokeWidth = thickness of icon lines
                  */}
                </div>
              </div>
            </div>
          </div>

          {/* TITLE AND DESCRIPTION */}
          <div className="text-center mb-12">
            {/* text-center = center align text */}
            
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {/*
                text-3xl = font size 30px
                font-bold = weight 700
                text-gray-900 = dark gray (almost black)
                mb-3 = margin-bottom 12px
              */}
              Get Started
            </h1>
            
            <p className="text-gray-600 text-base">
              {/*
                text-gray-600 = medium gray
                text-base = font size 16px
              */}
              We'll send a one-time password to your<br />mobile number.
            </p>
          </div>

          {/* MOBILE INPUT */}
          <div className="mb-6">
            <div className="relative">
              {/* relative = position relative (for absolute children) */}
              
              <input
                type="tel"
                {/* type="tel" = shows number keyboard on mobile */}
                
                value={mobile}
                {/* Controlled input - value comes from state */}
                
                onChange={handleMobileChange}
                {/* When user types, call this function */}
                
                onKeyPress={handleKeyPress}
                {/* When user presses a key, call this */}
                
                placeholder="Your mobile number"
                {/* Gray text shown when empty */}
                
                maxLength="10"
                {/* HTML limit (backup for our JS limit) */}
                
                className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors"
                /*
                  w-full = width 100%
                  px-6 = padding left/right 24px
                  py-4 = padding top/bottom 16px
                  bg-white = white background
                  border-2 = 2px border
                  border-gray-200 = light gray border
                  rounded-xl = border-radius 12px
                  text-gray-900 = dark text
                  text-base = 16px font
                  placeholder-gray-400 = gray placeholder
                  focus:outline-none = remove default outline
                  focus:border-red-500 = red border when focused
                  transition-colors = smooth color change
                */
                
                style={{ paddingLeft: '4rem' }}
                {/* Extra left padding for +91 prefix */}
              />
              
              {/* +91 PREFIX */}
              <span className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-600 text-base font-medium">
                {/*
                  absolute = position absolute
                  left-6 = 24px from left
                  top-1/2 = 50% from top
                  transform -translate-y-1/2 = move up 50% of its height (centers it)
                  text-gray-600 = medium gray
                  font-medium = weight 500
                */}
                +91
              </span>
            </div>
            
            {/* ERROR MESSAGE */}
            {error && (
              /* 
                Conditional rendering
                If error exists, show this paragraph
                && = logical AND (both must be true)
              */
              <p className="mt-2 text-sm text-red-600 px-2">
                {/*
                  mt-2 = margin-top 8px
                  text-sm = font size 14px
                  text-red-600 = red color
                  px-2 = padding left/right 8px
                */}
                {error}
                {/* Display the error message */}
              </p>
            )}
          </div>

          {/* REQUEST OTP BUTTON */}
          <button
            onClick={handleSubmit}
            {/* When clicked, call handleSubmit */}
            
            disabled={loading}
            {/* Disable button when loading */}
            
            className="w-full bg-red-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-red-700 active:bg-red-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-lg"
            /*
              bg-red-600 = red background
              text-white = white text
              py-4 = padding top/bottom 16px
              rounded-xl = border-radius 12px
              font-semibold = weight 600
              text-lg = font size 18px
              hover:bg-red-700 = darker on hover
              active:bg-red-800 = even darker when clicked
              disabled:bg-gray-400 = gray when disabled
              disabled:cursor-not-allowed = show "not allowed" cursor
              transition-colors = smooth transitions
              shadow-lg = drop shadow
            */}
          >
            {loading ? 'Sending OTP...' : 'Request OTP'}
            {/* 
              Ternary operator: condition ? ifTrue : ifFalse
              Show different text based on loading state
            */}
          </button>
        </div>
      </div>
    </div>
  );
}