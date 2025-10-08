import React from 'react';

/**
 * A custom SVG component that draws the car icon.
 * It's defined separately for clarity but used within the main component.
 */
const CarIconSVG = ({ size = 60, color = '#B91C1C' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64" // A 64x64 canvas for drawing
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill={color}>
      {/* T-Shape representing the road/parking spot */}
      <path d="M24 48H40V52H24V48Z" />
      <path d="M30 38H34V48H30V38Z" />

      {/* Main car body */}
      <path
        d="M12 24C12 22.8954 12.8954 22 14 22H50C51.1046 22 52 22.8954 52 24V34H12V24Z"
      />
      {/* Car roof */}
      <path
        d="M18 12C18 10.8954 18.8954 10 20 10H44C45.1046 10 46 10.8954 46 12V22H18V12Z"
      />
    </g>
  </svg>
);


/**
 * The main component that renders the icon with its circular background.
 */
const VehicleStatusIcon = () => {
  // Styles for the circular container
  const iconContainerStyle = {
    width: '180px',
    height: '180px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // Inner, darker circle color (semi-transparent)
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    // Outer, lighter halo effect created with box-shadow
    boxShadow: '0 0 0 20px rgba(239, 68, 68, 0.1)',
  };

  return (
    <div style={iconContainerStyle}>
      <CarIconSVG size={64} color="#dc2626" />
    </div>
  );
};

export default VehicleStatusIcon;