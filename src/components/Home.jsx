import { ReactTyped } from 'react-typed';
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import video1 from "../videos/PV1NL21-privateRoom.mp4";
import CountUp from 'react-countup';
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaPhoneAlt } from 'react-icons/fa';
import "./Home.css"

const Home = () => {
  useEffect(() => {
    AOS.init({ duration: 1500, once: true });
    AOS.refresh();
  }, []);


  return (
    <>
      <section id="home" className="gradient-bg flex text-black border py-16 pt-32 lg:min-h-screen">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center  justify-between px-4 sm:px-6 lg:px-8 gap-10">

          {/* Left side: content */}
          <div className="flex-1 w-full">
            <h1 className="text-2xl sm:text-2xl md:text-4xl font-bold text-green-900 mb-4 leading-snug"
            // style={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.5)' }}
            >
              Our goal is to make you feel at home
              in our paying guest facilities with all
              the quality services
            </h1>
            <p
              className="text-xl sm:text-xl md:text-2xl text-[#191715] mb-6 opacity-90"
              style={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.5)' }}
            >
              <ReactTyped
                strings={["Enjoy Luxurious Stay at Best Price"]}
                typeSpeed={20}
                backSpeed={20}
                loop
              />
            </p>
            <Link
              to="/contact"
              className="relative p-3 flex justify-center items-center rounded-full w-[100%] md:w-[80%] max-w-md mb-8 space-x-2 overflow-hidden group color-flow-bg"
            >
              <p className="whitespace-nowrap overflow-hidden text-ellipsis text-white capitalize text-base sm:text-md md:text-xl transition-all duration-700 group-hover:mr-4 z-10">
                Book Your Stay with us today
              </p>

              <span className="opacity-0 group-hover:opacity-100 text-white transition-opacity duration-300 z-10">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
                  className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                </svg>
              </span>
            </Link>

            <div className="flex flex-wrap gap-4 justify-start">
              <div className="bg-white text-[#3730a3] px-6 py-3 rounded-lg font-semibold text-center w-full sm:w-auto">
                <h1 className="text-xl">
                  <CountUp end={10} duration={2} />+
                </h1>
                <p>Years Experience</p>
              </div>

              <div className="bg-white text-[#3730a3] px-6 py-3 rounded-lg font-semibold text-center w-full sm:w-auto">
                <h1 className="text-xl">
                  <CountUp end={4} duration={2.5} separator="," />k+
                </h1>
                <p>Customers</p>
              </div>

              <div className="bg-white text-[#3730a3] px-6 py-3 rounded-lg font-semibold text-center w-full sm:w-auto">
                <h1 className="text-xl">
                  <CountUp end={500} duration={2} separator="," />+
                </h1>
                <p>Reviews</p>
              </div>
            </div>
          </div>

          {/* Right side: video */}
          <div data-aos="fade-up" className="flex-1   flex justify-center md:justify-end">
            <video
              className="h-[400px] lg:h-[400px] mt-7 w-full object-cover rounded-lg "
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={video1} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

        </div>
      </section>

      {/* Sticky 3D WhatsApp & Call icons */}
      <div
        className="fixed bottom-8  right-4 z-50 flex flex-col space-y-4"
        data-aos="fade-left"
      >
        {/* WhatsApp Button */}
        <a
          href="https://wa.me/9326262292"
          target="_blank"
          rel="noopener noreferrer"
          className="w-auto min-w-[20px]  h-8 lg:h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg text-white text-2xl
      transform transition-transform duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-2xl
      active:scale-95 active:shadow-md animate-bounce"
          title="Chat with us on WhatsApp"
          aria-label="WhatsApp Chat"
        >
          <FaWhatsapp className=" text-xl lg:text-4xl" />
        </a>

        {/* Call Button */}
        <a
          href="tel:9326262292"
          className="w-auto min-w-[20px] px-3 h-8 lg:h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg text-white text-2xl
      transform transition-transform duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-2xl
      active:scale-95 active:shadow-md animate-bounce"
          title="Call us"
          aria-label="Call Us"
        >
          <FaPhoneAlt className=" text-xl lg:text-2xl" />
        </a>
      </div>

    </>
  );
};

export default Home;
