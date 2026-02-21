import React from 'react';
import { BrowserRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom';
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
import { Toaster } from 'react-hot-toast';
import AdminLayout from './Component/Pages/adminPanel/AdminLayeout';
import AddProduct from './Component/Pages/adminPanel/AddProduct';
import AddCatagory from './Component/Pages/adminPanel/AddCatagory';
import ProductTable from './Component/Pages/adminPanel/ProductTable';
import UserTable from './Component/Pages/adminPanel/UserTable';
import EditProduct from './Component/Pages/adminPanel/EditProduct';
import AdminDashboard from './Component/Pages/adminPanel/AdminDashboard';
import AdminInquiry from './Component/Pages/adminPanel/AdminInquiry';
import AdminChatTab from './Component/Pages/adminPanel/AdminChatTab';
import ScrollToHashElement from './ScrollToHashElement';
import WhatsappLogo from './WhatsappLogo';
import SubscribeEmailModal from './Component/Form/OTP/SubscribeEmailModal';
import CompleteProfile from './Component/Form/CompleteProfile';
import ChatPopup from './Component/Chat/ChatPopup';


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

// This wrapper is needed to use useLocation inside App
function AppWrapper() {
  const location = useLocation();
  const user = getUserFromCookie();
  const isLoggedIn = !!user;

  // Admin path condition
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {!isAdminRoute && <Header />}
      <ScrollToTop />
      <ScrollToHashElement />

      {!isAdminRoute && !user && <SubscribeEmailModal />}
      {!isAdminRoute && <WhatsappLogo />}
      {!isAdminRoute && <ChatPopup />}
      <Routes>
        {/* Admin panel route */}
        <Route path={`/admin-a9xK72rQ1m8vZpL0`} element={<AdminLayout />}>
          <Route path="add-product" element={<AddProduct />} />
          <Route path="add-category" element={<AddCatagory />} />
          <Route path="view-products" element={<ProductTable />} />
          <Route path="view-user" element={<UserTable />} />
          <Route path="edit-product/:pid" element={<EditProduct />} />
          <Route path="" element={<AdminDashboard />} />
          <Route path="admin-Inquiries" element={<AdminInquiry />} />
          <Route path="admin-chats" element={<AdminChatTab />} />
          {/* Add other admin routes */}
        </Route>


        {/* Normal user routes */}
        <Route path="/" element={<MainPage />} />
        <Route path="/catagory/:CatagoryName" element={<CatagroyProducts />} />
        <Route path="/Product/:ProductId" element={<ViewProduct />} />
        <Route path="/ViewAllProduct" element={<ViewAllProduct />} />
        <Route path="/otp" element={<VerificationForm />} />
        <Route path="/login" element={<Navigate to="/SignInPage" replace />} />
        <Route
          path="/SignUpPage"
          element={isLoggedIn ? <Navigate to="/" /> : <SignUpMain />}
        />
        <Route path="/CompleteProfile" element={<CompleteProfile />} />
        <Route
          path="/SignInPage"
          element={isLoggedIn ? <Navigate to="/" /> : <LoginMain />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>

      {!isAdminRoute && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppWrapper />

    </BrowserRouter>
  );
}

export default App;
