import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const VerifyForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [mobile, setMobile] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mobileNumber = params.get("mobile");
    if (!mobileNumber) {
      toast.error("Mobile number is missing.");
      navigate("/login");
    } else {
      setMobile(mobileNumber);
    }
  }, [location, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp) return toast.error("Please enter OTP");
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/verifyOtp`,
        { mobile, otp },
        { withCredentials: true }
      );

      if (data?.verified) {
        if (data?.isNewUser) {
          navigate(`/SignpPage?mobile=${mobile}`);
        } else {
          navigate("/login");
        }
      } else {
        toast.error(data?.message || "Invalid OTP");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded">
      <h2 className="text-xl font-bold mb-4">Verify OTP</h2>
      <form onSubmit={handleVerify}>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full p-2 border rounded mb-4"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
};

export default VerifyForm;
