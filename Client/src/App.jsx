import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import MainPage from './Component/Pages/MainPage';
import ViewProduct from './Component/Pages/ViewProduct';
import Header from './Component/Header/Header';
import CatagroyProducts from './Component/Pages/CatagroyProducts';
import ScrollToTop from './ScrollToTop';
import Footer from './Component/Footer/Footer';
import LoginMain from './Component/Form/LoginMain';
import SignUpMain from './Component/Form/SignUpMain';
import ViewAllProduct from './Component/Pages/ViewAllProduct';
import VerificationForm from './Component/Form/OTP/VerificationForm';
import SendOtpWithNumber from './Component/Form/OTP/SendOtpWithNumber';
import MissMobileNumber from './Component/Form/MissMobileNumber'; // ✅ Import this
import { Toaster } from 'react-hot-toast';

function getUserFromCookie() {
  try {
    const cookies = document.cookie.split('; ');
    const userCookie = cookies.find(c => c.startsWith('user='));
    if (userCookie) {
      const userString = decodeURIComponent(userCookie.split('=')[1]);
      return JSON.parse(userString);
    }
  } catch (err) {
    console.error('Failed to parse user cookie:', err);
  }
  return null;
}

function App() {
  const user = getUserFromCookie();
  const isLoggedIn = !!user;

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <BrowserRouter>
        <Header />
        <ScrollToTop />
        <SendOtpWithNumber />
        {/* {user && <MissMobileNumber user={user} />} ✅ Safe usage */}

        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/catagory/:CatagoryName" element={<CatagroyProducts />} />
          <Route path="/Product/:ProductId" element={<ViewProduct />} />
          <Route path="/ViewAllProduct" element={<ViewAllProduct />} />
          <Route path="/otp" element={<VerificationForm />} />

          {/* ✅ Block login/signup if already logged in */}
          <Route
            path="/SignUpPage"
            element={isLoggedIn ? <Navigate to="/" /> : <SignUpMain />}
          />
          <Route
            path="/SignInPage"
            element={isLoggedIn ? <Navigate to="/" /> : <LoginMain />}
          />
        </Routes>

        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
