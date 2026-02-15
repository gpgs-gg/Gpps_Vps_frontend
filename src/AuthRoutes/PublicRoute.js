import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';
import { SECRET_KEY } from '../Config';

const PublicRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      let encryptedUser = null;
      let auth = false;

      try {
        encryptedUser = localStorage.getItem('user');
        auth = localStorage.getItem('auth') === 'true';
      } catch (err) {
        console.error('localStorage access error:', err);
        setIsAuthenticated(false);
        return;
      }

      if (auth && encryptedUser) {
        try {
          const bytes = CryptoJS.AES.decrypt(encryptedUser, SECRET_KEY);
          const decrypted = bytes.toString(CryptoJS.enc.Utf8);

          if (!decrypted) {
            console.warn('Decryption failed or returned empty string');
            setIsAuthenticated(false);
            return;
          }

          let user;
          try {
            user = JSON.parse(decrypted);
          } catch (jsonErr) {
            console.error('JSON parsing error:', jsonErr);
            setIsAuthenticated(false);
            return;
          }

          setIsAuthenticated(!!user?.employee?.LoginID);
        } catch (decryptErr) {
          console.error('Decryption error:', decryptErr);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div style={{ textAlign: 'center', marginTop: '40px' }}>Checking login...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/gpgs-actions" replace />;
  }

  return children;
};

export default PublicRoute;
