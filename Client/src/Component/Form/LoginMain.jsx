import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/api';
import { useMutation } from '@tanstack/react-query';

const LoginMain = ({ onLoginSuccess, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      // Updated to use standard Axios with global api config if available
      const { data } = await api.post('/api/login', credentials);
      return data;
    },
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      toast.success('✅ Login successful!');

      setTimeout(() => {
        if (data.role === 'admin' || (data.user && data.user.role === 'admin')) {
          window.location.href = '/admin-a9xK72rQ1m8vZpL0';
        } else {
          if (onClose) onClose();
          if (onLoginSuccess) {
            const user = data.user;
            // Handle both id and uid from different endpoints
            if (user && !user.uid && user.id) user.uid = user.id;
            onLoginSuccess(user);
          }
          navigate('/');
        }
      }, 1000);
    },
    onError: (error) => {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Invalid email or password.';
      toast.error(message);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  return (
    <section className="bg-transparent min-h-screen flex box-border justify-center items-center" style={{ scale: 0.7 }}>
      <div className="bg-[#fff8a8] rounded-2xl flex max-w-3xl p-5 items-center shadow-xl">
        <div className="md:w-1/2 px-8">
          <h2 className="font-bold text-3xl text-[#002D74]">Login</h2>
          <p className="text-sm mt-4 text-[#002D74]">If you're already a member, easily log in</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
            <input
              className="p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#002D74] outline-none"
              type="email"
              name="email"
              placeholder="Email"
              autoComplete="username"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <div className="relative">
              <input
                className="p-3 rounded-xl border border-gray-200 w-full focus:ring-2 focus:ring-[#002D74] outline-none"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-[#002D74]"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z" />
                    <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                  </svg>
                )}
              </button>
            </div>
            <button
              className="bg-[#002D74] rounded-xl text-white py-3 mt-4 hover:scale-[1.02] duration-300 hover:bg-[#206ab1] font-bold shadow-lg shadow-[#002D74]/20 disabled:opacity-50"
              type="submit"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-10 grid grid-cols-3 items-center text-gray-400">
            <hr className="border-gray-400" />
            <p className="text-center text-sm">OR</p>
            <hr className="border-gray-400" />
          </div>

          <a href={`${import.meta.env.VITE_API_URL}/api/google`}>
            <button className="bg-white border py-2.5 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 hover:bg-[#60a8bc4f] font-medium text-gray-700">
              <svg className="mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="22px">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
              </svg>
              Login with Google
            </button>
          </a>

          <div className="mt-8 text-sm flex justify-between items-center px-2">
            <p className="text-[#002D74]/70">Don't have an account?</p>
            <Link to={`/SignUpPage`}>
              <button
                className="text-white bg-[#002D74] rounded-xl py-2.5 px-6 hover:scale-105 hover:bg-[#1a4b8e] font-bold duration-300 shadow-md"
                onClick={() => onClose?.()}
              >
                Register
              </button>
            </Link>
          </div>
        </div>

        <div className="md:block hidden w-1/2 p-4">
          <img
            className="rounded-2xl shadow-lg border-4 border-white object-cover h-[500px] w-full"
            src={"https://res.cloudinary.com/dioicxwct/image/upload/v1753540203/login_zdfitc.jpg"}
            alt="login image"
          />
        </div>
      </div>
    </section>
  );
};

export default LoginMain;