import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
const SignUpMain = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate= useNavigate()
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    Uname:'',
    email: '',
    mobile: '',
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
    alert("Passwords don't match!");
    return;
  }

  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/register`, formData);
    console.log("Server Response:", response.data);
    alert("Registration Successful!");
    navigate('/SignInPage')
    
  } catch (error) {
    console.error("Registration Failed:", error);
    alert("Registration failed. Please try again.");
  }
};


  return (
    <section className="bg-transparent min-h-screen flex box-border justify-center items-center" style={{ scale: 0.7 }}>
      <div className="bg-[#dfa674] rounded-2xl flex max-w-3xl p-5 items-center">
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
<PhoneInput
  country={'in'}
  value={formData.mobile}
  onChange={(phone) =>
    setFormData((prev) => ({ ...prev, mobile: phone }))
  }
  name="mobile"
  containerClass="w-full relative"
  inputStyle={{ width: '100%', paddingLeft: '40px', borderRadius: '0.75rem' }}
  buttonClass="absolute left-2  transform -translate-x-1/2 z-10"
  placeholder="Mobile Number"
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
            src="https://images.unsplash.com/photo-1552010099-5dc86fcfaa38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxfHxmcmVzaHxlbnwwfDF8fHwxNzEyMTU4MDk0fDA&ixlib=rb-4.0.3&q=80&w=1080"
            alt="registration form"
          />
        </div>
      </div>
    </section>
  );
};

export default SignUpMain;



// // import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import PhoneInput from 'react-phone-input-2';
// import 'react-phone-input-2/lib/style.css';

// const SignUpMain = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     Uname: '',
//     email: '',
//     mobile: '',
//     address: '',
//     password: '',
//     confirmPassword: ''
//   });

//   const [isOtpVerified, setIsOtpVerified] = useState(false);
//   const [otpCountdown, setOtpCountdown] = useState(0);

//   // Countdown timer for OTP resend
//   useEffect(() => {
//     let timer;
//     if (otpCountdown > 0) {
//       timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
//     }
//     return () => clearTimeout(timer);
//   }, [otpCountdown]);

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const toggleConfirmPasswordVisibility = () => {
//     setShowConfirmPassword(!showConfirmPassword);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   // Send OTP to mobile number
//  const sendOtp = () => {
//   if (!formData.mobile) {
//     alert('Please enter a valid mobile number');
//     return;
//   }

//   const fullMobile = `+${formData.mobile}`;
//  // MSG91 needs +91...

//   // Load OTP widget
//   const configuration = {
// widgetId: import.meta.env.VITE_MSG91_WIDGET_ID,
// tokenAuth: import.meta.env.VITE_MSG91_TOKEN,

//     identifier: fullMobile,
//     exposeMethods: true,
//     success: async (data) => {
//       console.log("✅ OTP Verified:", data);
//       setIsOtpVerified(true);
//       setShowOtpField(false);

//       // Send token to backend to verify & create user
//       try {
//         const res = await axios.post(`${import.meta.env.VITE_API_URL}/verify`, {
//           access_token: data.token,
//           phone: fullMobile,
//         });
//         alert("Mobile verified and user created!");
//       } catch (err) {
//         alert("OTP verified but server error");
//         console.error(err);
//       }
//     },
//     failure: (err) => {
//       alert("OTP verification failed");
//       console.error(err);
//     },
//   };

//   window.initSendOTP(configuration); // call widget
// };



//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!isOtpVerified) {
//       alert("Please verify your mobile number first");
//       return;
//     }

//     if (formData.password !== formData.confirmPassword) {
//       alert("Passwords don't match!");
//       return;
//     }

//     try {
//       const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/register`, formData);
//       console.log("Server Response:", response.data);
//       alert("Registration Successful!");
//       navigate('/SignInPage');
//     } catch (error) {
//       console.error("Registration Failed:", error);
//       alert("Registration failed. Please try again.");
//     }
//   };

//   return (
//     <section className="bg-transparent min-h-screen flex box-border justify-center items-center" style={{ scale: 0.7 }}>
//       <div className="bg-[#dfa674] rounded-2xl flex max-w-3xl p-5 items-center">
//         <div className="md:w-1/2 px-8">
//           <h2 className="font-bold text-3xl text-[#002D74]">Register</h2>
//           <p className="text-sm mt-4 text-[#002D74]">Create an account to get started.</p>

//           <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//             <input
//               className="p-2 mt-8 rounded-xl border"
//               type="text"
//               name="Uname"
//               placeholder="Enter your Name"
//               value={formData.Uname}
//               onChange={handleChange}
//               required
//             />
//             <input
//               className="p-2 rounded-xl border"
//               type="email"
//               name="email"
//               placeholder="Email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
            
//             <div className="relative">
//               <PhoneInput
//                 country={'in'}
//                 value={formData.mobile}
//                 onChange={(phone) => {
//                   setFormData(prev => ({ ...prev, mobile: phone }));
//                   setIsOtpVerified(false); // Reset verification if number changes
//                 }}
//                 name="mobile"
//                 containerClass="w-full"
//                 inputStyle={{ width: '100%', paddingLeft: '40px', borderRadius: '0.75rem' }}
//                 buttonClass="absolute left-2 transform -translate-x-1/2 z-10"
//                 placeholder="Mobile Number"
//                 disabled={isOtpVerified}
//               />
//               {/* put this just below your phone-number block */}
// <div id="otp-container" className="mt-2"></div>

              
//               {!isOtpVerified && formData.mobile && (
//                 <button
//                   type="button"
//                   onClick={sendOtp}
//                   disabled={otpCountdown > 0}
//                   className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-xs ${otpCountdown > 0 ? 'text-gray-400' : 'text-blue-600 font-semibold'}`}
//                 >
//                   {otpCountdown > 0 ? `Resend in ${otpCountdown}s` : 'Send OTP'}
//                 </button>
//               )}
              
//               {isOtpVerified && (
//                 <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-green-600">
//                   Verified ✓
//                 </span>
//               )}
//             </div>

//             {/* Inline OTP Field */}
       
//             <textarea
//               className="p-2 rounded-xl border"
//               type="text"
//               name="address"
//               placeholder="Address (Optional)"
//               value={formData.address}
//               onChange={handleChange}
//             />

//             <div className="relative">
//               <input
//                 className="p-2 rounded-xl border w-full"
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 placeholder="Password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//               />
//               {showPassword ? (
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="16"
//                   height="16"
//                   fill="currentColor"
//                   className="bi bi-eye-slash-fill absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
//                   onClick={togglePasswordVisibility}
//                   viewBox="0 0 16 16"
//                 >
//                   <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z" />
//                   <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z" />
//                 </svg>
//               ) : (
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="16"
//                   height="16"
//                   fill="gray"
//                   className="bi bi-eye absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
//                   onClick={togglePasswordVisibility}
//                   viewBox="0 0 16 16"
//                 >
//                   <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
//                   <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
//                 </svg>
//               )}
//             </div>

//             <div className="relative">
//               <input
//                 className="p-2 rounded-xl border w-full"
//                 type={showConfirmPassword ? "text" : "password"}
//                 name="confirmPassword"
//                 placeholder="Confirm Password"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 required
//               />
//               {showConfirmPassword ? (
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="16"
//                   height="16"
//                   fill="currentColor"
//                   className="bi bi-eye-slash-fill absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
//                   onClick={toggleConfirmPasswordVisibility}
//                   viewBox="0 0 16 16"
//                 >
//                   <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z" />
//                   <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z" />
//                 </svg>
//               ) : (
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="16"
//                   height="16"
//                   fill="gray"
//                   className="bi bi-eye absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
//                   onClick={toggleConfirmPasswordVisibility}
//                   viewBox="0 0 16 16"
//                 >
//                   <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
//                   <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
//                 </svg>
//               )}
//             </div>

//             <button
//               className="bg-[#002D74] text-white py-2 rounded-xl hover:scale-105 duration-300 hover:bg-[#206ab1] font-medium"
//               type="submit"
//               disabled={!isOtpVerified}
//             >
//               {isOtpVerified ? 'Register' : 'Verify Mobile to Register'}
//             </button>

//             <div className="mt-4 text-sm flex justify-between items-center container-mr">
//               <p className="mr-3 md:mr-0">Already have an account?</p>
//               <Link to={`/SignInPage`}>
//                 <button
//                   className="hover:border register text-white bg-[#002D74] hover:border-gray-400 rounded-xl py-2 px-5 hover:scale-110 hover:bg-[#002c7424] font-semibold duration-300"
//                   type="button"
//                 >
//                   Login
//                 </button>
//               </Link>
//             </div>
//           </form>
//         </div>
//         <div className="md:block hidden w-1/2">
//           <img
//             className="rounded-2xl max-h-[1600px]"
//             src="https://images.unsplash.com/photo-1552010099-5dc86fcfaa38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxfHxmcmVzaHxlbnwwfDF8fHwxNzEyMTU4MDk0fDA&ixlib=rb-4.0.3&q=80&w=1080"
//             alt="registration form"
//           />
//         </div>
//       </div>
//     </section>
//   );
// };

// export default SignUpMain;




