import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

import './styles.css';

// import required modules
import { EffectCoverflow, Pagination } from 'swiper/modules';



import bed3 from "../images_of_male_pg/bed3.png"
import bed5 from "../images_of_male_pg/photo5.jpeg"

import bed8 from "../images_of_male_pg/photo8.jpeg"

import bed13 from "../images_of_male_pg/photo13.jpeg"

import bed16 from "../images_of_male_pg/photo16.jpeg"

import bed20 from "../images_of_male_pg/photo20.jpeg"

import bed25 from "../images_of_male_pg/photo25.jpeg"

import gbed19 from "../images_of_female_pg/photo19.jpeg"
import gbed2 from "../images_of_female_pg/photo2.jpeg"
import gbed27 from "../images_of_female_pg/photo27.jpeg"
import { Link } from 'react-router-dom';
import googlePng from "../logo/download_google-removebg-preview.png"
import documentPng from "../logo/Document.png"
import clockPng from "../logo/Clock.png"
import securedPng from "../logo/Secured.png"
import FirePng from "../logo/Fire.png"
import INRPng from "../logo/INR.png"
import GreenTickPng from "../logo/GreenTick.png"
import Housekeeping from "../logo/Housekeeping.png"
import ToolsPng from "../logo/Tools.png"
import WifiPng from "../logo/WiFi.png"





const Services = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // global animation duration
      once: false, // whether animation should happen only once - default true
    });
    AOS.refresh(); // refresh AOS when component mounts or updates
  }, []);

  const TestemonialContent = [
    {
      profile: " ",
      name: "Vanshika Gupta",
      rating: 5,
      link: "https://maps.app.goo.gl/MCP7NWLN6r2cS9eK8",
      reviewText: "Very systematic, very professional and the housekeeping is really good, the staffs are also very helpful & polite. They take quick actions in case we face any issues. The safety of this PG is 100% assured by them. Happy with the services.👍💯."
    },
    {
      profile: "",
      name: "Apoorva Sharma",
      rating: 5,
      link: "https://maps.app.goo.gl/qMrQEaYJpifQowjG8",
      reviewText: "Good place to live. They provide fully furnished accommodation along with well equipped kitchens and washrooms. They immediately address issues related to stay. I recommend ladies to consider Gopal's paying guest Nerul."
    },
    {
      profile: " ",
      name: "Obaidullah Molla",
      rating: 5,
      link: "https://maps.app.goo.gl/fdbhC4jn3rG61Pz6A",
      reviewText: "The best PG in Navi Mumbai. All the staffs are excellent. I stayed here for 2.5 months and my experience was amazing. All the facilities like cooking gas, refrigerator etc. are available here. Staffs are quick to resolve any problem. Thanks Gopal's PG for providing excellent service at reasonable price. Thank you so much..."
    },
    {
      profile: " ",
      name: "Sangeeta Bhatia",
      rating: 5,
      link: "https://maps.app.goo.gl/cZJf5sHUGRws3svj7",
      reviewText: "Accommodation is very neat clean. Every day cleaning takes place. My daughter was very safe here. They even helped with medicine when my daughter was sick. I would recommend this accommodation to everyone."
    },
    {
      profile: " ",
      name: "Mitali Wagh",
      rating: 4,
      link: "https://maps.app.goo.gl/6751PHtGVEULJYvXA",
      reviewText: "PG provides all the Facilities which are required and also the members of PG are available on single call if any problems arise and quick actions are taken."
    },
    {
      profile: " ",
      name: "Anand Arora",
      rating: 5,
      link: "https://maps.app.goo.gl/C4EBqz6uaZqkLqdw9",
      reviewText: "I had a great experience staying at PG. The rooms were clean, well-maintained, and offered all the basic amenities needed for a comfortable stay. The management was professional and responsive, always ready to help with any issues."
    },
    {
      profile: " ",
      name: "Anitha Manoharan",
      rating: 4,
      link: "https://maps.app.goo.gl/d8SthHtFSVxj7xgq9",
      reviewText: "1. Good maintenance 2. Safe and secured 3. Our concerns are taken and solved immediately."
    },
    {
      profile: " ",
      name: "Vaishnavi Raut",
      rating: 5,
      link: "https://maps.app.goo.gl/bkPeyR1BYWHStGG29",
      reviewText: "Such a wonderful PG! Daily cleaning is well-maintained, and any issues raised by PG members are addressed immediately. I’ve never seen a PG like this before. Thank you for your excellent service!"
    },
    {
      profile: " ",
      name: "Vidit Solanki",
      rating: 4,
      link: "https://maps.app.goo.gl/KDsmiM8rhkd9yCnw6",
      reviewText: "Good service. Actively takes action on issues raised."
    },
    {
      profile: " ",
      name: "Yogita Bhagat",
      rating: 5,
      link: "https://maps.app.goo.gl/nbicgnhuUhAt9NAw7",
      reviewText: "Best property I ever seen.. Very neat and clean.. All staff is very kind and prompt....Overall, it gives best PG experience...Thank you ☺️"
    },
    {
      profile: " ",
      name: "Arjun Arjun",
      rating: 4,
      link: "https://maps.app.goo.gl/Nnex8rhrPgYUeBkZ9",
      reviewText: "In Gopal's Paying Guest, I stayed for 4 months. Well maintained rooms. Especially the management very responsive and nice location with easy access to market, station and park."
    },
    {
      profile: " ",
      name: "Wajahat Khan",
      rating: 4,
      link: "https://maps.app.goo.gl/ZiRcv4JWaVdkTa6i6",
      reviewText: "Good PG services. Responsive. Beautiful Environment. Proximity to all important things. Cleaned from time to time."
    },
    {
      profile: " ",
      name: "Amey Patil",
      rating: 5,
      link: "https://maps.app.goo.gl/BwAsAiNisHJCAYDEA",
      reviewText: "It was very good experience to stay in the This facility.The management of this facility must deserve the appreciation for efforts they are taking to provide best service to guests"
    },
    {
      profile: " ",
      name: "Manas Meshram",
      rating: 4,
      link: "https://maps.app.goo.gl/FD5hN48uTQKHSmf17",
      reviewText: "Good Place to stay, Everything was clean- The Kitchen, The bedroom, The bedsheets etc. The service was also good."
    },
    {
      profile: " ",
      name: "Shubhi Dehariya",
      rating: 5,
      link: "https://maps.app.goo.gl/s96BsR5KEedeqJUi7",
      reviewText: "The staff is very good and helpful and cleanliness is always maintained in the PG."
    },
    {
      profile: " ",
      name: "Sachin",
      rating: 5,
      link: "https://maps.app.goo.gl/Nx1uroWRQw4A75KPA",
      reviewText: "Highly recommend! Excellent service, clean property, and daily housekeeping make it perfect for short or long-term stays in Navi Mumbai. If you are searching for PG accommodation then this is the best option."
    },
    {
      profile: " ",
      name: "Remhlupuii",
      rating: 4,
      link: "https://maps.app.goo.gl/GuidG5g4tPb12kVi9",
      reviewText: "The customer service was efficient and prompt. I highly recommend this place. I stayed there for 11 months, and I believe it’s the best PG I’ve experienced."
    },
    {
      profile: " ",
      name: "Ather Khan",
      rating: 5,
      link: "https://maps.app.goo.gl/E5PTkHaQ6gUoNchH8",
      reviewText: "Only Professional PG Service in Navi Mumbai, Affordable, On Spot Solution And The Best Part Is They Are Really Outstanding In Maintaining PG Housekeeping, which makes them better than any other PG. And last but not least a hustle free Checkout with On time FnF. Thank You for your great hospitality."
    },
    {
      profile: " ",
      name: "Anitha Meenakshi",
      rating: 5,
      link: "https://maps.app.goo.gl/3xmJC62ggz7S7eGM7",
      reviewText: "The PG was very comfortable to stay and  any need is there they were attending immediately. It was very safe to stay."
    },
    {
      profile: " ",
      name: "Vedant Karale",
      rating: 5,
      link: "https://maps.app.goo.gl/S3BQWUfBBSg7nnrX6",
      reviewText: "Amazing PGs. Unbelievably fast problem resolution. Plumbing and electricity problems would be resolved within 3-4 hours. The management shows commendable dedication for the well-being of those who stay here."
    },
  ]

  const [swiperInstance, setSwiperInstance] = useState(null);


  return (
    <>

      <section className='border bg-[#F8F9FB]'>

        <h1 className="flex items-center justify-center bg-[#F8F9FB] gap-1">
          <Link className="underline text-blue-500 cursor-pointer font-bold" to="https://www.google.com/maps/place/Gopal's+Paying+Guest+Services/@19.0347746,73.0228427,17z/data=!4m8!3m7!1s0x3be7c30f479c2543:0x2955da06c91d2d7f!8m2!3d19.0346655!4d73.024013!9m1!1b1!16s%2Fg%2F11rc28lypw?entry=ttu&g_ep=EgoyMDI1MDkxNi4wIKXMDSoASAFQAw%3D%3D" target='_black'>
            Click Here</Link> to check us on
          <img
            src={googlePng}
            alt="Logo"
            className="h-20 w-auto ml-1 bg-[#F8F9FB]"
          />
        </h1>
        <div
          onMouseEnter={() => swiperInstance?.autoplay?.stop()}
          onMouseLeave={() => swiperInstance?.autoplay?.start()}
        >
          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            loop={true}
            autoplay={{
              delay: 1000,
              disableOnInteraction: false,
            }}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 50,
              modifier: 10,
              slideShadows: true,
            }}
            pagination={{ clickable: true }}
            modules={[EffectCoverflow, Pagination, Autoplay]}
            onSwiper={(swiper) => setSwiperInstance(swiper)}
            className="mySwiper"
          >
            {TestemonialContent.map((ele, i) => (
              <SwiperSlide
                key={i}
                className="text-black mt-[-50px] hover:scale-95 transition-transform duration-300 bg-white border rounded-xl border-green-900 shadow-xl w-72 sm:w-80"
              >
                <a href={ele.link} target="_blank" rel="noopener noreferrer">
                  <div className="flex flex-col p-5 rounded-xl">
                    <div className="flex gap-2 items-center mb-2">
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                        {ele.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1 mb-1 text-yellow-500 text-sm">
                          {Array(ele.rating)
                            .fill("⭐")
                            .map((star, i) => (
                              <span key={i}>{star}</span>
                            ))}
                        </div>
                        <h1 className="text-base font-semibold capitalize">
                          {ele.name}
                        </h1>
                      </div>
                    </div>
                    <p className="capitalize text-sm mt-1 text-gray-700">
                      {ele.reviewText}
                    </p>
                  </div>
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>


      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2c4d04] mb-4" style={{ textShadow: '2px 2px 6px rgba(0, 0, 0, 0.3)' }}>Services & Facilities</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-4xl mx-auto">
              Smartly designed accommodations with all-inclusive comfort — everything you need, at one price.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left Side: Carousel & Info */}
            <div>
              <div className="bg-[#F8F9FB] rounded-xl shadow-lg p-6 ">
                {/* Swiper Carousel */}
                <div className="rounded-lg overflow-hidden">
                  <Swiper
                    modules={[Autoplay]}
                    autoplay={{ delay: 1000 }}
                    loop={true}
                    slidesPerView={1}
                  >
                    {[bed3, bed5, bed8, gbed19, bed13, bed16, bed20, bed25, gbed2, gbed27].map((src, idx) => (
                      <SwiperSlide key={idx}>
                        <img
                          src={src}
                          alt={`Location ${idx + 1}`}
                          className="w-full h-72 sm:h-64 md:h-72 lg:h-80 object-cover rounded-md"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                {/* Info Box */}
                <div className="bg-white p-6 rounded-lg flex justify-center items-center flex-col gap-2 text-center">
                  <i className="fas fa-city text-purple-600 text-3xl md:text-4xl mb-4"></i>

                  <p className="font-bold text-gray-900 text-xl md:text-lg">
                    Found The Right Option For You?
                  </p>

                  <div className="text-gray-600 mt-2 text-sm md:text-base w-full flex justify-center">
                    <a
                      href="/contact"
                      className="group relative py-2 px-8 flex justify-center items-center rounded-full w-full max-w-md mb-2 space-x-2 overflow-hidden border bg-[#297229]"
                    >
                      <span className="text-white text-base sm:text-lg md:text-xl transform animate-zoom">
                        Reserve Your Spot Today
                      </span>
                    </a>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Side: Accommodation Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  title: "Private Room",
                  subtitle: "Privacy & Personal Space",
                  price: "₹8,500 - ₹28,000/month",
                },
                {
                  title: "Double Sharing",
                  subtitle: "Friendship & Connections",
                  price: "₹6,500 - ₹14,000/month",
                },
                {
                  title: "Triple Sharing",
                  subtitle: "Vibrant Community Atmosphere",
                  price: "₹6,500 - ₹12,000/month",
                },
                {
                  title: "Quad Sharing",
                  subtitle: "Vibrant Community Atmosphere",
                  price: "₹8,000 - ₹10,000/month",
                },
              ].map((room, index) => (
                <div
                  key={index}
                  className="card-hover bg-white rounded-xl shadow-lg overflow-hidden border flex flex-col justify-between"
                >
                  <div className="p-6 text-center ombre-container  text-white">
                    <h3 className="text-xl font-bold mb-2" style={{ textShadow: '2px 2px 6px rgba(0, 0, 0, 0.4)' }}>{room.title}</h3>
                    <p className="text-sm " style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)' }}>{room.subtitle}</p>
                  </div>
                  <div className="p-6 flex-grow flex flex-col justify-center items-center">
                    <ul className="space-y-3 text-gray-700 text-sm text-center">
                      <li><i className="fas fa-check text-green-500 mr-2"></i>AC/Non-AC rooms</li>
                      <li><i className="fas fa-check text-green-500 mr-2"></i>{room.price}</li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 bg-[#F8F9FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid bg-white rounded-xl p-2 md:grid-cols-2 gap-12 items-center">
            <div className='  flex flex-col justify-center items-center'>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Services Included</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className=" bg-white rounded-full flex items-center justify-center">
                    {/* <i className="fas fa-wifi text-green-600"></i> */}
                    <img src="https://cdn-icons-gif.flaticon.com/15576/15576872.gif" alt="" className='h-9 w-9' />
                  </div>
                  <span className="text-gray-700">High-Speed WiFi</span>
                </div>
                <div className="flex items-center justify-center">
                  <div className=" bg-white rounded-full flex items-center justify-center">
                    {/* <i className="fas fa-broom text-blue-600"></i> */}
                    <img src="https://cdn-icons-gif.flaticon.com/10053/10053406.gif" alt="" className='h-12 w-12 mt-[-15px]' />
                  </div>
                  <span className="text-gray-700">Housekeeping</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className=" bg-white rounded-full flex items-center justify-center">
                    {/* <i className="fas fa-tools text-purple-600"></i> */}
                    <img src="https://cdn-icons-gif.flaticon.com/17122/17122628.gif" alt="" className='h-9 w-9' />
                  </div>
                  <span className="text-gray-700">Maintenance</span>
                </div>
                <div className="flex items-center ml-4 space-x-2">
                  <div className=" bg-white rounded-full flex items-center justify-center">
                    {/* <i className="fas fa-fire text-orange-600"></i> */}
                    <img src="https://cdn-icons-gif.flaticon.com/15578/15578668.gif" alt="" className='h-10 w-10 mt-[-14px]' />
                  </div>
                  <span className="text-gray-700">Cooking Gas</span>
                </div>
              </div>
            </div>

            <div className='flex flex-col justify-center items-center p-5'>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-start">Premium Amenities</h3>
              <div className="space-y-4 capitalize">
                <div className="flex items-start space-x-3">
                  {/* <i className="fas fa-check-circle text-green-500 mt-1"></i> */}
                  <img src={GreenTickPng} alt="" className='h-5 w-5' />
                  <div>
                    <p className="font-medium text-gray-900">Fully Furnished Rooms</p>
                    <p className="text-gray-600  text-sm">Full-size bed, quality mattress, wardrobe, bedside table</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <img src={GreenTickPng} alt="" className='h-5 w-5' />
                  <div>
                    <p className="font-medium text-gray-900">Modern Kitchen</p>
                    <p className="text-gray-600 text-sm">Gas stove, microwave, toaster, mixer grinder,
                      water purifier</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <img src={GreenTickPng} alt="" className='h-5 w-5 ' />
                  <div>
                    <p className="font-medium text-gray-900">Laundry & Utilities</p>
                    <p className="text-gray-600 text-sm">Fully automatic washing machine, geyser,
                      refrigerator</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        <section id="services" className=" bg-[#F8F9FB] pt-5 ">
          <div className="max-w-[1220px] bg-white rounded-xl py-5 mx-auto">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-[#2c4d04]" style={{ textShadow: '2px 2px 6px rgba(0, 0, 0, 0.3)' }}>Additional Information</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-5 items-center">
              <div className='flex flex-col justify-center items-center'>
                <h3 className="text-2xl font-semibold text-gray-900 ">Monthly Expenses</h3>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                      {/* <i className="fa-solid fa-indian-rupee-sign text-xl text-green-500"></i>  */}
                      <img src={INRPng} alt="" className='h-8 w-8' />
                    </div>
                    <span className="text-gray-700">Rent + Electricity Bill (Your responsibility)</span>
                  </div>

                </div>
              </div>

              <div className='flex flex-col justify-center items-center p-5'>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-start">Security Deposit</h3>
                <div className="space-y-4 capitalize">
                  <div className="flex items-start space-x-3">
                    <img src={securedPng} alt="" className='h-5 w-5' />
                    <div>
                      <p className="text-gray-600  text-sm">1.5-2 months rent (varies by property)</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <img src={clockPng} alt="" className='h-5 w-5' />
                    <div>
                      <p className="text-gray-600 text-sm">Fully refundable with 1 month notice</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    {/* <i className="fas fa-check-circle text-green-500 mt-1"></i> */}
                    <img src={documentPng} alt="" className='h-5 w-5' />
                    <div>
                      <p className="text-gray-600 text-sm">Documentation charges : ₹500 (one-time)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </section>
      </section>





    </>
  )
}

export default Services
