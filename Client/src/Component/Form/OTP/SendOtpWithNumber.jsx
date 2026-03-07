import React, { useState, useEffect, useRef } from 'react';
import VerificationForm from './VerificationForm';
import './otp.css';
import SignUpMain from '../SignUpMain';
import toast from 'react-hot-toast';
import { API_SEND_OTP } from '../../../lib/apiConstants';

const SendOtpWithNumber = ({ forceOpen = false, onClose }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [serverOtp, setServerOtp] = useState(null);
  const [showSignupPage, setShowSignupPage] = useState(false);
  const [verifiedUser, setVerifiedUser] = useState(null); // ✅ Store verified user
  const timerRef = useRef(null);

  useEffect(() => {
    if (forceOpen) {
      setShowPopup(true);
      return;
    }

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
      const res = await fetch(API_SEND_OTP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      const data = await res.json();

      if (data.success) {
        setShowOtpForm(true);
        setServerOtp(data.otp); // only for dev/debug
      } else {
        toast.error(' Failed to send OTP');
      }
    } catch (err) {
      toast.error('❌ Error: ' + err.message);
    }
  };

  // 🔄 Conditional rendering
  if (!showPopup) return null;

  return (
    <>
      {showSignupPage ? (
        <SignUpMain phoneNumber={phoneNumber} user={verifiedUser} />
      ) : !showOtpForm ? (
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
              serverOtp={serverOtp}
              onVerified={(user) => {
                setShowOtpForm(false);
                setVerifiedUser(user);

                if (user && user.uid) {
                  // ✅ User exists, treat as login
                  setShowPopup(false);
                  if (onClose) onClose();
                  // Force a reload or update state to reflect login
                  window.location.reload();
                } else {
                  // 🔄 New user, but in the new flow with 2-step registration,
                  // this case should not happen via SendOtpWithNumber if it's strictly for login.
                  // For now, redirect to signup if somehow missing UID
                  setShowSignupPage(true);
                }
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default SendOtpWithNumber;
