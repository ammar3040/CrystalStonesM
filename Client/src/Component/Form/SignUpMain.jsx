import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import toast from 'react-hot-toast';
const SignUpMain = ({phoneNumber}) => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate= useNavigate()
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    Uname:'',
    email: '',
    mobile: phoneNumber,
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

  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/register`, formData);
    console.log("Server Response:", response.data);
    toast.success("Registration Successful!");
    navigate('/')
    
  } catch (error) {
    console.error("Registration Failed:", error);
    toast.error("Registration failed. Please try again.");
  }
};


  return (
    <section className="bg-transparent  min-h-screen flex box-border justify-center items-center" style={{ scale: 0.7 }}>
      <div className="bg-[#fff8a8] rounded-2xl flex max-w-3xl p-5 items-center">
        <div className="md:w-1/2 px-8">
          <h2 className="font-bold text-3xl text-[#002D74]">Register</h2>
          <p className="text-sm mt-4 text-[#002D74]">Create an account to get started.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
               <input
              className="p-2 mt-8 rounded-xl border"
              type="text"
              name="Uname"
              placeholder="Enter you Name"
              value={formData.Uname}
              onChange={handleChange}
              required
            />
            <input
              className="p-2 mt-8 rounded-xl border"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
<input
  type="tel"
  name="mobile"
  value={formData.mobile}
  
  className="w-full px-4 py-2 border rounded-xl"
disabled
  maxLength={10}
/>



           

            <textarea
              className="p-2 rounded-xl border"
              type="text"
              name="address"
              placeholder="Address (Optional)"
              value={formData.address}
              onChange={handleChange}
            />

            <div className="relative">
              <input
                className="p-2 rounded-xl border w-full"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-eye-slash-fill absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                  onClick={togglePasswordVisibility}
                  viewBox="0 0 16 16"
                >
                  <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z" />
                  <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="gray"
                  className="bi bi-eye absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                  onClick={togglePasswordVisibility}
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                </svg>
              )}
            </div>

            <div className="relative">
              <input
                className="p-2 rounded-xl border w-full"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              {showConfirmPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-eye-slash-fill absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                  onClick={toggleConfirmPasswordVisibility}
                  viewBox="0 0 16 16"
                >
                  <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z" />
                  <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="gray"
                  className="bi bi-eye absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                  onClick={toggleConfirmPasswordVisibility}
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                </svg>
              )}
            </div>

            <button
              className="bg-[#002D74] text-white py-2 rounded-xl hover:scale-105 duration-300 hover:bg-[#206ab1] font-medium"
              type="submit"
            >
              Register
            </button>

            <div className="mt-4 text-sm flex justify-between items-center container-mr">
              <p className="mr-3 md:mr-0">Already have an account?</p>
              <Link to={`/SignInPage`}><button
                className="hover:border register text-white bg-[#002D74] hover:border-gray-400 rounded-xl py-2 px-5 hover:scale-110 hover:bg-[#002c7424] font-semibold duration-300"
                type="button"
              >
                Login
              </button>
              </Link>
            </div>
          </form>
        </div>
        <div className="md:block hidden w-1/2">
          <img
            className="rounded-2xl max-h-[1600px]"
            src={"https://res.cloudinary.com/dioicxwct/image/upload/v1752046684/loginpage_cyj0ql.jpg"}
            alt="registration form"
          />
        </div>
      </div>
    </section>
  );
};

export default SignUpMain;

