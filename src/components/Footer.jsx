import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-white px-6 py-10 ">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

        {/* Column 1: Brand */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-2">Gopal's Paying Guest Services</h2>
          <p className="text-lg leading-relaxed">
            Enjoy Luxurious Stay at Best Price
          </p>
          <div className="flex space-x-4 text-lg">
                <a href="#" className="hover:text-blue-500 transition" aria-label="Facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="hover:text-pink-500 transition" aria-label="Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="hover:text-sky-500 transition" aria-label="Twitter">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="hover:text-red-600 transition" aria-label="YouTube">
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
        </div>

        {/* Column 2: Navigation */}
        <div className='flex flex-col  justify-center items-start lg:items-center rounded-lg p-4'>
          {/* <h3 className="text-lg font-bold text-white mb-3">Links</h3> */}
          <ul className="space-y-2 text-lg">
            <li><a href="/" className="hover:text-white transition">Home</a></li>
            <li><a href="/gallery" className="hover:text-white transition">Gallery</a></li>
            <li><a href="/services" className="hover:text-white transition">Facilities</a></li>
            <li><a href="/locations" className="hover:text-white transition">Locations</a></li>
            <li><a href="/about" className="hover:text-white transition">About Us</a></li>
            <li><a href="/contact" className="hover:text-white transition">Contact Us</a></li>
            <div>
              {/* <h3 className="text-xl font-medium text-white mb-3">Connect</h3> */}
              
            </div>
          </ul>
        </div>

        {/* Column 3: Social / Contact */}
        <ul className="space-y-2 text-lg">
          <li><a className="text-2xl font-semibold text-white mb-2">Gopal's Group  Upcoming Ventures</a></li>
          <li><a className="hover:text-white transition">Gopal's Organic Mart</a></li>
             <li><a className="hover:text-white transition">Gopal's Property Maintenance Services</a></li>
                       <li><a className="hover:text-white transition">Gopal's Realty</a></li>
          <li><a className="hover:text-white transition">Gopal's Innovative Tech Solutions</a></li>
        </ul>
      </div>

      {/* Divider */}
      <div className="border-t border-neutral-700 mt-10 pt-4 text-center text-lg text-white">
        &copy; {currentYear} Gopal's Paying Guest Services
        <span className='text-[12px] p-5'> Developed by : Gopal's Innovative Tech Solutions</span>

      </div>
    </footer>
  );
};

export default Footer;

