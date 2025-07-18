import React, { useState, useEffect, useRef } from 'react';
import './OTP/otp.css';
import toast from 'react-hot-toast';

const MissMobileNumber = ({ user }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSending, setIsSending] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (user && !user.mobile) {
      timerRef.current = setTimeout(() => {
        setShowPopup(true);
      }, 5000);
    }

    return () => clearTimeout(timerRef.current);
  }, [user]);

  const handleClose = () => {
    setShowPopup(false);
    clearTimeout(timerRef.current);
  };

  const handleSubmitNumber = async (e) => {
    e.preventDefault();

    if (isSending) return;
    setIsSending(true);

    try {
      if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
        setIsSending(false);
        return toast.error('❌ Invalid mobile number');
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/updatePhone`, {
        method: 'Post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, mobile: phoneNumber }),
      });

      const data = await res.json();
      console.log('updatePhone response:', data);

      if (res.ok && data.success) {
        toast.success('✅ Mobile number added successfully!');
        setShowPopup(false);
        window.location.reload();
      } else {
        toast.error('❌ Failed to update number');
      }
    } catch (err) {
      toast.error('❌ Error: ' + err.message);
    } finally {
      setIsSending(false);
    }
  };

  if (!showPopup) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-button" onClick={handleClose}>✕</button>
        <form className="number-form" onSubmit={handleSubmitNumber}>
          <h3 className="popup-title">Mobile Number Missing </h3>
          <p className="popup-subtitle">Please provide your phone number so we can contact you.</p>

          <div className="input-group">
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter mobile number"
              required
            />
          </div>

          <button type="submit" className="verify-button" disabled={isSending}>
            {isSending ? 'Saving...' : 'Save Number'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MissMobileNumber;
