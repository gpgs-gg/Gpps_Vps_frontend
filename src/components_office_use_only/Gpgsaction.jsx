import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link, useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import { SECRET_KEY } from "../Config";
import { PiCalendarCheckThin } from "react-icons/pi";
import { IoIosPeople } from "react-icons/io";
import { usePermissionData } from './TicketSystem/Services';


const Gpgsaction = () => {
  const [showSalesOptions, setShowSalesOptions] = useState(false);
  const [showHrmsOptions, setShowHrmsOptions] = useState(false);
  const [showAccountsOptions, setShowAccountsOptions] = useState(false);
  const [decryptedUser, setDecryptedUser] = useState(null);
  const navigate = useNavigate()
  const { data: permission } = usePermissionData()

  const functionPermission = permission?.data || []

  const userEmail = decryptedUser?.loginId;

  // Check Attendance Permission
  const hasAttendancePermission = functionPermission.some(
    (item) => item.Attendance === userEmail
  );

  // Check Salary Permission
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

          {/* <Link to="/gpgs-actions/Check-in-out">
            <div className={cardClasses}>
              <div className={`${iconClasses} bg-green-100 text-green-600`}>
               <PiCalendarCheckThin className='text-2xl text-green-600'/>
              </div>
              <h3 className={titleClasses}>ATTENDANCE</h3>
              <button className={`${btnClasses} bg-indigo-600 hover:bg-indigo-700`}>
                Go For Attendance System
              </button>
            </div>
          </Link> */}
          <div>
            <div
              className={`${cardClasses} cursor-pointer`}
              //
              onClick={() => setShowHrmsOptions(prev => !prev)}
            >
              <div className={`${iconClasses} bg-yellow-100 text-yellow-600`}>
                <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxIPEBUQEBIVFRUQGBYYGBYVEBYVFRYXFhEXGBUZFxUYHSggGBolGxUVITEhJSkrLi4uFx8zODMsNygtLisBCgoKDg0OGxAQGy0mICUrLS0yKzcuLS0tLTAtLy0tLS0tLS0tLS8tLS8tLS0vLy0rLS0tLS0tLS0tLS0tLS0tLf/AABEIAOkA2AMBIgACEQEDEQH/xAAcAAEAAQUBAQAAAAAAAAAAAAAABgEEBQcIAgP/xABEEAACAQIDBAgCBQkHBQEAAAABAgADEQQFIQYSMVEHEyIyQWFxgZGhFEJSscEjM1NykqKy0fBDYnOCwtLhJDRUY5QV/8QAGgEBAAMBAQEAAAAAAAAAAAAAAAMEBQIBBv/EACoRAAICAgIABAYCAwAAAAAAAAABAgMEESExEhNBUQUiMkKBkSNxUrHB/9oADAMBAAIRAxEAPwDeMREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREARKTxVrqgu7BRzJAHzgH0iRvHbd5dQNnxSEjwp71Q/uAzEVulbAL3RXb0o2/iYSRUzfSZG7oLtoncTXw6W8F+ir/sJ/vl1h+lPLm7zVU/WoMR+5edOixfazlX1v7kTeJhcu2rwWJ0o4qkxP1d/db9lrH5TMK19RInFrtEqkn0eoiJ4eiIiAIiIAiIgCIiAIiIAiIgCIiAIieSbQCsxOf7SYbALvYiqFJ4INXb0Ua+8hO2vSYKZahgLM40asdUXyQfWPnwHnNUYnEPVdqlRi7ubszG5PqTLtOHKfMuEUrsxR4jyT/P8ApWxFUlcGgor9tgHqH0HdX5yC5hmVbEner1XqE/bckfDhLWJowphDpGfO2c+2IiJIRCJS8rAKETL5TtLi8IR1GIdQPqk76fstcWmJieSipLTR1GTT2mbX2e6WVNkx1PdP6SkCV/zIdV9iZsjAY+niEFWjUWojcGVricwTJZFnlfA1Otw7lSe8vFHHJl4H14ylbhRfMC5VmSXE+TpeJEti9uKOYjca1KuBrTJ0a31qZ8R5cR85LZmyg4vTNKE1JbQiInJ0IiIAiIgCIiAIiIAlLyspAKMwAudLTTfSLt4cQzYXCORRGj1Boap8Qp8E+/045PpX2vK3y/DtqfzzA6gHUUwfAnx8tPGapmjiY33y/BnZWR9kRETK7O7P18wq9VQXh3nPcQc2P4cTNCUlFbZQjFyekYsC+g1J4W4mS/IOjjG4qzOooIfGr3yPKmNR72m0Nk9iMNl4DAdZW8argX9EHBR8/OSiZ1uc+ofs0KsJdz/RAct6KMHTANZqlU/rlF+C6/OZ7D7EZdT4YOif103z8XvJDEpyunLtsuRphHpGHbZXAEWODw3/AM9P+UsMVsBltTjhUU86Zan/AAkCSeJ4rJLps98uHsjWebdEdFhfC13Q/ZqdtfiLGa/z/ZDGYG5rUiU/SJ26fuRqvuBOjDPLoCCCLg8QRoZPXmWR75K9mJXLrg5Yibk2x6NKde9bBWpVOJp/2b+n2G9NPLxmoMVhnou1OopR0NmVhYgzTpujauDOtplW+TzSqsjB0YqykFWBsykcCCOBm6ujvbkY0fR8SQMQo0PAVQOJHJh4j3E0lJr0c7IVMZVXEsWp0aLAhl0aoynuofADxPt6R5UIOG5HeLOanqJvSJQSsxjZEREAREQBERAEREATAba5+Mvwj1vrns0xzcjT2FiT6TPzRvSznf0nG9Sp7GFBUci7WLn+Eexk+PV5k0vQgyLPLg36kKq1C7F2JLOSzE8SzEkk+dzPMT1TQsQqgszEAAcSxNgB5kkTb6MXsymzGQVcwxAoUtBxd7aIl9SfPkPGdBZDk1HA0VoUF3VXifrM3izHxJmO2J2bXLsMKdgaj2aq3NrcPQcBJDMbJvdktLo18ahVrb7FpWIlYtCIiAIiIAiIgFJE9vNjkzGlvIAuIpjsP9ofYc+IPPwktlJ1GTi9o5nFSWmaN2K2Bq4usWxKNTo0WIcHRnZTqi+XNvh5btw2HSmi06ahVQWCqLAAcABPraJ3bdK17ZHVTGtaQtKxEiJhERAEREAREQBKSsQCyznHLhsPVrtwooz+u6pIHubCczVarOxdzdnJZjzLG5PxM3h0uY3q8tZAdazonqL7zfdNGTUwYai5GXnS3JREn3RBkYr4psS4uuFAt/iMNPgLn3kBm+uizLfo+W0yR2q5NVv82i/uBZJl2eGvXuR4lfis59CXiIiY5sCIiAUiWma5jTwtF69Zt1KQJJ+4AeJPACaL2r25xOPYqrtSo+FNGIJHOow1Y+XCTU0StfHRBdfGtcm9WzGiDY1qYPI1Fv8AfLlHDC4IIPiNROVyL6mZbI9osVgXDYeqwHihJam3kUOnuLGWpYD1wytHPW+UdJysj2xu1FPMqHWKN2olhUp3uVPhbmp8DJDKEouL0y/GSktoRETw9EREAREQBERAEREAREQBESkA1j031/yWGp83dv2Ut/qmpZtHpx72F9Kv+iaumzhr+JGNlv8AlYC30Hjp8Z09lVAU6FNBwRFHwUTmbC/nE/WX+ITqGl3R6D7pXz39KLGAuz3EpPLOALkgDz0mcaJ7gy3pY2mxsrqTyDCfeNHiafRqvpszNh1GFU6Neo3nY7qfMk+01XNkdNuFIxFCt9VqbJ6FXv8Ac3ymt5tYiXlLRj5TfmvYiIlgrEr6MMybD5jTAPZr3psPA3F1+BHzPOb9nO2wWGNXMsOo8H3j5BQSTOiRMrOS8xf0auE34H/ZWJ8qmIVe8wHqRPaOCLgg+koKSb1svaPUSkrOjwREQBERAEREAREQBEShgGsOnCj+Tw1Tk7r8UB/0zU03l0u4LrMuZwNaLo3tfdP8U0bNfCe6jIzFqwBrajw1+E6fyysKlGm41DIp+KicwTfnRfmQxGW0te1QvSb1Tu/ulT7yPPj8qZJgy+ZolhkBz3M2r1CL9hSQq+BseJ5yesLzWuOw5pVGRuKk+48D8JVxknLk8+KSkoJLo+A01EmmyuZtWQ03N2p21PEqeF/PSQuSjYrDG71TwICjzN7n8JNkJOHJQ+HSkrkl16l3tts6uY4VqOgde1TY8A4Gl/I8D6zn7H4Kph6jUqyMjpxVhb3HMeYnUExeebP4bHLu4mkr24Hgy+jDUSLHyXVw+jZyMZWcrs5rgDw5/wBcJuep0SYIm4q4hRyDoR8ShMz+Q7FYLAkPSpXcfXqHfYel9B7S5LOglwU44U2+TAdFuyDYRTi8QpWtVXdVCNaaE3Nx4MbC/IC3OTLOMYaSdnvNoPLmZfiYjaKkSisPqnX0PjML4hdY6pzXejXxq4xaj6GAYkm51PnrPvgcW1JgQdPEeBEt5VELEKOJ0+M+OrnOM1KL5NeUU1pk1Rri/Oep86KbqgcgB8p9J9tHelsx2IiJ0BERAEREAREQBERALHO8vGKw1XDtwrIy+hKmx9jY+05mqU2RijizISrDkQbEfETqeaK6V8l+jY7rVHYxQLj9cWFQfNT7y9g2ak4v1KOdXuKkvQhc2B0P52KOJbCubLiQCv8AiKPxW/wmv5svot2N6xlx+IBCqb0VOm8RwqHyHhz48pdynFVvxFPGUnYvCbdvMTnWEw9T88yow0DbwDennMXtBtAQxpUTa2jP438Qv85GGYsbk3J8TqZm1USfzb0S5efWtwS8X+iS4XJcKzf9wH8gyj7tZKMPRVFCoAFHADhNZ0qRdgqi5Y2A8zJZnuaplGA6xjvMAFQE9+o3AeQ4n0E9ug9pb2xgWxak1BJL1PptXtdh8tT8qd6ow7NJe8fM/ZXzM1PnXSPjsQSKb9Qn2aYG97uRf4WkXzDHVMRVatWbeeobk/gOQHgJby9TiwgueWc25UpvjhF8+dYpjc4rEE8/pNX/AHTJZZttmGHI3cU7gfVqnrQfdu0PYyPxJ3XB8NFdWTXTN2bIdJNHFsKOJAo1W0U3/JueQJ7p8j8ZOmAIsdQZyzNydFe1ZxVM4Ou16tJboxOr0xpY82XTXlaZ2ViqK8UevY0cbKcn4Zd+5KcVldEH85ueRI/GXGXYeghujhm5lgT7cpg8wwxpVCp18QeYlvPinlwptb8pJo3lU5w+om95WRfLs0amQGO8vzHp/KSSjUDgMpuDNzFzIZC3Hv2KllUq3yfSIiWyIREQBERAEREAREQBI7txs+MwwjUhbrF7dMnwcA6ehBI95IpSexk4vaOZRUlpmjuj7YlsZW63EqVoUGIZSLGo6mxT0BGvpabU2izMYemKVOwdhYW+ovC/lyEymPxAoUmqbt90E2A4kn+Z1M13isQ1Vy7m5Y/0JcUnfPxS6Rl5Vixq/BHt+p8oiXOXYM16i018eJ5DxP8AXlLLelsxYxcmku2Z7ZDLrk12HDRPxP4fGax6S9o/p2LKUzejh7qvJmvZ2+IsPITY3SJnoy7A9VSO7UrA06YHEC3bf2BGvMiaKE4xoeOTsf4NmxKmtVR/IiIl8qCIiAJd5RmD4WvTxFPvUmDDzHBgfIgke8tIhpNaZ6m09o6LasmOwqYmjrvLvDn/AHl9Rb5TCyMdD20XV1GwNQ9mqS9K54PbtqPUC/qDzk2zjB9W9wOy+o/ET4T47guufmL8/wDD6n4fkqyOmWEu8ux7UTzU8R+I85aQBfQeMwKrJ1yUodmjKKktMmeHrrUUMpuDPrLDKcF1Sa95tT5eUvxPs6ZTlBOa0zIkknwIiJKciIiAIiIAiIgCIiAeXW4seBkL2hyM0SalMXpniPsf8SbSjLfQzuuxwe0V8jHjdHT/AGatkz2ZwAo0jWfQuLm/1VGo/nFbZhDWV10S92S2nlbkL+Ej3S5tD9Hw30SmbVMSLNb6tId703u76XlmU/NahH1M/GxXjuVlnp0a122z45hjHrA/k17FMf3FPH3Nz8JgYiakIqMUkV5Scm2xEROjkREQBERPQfTD1mputSmxVkIZWHEMDcGdB5JmS5pgUqiwZh2gPqVF0Yel7+xnPEn/AEPZnVp4tqCq70qwu26CRTdR2XJ4AEaH25Shn48bansuYVzhZr3JmVINra3tbzvwkgyjLNztv3vAfZ/5l8uCQVDUt2j/AFp5y4nyuJ8MjVNznz7G/bkOa0gJWImsVhERAEREAREQBERAEREAREQCkwm0mymFzBfy6dsCy1FO7UX0bxHkbjymcieqTi9o8lFSWmaSz/ouxVC7YYiunLRanwOh9jIRi8NUotuVUemw+q6FD8GE6ktPhisJTrLu1UVxyZQw+cuwzpr6uSnPCi/p4OXYm/8AHdHmXVdeoCH/ANbMnyBmGrdEmDPdrV1/zIfvWWFnVvvZWeFYutGmYm4B0QYb/wAmv8Kf+2XeG6KMCveas/rUA/hAnTzakeLDtNKS/wAqyXE4s2w9GpU8wp3B6ueyPjN85fsVgKBumGQkeLjfP715n0QKLAAAcABYD2kE8/8AxRNDBf3M1Rs/0Tk2fHVbD9HSOp8mc/h8ZszK8ro4WmKWHprTUeCj5k8SfMy9iU7Lp2fUy5XTCv6UIiJESiIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAUlYiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIlC1oBWJb4XGLULhf7JyjX01ABNvLtCUxOPp0r9Y4WyM5v9hLb59riAXMTwtQHUHjr7TxXxKU0Z3YBUBZjyUC5MA+0TyHB4HznxTGIajUh3kVWPKzFgLHn2TALiJ5Lf1eN8cx8YB6iUBlniM1o06q0Xeztaw3Wt2iQu8wG6tyrAXIvY2vAL2JiRtJhd3fFTS4FhTqFjdSwKpu7zKVBO8ARYE3sJ7/8A38NvFetXsqWLWbcsEDm1S26TukNug3sb2gGTiWFHOKLqrK/efqwCjh9/7JpkbwNtdRoNeGsYjOaFNnRqnapBCyhWZh1rFaYCqCSWKkAC5gF/EsVzegeqtUH/AFJIpjW7FVZmFuIICte9rWtPrgMfSxC79Fw6hmXeU3F1NmAPjrALmIiAIiIAiIgCIiAIiIAmK2jy9sTR6tVRmBBHWMQoI4E2Vt63HdIsfLjMrPMAimM2Vdy7qaQeo1UlrEbwalTCKbDhv0wba28Lz54nZWpW6xqi4ferrilJ1bq+vCbhUlLtulT9nvXHKTCBAIhU2WqM7Nu0lL0yo3azgUiaJp7ioEAZLkm5tx7pOs+uN2W3+tSmlBEq4dqWo3jvFLL2NzsKGu1wdeV9ZKZUQCH4rZarU3gOppb+oqIWLoOoFPqVG6t6V+1e4490HWXNHZ+oKyVwtGn1e4OpRmNI2NTePcHaG+GU7uhFvG8k8CARvM8iq13qtakDXpBd8sxeiwRgVTsjeRidTdTx43FrM7JM7FnWitw+7TW5SkXqUD2DujQik9zYavwkvMCAYvLsoFOkaTGyis9RBTZkCqa5qIultBcArw4jhPnmWFxFTEIVp0WoputZqzo5cE9pgKTBgvgLjXXlMzKQCLUMoxYcYhlw/XqW/tqjU3V03bfmgaYSy2Hav2rkXvPeD2ZbD2akVY0aQWmru4ptW6oU2qutju6KBZb8W5yTxAIfV2cxNQKx6tag6y7DEVWKvUKE1wRTXefslerIAsB2rXE+tfZeqCxSuagbqyVq7qdYyV3qNvVKdMMveFiL+mgkriARbL9l6lM0XNc3pMCUCoaaoFqgU0LJvn84ASTc6nQ2tlsiw9amKgrJTXeqM69XVZxZjex3qaWtpz9pkzAgFYiIAiIgCIiAf//Z" alt="" />
              </div>
              <h3 className={titleClasses}>HRMS</h3>
              <button className={`${btnClasses} bg-orange-500 hover:bg-orange-600`}>
                {showHrmsOptions ? 'Hide HRMS Options' : 'Show HRMS Options'}
              </button>

              {showHrmsOptions && (
                <div className="w-full flex flex-col gap-3 mt-5">
                  <Link
                    to="/gpgs-actions/Check-in-out"
                    className={`${subBtnClasses} bg-green-100 flex justify-center items-center gap-1 text-green-800 hover:bg-green-200`}
                  >
                    <PiCalendarCheckThin className='text-xl text-green-600' /> Check In/Check Out
                  </Link>

                  {hasAttendancePermission && (
                    <Link
                      to="/gpgs-actions/attendance-details"
                      className={`${subBtnClasses} bg-indigo-100 flex justify-center gap-1 items-center text-indigo-800 hover:bg-indigo-200`}
                    >
                      <IoIosPeople className="text-xl text-indigo-600" /> Attendance Details
                    </Link>
                  )}

                  {hasSalaryPermission && (
                    <Link
                      to="/gpgs-actions/sallary-details"
                      className={`${subBtnClasses} bg-indigo-100 flex justify-center gap-1 items-center text-indigo-800 hover:bg-indigo-200`}
                    >
                      <IoIosPeople className="text-xl text-indigo-600" /> Salary Details
                    </Link>
                  )}


                </div>
              )}
            </div>
          </div>

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
                  <Link
                    to="/gpgs-actions/leads-list"
                    className={`${subBtnClasses} bg-indigo-100 text-indigo-800 hover:bg-indigo-200`}
                  >
                    ➕ Our Leads
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
                {showAccountsOptions ? 'Hide Accounts Options' : 'Show Accounts Options'}
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
                  <Link
                    to="/gpgs-actions/eb-calculation"
                    className={`${subBtnClasses} bg-blue-100 text-blue-800 hover:bg-blue-200`}
                  >
                    EB Calculation
                  </Link>
                </div>
              )}
            </div>
          </div>

            <Link to="/gpgs-actions/housekeeping-todo">
            <div className={cardClasses}>
              <div className={`${iconClasses} bg-red-100 text-rose-500`}>
                <i className="fa-solid fa-ticket text-xl"></i>
              </div>
              <h3 className={titleClasses}>HouseKeeping</h3>
              <button className={`${btnClasses} bg-rose-500 hover:bg-rose-600`}>
               To-Do HouseKeeping 
              </button>
            </div>
          </Link>
            <Link to="/gpgs-actions/maintenance-todo">
            <div className={cardClasses}>
              <div className={`${iconClasses} bg-blue-100 text-blue-500`}>
                <i className="fa-solid fa-ticket text-xl"></i>
              </div>
              <h3 className={titleClasses}>Maintenance
</h3>
              <button className={`${btnClasses} bg-blue-500 hover:bg-blue-600`}>
               To-Do Maintenance 
              </button>
            </div>
          </Link>
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
