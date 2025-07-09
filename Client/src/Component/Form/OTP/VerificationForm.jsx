import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


const VerificationForm = ({ phoneNumber, onClose, onVerified }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate(); // ✅ React Router navigation

  const handleChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          phone: phoneNumber,
          otp: fullOtp,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("✅ OTP verified successfully!");

        // ✅ Redirect new user to signup
        if (data.isNewUser) {
          navigate("/signup", { state: { phone: phoneNumber } });
        } else {
          if (onVerified) onVerified(data.user);
        }
      } else {
        toast.error("❌ Invalid number or expired OTP");
      }
    } catch (err) {
     toast.error("❌ Verification failed: " + (data.message || "Unexpected error"));

    }
  };

  return (
    <form className="otp-form" onSubmit={handleVerifyOtp}>
      <h3 className="popup-title">Enter OTP</h3>
      <p className="popup-subtitle">We've sent a code to {phoneNumber}</p>

      <div className="otp-inputs">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => (inputRefs.current[index] = el)}
            className="otp-input"
            required
          />
        ))}
      </div>

      <button type="submit" className="verify-button">
        Verify OTP
      </button>
    </form>
  );
};


export default VerificationForm;
