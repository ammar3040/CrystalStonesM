import React, { useState, useEffect, useRef } from 'react';
import VerificationForm from './VerificationForm';
import "./otp.css";
import SignUpMain from '../SignUpMain'; // ✅ Import SignUpPage component
const SendOtpWithNumber = ({ forceOpen = false, onClose }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [serverOtp, setServerOtp] = useState(null);
  const [showSignupPage, setShowSignupPage] = useState(false); // 🔸 store OTP if needed for testing
  const timerRef = useRef(null);

  useEffect(() => {
     if (forceOpen) {
    setShowPopup(true); // ✅ force open the modal immediately
    return;
  } // skip timer if opened manually

    const userCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('user='));

    if (userCookie) return;

    timerRef.current = setTimeout(() => {
      setShowPopup(true);
    }, 10000);

    return () => clearTimeout(timerRef.current);
  }, [forceOpen]);


 const handleClose = () => {
    setShowPopup(false);
    if (onClose) onClose();
    clearTimeout(timerRef.current);
  };
  const handleSubmitNumber = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      const data = await res.json();

      if (data.success) {
        setShowOtpForm(true);
        setServerOtp(data.otp); // 👈 optional: for dev/testing only
      } else {
        alert("❌ Failed to send OTP");
      }
    } catch (err) {
      alert("❌ Error: " + err.message);
    }
  };

  if (!showPopup) return null;

  return (
   
<>
         {showSignupPage ? (
          <SignUpMain phoneNumber={phoneNumber} /> // ✅ Directly render SignUpPage
        ) :(
        !showOtpForm ? (
           <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-button" onClick={handleClose}>✕</button>
          <form className="number-form" onSubmit={handleSubmitNumber}>
            <h3 className="popup-title">Verify Your Account</h3>
            <p className="popup-subtitle">Please enter your phone number to receive OTP</p>

            <div className="input-group">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter phone number"
                required
              />
            </div>

            <button type="submit" className="verify-button">
              Send OTP
            </button>
          </form>
           </div>
    </div>
        ) : (
           <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-button" onClick={handleClose}>✕</button>
          <VerificationForm
            phoneNumber={phoneNumber}
            onClose={handleClose}
            serverOtp={serverOtp} // 👈 pass OTP to VerificationForm (only during dev)
             onVerified={() => {
    setShowOtpForm(false);         // ✅ Hide OTP form
    setShowSignupPage(true);       // ✅ Show signup page
  }}
          />
          </div>
    </div>
        ))}
     </>
  );
};

export default SendOtpWithNumber;
