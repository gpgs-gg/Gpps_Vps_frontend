import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link, useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import { SECRET_KEY } from "../Config";
import { PiCalendarCheckThin } from "react-icons/pi";
import { IoIosPeople } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { usePermissionData } from './TicketSystem/Services';

const Gpgsaction = () => {
  const [activePopup, setActivePopup] = useState(null);
  const [decryptedUser, setDecryptedUser] = useState(null);
  const navigate = useNavigate();
  const { data: permission } = usePermissionData();

  const functionPermission = permission?.data || [];
  const userEmail = decryptedUser?.employee?.LoginID;

  const hasAttendancePermission = functionPermission.some(
    (item) => item.Attendance === userEmail
  );

  const hasSalaryPermission = functionPermission.some(
    (item) => item.Salary === userEmail
  );

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

  useEffect(() => {
    if (decryptedUser?.employee?.Role?.toLowerCase() === "client") {
      navigate("/gpgs-actions/tickets");
    }
  }, [decryptedUser, navigate]);

  const cardClasses =
    "bg-white shadow-lg rounded-xl p-5 hover:shadow-2xl transition duration-300 flex flex-col items-center text-center cursor-pointer";

  const iconClasses =
    "h-14 w-14 flex items-center justify-center rounded-full mb-4";

  const titleClasses =
    "text-xl font-semibold text-gray-800 mb-4 uppercase tracking-wide";

  const btnClasses =
    "w-full text-white py-2 px-3 rounded-md font-medium transition";

  const subBtnClasses =
    "py-2 px-4 rounded-md text-center transition text-sm bg-white text-black show w-full hover:bg-gray-100";

  return (
    <>
      <section className="bg-gray-200 min-h-screen py-10 px-4 md:px-6 flex items-center justify-center">
        {decryptedUser?.employee?.Role === "admin" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">

            {/* HRMS */}
            <div className={cardClasses} onClick={() => setActivePopup("HRMS")}>
              <div className={`${iconClasses} bg-yellow-100 text-yellow-600`}>
                <PiCalendarCheckThin className="text-2xl" />
              </div>
              <h3 className={titleClasses}>HRMS</h3>
              <button className={`${btnClasses} bg-orange-500`}>
                Open HRMS
              </button>
            </div>

            {/* TICKETS */}
            <Link to="/gpgs-actions/tickets">
              <div className={cardClasses}>
                <div className={`${iconClasses} bg-green-100 text-green-600`}>
                  🎫
                </div>
                <h3 className={titleClasses}>TICKETS SYSTEM</h3>
                <button className={`${btnClasses} bg-indigo-600`}>
                  Go For Tickets
                </button>
              </div>
            </Link>

            {/* SALES */}
            <div className={cardClasses} onClick={() => setActivePopup("SALES")}>
              <div className={`${iconClasses} bg-yellow-100 text-yellow-600`}>
                📈
              </div>
              <h3 className={titleClasses}>SALES</h3>
              <button className={`${btnClasses} bg-yellow-500`}>
                Open Sales
              </button>
            </div>

            {/* ACCOUNTS */}
            <div className={cardClasses} onClick={() => setActivePopup("ACCOUNTS")}>
              <div className={`${iconClasses} bg-green-100 text-green-600`}>
                💰
              </div>
              <h3 className={titleClasses}>ACCOUNTS</h3>
              <button className={`${btnClasses} bg-green-500`}>
                Open Accounts
              </button>
            </div>

            {/* HOUSEKEEPING */}
            <Link to="/gpgs-actions/housekeeping-todo">
              <div className={cardClasses}>
                <div className={`${iconClasses} bg-rose-100 text-rose-500`}>
                  🧹
                </div>
                <h3 className={titleClasses}>HOUSEKEEPING</h3>
                <button className={`${btnClasses} bg-rose-500`}>
                  To-Do Housekeeping
                </button>
              </div>
            </Link>

            {/* MAINTENANCE */}
            <Link to="/gpgs-actions/maintenance-todo">
              <div className={cardClasses}>
                <div className={`${iconClasses} bg-blue-100 text-blue-500`}>
                  🛠️
                </div>
                <h3 className={titleClasses}>Maintenance</h3>
                <button className={`${btnClasses} bg-blue-500`}>
                  To-Do Maintenance
                </button>
              </div>
            </Link>

          </div>
        )}
      </section>

      {/* POPUP */}
      {activePopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-200 w-full max-w-md rounded-xl p-6 relative">
            <button
              className="absolute top-3 right-3 text-xl"
              onClick={() => setActivePopup(null)}
            >
              <IoClose />
            </button>

            <h2 className="text-2xl font-bold text-center mb-6">
              {activePopup}
            </h2>

            <div className="flex flex-col gap-3">

              {activePopup === "HRMS" && (
                <>
                  <Link to="/gpgs-actions/Check-in-out" className={subBtnClasses}>
                    Check In / Check Out
                  </Link>

                  {hasAttendancePermission && (
                    <Link to="/gpgs-actions/attendance-details" className={subBtnClasses}>
                      Attendance Details
                    </Link>
                  )}

                  {hasSalaryPermission && (
                    <Link to="/gpgs-actions/sallary-details" className={subBtnClasses}>
                      Salary Details
                    </Link>
                  )}
                </>
              )}

              {activePopup === "SALES" && (
                <>
                  <Link to="/gpgs-actions/beds-avilable" className={subBtnClasses}>
                    🛏️ Bed Status
                  </Link>
                  <Link to="/gpgs-actions/new-booking" className={subBtnClasses}>
                    ➕ New Booking
                  </Link>
                  <Link to="/gpgs-actions/leads-list" className={subBtnClasses}>
                    📋 PG Leads
                  </Link>
                </>
              )}

              {activePopup === "ACCOUNTS" && (
                <>
                  <Link to="/gpgs-actions/Client-Creation" className={subBtnClasses}>
                    Client Creation
                  </Link>
                  <Link to="/gpgs-actions/bank-transaction" className={subBtnClasses}>
                    Bank Transaction
                  </Link>
                  <Link to="/gpgs-actions/expense-management" className={subBtnClasses}>
                    Expense Management
                  </Link>
                  <Link to="/gpgs-actions/accounts" className={subBtnClasses}>
                    RNR Update
                  </Link>
                  <Link to="/gpgs-actions/eb-info" className={subBtnClasses}>
                    EB Info
                  </Link>
                  <Link to="/gpgs-actions/eb-calculation" className={subBtnClasses}>
                    EB Calculator
                  </Link>
                  <Link to="/gpgs-actions/eb-calculated-list" className={subBtnClasses}>
                    View Calculated EBs
                  </Link>
                </>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Gpgsaction;