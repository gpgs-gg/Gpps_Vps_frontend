// import React, { useState, useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { useClientDetails, useEmployeeDetails } from './services';
// import CryptoJS from 'crypto-js';
// import { SECRET_KEY } from '../Config';
// import SignupPage from './SignupPage';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const LoginPage = () => {
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const [showPassword, setShowPassword] = useState(false);
//   const [isOpen, setIsOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [loginData, setLoginData] = useState(null);

  // const { data: userData, isLoading: isEmpLoading } = useEmployeeDetails();
  // const { data: clientData, isLoading: isClientLoading } = useClientDetails();

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm();

//   // Normalize employee data
//   const normalizedUsers = (userData?.data || []).map(user => ({
//     id: user["EmployeeID"],
//     name: user["Name"],
//     role: user["Role"],
//      IsActive: user["IsActive"],
//     loginId: user["Login ID"] || user["LoginID"],
//     password: user["Password"],
//   }));

//   // Normalize client data
//   const normalizedClients = (clientData?.data || []).map(client => ({
//      clientID: client["ClientID"],
//     name: client["Name"],
//     loginId: client["LoginID"],
//     password: client["Password"],
//     IsActive: client["IsActive"],
//     role: client["Role"],
//     propertyCode: client["PropertyCode"],
//     doj: client["DOJ"],
//     actualDoj: client["ActualDOJ"],
//     isActive: client["IsActive"],
//     id: client["ID"],
//     temporaryPropCode: client["TemporaryPropCode"],
//     bloodGroup: client["BloodGroup"],
//     occupation: client["Occupation"],
//     organisation: client["Organisation"],
//     calling: client["CallingNo"],
//     whatsAppNo: client["WhatsAppNo"],
//     dob: client["DOB"],
//     emgyCont1FullName: client["EmgyCont1FullName"],
//     emgyCont1No: client["EmgyCont1No"],
//     emgyCont2FullName: client["EmgyCont2FullName"],
//     emgyCont2No: client["EmgyCont2No"],
//   }));

//   // Decrypt password
//   const decrypt = (encryptedText) => {
//     try {
//       const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
//       return bytes.toString(CryptoJS.enc.Utf8);
//     } catch (err) {
//       console.error("❌ Decryption failed:", err);
//       return '';
//     }
//   };

//   // Handle login submit (step 1): just set data and trigger flow
//   const onSubmit = (data) => {
//     setIsSubmitting(true);
//     setLoginData(data);
//   };

//   // Effect: Watch for when API finishes loading and submission is in progress
//   useEffect(() => {
//     if (isSubmitting && !isEmpLoading && !isClientLoading && loginData) {
//       processLogin(loginData);
//     }
//   }, [isSubmitting, isEmpLoading, isClientLoading, loginData]);

//   const processLogin = (data) => {
//     const inputLoginId = data.loginId.trim();
//     const inputPassword = data.password.trim();

//     const matchedEmployee = normalizedUsers.find((user) => {
//       const decryptedPassword = decrypt(user.password);
//       return (
//         user.loginId?.trim().toLowerCase() === inputLoginId.toLowerCase() &&
//         decryptedPassword === inputPassword &&
//         user.IsActive?.toLowerCase() === "yes"
//       );
//     });
    

//     const matchedClient = !matchedEmployee && normalizedClients.find((client) => {
//       const decryptedPassword = decrypt(client.password);
//       return (
//         client.loginId?.trim().toLowerCase() === inputLoginId.toLowerCase() &&
//         decryptedPassword === inputPassword &&
//         client.IsActive?.toLowerCase() === "yes"
//       );
//     });

//     const inactiveClient = !matchedEmployee && normalizedClients.find((client) => {
//       const decryptedPassword = decrypt(client.password);
//       return (
//         client.loginId?.trim().toLowerCase() === inputLoginId.toLowerCase() &&
//         decryptedPassword === inputPassword &&
//         client.IsActive?.toLowerCase() !== "yes"
//       );
//     });
//     const inactiveEmployee = !matchedClient && normalizedUsers.find((user) => {
//       const decryptedPassword = decrypt(user.password);
//       return (
//         user.loginId?.trim().toLowerCase() === inputLoginId.toLowerCase() &&
//         decryptedPassword === inputPassword &&
//         user.IsActive?.toLowerCase() !== "yes"
//       );
//     });

//     const user = matchedEmployee || matchedClient;

//     if (user) {
//       login(user);
//       toast.success("Logged in successfully!", { toastId: "login-success" });
//       localStorage.setItem('loginTimestamp', Date.now());
//       window.location.reload();
//       reset();
//     } else if (inactiveClient) {
//       toast.error("You don't have permission to log in. Please contact Administrator.", {
//         toastId: 'inactive-client',
//       });
//     }  else if (inactiveEmployee) {
//       toast.error("You don't have permission to log in. Please contact Administrator.", {
//         toastId: 'inactive-Employee',
//       });
//     } else {
//       toast.error('Invalid Login ID or Password', {
//         toastId: 'login-error',
//       });
//     }

//     // Cleanup
//     setIsSubmitting(false);
//     setLoginData(null);
//   };

//   return (
//     <>
//       <div className="flex items-center justify-center p-6 min-h-screen bg-[#F8F9FB]">
//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg"
//         >
//           <h2 className="text-2xl font-bold text-orange-600 mb-2">Login</h2>
//           <p className="text-gray-600 mb-4">Enter your login credentials to access your account.</p>

//           {/* Login ID */}
//           <label htmlFor="loginId" className="block mb-1 text-gray-700 font-medium">
//             Email ID
//           </label>
//           <input
//             id="loginId"
//             type="text"
//             placeholder="Enter your email ID"
//             {...register('loginId', { required: 'Login ID is required' })}
//             className="w-full mb-3 px-3 py-2 border border-orange-300 rounded focus:ring-2 outline-none focus:ring-orange-300"
//           />
//           {errors.loginId && <p className="text-red-600 text-sm">{errors.loginId.message}</p>}

//           {/* Password */}
//           <label htmlFor="password" className="block mt-4 mb-1 text-gray-700 font-medium">
//             Password
//           </label>
//           <div className="relative">
//             <input
//               id="password"
//               type={showPassword ? 'text' : 'password'}
//               placeholder="Enter password"
//               {...register('password', {
//                 required: 'Password is required',
//                 validate: (value) => {
//                   const trimmed = value.trim();
//                   if (trimmed.length === 0) return 'Password cannot be empty';
//                   if (trimmed.length < 6) return 'Minimum 6 characters';
//                   return true;
//                 },
//               })}
//               className="w-full px-3 py-2 pr-10 border border-orange-300 outline-none rounded focus:ring-2 focus:ring-orange-300"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-2 top-2 text-gray-600 hover:text-orange-500"
//               tabIndex={-1}
//             >
//               <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
//             </button>
//           </div>
//           {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}

//           {/* Set Password */}
//           <button
//             type="button"
//             onClick={() => setIsOpen(true)}
//             className="mt-5 mb-4 text-sm text-gray-600 hover:text-orange-500 underline"
//           >
//             Set Password
//           </button>

//           {/* Login Button */}
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded text-lg transition ${
//               isSubmitting
//                 ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
//                 : 'bg-orange-300 text-black hover:bg-orange-400'
//             }`}
//           >
//             {isSubmitting ? (
//               <>
//                 <span className="loader"></span> Logging in...
//               </>
//             ) : (
//               'Login'
//             )}
//           </button>
//         </form>
//       </div>

//       {/* Password Modal */}
//       <SignupPage isOpen={isOpen} setIsOpen={setIsOpen} userData={userData} clientData={clientData} />

//       {/* Inline Spinner CSS */}
//       <style>{`
//         .loader {
//           border: 3px solid #f3f3f3;
//           border-top: 3px solid #f97316;
//           border-radius: 50%;
//           width: 16px;
//           height: 16px;
//           animation: spin 0.6s linear infinite;
//         }

//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
//       `}</style>
//     </>
//   );
// };

// export default LoginPage;































import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useClientDetails, useEmployeeDetails, useLogin } from './services';
import CryptoJS from 'crypto-js';
import { SECRET_KEY } from '../Config';
import SignupPage from './SignupPage';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginData, setLoginData] = useState(null);
    

    

  const { mutate: sendLoginDetails, isPending: sending } = useLogin();


  // const { data: userData, isLoading: isEmpLoading } = useEmployeeDetails();
  // const { data: clientData, isLoading: isClientLoading } = useClientDetails();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Normalize employee data
  // const normalizedUsers = (userData?.data || []).map(user => ({
  //   id: user["EmployeeID"],
  //   name: user["Name"],
  //   role: user["Role"],
  //    IsActive: user["IsActive"],
  //   loginId: user["Login ID"] || user["LoginID"],
  //   password: user["Password"],
  // }));

  // Normalize client data
  // const normalizedClients = (clientData?.data || []).map(client => ({
  //    clientID: client["ClientID"],
  //   name: client["Name"],
  //   loginId: client["LoginID"],
  //   password: client["Password"],
  //   IsActive: client["IsActive"],
  //   role: client["Role"],
  //   propertyCode: client["PropertyCode"],
  //   doj: client["DOJ"],
  //   actualDoj: client["ActualDOJ"],
  //   isActive: client["IsActive"],
  //   id: client["ID"],
  //   temporaryPropCode: client["TemporaryPropCode"],
  //   bloodGroup: client["BloodGroup"],
  //   occupation: client["Occupation"],
  //   organisation: client["Organisation"],
  //   calling: client["CallingNo"],
  //   whatsAppNo: client["WhatsAppNo"],
  //   dob: client["DOB"],
  //   emgyCont1FullName: client["EmgyCont1FullName"],
  //   emgyCont1No: client["EmgyCont1No"],
  //   emgyCont2FullName: client["EmgyCont2FullName"],
  //   emgyCont2No: client["EmgyCont2No"],
  // }));

  // Decrypt password
  const decrypt = (encryptedText) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (err) {
      console.error("❌ Decryption failed:", err);
      return '';
    }
  };



  

  // Handle login submit (step 1): just set data and trigger flow
const onSubmit = (data) => {
  setIsSubmitting(true);

  sendLoginDetails(data, {
    onSuccess: (response) => {
      // Save entire user data in localStorage
          login(response)
      // localStorage.setItem('user', JSON.stringify(response));
      localStorage.setItem('loginTimestamp', Date.now());
      window.location.reload();
   
      // Show success
      toast.success('Logged in successfully!');

      // Redirect based on role or any property in response
      // if (response.role === 'Admin') {
      //   navigate('/admin/dashboard');
      // } else if (response.role === 'Employee') {
      //   navigate('/employee/home');
      // } else if (response.role === 'Client') {
      //   navigate('/client/home');
      // } else {
      //   navigate('/'); // default fallback
      // }

      reset(); // reset form
      setIsSubmitting(false);
    },
    onError: (error) => {
      // handle error from backend
        console.log("error", error)
      toast.error(error?.response?.data?.message || 'Invalid Login ID or Password');
      setIsSubmitting(false);
    },
  });
};



// 1️⃣ Save to localStorage

// 2️⃣ Read from localStorage

  // Effect: Watch for when API finishes loading and submission is in progress
  // useEffect(() => {
  //   if (isSubmitting && !isEmpLoading && !isClientLoading && loginData) {
  //     processLogin(loginData);
  //   }
  // }, [isSubmitting, isEmpLoading, isClientLoading, loginData]);

  // const processLogin = (data) => {
  //   const inputLoginId = data.loginId.trim();
  //   const inputPassword = data.password.trim();

  //   const matchedEmployee = normalizedUsers.find((user) => {
  //     const decryptedPassword = decrypt(user.password);
  //     return (
  //       user.loginId?.trim().toLowerCase() === inputLoginId.toLowerCase() &&
  //       decryptedPassword === inputPassword &&
  //       user.IsActive?.toLowerCase() === "yes"
  //     );
  //   });
    

  //   const matchedClient = !matchedEmployee && normalizedClients.find((client) => {
  //     const decryptedPassword = decrypt(client.password);
  //     return (
  //       client.loginId?.trim().toLowerCase() === inputLoginId.toLowerCase() &&
  //       decryptedPassword === inputPassword &&
  //       client.IsActive?.toLowerCase() === "yes"
  //     );
  //   });

  //   const inactiveClient = !matchedEmployee && normalizedClients.find((client) => {
  //     const decryptedPassword = decrypt(client.password);
  //     return (
  //       client.loginId?.trim().toLowerCase() === inputLoginId.toLowerCase() &&
  //       decryptedPassword === inputPassword &&
  //       client.IsActive?.toLowerCase() !== "yes"
  //     );
  //   });
  //   const inactiveEmployee = !matchedClient && normalizedUsers.find((user) => {
  //     const decryptedPassword = decrypt(user.password);
  //     return (
  //       user.loginId?.trim().toLowerCase() === inputLoginId.toLowerCase() &&
  //       decryptedPassword === inputPassword &&
  //       user.IsActive?.toLowerCase() !== "yes"
  //     );
  //   });

  //   const user = matchedEmployee || matchedClient;

  //   if (user) {
  //     login(user);
  //     toast.success("Logged in successfully!", { toastId: "login-success" });
  //     localStorage.setItem('loginTimestamp', Date.now());
  //     window.location.reload();
  //     reset();
  //   } else if (inactiveClient) {
  //     toast.error("You don't have permission to log in. Please contact Administrator.", {
  //       toastId: 'inactive-client',
  //     });
  //   }  else if (inactiveEmployee) {
  //     toast.error("You don't have permission to log in. Please contact Administrator.", {
  //       toastId: 'inactive-Employee',
  //     });
  //   } else {
  //     toast.error('Invalid Login ID or Password', {
  //       toastId: 'login-error',
  //     });
  //   }

  //   // Cleanup
  //   setIsSubmitting(false);
  //   setLoginData(null);
  // };

  return (
    <>
      <div className="flex items-center justify-center p-6 min-h-screen bg-[#F8F9FB]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg"
        >
          <h2 className="text-2xl font-bold text-orange-600 mb-2">Login</h2>
          <p className="text-gray-600 mb-4">Enter your login credentials to access your account.</p>

          {/* Login ID */}
          <label htmlFor="loginId" className="block mb-1 text-gray-700 font-medium">
            Email ID
          </label>
          <input
            id="loginId"
            type="text"
            placeholder="Enter your email ID"
            {...register('loginId', { required: 'Login ID is required' })}
            className="w-full mb-3 px-3 py-2 border border-orange-300 rounded focus:ring-2 outline-none focus:ring-orange-300"
          />
          {errors.loginId && <p className="text-red-600 text-sm">{errors.loginId.message}</p>}

          {/* Password */}
          <label htmlFor="password" className="block mt-4 mb-1 text-gray-700 font-medium">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password"
              {...register('password', {
                required: 'Password is required',
                validate: (value) => {
                  const trimmed = value.trim();
                  if (trimmed.length === 0) return 'Password cannot be empty';
                  if (trimmed.length < 6) return 'Minimum 6 characters';
                  return true;
                },
              })}
              className="w-full px-3 py-2 pr-10 border border-orange-300 outline-none rounded focus:ring-2 focus:ring-orange-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 text-gray-600 hover:text-orange-500"
              tabIndex={-1}
            >
              <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
            </button>
          </div>
          {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}

          {/* Set Password */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="mt-5 mb-4 text-sm text-gray-600 hover:text-orange-500 underline"
          >
            Set Password
          </button>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded text-lg transition ${
              isSubmitting
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-orange-300 text-black hover:bg-orange-400'
            }`}
          >
            {isSubmitting ? (
              <>
                <span className="loader"></span> Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>

      {/* Password Modal */}
      <SignupPage isOpen={isOpen} setIsOpen={setIsOpen}  />

      {/* Inline Spinner CSS */}
      <style>{`
        .loader {
          border: 3px solid #f3f3f3;
          border-top: 3px solid #f97316;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default LoginPage;




