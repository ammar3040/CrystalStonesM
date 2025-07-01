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

function isUserLoggedIn() {
  const cookies = document.cookie.split("; ");
  const userCookie = cookies.find((c) => c.startsWith("user="));
  return !!userCookie;
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <ScrollToTop />

        <Routes>
          <Route path='/' element={<MainPage />} />
          <Route path='/catagory/:CatagoryName' element={<CatagroyProducts />} />
          <Route path='/Product/:ProductId' element={<ViewProduct />} />

          {/* 🚫 Restrict SignUp and SignIn pages if user is already logged in */}
          <Route
            path='/SignUpPage'
            element={isUserLoggedIn() ? <Navigate to='/' /> : <SignUpMain />}
          />
          <Route
            path='/SignInPage'
            element={isUserLoggedIn() ? <Navigate to='/' /> : <LoginMain />}
          />
        </Routes>

        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
