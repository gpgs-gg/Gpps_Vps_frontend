import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import bed2 from "../images_of_male_pg/bed2.png"

import bed11 from "../images_of_male_pg/photo11.jpeg"


import gbed1 from "../images_of_female_pg/photo1.jpeg"
import gbed3 from "../images_of_female_pg/photo3.jpeg"

import gbed14 from "../images_of_female_pg/photo14.jpeg"
import gbed15 from "../images_of_female_pg/photo15.jpeg"
import gbed16 from "../images_of_female_pg/photo16.jpeg"
import gbed17 from "../images_of_female_pg/photo17.jpeg"

import gbed20 from "../images_of_female_pg/photo20.jpeg"
import gbed21 from "../images_of_female_pg/photo21.jpeg"
import gbed23 from "../images_of_female_pg/photo23.jpeg"
import Footer from './Footer';


// 🖼️ Replace these with your real image imports or URLs
const galleryImages = [
  gbed1, gbed3, gbed20, gbed14, gbed15,
  gbed16, gbed17, gbed21, gbed23, bed2, bed11,
];

const salesContacts = [
  { title: 'Sales Team', phone: '9326262292' },
  { title: '', phone: '7021368623' },
];

const supportContacts = [
  { title: 'Customer Care', phone: '8928191814' },
];


const Contact = () => {
  return (
 <>
    <section id="contact" className="gradient-bg-contact text-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-4xl text-black font-bold mb-4"style={{ textShadow: '2px 2px 6px rgba(0, 0, 0, 0.0)' }}>
            Connect With Us
          </h2>
        </div>

        <div className="bg-gray-100  backdrop-blur-lg rounded-xl p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-1  gap-6">

              {/* Sales Team */}
              {/* Sales Team */}
              <div className="bg-white backdrop-blur-lg  rounded-xl p-6 text-center ">
                {salesContacts.map(({ title, phone }, idx) => (
                  <div key={idx}>
                    <h3 className="text-lg sm:text-xl text-black font-bold mb-3">
                      {title}
                    </h3>
                    <a
                      href={`tel:${phone}`}
                      className="text-xl sm:text-2xl text-gray-600 font-bold hover:text-[#3730a10] transition duration-300 block"
                    >
                      <i className="fas fa-phone mr-2"></i>{phone}
                    </a>
                  </div>
                ))}
              </div>


              {/* Support */}
              {supportContacts.map(({ title, phone }, idx) => (
                <div
                  key={idx}
                  className="bg-white  backdrop-blur-lg rounded-xl p-6 text-center"
                >
                  <h3 className="text-xl sm:text-xl text-black font-bold mb-3">
                    {title}
                  </h3>
                  <a
                    href={`tel:${phone}`}
                    className="text-xl sm:text-2xl text-gray-600 font-bold hover:text-[#3730a10] transition duration-300 block"
                  >
                    <i className="fas fa-phone mr-2"></i>{phone}
                  </a>
                </div>
              ))}

              {/* Business Proprietor */}
              {/* <div className="sm:col-span-2">
                <h3 className="text-xl sm:text-2xl text-[#3730a3] font-bold text-center mt-6">
                  {proprietorContact.title}
                </h3>
                <div className="flex justify-center mt-4">
                  <a
                    href={`tel:${proprietorContact.phone}`}
                    className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300"
                  >
                    <i className="fas fa-phone mr-2"></i>{proprietorContact.phone}
                  </a>
                </div>
              </div> */}
            </div>

            {/* Image Carousel */}
            <div className="rounded-lg mt-[-50px] overflow-hidden shadow-md">
              <Swiper
                modules={[Autoplay]}
                autoplay={{ delay: 1000 }}
                loop={true}
                slidesPerView={1}
              >
                {galleryImages.map((imgSrc, idx) => (
                  <SwiperSlide key={idx}>
                    <img
                      src={imgSrc}
                      alt={`Location ${idx + 1}`}
                      className="w-full h-60 sm:h-72 md:h-80 lg:h-96 object-cover rounded-md"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

          </div>
        </div>

      </div>
    </section>
     <Footer/>
 </>
  );
};

export default Contact;
