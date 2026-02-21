import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../../../lib/api";

const VerificationForm = ({ phoneNumber, registrationData, onVerified, onClose }) => {
  const [otp, setOtp] = useState("");

  const verifyMutation = useMutation({
    mutationFn: async (otpData) => {
      // API expects { phone, otp, registrationData }
      const { data } = await api.post('/api/verify-otp', otpData);
      return data;
    },
    onSuccess: (data) => {
      if (data.success) {
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        toast.success("Verification successful!");
        if (onVerified) onVerified(data.user);
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    },
    onError: (error) => {
      console.error('OTP verification error:', error);
      toast.error(error.response?.data?.message || "OTP verification failed");
    }
  });

  const handleVerify = (e) => {
    e.preventDefault();
    if (!otp) return toast.error("Please enter OTP");

    const payload = {
      phone: phoneNumber,
      otp
    };

    if (registrationData) {
      payload.registrationData = registrationData;
    }

    verifyMutation.mutate(payload);
  };

  return (
    <div className="w-full max-w-sm mx-auto p-4">
      <h3 className="text-xl font-bold mb-2 text-[#002D74]">Verify OTP</h3>
      <p className="text-sm text-gray-600 mb-6">
        Sent to {phoneNumber}
      </p>

      <form onSubmit={handleVerify} className="space-y-4">
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter 4-digit OTP"
          className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#002D74] outline-none transition-all"
          maxLength={6}
          required
        />

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={verifyMutation.isPending}
            className="flex-3 bg-[#002D74] text-white px-8 py-2 rounded-xl hover:bg-[#206ab1] font-semibold disabled:opacity-50 transition-all shadow-md shadow-[#002D74]/20"
          >
            {verifyMutation.isPending ? "Verifying..." : "Verify & Complete"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VerificationForm;
