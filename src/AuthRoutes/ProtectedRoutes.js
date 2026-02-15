// // components/ProtectedRoute.js
// import { Navigate, useLocation } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import CryptoJS from 'crypto-js';
// import { SECRET_KEY } from '../Config';

// const ProtectedRoute = ({ children }) => {
//   const location = useLocation();
//   const [decryptedUser, setDecryptedUser] = useState(null);
//   const [loading, setLoading] = useState(true); // ⏳ To show loading until decryption finishes

//   // Decrypt user data from localStorage
//   useEffect(() => {
//     const decryptUser = (encryptedData) => {
//       try {
//         const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
//         const decrypted = bytes.toString(CryptoJS.enc.Utf8);
//         return JSON.parse(decrypted);
//       } catch (error) {
//         console.error('❌ Failed to decrypt user:', error);
//         return null;
//       }
//     };

//     const encryptedUser = localStorage.getItem('user');
//     const isAuthenticated = localStorage.getItem('auth') === 'true';

//     if (isAuthenticated && encryptedUser) {
//       const user = decryptUser(encryptedUser);
//       setDecryptedUser(user);
//     }

//     setLoading(false);
//   }, []);

//   // ⏳ Show nothing or loader while decrypting
//   if (loading) return null; // Or <Loader />

//   // ❌ If unauthenticated or missing loginId
//   if (!decryptedUser || !decryptedUser.loginId) {
//     return <Navigate to="/gpgs-actions/login" replace state={{ from: location }} />;
//   }

//   // ✅ If authenticated and decrypted user is valid
//   return children;
// };

// export default ProtectedRoute;





// components/ProtectedRoute.js
import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';
import { SECRET_KEY } from '../Config';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const [status, setStatus] = useState('checking'); // 'checking', 'unauthenticated', 'unauthorized', 'authorized'
  const location = useLocation();

  useEffect(() => {
    const encryptedUser = localStorage.getItem('user');
    const auth = localStorage.getItem('auth') === 'true';
      
    if (auth && encryptedUser) {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedUser, SECRET_KEY);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        const user = JSON.parse(decrypted);
        if (user?.employee?.LoginID) {
          if (allowedRoles.length === 0 || allowedRoles.includes(user?.employee?.Role)) {
            setStatus('authorized');
          } else {
            setStatus('unauthorized');
          }
        } else {
          setStatus('unauthenticated');
        }
      } catch (err) {
        setStatus('unauthenticated');
      }
    } else {
      setStatus('unauthenticated');
    }
  }, [allowedRoles]);

  if (status === 'checking') return null; // Optional: Show loader or splash screen

  if (status === 'unauthenticated') {
    return <Navigate to="/gpgs-actions/login" replace state={{ from: location }} />;
  }

  if (status === 'unauthorized') {
    return <Navigate to="/unauthorized" replace />;
  }

  return children; // Authorized
};

export default ProtectedRoute;
