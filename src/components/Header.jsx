import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useAuth } from "../context/AuthContext";
import CryptoJS from 'crypto-js';
import { SECRET_KEY } from "../Config";
import gpgsLogo from "../logo/Gpgs-logo.jpg"; 

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [decryptedUser, setDecryptedUser] = useState(null);

  const location = useLocation();
  const { logout } = useAuth();
  const isHomePage = location.pathname === "/";

  // AOS Animation Init
  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
    AOS.refresh();
  }, []);

  // Responsive menu: close on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [menuOpen]);

  // Handle logout
  const handleLogout = () => {
    logout();
    localStorage.clear();
    window.location.reload();
  };

  // Decrypt user from localStorage
  useEffect(() => {
    const encrypted = localStorage.getItem('user');
    if (encrypted) {
      setDecryptedUser(decryptUser(encrypted));
    }
  }, []);

  const decryptUser = (encryptedData) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Failed to decrypt user:', error);
      return null;
    }
  };

  // Nav Links
  const navLinks = isHomePage ? (
    <>
      <a href="#home" className="nav-link">Home</a>
      <a href="/gallery" className="nav-link">Gallery</a>
      <a href="#services" className="nav-link">Facilities</a>
      <a href="#locations" className="nav-link">Locations</a>
      <a href="#about" className="nav-link">About Us</a>
      <a href="#contact" className="nav-link">Contact Us</a>
    </>
  ) : (
    <>
      <Link to="/" className="nav-link">Home</Link>
      <Link to="/gallery" className="nav-link">Gallery</Link>
      <Link to="/services" className="nav-link">Facilities</Link>
      <Link to="/locations" className="nav-link">Locations</Link>
      <Link to="/about" className="nav-link">About Us</Link>
      <Link to="/contact" className="nav-link">Contact Us</Link>
    </>
  );

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-2 lg:px-2">
        <div className="flex justify-between items-center h-20 md:h-24">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              <img
                src={gpgsLogo}
                alt="GPGS Logo"
                className="h-14  md:h-20"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex  items-center space-x-2 md:space-x-5">
            {navLinks}

            {/* <Link to="/gallery" className="nav-link">Gallery</Link> */}
            
            <Link to="/gpgs-actions" className="nav-link"><span className="text-xl">|</span>  My Account</Link>
      
            {decryptedUser && (
              <div  className="flex items-center space-x-4 ml-6">
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-800">{decryptedUser?.name?.substring(0, 12) + "..."}</div>
                  {/* <div className="text-xs text-gray-500">({decryptedUser.role})</div> */}
                </div>
                <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                  {decryptedUser.name.split(' ').map(n => n[0]).join('')}
                </div>
                <button onClick={handleLogout} className="text-sm text-gray-700 hover:text-indigo-600">Logout</button>
              </div>
            )}
          </nav>
          {/* Mobile Menu Button */}
          <div  className="md:hidden flex items-center space-x-2">
            {decryptedUser && (
              <div className="text-right mr-2">
                <div className="text-sm font-semibold text-gray-800">{decryptedUser.name.substring(0, 12) + "..."}</div>
                {/* <div className="text-xs text-gray-500">({decryptedUser.role})</div> */}
              </div>
            )}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="  text-2xl focus:outline-none"
              aria-label="Toggle Menu"
            >
              {menuOpen ? '×' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div data-aos="fade-down"
     data-aos-easing="linear"
     data-aos-duration="300" className="md:hidden flex flex-col bg-white border-t border-gray-200 px-4 py-4 space-y-4">
          {isHomePage ? (
            <>
              <a onClick={() => setMenuOpen(false)} href="#home" className="mobile-link">Home</a>
                  <a onClick={() => setMenuOpen(false)} href="/gallery" className="mobile-link">Gallery</a>
              <a onClick={() => setMenuOpen(false)} href="#services" className="mobile-link">Facilities</a>
              <a onClick={() => setMenuOpen(false)} href="#locations" className="mobile-link">Locations</a>
              <a onClick={() => setMenuOpen(false)} href="#about" className="mobile-link">About Us</a>
          
              <a onClick={() => setMenuOpen(false)} href="#contact" className="mobile-link">Contact Us</a>
            </>
          ) : (
            <>
              <Link onClick={() => setMenuOpen(false)} to="/" className="mobile-link">Home</Link>
               <Link onClick={() => setMenuOpen(false)} to="/gallery" className="mobile-link">Gallery</Link>
              <Link onClick={() => setMenuOpen(false)} to="/services" className="mobile-link">Facilities</Link>
              <Link onClick={() => setMenuOpen(false)} to="/locations" className="mobile-link">Locations</Link>
             
              <Link onClick={() => setMenuOpen(false)} to="/about" className="mobile-link">About Us</Link>
              <Link onClick={() => setMenuOpen(false)} to="/contact" className="mobile-link">Contact Us</Link>
            </>
          )}
          <Link onClick={() => setMenuOpen(false)} to="/gpgs-actions" className="mobile-link">My Account</Link>
          {decryptedUser && (
            <button
              onClick={() => { handleLogout(); setMenuOpen(false); }}
              className="mobile-link text-left w-full"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;

