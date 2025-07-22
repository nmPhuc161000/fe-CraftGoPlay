import React from "react";
import PropTypes from "prop-types";

const LoadingSpinner = ({ 
  message = "Đang tải...", 
  size = "medium",
  color = "primary",
  className = ""
}) => {
  const sizeClasses = {
    small: "h-6 w-6 border-t-2 border-b-2",
    medium: "h-8 w-8 border-t-2 border-b-2",
    large: "h-12 w-12 border-t-3 border-b-3"
  };

  const colorClasses = {
    primary: "border-[#5e3a1e]",
    secondary: "border-gray-600",
    white: "border-white",
    danger: "border-red-500",
    success: "border-green-500"
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}
      />
      {message && (
        <p className={`mt-2 ${
          color === "white" ? "text-white" : "text-gray-600"
        }`}>
          {message}
        </p>
      )}
    </div>
  );
};

LoadingSpinner.propTypes = {
  message: PropTypes.string,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  color: PropTypes.oneOf(["primary", "secondary", "white", "danger", "success"]),
  className: PropTypes.string
};

export default LoadingSpinner;