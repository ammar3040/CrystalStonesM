import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Lazy load components
const MainPage = lazy(() => import('./Component/Pages/MainPage'));
const ViewProduct = lazy(() => import('./Component/Pages/ViewProduct'));
const CatagroyProducts = lazy(() => import('./Component/Pages/CatagroyProducts'));
const ViewAllProduct = lazy(() => import('./Component/Pages/ViewAllProduct'));
import LoginMain from './Component/Form/LoginMain';
import SignUpMain from './Component/Form/SignUpMain';
const VerificationForm = lazy(() => import('./Component/Form/OTP/VerificationForm'));
const CompleteProfile = lazy(() => import('./Component/Form/CompleteProfile'));
const SubscribeEmailModal = lazy(() => import('./Component/Form/OTP/SubscribeEmailModal'));

// Admin Panel Components
const AdminLayout = lazy(() => import('./Component/Pages/adminPanel/AdminLayeout'));
const AddProduct = lazy(() => import('./Component/Pages/adminPanel/AddProduct'));
const AddCatagory = lazy(() => import('./Component/Pages/adminPanel/AddCatagory'));
const ProductTable = lazy(() => import('./Component/Pages/adminPanel/ProductTable'));
const UserTable = lazy(() => import('./Component/Pages/adminPanel/UserTable'));
const EditProduct = lazy(() => import('./Component/Pages/adminPanel/EditProduct'));
const AdminDashboard = lazy(() => import('./Component/Pages/adminPanel/AdminDashboard'));
const AdminInquiry = lazy(() => import('./Component/Pages/adminPanel/AdminInquiry'));
const AdminChatTab = lazy(() => import('./Component/Pages/adminPanel/AdminChatTab'));

// Components that should load quickly
import Header from './Component/Header/Header';
import Footer from './Component/Footer/Footer';
import ScrollToTop from './ScrollToTop';
import ScrollToHashElement from './ScrollToHashElement';
import WhatsappLogo from './WhatsappLogo';
import ChatPopup from './Component/Chat/ChatPopup';

// Loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);


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

      {!isAdminRoute && !user && (
        <Suspense fallback={null}>
          <SubscribeEmailModal />
        </Suspense>
      )}
      {!isAdminRoute && <WhatsappLogo />}
      {!isAdminRoute && <ChatPopup />}
      <Suspense fallback={<PageLoader />}>
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
      </Suspense>

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
