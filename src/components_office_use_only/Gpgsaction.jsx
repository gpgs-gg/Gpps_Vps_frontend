import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link, useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import { SECRET_KEY } from "../Config";
import { PiCalendarCheckThin } from "react-icons/pi";


const Gpgsaction = () => {
  const [showSalesOptions, setShowSalesOptions] = useState(false);
  const [showAccountsOptions, setShowAccountsOptions] = useState(false);
  const [decryptedUser, setDecryptedUser] = useState(null);
  const navigate = useNavigate()

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

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const cardClasses = "bg-white shadow-lg rounded-xl p-5 hover:shadow-2xl transition duration-300  flex flex-col items-center text-center";
  const iconClasses = "h-14 w-14 flex items-center justify-center rounded-full mb-4";
  const titleClasses = "text-xl font-semibold text-gray-800 mb-4";
  const btnClasses = "w-full text-white py-2 px-3 rounded-md font-medium transition";
  const subBtnClasses = "py-2 px-4 rounded-md text-center transition text-sm";

  useEffect(() => {
    if (decryptedUser?.role.toLowerCase() === "client") {
      navigate("/gpgs-actions/tickets")

    }
  }, [decryptedUser])


  return (
    <section className="bg-gray-200 min-h-screen py-10 px-4 md:px-6 flex items-center justify-center">
      {decryptedUser?.role === "admin" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
          {/* Hrms  */}

          <Link to="/gpgs-actions/Check-in-out">
            <div className={cardClasses}>
              <div className={`${iconClasses} bg-green-100 text-green-600`}>
               <PiCalendarCheckThin className='text-2xl text-green-600'/>
              </div>
              <h3 className={titleClasses}>ATTENDANCE</h3>
              <button className={`${btnClasses} bg-indigo-600 hover:bg-indigo-700`}>
                Go For Attendance System
              </button>
            </div>
          </Link>


          {/* TICKETS SYSTEM */}
          <Link to="/gpgs-actions/tickets">
            <div className={cardClasses}>
              <div className={`${iconClasses} bg-green-100 text-green-600`}>
                <i className="fa-solid fa-ticket text-xl"></i>
              </div>
              <h3 className={titleClasses}>TICKETS SYSTEM</h3>
              <button className={`${btnClasses} bg-indigo-600 hover:bg-indigo-700`}>
                Go For Tickets System
              </button>
            </div>
          </Link>

          {/* SALES */}
          <div>
            <div
              className={`${cardClasses} cursor-pointer`}
              //
              onClick={() => setShowSalesOptions(prev => !prev)}
            >
              <div className={`${iconClasses} bg-yellow-100 text-yellow-600`}>
                <i className="fa-solid fa-chart-line text-xl"></i>
              </div>
              <h3 className={titleClasses}>SALES</h3>
              <button className={`${btnClasses} bg-yellow-500 hover:bg-yellow-600`}>
                {showSalesOptions ? 'Hide Sales Options' : 'Show Sales Options'}
              </button>

              {showSalesOptions && (
                <div className="w-full flex flex-col gap-3 mt-5">
                  <Link
                    to="/gpgs-actions/beds-avilable"
                    className={`${subBtnClasses} bg-green-100 text-green-800 hover:bg-green-200`}
                  >
                    🛏️ Bed Status
                  </Link>
                  <Link
                    to="/gpgs-actions/new-booking"
                    className={`${subBtnClasses} bg-indigo-100 text-indigo-800 hover:bg-indigo-200`}
                  >
                    ➕ New Booking
                  </Link>
                </div>
              )}
            </div>
          </div>



          {/* ACCOUNTS */}
          <div>
            <div
              className={`${cardClasses} cursor-pointer`}
              //
              onClick={() => setShowAccountsOptions(prev => !prev)}
            >
              <div className={`${iconClasses} bg-yellow-100 text-yellow-600`}>
                <i className="fa-solid fa-chart-line text-xl"></i>
              </div>
              <h3 className={titleClasses}>ACCOUNTS</h3>
              <button className={`${btnClasses} bg-green-500 hover:bg-green-600`}>
                {showAccountsOptions ? 'Hide Sales Options' : 'Show Sales Options'}
              </button>

              {showAccountsOptions && (
                <div className="w-full flex flex-col gap-3 mt-5">
                  <Link
                    to="/gpgs-actions/Client-Creation"
                    className={`${subBtnClasses} bg-green-100 text-green-800 hover:bg-green-200`}
                  >
                    Client Creation
                  </Link>
                  <Link
                    to="/gpgs-actions/accounts"
                    className={`${subBtnClasses} bg-indigo-100 text-indigo-800 hover:bg-indigo-200`}
                  >
                    RNR Update
                  </Link>
                </div>
              )}
            </div>
          </div>









          {/* <Link to="/gpgs-actions/accounts">
          <div className={cardClasses}>
            <div className={`${iconClasses} bg-green-100 text-green-600`}>
              <i className="fa-solid fa-file-invoice text-xl"></i>
            </div>
            <h3 className={titleClasses}>ACCOUNTS</h3>
            <button className={`${btnClasses} bg-green-600 hover:bg-green-700`}>
              Go For Accounts
            </button>
          </div>
        </Link> */}

        </div>
      )}

    </section>
  );
};

export default Gpgsaction;
