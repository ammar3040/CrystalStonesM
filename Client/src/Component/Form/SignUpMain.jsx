import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const SignUpMain = ({ onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    Uname: '',
    email: '',
    mobile: "",
    address: '',
    password: '',
    confirmPassword: ''
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/register`, formData);

      if (response.data.success) {
        toast.success(response.data.message || "Registration Successful!");

        // Store JWT token if returned
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }

        setTimeout(() => {
          if (onClose) onClose();
          navigate('/');
        }, 1500);
      } else {
        toast.error(response.data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      const message = error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-transparent min-h-screen flex box-border justify-center items-center" style={{ scale: 0.7 }}>
      <div className="bg-[#fff8a8] rounded-2xl flex max-w-3xl p-5 items-center shadow-xl">
        <div className="md:w-1/2 px-8">
          <h2 className="font-bold text-3xl text-[#002D74]">Register</h2>
          <p className="text-sm mt-4 text-[#002D74]">Create an account to get started immediately.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
            <input
              className="p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#002D74] outline-none"
              type="text"
              name="Uname"
              placeholder="Full Name"
              value={formData.Uname}
              onChange={handleChange}
              required
            />
            <input
              className="p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#002D74] outline-none"
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              className="p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#002D74] outline-none"
              type="tel"
              name="mobile"
              placeholder="Mobile Number"
              value={formData.mobile}
              onChange={handleChange}
              maxLength={10}
              required
            />
            <textarea
              className="p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#002D74] outline-none"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              rows={2}
              required
            />

            <div className="relative">
              <input
                className="p-3 rounded-xl border border-gray-200 w-full focus:ring-2 focus:ring-[#002D74] outline-none"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-[#002D74]"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z" />
                    <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                  </svg>
                )}
              </button>
            </div>

            <div className="relative">
              <input
                className="p-3 rounded-xl border border-gray-200 w-full focus:ring-2 focus:ring-[#002D74] outline-none"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-[#002D74]"
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z" />
                    <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                  </svg>
                )}
              </button>
            </div>

            <button
              className="bg-[#002D74] text-white py-3 mt-4 rounded-xl hover:scale-[1.02] duration-300 hover:bg-[#206ab1] font-bold shadow-lg shadow-[#002D74]/20 disabled:opacity-50"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Create Account'}
            </button>

            <div className="mt-6 text-sm flex justify-between items-center px-2">
              <p className="text-[#002D74]/70">Already have an account?</p>
              <Link to={`/SignInPage`}>
                <button
                  className="text-white bg-[#002D74] rounded-xl py-2.5 px-6 hover:scale-105 hover:bg-[#1a4b8e] font-bold duration-300 shadow-md"
                  type="button"
                  onClick={() => onClose?.()}
                >
                  Login
                </button>
              </Link>
            </div>
          </form>
        </div>
        <div className="md:block hidden w-1/2 p-4">
          <img
            className="rounded-2xl shadow-lg border-4 border-white object-cover"
            src={"https://res.cloudinary.com/dioicxwct/image/upload/v1753539190/pqf3ybaexutwltwndjgi_w300gz.jpg"}
            alt="registration form"
          />
        </div>
      </div>
    </section>
  );
};

export default SignUpMain;
