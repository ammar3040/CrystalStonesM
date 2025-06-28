import React from 'react'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import MainPage from './Component/Pages/MainPage'
import ViewProduct from './Component/Pages/ViewProduct'
import Header from './Component/Header/Header'
import CatagroyProducts from './Component/Pages/CatagroyProducts'
import ScrollToTop from './ScrollToTop'
import Footer from './Component/Footer/Footer'
import AdminPanel from './Component/Pages/Admin/AdminPanel'
import LoginMain from './Component/Form/LoginMain'
import SignUpMain from './Component/Form/SignUpMain'


function app() {
  return (
    <>

   <BrowserRouter>
        <Header/>
   <ScrollToTop/>
   <Routes>
    <Route path='/' element={<MainPage/>}/>
    <Route path='/catagory/:CatagoryName' element={<CatagroyProducts/>}/>
    <Route path='/Product/:ProductId' element={<ViewProduct/>}/>
    <Route path='/SignUpPage' element={<SignUpMain/>}/>
    <Route path='/SignInPage' element={<LoginMain/>}/>
  
   </Routes>
      <Footer/>
   </BrowserRouter>

{/* 
   <BrowserRouter>
   <Routes>
     <Route path='/admin' element={<AdminPanel/>}/> 
     
 
    </Routes></BrowserRouter> */}
   </>
  )
}

export default app