import { useState } from 'react'
import './App.css'
import { BrowserRouter } from 'react-router-dom'
import { Routes, Route,Outlet } from 'react-router-dom'
import FloraXNavbar from './components/FloraXNavbar'
import Home from './pages/home'
import Footer from './components/Footer'
import Login from './pages/login'
import Register from './pages/register'
import About from './pages/about'
import Services from './pages/service'
import Contact from './pages/contact'

function PublicLayout() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <FloraXNavbar />
      <Outlet />
      <Footer />
 
    </div>
  );
}

function App() {


  return (
    <>
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    
    </BrowserRouter>
      
    </>
  )
}

export default App
