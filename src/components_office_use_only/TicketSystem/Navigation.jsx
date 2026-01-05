import { use, useEffect, useState } from "react";
import { useApp } from "./AppProvider";
import { useAuth } from "../../context/AuthContext";
import { SECRET_KEY } from "../../Config";
import CryptoJS from 'crypto-js';

export const Navigation = () => {
  const { currentView, setCurrentView, currentUser } = useApp();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout } = useAuth();

  const [decryptedUser, setDecryptedUser] = useState(null);

const rawMenuItems = [
  { id: 'pgpropertydetails', label: 'Property Info', icon: 'fa-solid fa-house' },
  { id: 'personalinfo', label: 'Personal Info', icon: 'fa-solid fa-circle-info' },
  { id: 'payments', label: 'Payments', icon: 'fa-solid fa-credit-card' },
  { id: 'documents', label: 'Documents', icon: 'fa-solid fa-file' },
  { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
  { id: 'EBInfo', label: 'Electricity Bill Info', icon: 'fas fa-tachometer-alt' },
  // { id: 'mypgtickets', label: 'Property Tickets', icon: 'fa-solid fa-ticket' },

  {
    id: 'tickets',
    label: decryptedUser?.role === 'client' ? 'My Tickets' : 'All Tickets',
    icon: 'fas fa-ticket-alt'
  },
  { id: 'create', label: 'Create Ticket', icon: 'fas fa-plus-circle' },
];

// Filter logic based on role
const menuItems = rawMenuItems.filter(item => {
  if (decryptedUser?.role === 'client') {
    // For clients, exclude 'dashboard'
    return ['pgpropertydetails', 'personalinfo', 'payments', "documents" ,"mypgtickets" ,'tickets', 'create', 'EBInfo'].includes(item.id);
  } else {
    // For other roles, exclude 'overview', 'personalinfo', 'payments'
    return !['pgpropertydetails', 'personalinfo', 'payments',"mypgtickets", "documents" ,].includes(item.id);
  }
});


  const handleLogout = () => {
    logout();
    window.location.reload(); // Refresh to reset state
  }

  useEffect(() => {
    setDecryptedUser(decryptUser(localStorage.getItem('user')))
      ; // Just to verify decryption works
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

  return (
    <div className="bg-[#F8F9FB] shadow-sm border-b border-gray-200 mb-6 no-print">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center space-x-2">
          <i className="fas fa-ticket-alt text-2xl text-orange-600"></i>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">GPGS Ticket System</h1>
        </div>


      </div>

      {/* Navigation Menu */}
      <nav className="px-4 sm:px-6">
        <div
          className={`
      grid grid-cols-2 gap-2 mt-10 
      sm:flex sm:flex-row sm:space-x-6 sm:space-y-0
    `}
        >
          {menuItems.map(item => {
            if (item.adminOnly && currentUser?.role !== 'Admin') return null;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setMobileMenuOpen(false); // Close on mobile after selection
                }}
                className={`
            flex items-center space-x-2 px-3 py-2 text-lg font-medium rounded-md 
            sm:rounded-t-lg border-b-2 transition-colors 
            text-left w-full sm:w-auto
            ${currentView === item.id
                    ? 'text-orange-600 border-orange-600 bg-orange-50'
                    : 'text-black border-transparent hover:text-gray-900 hover:border-gray-300'
                  }
          `}
              >
                <i className={item.icon}></i>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

    </div>
  );
};

export default Navigation;
