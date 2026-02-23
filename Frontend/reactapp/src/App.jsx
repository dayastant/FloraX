import { useState } from 'react'
import './App.css'
import { BrowserRouter } from 'react-router-dom'
import { Routes, Route, Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import FloraXNavbar from './components/FloraXNavbar'
import Home from './pages/home'
import Footer from './components/Footer'
import Login from './pages/login'
import Register from './pages/register'
import About from './pages/about'
import Services from './pages/service'
import Contact from './pages/contact'

// Scroll to top when route changes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function PublicLayout() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <ScrollToTop />
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
