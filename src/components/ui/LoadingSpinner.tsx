import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <svg
        className="animate-spin h-8 w-8 text-primary-500"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle className="text-gray-200 opacity-50" cx="12" cy="12" r="10" strokeWidth="4" fill="none" />
        <circle
          cx="12"
          cy="12"
          r="10"
          strokeWidth="4"
          fill="none"
          strokeDasharray="31.4"
          strokeDashoffset="15.7"
          className="stroke-primary-500"
        />
      </svg>
    </div>
  );
};

export default LoadingSpinner;
