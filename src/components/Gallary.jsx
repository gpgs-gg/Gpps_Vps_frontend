import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';


// for boys import 
import bed1 from "../images_of_male_pg/bed1.png"
import bed2 from "../images_of_male_pg/bed2.png"
import bed3 from "../images_of_male_pg/bed3.png"
import bed4 from "../images_of_male_pg/photo4.jpeg"
import bed5 from "../images_of_male_pg/photo5.jpeg"
import bed6 from "../images_of_male_pg/photo6.jpeg"
import bed7 from "../images_of_male_pg/photo7.jpeg"
import bed8 from "../images_of_male_pg/photo8.jpeg"
import bed9 from "../images_of_male_pg/photo9.jpeg"
import bed10 from "../images_of_male_pg/photo10.jpeg"
import bed11 from "../images_of_male_pg/photo11.jpeg"
import bed12 from "../images_of_male_pg/photo12.jpeg"
import bed13 from "../images_of_male_pg/photo13.jpeg"
import bed14 from "../images_of_male_pg/photo14.jpeg"
import bed15 from "../images_of_male_pg/photo15.jpeg"
import bed16 from "../images_of_male_pg/photo16.jpeg"
import bed17 from "../images_of_male_pg/photo17.jpeg"
import bed18 from "../images_of_male_pg/photo18.jpeg"
import bed19 from "../images_of_male_pg/photo19.jpeg"
import bed20 from "../images_of_male_pg/photo20.jpeg"
import bed21 from "../images_of_male_pg/photo21.jpeg"
import bed22 from "../images_of_male_pg/photo22.jpeg"
import bed23 from "../images_of_male_pg/photo23.jpeg"
import bed24 from "../images_of_male_pg/photo24.jpeg"
import bed25 from "../images_of_male_pg/photo25.jpeg"
import bed26 from "../images_of_male_pg/photo26.jpeg"
import bed27 from "../images_of_male_pg/photo27.jpeg"
import bed28 from "../images_of_male_pg/photo28.jpeg"
import bed29 from "../images_of_male_pg/photo29.jpeg"
import bed30 from "../images_of_male_pg/photo30.jpeg"

// for girls import 
import gbed1 from "../images_of_female_pg/photo1.jpeg"
import gbed2 from "../images_of_female_pg/photo2.jpeg"
import gbed3 from "../images_of_female_pg/photo3.jpeg"
import gbed4 from "../images_of_female_pg/photo4.jpeg"
import gbed5 from "../images_of_female_pg/photo5.jpeg"
import gbed6 from "../images_of_female_pg/photo6.jpeg"
import gbed7 from "../images_of_female_pg/photo7.jpeg"
import gbed8 from "../images_of_female_pg/photo8.jpeg"
import gbed9 from "../images_of_female_pg/photo9.jpeg"
import gbed10 from "../images_of_female_pg/photo10.jpeg"
import gbed11 from "../images_of_female_pg/photo11.jpeg"
import gbed12 from "../images_of_female_pg/photo12.jpeg"
import gbed13 from "../images_of_female_pg/photo13.jpeg"
import gbed14 from "../images_of_female_pg/photo14.jpeg"
import gbed15 from "../images_of_female_pg/photo15.jpeg"
import gbed16 from "../images_of_female_pg/photo16.jpeg"
import gbed17 from "../images_of_female_pg/photo17.jpeg"
import gbed18 from "../images_of_female_pg/photo18.jpeg"
import gbed19 from "../images_of_female_pg/photo19.jpeg"
import gbed20 from "../images_of_female_pg/photo20.jpeg"
import gbed21 from "../images_of_female_pg/photo21.jpeg"
import gbed22 from "../images_of_female_pg/photo22.jpeg"
import gbed23 from "../images_of_female_pg/photo23.jpeg"
import gbed24 from "../images_of_female_pg/photo24.jpeg"
import gbed25 from "../images_of_female_pg/photo25.jpeg"
import gbed26 from "../images_of_female_pg/photo26.jpeg"
import gbed27 from "../images_of_female_pg/photo27.jpeg"
import gbed28 from "../images_of_female_pg/photo28.jpeg"
import gbed29 from "../images_of_female_pg/photo29.jpeg"
import gbed30 from "../images_of_female_pg/photo30.jpeg"


const images_of_male_pg = [
  bed1,
  bed2,
  bed3,
  bed4,
  bed5,
  bed6,
  bed7,
  bed8,
  bed9,
  bed10,
  bed11,
  bed12,
  bed13,
  bed14,
  bed15,
  bed16,
  bed17,
  bed18,
  bed19,
  bed20,
  bed21,
  bed22,
  bed23,
  bed24,
  bed25,
  bed26,
  bed27,
  bed28,
  bed29,
  bed30,

];

const images_of_female_pg = [
gbed1,
gbed2,
gbed3,
gbed4,
gbed5,
gbed6,
gbed7,
gbed8,
gbed9,
gbed10,
gbed11,
gbed12,
gbed13,
gbed14,
gbed15,
gbed16,
gbed17,
gbed18,
gbed19,
gbed20,
gbed21,
gbed22,
gbed23,
gbed24,
gbed25,
gbed26,
gbed27,
gbed28,
gbed29,
gbed30,


];



const Gallary = () => {
  const [activeTab, setActiveTab] = useState('male');

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const tabs = [
    { id: 'male', label: 'Male PG Photos' },
    { id: 'female', label: 'Female PG Photos' }
  ];

  const currentImages = activeTab === 'male' ? images_of_male_pg : images_of_female_pg;

  return (
    <div className="min-h-screen bg-[#fbfbfb] py-16 px-4 sm:px-6 lg:px-12 mt-20">
      <div className="max-w-7xl mx-auto">
        {/* 🧭 Tabs */}
        <div className="flex justify-center gap-4 mb-5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-sm font-bold text-sm md:text-base  transition-all duration-300 
                ${activeTab === tab.id
                  ? 'border-b-8  border-gray-400 text-black '
                  :' text-gray-700' 
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 📷 Image Grid */}
        <div className="space-y-8" data-aos="fade-up">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-[#407105] mb-8">
            {/* {tabs.find(tab => tab.id === activeTab).label} */}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {currentImages.map((src, index) => (
              <div
                key={index}
                className="group relative w-full h-[400px] overflow-hidden rounded-xl shadow-lg p-5 bg-white"
                data-aos="zoom-in"
                data-aos-delay={(index % 6) * 100}
              >
                <img
                  src={src}
                  alt={`${activeTab} PG ${index + 1}`}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500 ease-in-out"
                />
                {/* Optional overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallary;
