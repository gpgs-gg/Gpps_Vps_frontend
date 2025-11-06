import { useEffect, useRef, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

import Header from './components/Header';
import Home from './components/Home';
import Services from './components/Services';
import About from './components/About';
import Pricing from './components/Pricing';
import Location from './components/Location';
import Contact from './components/Contact';
import Gpgsaction from './components_office_use_only/Gpgsaction';
import Gallary from './components/Gallary';
import BedsAvilable from './components_office_use_only/Gpgps_Bedsavilable/BedsAvilable';
import Accounts from './components_office_use_only/Gpgs_Accounts/Accounts';
import AdminLayout from './components_office_use_only/TicketSystem/AdminLayout';
import NewBooking from './components_office_use_only/NewBooking/NewBooking';
import ProtectedRoute from './AuthRoutes/ProtectedRoutes';
import LoginPage from './auth/LoginPage';
import PublicRoute from './AuthRoutes/PublicRoute';
import PageNotFound from './components/PageNotFound';
import { useAuth } from './context/AuthContext';
import Profile from './ClientProfile/Profile';
import CreateClient from './components_office_use_only/ClientCreation/CreateClient';
import CheckInOut from './components_office_use_only/Hrms_System/CheckInOut';
// import Footer from './components/Footer';
// import { useAuth } from './context/AuthContext';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef(null);
  const { logout } = useAuth();


  // Smooth scroll
  useEffect(() => {
    const handleSmoothScroll = (e) => {
      e.preventDefault();
      const targetId = e.currentTarget.getAttribute("href");
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setIsMenuOpen(false);
    };

    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach((a) => a.addEventListener("click", handleSmoothScroll));

    return () => {
      anchors.forEach((a) =>
        a.removeEventListener("click", handleSmoothScroll)
      );
    };
  }, [isMenuOpen]);

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        navRef.current?.classList.add("bg-white", "shadow-lg");
      } else {
        navRef.current?.classList.remove("shadow-lg");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Card fade-in animation
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in");
        }
      });
    }, observerOptions);

    const cards = document.querySelectorAll(".card-hover");
    cards.forEach((card) => observer.observe(card));

    return () => {
      cards.forEach((card) => observer.unobserve(card));
    };
  }, []);

  // Telephone link click effect
  useEffect(() => {
    const telLinks = document.querySelectorAll('a[href^="tel:"]');

    const handleClick = function () {
      this.style.transform = "scale(0.95)";
      setTimeout(() => {
        this.style.transform = "scale(1)";
      }, 150);
    };

    telLinks.forEach((link) => link.addEventListener("click", handleClick));
    return () => {
      telLinks.forEach((link) =>
        link.removeEventListener("click", handleClick)
      );
    };
  }, []);

  // for auto logout ...............
 const TEN_HOURS = 10 * 60 * 60 * 1000;
  const ONE_HOUR = 60 * 60 * 1000;

  useEffect(() => {
    let lastActivity = Date.now();

    const updateActivity = () => {
      lastActivity = Date.now();
    };

    // Listen for user activity on your website
    window.addEventListener("mousemove", updateActivity);
    window.addEventListener("keydown", updateActivity);
    window.addEventListener("scroll", updateActivity);
    window.addEventListener("click", updateActivity);
    window.addEventListener("touchstart", updateActivity);

    const interval = setInterval(() => {
      const now = Date.now();
      const loginTimestamp = Number(localStorage.getItem("loginTimestamp"));

      // Logout after 1 hour of inactivity
      if (now - lastActivity > ONE_HOUR) {
        logout();
        localStorage.removeItem("loginTimestamp");
        window.location.reload();
        clearInterval(interval);
        return;
      }

      // Logout after TEN_HOURS since login
      if (loginTimestamp && now - loginTimestamp > TEN_HOURS) {
        logout();
        localStorage.removeItem("loginTimestamp");
        window.location.reload();
        clearInterval(interval);
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", updateActivity);
      window.removeEventListener("keydown", updateActivity);
      window.removeEventListener("scroll", updateActivity);
      window.removeEventListener("click", updateActivity);
      window.removeEventListener("touchstart", updateActivity);
    };
  }, [TEN_HOURS, logout]);
  // lock right click
  // useEffect(() => {
  //   const onContext = (e) => e.preventDefault();
  //   document.addEventListener('contextmenu', onContext);
  //   return () => document.removeEventListener('contextmenu', onContext);
  // }, []);


  

  return (
    <>


      {/* Show Header only if not in admin route */}
      <Header />
      <Routes>
        <Route path="/" element={
          <>
            <Home />
            <Services />
            <About />
            {/* <Pricing /> */}
            <Location />
            <Contact />
          </>
        } />
        <Route path="/home" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/locations" element={<Location />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/gpgs-actions/tickets" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>} />
        <Route path="/gallery" element={<Gallary />} />
        {/* <Route path="/gpgs-actions/beds-avilable" element={<ProtectedRoute><BedsAvilable /></ProtectedRoute>} />
        <Route path="/gpgs-actions/new-booking" element={<ProtectedRoute><NewBooking /></ProtectedRoute>} />
        <Route path="/gpgs-actions/accounts" element={<ProtectedRoute><Accounts /></ProtectedRoute>} /> */}
        {/* Public route for login page */}


        {/* Protected Routes - Only accessible to roles other than 'user' */}
        <Route
          path="/gpgs-actions/beds-avilable"
          element={
            <ProtectedRoute allowedRoles={['admin', 'manager']}>
              <BedsAvilable />
            </ProtectedRoute>
          }
        />

        <Route
          path="/gpgs-actions/new-booking"
          element={
            <ProtectedRoute allowedRoles={['admin', 'manager']}>
              <NewBooking />
            </ProtectedRoute>
          }
        />

        <Route
          path="/gpgs-actions/client-creation"
          element={
            <ProtectedRoute allowedRoles={['admin', 'manager']}>
              <CreateClient />
            </ProtectedRoute>
          }
        />

        <Route
          path="/gpgs-actions/accounts"
          element={
            <ProtectedRoute allowedRoles={['admin', 'manager']}>
              <Accounts />
            </ProtectedRoute>
          }
        />
        <Route path="/gpgs-actions/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/gpgs-actions" element={<ProtectedRoute><Gpgsaction /></ProtectedRoute>} />

        <Route path="*" element={<PageNotFound />} />
        <Route path="/gallery" element={<Gallary />} />
        <Route path="gpgs-actions/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

         <Route
          path="/gpgs-actions/check-in-out"
          element={
            <ProtectedRoute allowedRoles={['admin', 'manager']}>
             <CheckInOut/>
            </ProtectedRoute>
          }
        />


        {/* Admin routes */}
        {/* <Route path="/gpgs-actions/tickets" element={
            <AdminLayout />
        } /> */}
      </Routes>

          

      
   

    </>
  );
}

export default App;
