import React from "react";

const BloodDroplet = ({ particle }) => (
  <svg
    className="absolute"
    style={{
      left: `${particle.x}%`,
      top: `${particle.y}%`,
      width: `${particle.size}px`,
      height: `${particle.size}px`,
      animation: `float ${particle.duration}s ease-in-out infinite ${particle.delay}s, pulse-size 2s ease-in-out infinite`,
    }}
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M12 3C12 3 8 8 8 12C8 16 12 21 12 21C12 21 16 16 16 12C16 8 12 3 12 3Z"
      fill="#f87171"
      fillOpacity="0.5"
    />
  </svg>
);

export default BloodDroplet;
