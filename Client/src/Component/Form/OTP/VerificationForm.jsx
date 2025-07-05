import React, { useState, useRef } from 'react';

const VerificationForm = ({ phoneNumber, onClose, onVerified }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phoneNumber,
          otp: fullOtp,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ OTP verified successfully!");
        if (onVerified) onVerified();
      } else {
        alert("❌ Invalid or expired OTP");
      }
    } catch (err) {
      alert("❌ Verification failed: " + err.message);
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
