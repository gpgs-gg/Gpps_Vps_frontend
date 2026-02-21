// // import React from "react";
// // import { useAttendanceData, useSallaryTrackerDetail } from "./services";

// // const SalaryDetail = () => {

// //   const { data, isPending } = useAttendanceData()
// //   const { data: sallayTrackerdetails } = useSallaryTrackerDetail()

// //   console.log(333333333, sallayTrackerdetails)
// //   // Extract attendance list
// //   const attendanceList = data?.data || []
// //   //console.log(121212, attendanceList)
// //   //Transform raw attendance list
// //   const employeesNew = Object.values(
// //     attendanceList.reduce((acc, record) => {
// //       const { EmployeeID, EmployeeName, AttendanceStatus, HalfDayHrs } = record;

// //       if (!acc[EmployeeID]) {
// //         acc[EmployeeID] = {
// //           id: EmployeeID,
// //           name: EmployeeName,
// //           salary: 0, // will fill later
// //           AdjustedAmt: 0,
// //           PaidLeaves: 0,
// //           attendance: [],
// //         };
// //       }

// //       let attendanceValue = 0;
// //       if (AttendanceStatus === "1") attendanceValue = 1;
// //       else if (AttendanceStatus === "0.5") attendanceValue = 0.5;
// //       else if (AttendanceStatus === "0") attendanceValue = 0;
// //       else if (HalfDayHrs && Number(HalfDayHrs) > 0) attendanceValue = 0.5;

// //       acc[EmployeeID].attendance.push(attendanceValue);

// //       return acc;
// //     }, {})
// //   );

// //   //Example salary data

// //   //Merge salary
// //   const employeesWithSalary = employeesNew.map(emp => {
// //     const match = sallayTrackerdetails?.data?.find(s => s.EmployeeID == emp.id);

// //     return {
// //       ...emp, salary: match ? match.FixSalary : 0, AdjustedAmt: match ? match.AdjustedAmt : 0
// //       , PaidLeaves: match ? match.PaidLeaves : 0, CurrentDue: match ? match.CurrentDue : 0,
// //       PreviousDue: match ? match.PreviousDue : 0, Comments: match ? match.Comments : 0,
// //       PaidAmount: match ? match.PaidAmount : 0


// //     };
// //   });

// //   console.log("employeesWithSalary", employeesWithSalary)


// //   // const employees = [
// //   //   {
// //   //     id: 1,
// //   //     name: "Sandeep Pawar",
// //   //     department: "Marketing & Sales",
// //   //     salary: 60000,
// //   //     attendance: [1, 1, 1, 0.5, 1, 1, 1, 1, 0.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
// //   //   },
// //   //   {
// //   //     id: 2,
// //   //     name: "Sachin Patil",
// //   //     department: "Marketing & Sales",
// //   //     salary: 30000,
// //   //     attendance: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0],
// //   //   },
// //   //   {
// //   //     id: 3,
// //   //     name: "Vikram Mahankal",
// //   //     department: "Maintenance & Admin",
// //   //     salary: 100000,
// //   //     attendance: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0],
// //   //   },
// //   // ];




// //   const getAttendanceSum = (arr) =>
// //     arr?.reduce((sum, val) => sum + (typeof val === "number" ? val : 0), 0);

// //   function myFunction() {
// //     var today = new Date();
// //     var month = today.getMonth();
// //     return daysInMonth(month + 1, today.getFullYear())
// //   }

// //   function daysInMonth(month, year) {
// //     return new Date(year, month, 0).getDate();
// //   }

// //   myFunction();



// //   return (
// //     <div className="min-h-screen bg-gray-50 p-6">
// //       {/* Header */}
// //       <div className="bg-gray-50 text-gray-800 text-center p-4 rounded-md mt-20  mb-6">
// //         <h1 className="text-2xl font-bold">
// //           Attendance & Salary Tracker - November 2025
// //         </h1>
// //         <p className="text-lg text-gray-700">l's paying Guest Services Pvt.Gopa Ltd</p>
// //       </div>

// //       {/* Table */}
// //       <div className="overflow-x-auto bg-white text-2xl rounded-lg shadow border border-gray-200">
// //         <table className="min-w-auto border-red-500">
// //           <thead className="bg-orange-200 font-bold border-b border-gray-300 text-sm  text-gray-700  text-center">
// //             <tr>
// //               <th className="border border-gray-300 px-2 py-2">EmpID</th>
// //               <th className="border border-gray-300 px-2 py-2 text-left">
// //                 Employee's Name
// //               </th>
// //               {/* <th className="border border-gray-300 px-2 py-2">DOJ</th> */}

// //               {/* Days 1–30 */}
// //               {[...Array(31)].map((_, i) => (
// //                 <th key={i} className="border border-gray-300 px-1 py-1 w-6">
// //                   {i + 1}
// //                 </th>
// //               ))}
// //               <th className="border border-gray-300 px-2 py-2">Total Days</th>
// //               <th className="border border-gray-300 px-2 py-2">Fix Salary</th>
// //               <th className="border border-gray-300 px-2 py-2">Per Day</th>
// //               <th className="border border-gray-300 px-2 py-2">Adjusted Amt</th>
// //               <th className="border border-gray-300 px-2 py-2">Paid Leaves</th>
// //               <th className="border border-gray-300 px-2 py-2">Payable Salary</th>
// //               <th className="border border-gray-300 px-2 py-2">Paid Amt </th>
// //               <th className="border border-gray-300 px-2 py-2">Current Due</th>
// //               <th className="border border-gray-300 px-2 py-2">Previous Due</th>
// //               <th className="border border-gray-300 w-48 px-2 py-2">Comments</th>
// //             </tr>
// //           </thead>

// //           <tbody>
// //             {employeesWithSalary?.filter(emp => emp?.id)?.map((emp, i) => {
// //               const attendanceDays = getAttendanceSum(emp.attendance) || 0;
// //               const AdjustedAmt = Number(emp.AdjustedAmt) || 0;  // ensure it's a number
// //               const PaidLeaves = Number(emp.PaidLeaves) || 0;
// //               const salary = Number(emp.salary) || 0;

// //               const perDay = salary / 30;
// //               const payable = (perDay * attendanceDays) + (PaidLeaves * perDay) + AdjustedAmt;
// //               // console.log(11111111111111, payable)
// //               return (
// //                 <tr
// //                   key={emp.id}
// //                   className={`text-sm text-gray-800 text-center ${i % 2 === 0 ? "bg-gray-50" : "bg-white"
// //                     } hover:bg-yellow-50`}
// //                 >
// //                   <td className="border border-gray-300 px-2 py-1">{emp.id}</td>
// //                   <td className="border border-gray-300 px-2 py-1 text-left font-medium">
// //                     {emp.name}
// //                     <div className="text-[10px] text-gray-500">{emp.department}</div>
// //                   </td>
// //                   {/* <td className="border border-gray-300 px-2 py-1">{emp.doj}</td> */}

// //                   {/* Attendance Days */}
// //                   {emp.attendance.map((a, index) => (
// //                     <td
// //                       key={index}
// //                       className={`border border-gray-300 px-1 py-1 font-semibold ${a === 1
// //                         ? "bg-white text-black"
// //                         : a === 0.5
// //                           ? "bg-yellow-100 text-yellow-700"
// //                           : "bg-red-100 text-red-700"
// //                         }`}
// //                     >
// //                       {a}
// //                     </td>
// //                   ))}

// //                   {/* Summary Columns */}

// //                   <td className="border border-gray-300 px-2 py-1 font-semibold">
// //                     {attendanceDays.toFixed(1)}
// //                   </td>
// //                   <td className="border border-gray-300 px-2 py-1">
// //                     ₹{emp.salary.toLocaleString()}
// //                   </td>
// //                   <td className="border border-gray-300 px-2 py-1">
// //                     ₹{perDay.toFixed(2)}
// //                   </td>
// //                   <td className="border border-gray-300 px-2 py-1">
// //                     ₹{emp.AdjustedAmt}
// //                   </td>
// //                   <td className="border border-gray-300 px-2 py-1">
// //                     {emp.PaidLeaves}
// //                   </td>
// //                   <td className="border border-gray-300 px-2 py-1 font-semibold text-blue-700">
// //                     ₹{payable.toFixed(0)}
// //                   </td>
// //                   <td className="border border-gray-300 px-2 py-1 text-green-700 font-semibold">
// //                     ₹{emp.PaidAmount}
// //                   </td>
// //                   <td className="border border-gray-300 px-2 py-1  font-semibold">
// //                     ₹{emp.CurrentDue}
// //                   </td>
// //                   <td className="border border-gray-300 px-2 py-1  font-semibold">
// //                     ₹{emp.PreviousDue}
// //                   </td>
// //                   <td className="border border-gray-300 px-2 py-1 w-48 font-semibold">
// //                     {emp.Comments}
// //                   </td>
// //                   {/* <td className="border border-gray-300 px-2 py-1 text-green-700 font-semibold">
// //                     ₹{emp.PaidAmount}
// //                   </td>
// //                   <td className="border border-gray-300 px-2 py-1 text-red-600 font-semibold">
// //                     ₹{payable.toFixed(0)}
// //                   </td> */}
// //                 </tr>
// //               );
// //             })}
// //           </tbody>
// //         </table>
// //       </div>

// //       {/* Legend */}
// //       {/* <div className="mt-6 text-sm text-gray-600">
// //         <p>
// //           🟢 <b>1</b> = Full Day | 🟡 <b>0.5</b> = Half Day | 🔴 <b>0</b> =
// //           Absent
// //         </p>
// //         <p>
// //           💰 Payable Salary = (Monthly Salary ÷ 30) × Total Attendance Days
// //         </p>
// //       </div> */}
// //     </div>
// //   );
// // };

// // export default SalaryDetail;


// /////////////////////////////////////////

// // import React, { useState, useEffect } from "react";
// // import { useAttendanceData, useSallaryTrackerDetail } from "./services";

// // const SalaryDetail = () => {
// //   const { data, isPending } = useAttendanceData();
// //   const { data: sallayTrackerdetails } = useSallaryTrackerDetail();

// //   // Extract attendance list
// //   const attendanceList = data?.data || [];

// //   // Transform raw attendance list
// //   const employeesNew = Object.values(
// //     attendanceList.reduce((acc, record) => {
// //       const { EmployeeID, EmployeeName, AttendanceStatus, HalfDayHrs } = record;

// //       if (!acc[EmployeeID]) {
// //         acc[EmployeeID] = {
// //           id: EmployeeID,
// //           name: EmployeeName,
// //           salary: 0,
// //           AdjustedAmt: 0,
// //           PaidLeaves: 0,
// //           PaidAmount : 0,
// //           attendance: [],
// //         };
// //       }

// //       let attendanceValue = 0;
// //       if (AttendanceStatus === "1") attendanceValue = 1;
// //       else if (AttendanceStatus === "0.5") attendanceValue = 0.5;
// //       else if (AttendanceStatus === "0") attendanceValue = 0;
// //       else if (HalfDayHrs && Number(HalfDayHrs) > 0) attendanceValue = 0.5;

// //       acc[EmployeeID].attendance.push(attendanceValue);
// //       return acc;
// //     }, {})
// //   );

// //   // Merge salary data
// //   const [employees, setEmployees] = useState([]);

// //   useEffect(() => {
// //     if (employeesNew.length && sallayTrackerdetails?.data) {
// //       const merged = employeesNew.map((emp) => {
// //         const match = sallayTrackerdetails?.data?.find(
// //           (s) => s.EmployeeID == emp.id
// //         );
// //         return {
// //           ...emp,
// //           salary: match ? match.FixSalary : 0,
// //           AdjustedAmt: match ? match.AdjustedAmt : 0,
// //           PaidLeaves: match ? match.PaidLeaves : 0,
// //           CurrentDue: match ? match.CurrentDue : 0,
// //           PreviousDue: match ? match.PreviousDue : 0,
// //           Comments: match ? match.Comments : "",
// //           PaidAmount: match ? match.PaidAmount : 0,
// //         };
// //       });
// //       setEmployees(merged);
// //     }
// //   }, [data, sallayTrackerdetails]);

// //   const getAttendanceSum = (arr) =>
// //     arr?.reduce((sum, val) => sum + (typeof val === "number" ? val : 0), 0);

// //   const handleFieldChange = (id, field, value) => {
// //     setEmployees((prev) =>
// //       prev.map((emp) =>
// //         emp.id === id ? { ...emp, [field]: value } : emp
// //       )
// //     );
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50 p-6">
// //       {/* Header */}
// //       <div className="bg-gray-50 text-gray-800 text-center p-4 rounded-md mt-20 mb-6">
// //         <h1 className="text-2xl font-bold">
// //           Attendance & Salary Tracker - November 2025
// //         </h1>
// //         <p className="text-lg text-gray-700">
// //           Gopal's Paying Guest Services Pvt. Ltd
// //         </p>
// //       </div>

// //       {/* Table */}
// //       <div className="overflow-x-auto bg-white text-2xl rounded-lg shadow border border-gray-200">
// //         <table className="min-w-auto border-red-500">
// //           <thead className="bg-orange-200 font-bold border-b border-gray-300 text-sm text-gray-700 text-center">
// //             <tr>
// //               <th className="border border-gray-300 px-2 py-2">EmpID</th>
// //               <th className="border border-gray-300 px-2 py-2 text-left">
// //                 Employee's Name
// //               </th>
// //               {[...Array(31)].map((_, i) => (
// //                 <th key={i} className="border border-gray-300 px-1 py-1 w-6">
// //                   {i + 1}
// //                 </th>
// //               ))}
// //               <th className="border border-gray-300  px-2 py-2">Total Days</th>
// //               <th className="border border-gray-300 px-2 py-2">Fix Salary</th>
// //               <th className="border border-gray-300 px-2 py-2">Per Day</th>
// //               <th className="border border-gray-300 px-2 py-2">Adjusted Amt</th>
// //               <th className="border border-gray-300 px-2 py-2">Paid Leaves</th>
// //               <th className="border border-gray-300 px-2 py-2">Payable Salary</th>
// //               <th className="border border-gray-300 px-2 py-2">Paid Amt</th>
// //               <th className="border border-gray-300 px-2 py-2">Current Due</th>
// //               <th className="border border-gray-300 px-2 py-2">Previous Due</th>
// //               <th className="border border-gray-300 w-48 px-2 py-2">Comments</th>
// //             </tr>
// //           </thead>

// //           <tbody>
// //             {employees?.filter(emp => emp?.id)?.map((emp, i) => {
// //               const attendanceDays = getAttendanceSum(emp.attendance) || 0;
// //               const AdjustedAmt = Number(emp.AdjustedAmt) || 0;
// //               const PaidLeaves = Number(emp.PaidLeaves) || 0;
// //               const PaidAmt = Number(emp.PaidAmount) || 0;
// //               const CurrentDue = Number(emp.CurrentDue) || 0;
// //               const salary = Number(emp.salary) || 0;

// //               const perDay = salary / 30;
// //               const payable =
// //                 perDay * attendanceDays + PaidLeaves * perDay + AdjustedAmt;
// //              const CurrentDueAmt = CurrentDue - PaidAmt


// //               return (
// //                 <tr
// //                   key={emp.id}
// //                   className={`text-sm text-gray-800 text-center ${
// //                     i % 2 === 0 ? "bg-gray-50" : "bg-white"
// //                   } hover:bg-yellow-50`}
// //                 >
// //                   <td className="border border-gray-300 px-2 py-1">{emp.id}</td>
// //                   <td className="border border-gray-300 px-2 py-1 text-left font-medium">
// //                     {emp.name}
// //                   </td>

// //                   {/* Attendance */}
// //                   {emp.attendance.map((a, index) => (
// //                     <td
// //                       key={index}
// //                       className={`border border-gray-300 px-1 py-1 font-semibold ${
// //                         a === 1
// //                           ? "bg-white text-black"
// //                           : a === 0.5
// //                           ? "bg-yellow-100 text-yellow-700"
// //                           : "bg-red-100 text-red-700"
// //                       }`}
// //                     >
// //                       {a}
// //                     </td>
// //                   ))}

// //                   {/* Totals */}
// //                   <td className="border border-gray-300 px-2 py-1 font-semibold">
// //                     {attendanceDays.toFixed(1)}
// //                   </td>

// //                   {/* Editable Fix Salary */}
// //                   <td className="border border-gray-300 px-2 py-1">
// //                     <input
// //                       type="number"
// //                       className="w-24 border-none text-center focus:ring-0 bg-transparent outline-none"
// //                       value={emp.salary}
// //                       onChange={(e) =>
// //                         handleFieldChange(emp.id, "salary", e.target.value)
// //                       }
// //                     />
// //                   </td>

// //                   <td className="border border-gray-300 px-2 py-1">
// //                     ₹{perDay.toFixed(2)}
// //                   </td>

// //                   {/* Editable Adjusted Amount */}
// //                   <td className="border border-gray-300 px-2 py-1">
// //                     <input
// //                       type="number"
// //                       className="w-20 border-none text-center focus:ring-0 bg-transparent outline-none"
// //                       value={emp.AdjustedAmt}
// //                       onChange={(e) =>
// //                         handleFieldChange(emp.id, "AdjustedAmt", e.target.value)
// //                       }
// //                     />
// //                   </td>

// //                   {/* Editable Paid Leaves */}
// //                   <td className="border border-gray-300 px-2 py-1">
// //                     <input
// //                       type="number"
// //                       className="w-12 border-none text-center focus:ring-0 bg-transparent outline-none"
// //                       value={emp.PaidLeaves}
// //                       onChange={(e) =>
// //                         handleFieldChange(emp.id, "PaidLeaves", e.target.value)
// //                       }
// //                     />
// //                   </td>

// //                   <td className="border border-gray-300 px-2 py-1 font-semibold text-blue-700">
// //                     ₹{payable.toFixed(0)}
// //                   </td>

// //                   {/* <td className="border border-gray-300 px-2 py-1 text-green-700 font-semibold">
// //                     ₹{emp.PaidAmount}
// //                   </td> */}


// //                       <td className="border border-gray-300 px-2 py-1">
// //                     <input
// //                       type="number"
// //                       className="w-12 border-none text-center focus:ring-0 bg-transparent outline-none"
// //                       value={emp.PaidAmount}
// //                       onChange={(e) =>
// //                         handleFieldChange(emp.id, "PaidAmount", e.target.value)
// //                       }
// //                     />
// //                   </td>




// //                   <td className="border border-gray-300 px-2 py-1 font-semibold">
// //                     ₹{CurrentDueAmt}
// //                   </td>

// //                   <td className="border border-gray-300 px-2 py-1 font-semibold">
// //                     ₹{emp.PreviousDue}
// //                   </td>

// //                   {/* Editable Comments */}
// //                   <td className="border border-gray-300 px-2 py-1 w-48 font-semibold">
// //                     <input
// //                       type="text"
// //                       className="w-full border-none focus:ring-0 bg-transparent outline-none"
// //                       value={emp.Comments}
// //                       onChange={(e) =>
// //                         handleFieldChange(emp.id, "Comments", e.target.value)
// //                       }
// //                     />
// //                   </td>
// //                 </tr>
// //               );
// //             })}
// //           </tbody>
// //         </table>
// //       </div>
// //     </div>
// //   );
// // };

// // export default SalaryDetail;

// //////////////////////////////////////////////////////


// import React, { useState, useEffect } from "react";
// import { useAttendanceData, useCreateSallaryDetails, useSallaryTrackerDetail } from "./services";
// import { toast } from "react-toastify";
// import LoaderPage from "../NewBooking/LoaderPage";
// import { useApp } from "../TicketSystem/AppProvider";
// import { Controller, useForm } from "react-hook-form";
// import DatePicker from "react-datepicker";
// // import your API function here for saving data
// // e.g. import { saveSalaryData } from "./services";

// const SalaryDetail = () => {


//   const MONTH_SHORT_NAMES = [
//     "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
//   ];



//   const getPreviousMonthFormatted = () => {
//     const date = new Date();
//     date.setMonth(date.getMonth()); // go to previous month
//     const month = MONTH_SHORT_NAMES[date.getMonth()];
//     const year = date.getFullYear();
//     return `${month}${year}`; // format like "Nov2025"
//   };


//   const { control, watch } = useForm({
//     defaultValues: {
//       selectedMonth: getPreviousMonthFormatted(), // previous month as default
//     },
//   });
//   const selectedMonth = watch("selectedMonth") || ""



//   const { data, isPending } = useAttendanceData(selectedMonth);
//   const { data: sallayTrackerdetails } = useSallaryTrackerDetail(selectedMonth);

//   const attendanceList = data?.data || [];



//   const employeesNew = Object.values(
//     attendanceList.reduce((acc, record) => {
//       const { EmployeeID, EmployeeName, AttendanceStatus, HalfDayHrs } = record;
//       if (!acc[EmployeeID]) {
//         acc[EmployeeID] = {
//           id: EmployeeID,
//           name: EmployeeName,
//           FixSalary: 0,
//           AdjustedAmt: 0,
//           PaidLeaves: 0,
//           PaidAmount: 0,
//           attendance: [],
//           AdjAmtDetails: 0,
//           PaidAmtDetails: 0
//         };
//       }

//       let attendanceValue = 0;
//       if (AttendanceStatus === "1") attendanceValue = 1;
//       else if (AttendanceStatus === "0.5") attendanceValue = 0.5;
//       else if (AttendanceStatus === "0") attendanceValue = 0;
//       else if (HalfDayHrs && Number(HalfDayHrs) > 0) attendanceValue = 0.5;

//       acc[EmployeeID].attendance.push(attendanceValue);
//       return acc;
//     }, {})
//   );


//   const [employees, setEmployees] = useState([]);
  
//   const [enteredAdjustedAmount, setEnteredAdjustedAmount] = useState(0);
//   const [enteredPaidAmount, setEnteredPaidAmount] = useState(0);
//   const [paidAmtPopUp, setPaidAmtPopUp] = useState(false);
//   const [adjAmtPopUp, setAdjAmtPopUp] = useState(false);
//   const [adjAmtDetails, setAdjAmountDetails] = useState("")
//   const [paidAmtDetails, setPaidAmountDetails] = useState("")
//   const [splAmt, setSplAmt] = useState("")
//   const [splDecducAmt, setDecducAmt] = useState("")
//   const [advAmt, setAdvAmt] = useState("")
//   const [advDecducAmt, setAdvDecducAmt] = useState("")
//   const [handleSplAmtType, setHandleSplAmtType] = useState("")
//   const [handleDeducAmtType, setHandleDeducAmtType] = useState("")
//   const [handleAdvAmtType, setHandleAdvAmtType] = useState("")
//   const [handleAdvDeducAmtType, setHandleAdvDeducAmtType] = useState("")
//   const [secularEmpId, setSecularEmpId] = useState("null")
//   const [error, setError] = useState("")
//   const [deductError, setDeductError] = useState("")
//   const [loadingRowId, setLoadingRowId] = useState(null);
//   const { decryptedUser } = useApp();

//   const [cmt, setCmt] = useState("")
//   const [deductCmt, setDeductCmt] = useState("")
//   const [advCmt, setAdvCmt] = useState("")
//   const [advDeductCmt, setAdvDeductCmt] = useState("")

//   const { mutate: createSallaryDetails, isPending: isCreateSallaryDetails } = useCreateSallaryDetails();


//   // const [attendanceDays, setAttendanceDays] = useState(0);

//   // useEffect(() => {
//   //   if (splAmt) {
//   //     setError("")
//   //   } else if (splDecducAmt) {
//   //     setDeductError("")
//   //   }

//   // }, [splAmt, splDecducAmt])

//   // console.log("enteredAdjustedAmount", enteredAdjustedAmount)

//   useEffect(() => {
//     if (employeesNew.length && sallayTrackerdetails?.data) {
//       const merged = employeesNew.map((emp) => {
//         const match = sallayTrackerdetails?.data?.find(
//           (s) => s.EmployeeID == emp.id
//         );
//         return {
//           ...emp,
//           FixSalary: match ? match.FixSalary : 0,
//           AdjustedAmt: match ? match.AdjustedAmt : 0,
//           PaidLeaves: match ? match.PaidLeaves : 0,
//           CurrentDue: match ? match.CurrentDue : 0,
//           PreviousDue: match ? match.PreviousDue : 0,
//           Comments: match ? match.Comments : "",
//           PaidAmount: match ? match.PaidAmount : 0,
//           AdjAmtDetails: match ? match.AdjAmtDetails : 0,
//           PaidAmtDetails: match ? match.PaidAmtDetails : 0,
//           // PerDay: match ? match.PerDay : 0,
//           // TotalDays: match ? match.TotalDays : 0,
//           PayableSalary: match ? match.PayableSalary : 0,
//         };
//       });
//       setEmployees(merged);
//     }



//   }, [data, sallayTrackerdetails]);

// //  old code ......................................
//   // const getAttendanceSum = (arr) => 
//   //     Math.min(
//   //         arr?.reduce((sum, val) => sum + (typeof val === "number" ? val : 0), 0),
//   //         30 // maximum allowed
//   //     );
// //  old code ......................................
//   const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//   // const selectedMonth = "Jan2026";
//   const monthStr = selectedMonth.slice(0, 3);  // "Jan"
//   const selectedYear = parseInt(selectedMonth.slice(3)); // 2026
//   const selectetNewMonth = monthNames.indexOf(monthStr) + 1; // 1 for Jan
//   const monthIndex = monthNames.indexOf(monthStr); // 0-based index (0 = Jan)

// const lastDateOfSelectedMonth = new Date(selectedYear, monthIndex + 1, 0)






// //      const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// // const selectedMonth = "Jan2026"; // example
// // const monthStr = selectedMonth.slice(0, 3); // "Jan"
// // const year = parseInt(selectedMonth.slice(3)); // 2026
// // const monthIndex = monthNames.indexOf(monthStr); // 0-based index (0 = Jan)

// // const lastDateOfSelectedMonth = new Date(year, monthIndex + 1, 0).getDate();

// // console.log("Last date of", selectedMonth, "is", lastDateOfSelectedMonth); // 31

//   // const getAttendanceSum = (arr) => {

//   //   const daysInMonth = new Date(selectedYear, selectetNewMonth, 0).getDate();
//   //   const monthDaysArr = arr.slice(0, daysInMonth);

//   //   let sum = 0;

//   //   if (daysInMonth === 31) {
//   //     sum = monthDaysArr.slice(0, 30).reduce((total, val) => total + (typeof val === "number" ? val : 0), 0);
//   //     const lastDay = monthDaysArr[30];
//   //     if (lastDay === 0.5) {
//   //       sum -= 0.5;
//   //     }
//   //     if (lastDay === 0) {
//   //       sum -= 1;
//   //     }
//   //   } else  {
//   //     sum = monthDaysArr.reduce((total, val) => total + (typeof val === "number" ? val : 0), 0);
//   //   } 





//   //   return Math.max(0, Math.min(sum, 30));
//   // };



//   const getAttendanceSum = (arr) => {
//     const daysInMonth = new Date(selectedYear, selectetNewMonth, 0).getDate();
//     const monthDaysArr = arr.slice(0, daysInMonth);
//     let sum = 0;
//     if (daysInMonth === 31 && lastDateOfSelectedMonth < new Date() ) {
//       sum = monthDaysArr.slice(0, 30).reduce((total, val) => total + (typeof val === "number" ? val : 0), 0);
//       const lastDay = monthDaysArr[30];
//       if (lastDay === 0.5) {
//         sum -= 0.5;
//       }
//       if (lastDay === 0) {
//         sum -= 1;
//       }
//     }
//     else if (daysInMonth === 29 && lastDateOfSelectedMonth < new Date()) {
//       sum = monthDaysArr.reduce((total, val) => total + (typeof val === "number" ? val : 0), 0);
//       sum += 1;
//     } else if (daysInMonth === 28 && lastDateOfSelectedMonth < new Date()) {
//       sum = monthDaysArr.reduce((total, val) => total + (typeof val === "number" ? val : 0), 0);
//       sum += 2;
//     }
//     else{
//       sum = monthDaysArr.reduce((total, val) => total + (typeof val === "number" ? val : 0), 0);
//     }
//     return Math.max(0, Math.min(sum, 30));
//   };




//   //   const getAttendanceSum = (arr) => {
//   //   let present = 0;
//   //   let leave = 0;
//   //   let HalfDay = 0;
//   //   const arrayForHalfDay = []
//   //   const MaxTotalDays = 30;

//   //   for (let i = 0; i < arr.length; i++) {
//   //   if (arr[i] === 1) {
//   //     if (present < MaxTotalDays) present++;
//   // } else if (arr[i] === 0.5) {
//   //     if (present + 0.5 <= MaxTotalDays) present += 0.5;
//   // } else if (arr[i] === 0) {
//   //       leave++; // full leave count
//   //     }
//   //     else if (arr[i] === 0.5){
//   //       arrayForHalfDay.push(arr[i])
//   //     }
//   //   }

//   // let halfDaysPresent = arrayForHalfDay.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

//   //   let totaldays = MaxTotalDays + halfDaysPresent - leave;

//   //   if (totaldays < 0) {
//   //     totaldays = 0; // minus me nahi jayega
//   //   }

//   //   return totaldays;
//   // };

//   const handleFieldChange = (id, field, value) => {
//     if (field == "AdjustedAmt") {
//       setEnteredAdjustedAmount(value)
//     } else if (field == "PaidAmount") {
//       setEnteredPaidAmount(value)
//     }

//     setEmployees((prev) =>
//       prev.map((emp) =>
//         emp.id === id ? { ...emp, [field]: value } : emp
//       )
//     );
//   };


//   const now = new Date();

//   // Format date like "22 Nov 2025"
//   const formattedDate = now.toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });

//   // Format time like "3:45 pm"
//   const formattedTime = now.toLocaleTimeString("en-US", {
//     hour: "numeric",
//     minute: "2-digit",
//     hour12: true,
//   }).toLowerCase(); // optional: ensure "pm" is lowercase

//   // Combine date + time
//   const dateTimeStamp = `${formattedDate} ${formattedTime}`;

//   // Collect non-empty comments
//   const commentsList = [
//     cmt && `[${dateTimeStamp} ${decryptedUser?.employee?.Name}]${cmt}`,
//     deductCmt && `[${dateTimeStamp} ${decryptedUser?.employee?.Name}]${deductCmt}`,
//     advCmt && `[${dateTimeStamp} ${decryptedUser?.employee?.Name}]${advCmt}`,
//     advDeductCmt && `[${dateTimeStamp} ${decryptedUser?.employee?.Name}]${advDeductCmt}`,
//   ].filter(Boolean);

//   const allComments = commentsList.join("\n");

  
//   const handleSaveRow = async (emp, calc) => {
//     setLoadingRowId(emp.id);


//     try {
//       const empId = emp.id;

//       // 1️⃣ Get previous value from DB record
//       const dbRecord = sallayTrackerdetails?.data?.find(
//         (s) => s.EmployeeID == empId
//       );

//       const previousAdjusted = dbRecord?.AdjAmtDetails?.toString() || "0";
//       const previousPaid = dbRecord?.PaidAmtDetails?.toString() || "0";

//       // 2️⃣ Get employee-specific entered values
//       const enteredAdjusted = enteredAdjustedAmount[empId] || 0;
//       const enteredPaid = enteredPaidAmount[empId] || 0;

//       // 3️⃣ Build final expression strings
//       const finalAdjustedAmt =
//         previousAdjusted.includes("+") || previousAdjusted.includes("-")
//           ? `${enteredAdjusted ? "" : previousAdjusted}${enteredAdjusted !== 0 ? (enteredAdjusted > 0 ? "+" + enteredAdjusted : enteredAdjusted) : ""}`
//           : enteredAdjusted !== 0
//             ? `${enteredAdjusted}`
//             : previousAdjusted;

//       const finalPaidAmount =
//         previousPaid.includes("+") || previousPaid.includes("-")
//           ? `${enteredPaid ? "" : previousPaid}${enteredPaid !== 0 ? (enteredPaid > 0 ? "+" + enteredPaid : enteredPaid) : ""}`
//           : enteredPaid !== 0
//             ? `${enteredPaid}`
//             : previousPaid;

//       // 4️⃣ Prepare payload
//       const PaidAmount = (finalPaidAmount && finalPaidAmount.toString())
//         .split(/(?=[+-])/g)
//         .reduce((a, b) => a + Number(b), 0);

//       // Calculate AdjustedAmt safely
//       const AdjustedAmt = (finalAdjustedAmt && finalAdjustedAmt.toString())
//         .split(/(?=[+-])/g)
//         .reduce((a, b) => a + Number(b), 0);


//       //         const mergedComments = [
//       //   ...(allComments || []),
//       //   ...(emp.Comments && emp.Comments.length ? emp.Comments : [])
//       // ];
//       const normalizeComments = (comments) => {
//         if (!comments) return [];
//         return Array.isArray(comments) ? comments : [comments];
//       };

//       const mergedComments = [
//         ...normalizeComments(allComments),
//         ...normalizeComments(emp.Comments),
//       ];

//       const payload = {
//         ...emp,
//         EmployeeName: emp.name,
//         AdjAmtDetails: finalAdjustedAmt,
//         PaidAmtDetails: finalPaidAmount,
//         PaidAmount: PaidAmount,
//         AdjustedAmt: AdjustedAmt,
//         CurrentDue: calc.CurrentDue,
//         TotalPresentDays: calc.attendanceDays,
//         PayableSalary: calc.payable,
//         perDay: calc.perDay,
//         Comments: mergedComments,
//         UpdatedBy: `${dateTimeStamp} ${decryptedUser?.employee?.Name}`
//       };
     
     
//       // 5️⃣ Convert attendance array to object with 1-based keys
//       if (Array.isArray(emp.attendance) && emp.attendance.length >= 31) {
//         emp.attendance.forEach((val, idx) => {
//           payload[idx + 1] = val;      // This adds fields 1,2,3..31 directly into payload
//         });
//         // ✅ Remove the original array
//         delete payload.attendance;
//       } else {
//         console.warn(`Attendance array for ${emp.name} does not have 31 elements`);
//       }



//       // 6️⃣ Reset only this employee's entered values
//       setEnteredAdjustedAmount(prev => ({ ...prev, [empId]: 0 }));
//       setEnteredPaidAmount(prev => ({ ...prev, [empId]: 0 }));

//       createSallaryDetails({ payload, selectedMonth }, {
//         onSuccess: () => {
//           toast.success(
//             <div className="flex items-center space-x-3">
//               <span className="font-semibold">Saved successfully for {emp.name}</span>
//             </div>
//           );
//           setSplAmt("")
//           setDecducAmt("")
//           setAdvAmt("")
//           setAdvDecducAmt("")
//           setHandleSplAmtType("")
//           setHandleDeducAmtType("")
//           setHandleAdvDeducAmtType("")
//           setHandleAdvAmtType("")
//           setSecularEmpId("")
//           setError("")
//           setDeductError("")
//           setLoadingRowId("")
//           setCmt("")
//           setDeductCmt("")
//           setAdvCmt("")
//           setAdvDeductCmt("")
//           // window.location.reload();
//         },
//         onError: (response) => {
//           toast.error(
//             <div>
//               <p className="font-semibold">Failed to submit.</p>
//               <p className="text-sm text-gray-400">
//                 {response?.response?.data?.error || "Unknown error"}
//               </p>
//             </div>
//           );
//         },
//       });


//       // Optional: reset other fields if global
//       // setSplAmt("");
//       // setDecducAmt("");
//       // setAdvAmt("");
//       // setAdvDecducAmt("");

//       // alert(`✅ Saved successfully for ${emp.name}`);
//     } catch (err) {
//       console.error("Save failed:", err);
//       alert("❌ Error saving data");
//     }
//   };

//   // // Save all employees in bulk
//   // const handleSaveAll = async () => {
//   //   try {
//   //     console.log("Saving all employees:", employees);
//   //     // await saveSalaryData(employees);
//   //     alert("✅ All employee data saved successfully!");
//   //   } catch (err) {
//   //     console.error("Bulk save failed:", err);
//   //     alert("❌ Error saving all data");
//   //   }
//   // };



//   const appendValueSplToCalculation = (existing, value, type, action = "add") => {
//     if (!value) return existing || "";
//     let operator = "";

//     if (handleSplAmtType === "spl" || handleSplAmtType === "adv") {
//       operator = action === "add" ? "+" : "-";
//     }
//     if (!existing) return value;

//     return `${existing}${operator}${value}`;
//   };

//   const appendValueDeducToCalculation = (existing, value, type, action = "add") => {
//     if (!value) return existing || "";
//     let operator = "";
//     if (handleDeducAmtType === "deduct" || handleDeducAmtType === "deducted") {
//       operator = action === "add" ? "-" : "+";
//     }
//     if (!existing) {
//       return `${operator}${value}`;
//     }

//     return `${existing}${operator}${value}`;
//   };



//   const appendValueAdvToCalculation = (existing, value, type, action = "add") => {
//     if (!value) return existing || "";
//     let operator = "";
//     if (handleAdvAmtType === "spl" || handleAdvAmtType === "adv") {
//       operator = action === "add" ? "+" : "-";
//     }
//     if (!existing) return value;
//     return `${existing}${operator}${value}`;
//   };

//   const appendValueAdvDeducToCalculation = (existing, value, type, action = "add") => {
//     if (!value) return existing || "";
//     let operator = "";
//     if (handleAdvDeducAmtType === "deduct" || handleAdvDeducAmtType === "deducted") {
//       operator = action === "add" ? "-" : "+";
//     }
//     if (!existing) {
//       return `${operator}${value}`;
//     }
//     return `${existing}${operator}${value}`;
//   };




//   // useEffect(() => {
//   //   if (!amt) return;
//   //   if (handleType === "spl" || handleType === "deduct") {
//   //     setAdjAmountDetails(prev => appendValueToCalculation(prev, amt, handleType));
//   //   }

//   //   if (handleType === "adv" || handleType === "deducted") {
//   //     setPaidAmountDetails(prev => appendValueToCalculation(prev, amt, handleType));
//   //   }

//   // }, [amt]);


//   const handlePopUp = (existingValue, empId, type) => {
//     if (type === "PaidAmount") {
//       setPaidAmountDetails(existingValue || "");
//       setPaidAmtPopUp(true);
//     } else {
//       setAdjAmountDetails(existingValue || "");
//       setAdjAmtPopUp(true);
//     }
//     setSecularEmpId(empId)
//     // setSplAmt("");
//     // setDecducAmt("")
//     // setCmt("");

//   };

//   const handleSplAmount = (e, type) => {
//     setSplAmt(e.target.value);
//     setHandleSplAmtType(type.toLowerCase());
//   };

//   const handleSplDeductAmount = (e, type) => {
//     setDecducAmt(e.target.value);
//     setHandleDeducAmtType(type.toLowerCase());
//   };

//   const handleAdvAmount = (e, type) => {
//     setAdvAmt(e.target.value);
//     setHandleAdvAmtType(type.toLowerCase());
//   };

//   const handleAdvDeductAmount = (e, type) => {
//     setAdvDecducAmt(e.target.value);
//     setHandleAdvDeducAmtType(type.toLowerCase());
//   };

//   const handleAdvComment = (e) => {
//     setAdvCmt(e.target.value)
//   }
//   const handleAdvDeductComment = (e) => {
//     setAdvDeductCmt(e.target.value)
//   }


//   const handleSplComment = (e) => {
//     setCmt(e.target.value)
//   }
//   const handleDeductAdvSplComment = (e) => {
//     setDeductCmt(e.target.value)
//   }


//   // useEffect(() => {
//   //   setEnteredAdjustedAmount(secularEmpId , appendValueDeducToCalculation(appendValueSplToCalculation(adjAmtDetails, splAmt), splDecducAmt))
//   // }, [appendValueDeducToCalculation(secularEmpId , appendValueSplToCalculation(adjAmtDetails, splAmt), splDecducAmt)])

//   useEffect(() => {
//     const finalValue = appendValueDeducToCalculation(
//       appendValueSplToCalculation(adjAmtDetails, splAmt),
//       splDecducAmt
//     );

//     setEnteredAdjustedAmount((prev) => ({
//       ...prev,
//       [secularEmpId]: finalValue
//     }));

//   }, [secularEmpId, adjAmtDetails, splAmt, splDecducAmt]);

//   // useEffect(() => {
//   //   setEnteredPaidAmount(secularEmpId , appendValueAdvDeducToCalculation(appendValueAdvToCalculation(paidAmtDetails, advAmt), advDecducAmt))
//   // }, [appendValueAdvDeducToCalculation(secularEmpId , appendValueAdvToCalculation(paidAmtDetails, advAmt), advDecducAmt)])

//   useEffect(() => {
//     const finalValue = appendValueAdvDeducToCalculation(
//       appendValueAdvToCalculation(paidAmtDetails, advAmt),
//       advDecducAmt
//     );

//     setEnteredPaidAmount((prev) => ({
//       ...prev,
//       [secularEmpId]: finalValue
//     }));

//   }, [secularEmpId, paidAmtDetails, advAmt, advDecducAmt]);

//   const handleSaveAdj = () => {
//     setError("");
//     setDeductError("");
//     if (splAmt && !cmt) {
//       setError("Comment is required for special perk");
//       return;   // stop execution
//     }
//     if (splDecducAmt && !deductCmt) {
//       setDeductError("Comment is required for deduction");
//       return;
//     }
//     setAdjAmtPopUp(false)


//   }


//   const handleSavePaid = () => {
//     setError("");
//     setDeductError("");
//     if (advAmt && !advCmt) {
//       setError("Comment is required for Advance Amt");
//       return;   // stop execution
//     }
//     if (advDecducAmt && !advDeductCmt) {
//       setDeductError("Comment is required for deduction");
//       return;
//     }
//     setPaidAmtPopUp(false)

//   }


//   if (isPending) {
//     return <div className="h-screen w-full flex justify-center items-center">
//       <LoaderPage />

//     </div>
//   }


//   const date = new Date();

//   const month = date.toLocaleString("en-US", { month: "long" }); // e.g., "November"
//   const year = date.getFullYear(); // e.g., 2025






//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       {/* Header */}
//       <div className="bg-gray-50 text-gray-800 text-center  rounded-md mt-20 pb-2">
//         <div className="text-2xl flex  flex-col justify-center items-center  font-bold">
//           <div className="flex  justify-center items-center  font-bold">
//             Attendance & Salary Tracker - <div>
//               <Controller
//                 name="selectedMonth"
//                 control={control}
//                 rules={{ required: "Please select a month" }}
//                 render={({ field }) => {
//                   // FIX: Convert "Dec2024" back to a Date object safely
//                   let selectedDate = null;

//                   if (field.value) {
//                     const monthStr = field.value.slice(0, 3); // "Dec"
//                     const yearStr = field.value.slice(3);     // "2024"

//                     const monthIndex = MONTH_SHORT_NAMES.indexOf(monthStr);

//                     if (monthIndex !== -1) {
//                       selectedDate = new Date(Number(yearStr), monthIndex, 1);
//                     }
//                   }

//                   return (
//                     <DatePicker
//                       selected={selectedDate}
//                       onChange={(date) => {
//                         if (!date) return field.onChange("");
//                         const month = MONTH_SHORT_NAMES[date.getMonth()];
//                         const year = date.getFullYear();
//                         const formatted = `${month}${year}`;
//                         field.onChange(formatted);
//                       }}
//                       dateFormat="MMM yyyy"
//                       showMonthYearPicker
//                       popperPlacement="bottom-start"
//                       withPortal
//                       popperClassName="custom-datepicker-popper z-[9999]"
//                       placeholderText="Select month"
//                       className="w-[150px]  focus:ring-1 border-none bg-gray-50 px-3 py-2 border-orange-300 outline-orange-200 rounded-md" />
//                   );
//                 }}
//               />

//               {/* {errors.selectedDate && (
//                             <p className="text-red-500 text-sm mt-1">
//                                 {errors.selectedDate.message}
//                             </p>
//                         )} */}
//             </div>

//           </div>

//         </div>


//         {/* Save All Button */}
//         {/* <button
//           onClick={handleSaveAll}
//           className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//         >
//           💾 Save All
//         </button> */}
//       </div>

//       {/* Table */}
//       {/* <div className=" text-2xl"> */}

//       <div className="overflow-auto max-w-full rounded-lg max-h-[510px]">
//         <table className="min-w-auto border-red-500">
//           <thead className="bg-orange-300 shadow-sm text-lg font-bold text-gray-700 sticky top-[-1px] z-50">
//             <tr>
//               <th className="border font-bold whitespace-nowrap px-2 py-2 sticky left-0 z-50 bg-orange-300">EmpID</th>
//               <th className="border border-gray-300 whitespace-nowrap font-bold  px-2 py-2 sticky left-20 z-50 bg-orange-300 text-left">Employee's Name</th>
//               {[...Array(31)].map((_, i) => (
//                 <th key={i} className="border border-gray-300 px-1 py-1 w-6">
//                   {i + 1}
//                 </th>
//               ))}
//               <th className="border whitespace-nowrap font-bold  border-gray-300 px-2 py-2 w-[100px]">Total Days</th>
//               <th className="border whitespace-nowrap font-bold border-gray-300 px-2 py-2">Fix Salary</th>
//               <th className="border whitespace-nowrap font-bold border-gray-300 px-2 py-2">Per Day</th>
//               <th className="border whitespace-nowrap font-bold border-gray-300 px-2 py-2">Adjusted Amt</th>
//               <th className="border whitespace-nowrap font-bold border-gray-300 px-2 py-2">Paid Leaves</th>
//               <th className="border whitespace-nowrap font-bold border-gray-300 px-2 py-2">Payable Salary</th>
//               <th className="border whitespace-nowrap font-bold border-gray-300 px-2 py-2">Paid Amt</th>
//               <th className="border whitespace-nowrap font-bold border-gray-300 px-2 py-2">Current Due</th>
//               <th className="border whitespace-nowrap font-bold border-gray-300 px-2 py-2">Previous Due</th>
//               <th className="border whitespace-nowrap font-bold border-gray-300 w-48 px-2 py-2">Comments</th>
//               <th className="border whitespace-nowrap font-bold border-gray-300 px-2 py-2">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {employees?.filter(emp => emp?.id)?.map((emp, i) => {
//               const attendanceDays = getAttendanceSum(emp.attendance) || 0;

//               // const AdjustedAmt = (emp.AdjAmtDetails || "0").split(/(?=[+-])/g).reduce((a, b) => a + Number(b), 0);
//               const rawValue =
//                 enteredAdjustedAmount[emp.id] && enteredAdjustedAmount[emp.id] !== "0"
//                   ? enteredAdjustedAmount[emp.id]
//                   : emp.AdjAmtDetails || "0";

//               const AdjustedAmt = rawValue
//                 .split(/(?=[+-])/g)
//                 .reduce((a, b) => a + Number(b), 0);


//               const SecondrawValue =
//                 enteredPaidAmount[emp.id] && enteredPaidAmount[emp.id] !== "0"
//                   ? enteredPaidAmount[emp.id]
//                   : emp.PaidAmtDetails || "0";

//               const PaidAmt = SecondrawValue
//                 .split(/(?=[+-])/g)
//                 .reduce((a, b) => a + Number(b), 0);


//               const PaidLeaves = Number(emp.PaidLeaves) || 0;
//               // const PaidAmt = (emp.PaidAmtDetails || "0").split(/(?=[+-])/g).reduce((a, b) => a + Number(b), 0);
//               // const CurrentDueAmt = Number(emp.CurrentDue) || 0;
//               const salary = Number(emp.FixSalary) || 0;
//               const perDay = salary / 30;
//               const payable =
//                 perDay * attendanceDays + PaidLeaves * perDay + AdjustedAmt;
//               const CurrentDue = payable - PaidAmt;
//               return (
//                 <tr
//                   key={emp.id}
//                   className={`text-lg text-gray-800 text-center ${i % 2 === 0 ? "bg-gray-50" : "bg-white"
//                     } hover:bg-yellow-50`}
//                 >
//                   <td className="border font-bold border-gray-300 px-2 py-1 sticky left-0 bg-orange-300 z-30">{emp.id}</td>
//                   <td className="border whitespace-nowrap border-gray-300 px-2 py-1 sticky left-20 font-bold bg-orange-300 z-30 text-left ">
//                     {emp.name}
//                   </td>

//                   {/* Attendance cells */}
//                   {emp.attendance.map((a, index) => (
//                     <td
//                       key={index}
//                       className={`border border-gray-300 px-1 py-1 font-semibold ${a === 1
//                         ? "bg-white text-black"
//                         : a === 0.5
//                           ? "bg-yellow-100 text-yellow-700"
//                           : "bg-red-100 text-red-700"
//                         }`}
//                     >
//                       {a}
//                     </td>
//                   ))}

//                   {/* Summary + Editable Fields */}
//                   <td className="border border-gray-300 px-2 py-1 font-semibold">
//                     {attendanceDays.toFixed(1)}
//                   </td>
//                   <td className="border border-gray-300 px-2 py-1">
//                     <input
//                       type="number"
//                       className="w-24 text-center border-none bg-transparent outline-none focus:ring-0"
//                       value={emp.FixSalary}
//                       // readOnly
//                       onChange={(e) => handleFieldChange(emp.id, "FixSalary", e.target.value)}
//                     />
//                   </td>
//                   <td className="border border-gray-300 px-2 py-1">₹{perDay.toFixed(2)}</td>
//                   <td onClick={() => handlePopUp(emp.AdjAmtDetails, emp.id, "AdjustedAmt")} className="border cursor-pointer border-gray-300 px-2 py-1">
//                     {AdjustedAmt}
//                     {/* <input
//                       type="number"
//                       className="w-20 text-center border-none bg-transparent outline-none focus:ring-0"
//                       value=
//                       onChange={(e) => handleFieldChange(emp.id, "AdjustedAmt", e.target.value)}
//                     /> */}
//                   </td>
//                   <td className="border border-gray-300 px-2 py-1">
//                     <input
//                       type="number"
//                       className="w-12 text-center border-none bg-transparent outline-none focus:ring-0"
//                       value={emp.PaidLeaves}
//                       onChange={(e) => handleFieldChange(emp.id, "PaidLeaves", e.target.value)}
//                     />
//                   </td>

//                   <td className="border border-gray-300 px-2 py-1 font-semibold text-blue-700">
//                     ₹{payable.toFixed(0)}
//                   </td>

//                   <td onClick={() => handlePopUp(emp.PaidAmtDetails, emp.id, "PaidAmount")} className="border cursor-pointer border-gray-300 px-2 py-1">
//                     {/* {emp.PaidAmount} */}
//                     {PaidAmt}
//                     {/* <input
//                       type="number"
//                       className="w-12 text-center border-none bg-transparent outline-none focus:ring-0"
//                       value={emp.PaidAmount}
//                       onChange={(e) => handleFieldChange(emp.id, "PaidAmount", e.target.value)}
//                     /> */}
//                   </td>
//                   <td className="border border-gray-300 px-2 py-1 font-semibold">
//                     ₹{CurrentDue.toFixed(0)}
//                   </td>

//                   <td className="border border-gray-300 px-2 py-1 font-semibold">
//                     ₹{emp.PreviousDue}
//                   </td>

//                   <td className="border cursor-pointer border-gray-300 px-2 py-1 w-48 font-semibold relative group">
//                     <input
//                       type="text"
//                       className="w-full border-none cursor-pointer focus:ring-0 bg-transparent outline-none"
//                       value={emp.Comments}
//                       readOnly
//                     />
//                     {/* Hover Popup */}
//                     {emp.Comments && (
//                       <div className="absolute right-10 top-full mt-1 hidden group-hover:block 
//                     bg-white border border-gray-300 shadow-lg 
//                     p-2 w-auto z-50 rounded text-start text-sm whitespace-pre">
//                         {emp.Comments}
//                       </div>
//                     )}
//                   </td>
//                   {/* Row Save Button */}
//                   <td className="border border-gray-300 px-2 py-1">
//                     <button
//                       onClick={() => handleSaveRow(emp, {
//                         attendanceDays,
//                         perDay,
//                         payable,
//                         CurrentDue,

//                       })}
//                       className="px-3 py-1 bg-orange-400 text-white rounded text-xs hover:bg-orange-500 flex items-center justify-center"
//                     >
//                       {isCreateSallaryDetails && loadingRowId === emp.id ? <LoaderPage /> : "Save"}
//                     </button>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//       {/* </div> */}

//       {/* <div className="flex flex-col items-center justify-center h-screen bg-gray-100"> */}
//       {/* ......................... */}
//       {adjAmtPopUp && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
//           <div className="bg-white rounded-xl shadow-xl p-6 w-96 relative animate-fadeIn">
//             <h2 className="text-xl font-semibold mb-4 text-gray-700">Adj Amt Details</h2>
//             {/* Adj Amount */}
//             <div className="flex gap-5 justify-center items-center ">
//               <label className="text-lg text-gray-600">Label: </label>
//               <input
//                 type="text"
//                 value={appendValueDeducToCalculation(appendValueSplToCalculation(adjAmtDetails, splAmt), splDecducAmt)}
//                 readOnly
//                 className="w-full mt-1 outline-none mb-4 p-2 border border-orange-300 rounded-lg bg-gray-100 cursor-not-allowed"
//               />
//             </div>
//             <div className="flex gap-5 justify-center items-center ">
//               <label className="text-lg text-gray-600 ">Spl.Perk₹:</label>
//               <input type="text" value={splAmt} onChange={(e) => handleSplAmount(e, "spl")}
//                 className="w-full mt-1 outline-none mb-4 p-2 border border-orange-300 rounded-lg "
//               />
//             </div>
//             <div className="flex gap-5 justify-center items-center ">
//               <label className="text-lg text-gray-600 ">Comments:</label>
//               <input
//                 type="text"
//                 value={cmt}
//                 onChange={handleSplComment}
//                 className="w-full mt-1 outline-none mb-4 p-2 border border-orange-300 rounded-lg"
//               />
//             </div>
//             <p className="text-red-500 text-sm text-center">{error}</p>
//             {/* ///////////////////// */}
//             <hr className="border border-gray-300 my-5" />
//             {/* Adj Amount */}
//             <div className="flex gap-5 justify-center items-center ">
//               <label className="text-lg text-gray-600">Label:</label>
//               <input
//                 type="text"
//                 value={appendValueDeducToCalculation(appendValueSplToCalculation(adjAmtDetails, splAmt), splDecducAmt)}
//                 readOnly
//                 className="w-full mt-1 outline-none mb-4 p-2 border border-orange-300 rounded-lg bg-gray-100 cursor-not-allowed"
//               />
//             </div>
//             <div className="flex gap-5 justify-center items-center ">
//               <label className="text-lg text-gray-600 ">Dedcucted.Amt₹:</label>
//               <input
//                 type="text"
//                 value={splDecducAmt}
//                 onChange={(e) => {
//                   const value = e.target.value;
//                   // Allow digits and minus sign anywhere
//                   if (/^[\d-]*$/.test(value)) {
//                     handleSplDeductAmount(e, "deduct");
//                   }
//                 }}
//                 className="w-full mt-1 outline-none mb-4 p-2 border border-orange-300 rounded-lg"
//               />
//             </div>
//             <div className="flex gap-5 justify-center items-center ">
//               <label className="text-lg text-gray-600 ">Comments:</label>
//               <input
//                 type="text"
//                 value={deductCmt}
//                 onChange={handleDeductAdvSplComment}
//                 className="w-full mt-1 outline-none mb-4 p-2 border border-orange-300 rounded-lg "
//               />
//             </div>
//             <p className="text-red-500 text-sm mb-5 text-center">{deductError}</p>
//             {/* <p className="text-gray-500 mb-6 text-sm">
//                 These are preview values and cannot be edited.
//               </p> */}
//             <div className="flex justify-center items-center gap-5">
//               <button
//                 onClick={handleSaveAdj}
//                 className="w-full py-2 bg-orange-300 text-white rounded-lg hover:bg-orange-500 transition"
//               >
//                 save
//               </button>
//               <button
//                 onClick={() => setAdjAmtPopUp(false)}
//                 className="w-full py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
//               >
//                 cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Popup Modal */}
//       {paidAmtPopUp && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
//           <div className="bg-white rounded-xl shadow-xl p-6 w-96 relative animate-fadeIn">
//             <h2 className="text-xl font-semibold mb-4 text-gray-700">Paid Amt Details</h2>
//             {/* Adj Amount */}
//             <div className="flex gap-5 justify-center items-center ">
//               <label className="text-lg text-gray-600">Label: </label>
//               <input
//                 type="text"
//                 value={appendValueAdvDeducToCalculation(appendValueAdvToCalculation(paidAmtDetails, advAmt), advDecducAmt)}
//                 readOnly
//                 className="w-full mt-1 outline-none mb-4 p-2 border border-orange-300 rounded-lg bg-gray-100 cursor-not-allowed"
//               />
//             </div>

//             <div className="flex gap-5 justify-center items-center ">
//               <label className="text-lg text-gray-600 ">Adv.Amt₹:</label>
//               <input
//                 type="text"
//                 value={advAmt}
//                 onChange={(e) => handleAdvAmount(e, "Adv")}
//                 className="w-full mt-1 outline-none mb-4 p-2 border border-orange-300 rounded-lg "
//               />
//             </div>

//             <div className="flex gap-5 justify-center items-center ">
//               <label className="text-lg text-gray-600 ">Comments:</label>
//               <input
//                 type="text"
//                 value={advCmt}
//                 onChange={handleAdvComment}
//                 className="w-full mt-1 outline-none mb-4 p-2 border border-orange-300 rounded-lg  "
//               />
//             </div>
//             <p className="text-red-500 text-sm mb-5 text-center">{error}</p>

//             {/* ///////////////////// */}
//             <hr className="border border-gray-300 my-5" />
//             {/* Adj Amount */}
//             <div className="flex gap-5 justify-center items-center ">
//               <label className="text-lg text-gray-600">Label:</label>
//               <input
//                 type="text"
//                 value={appendValueAdvDeducToCalculation(appendValueAdvToCalculation(paidAmtDetails, advAmt), advDecducAmt)}
//                 readOnly
//                 className="w-full mt-1 outline-none mb-4 p-2 border border-orange-300 rounded-lg bg-gray-100 cursor-not-allowed"
//               />
//             </div>

//             <div className="flex gap-5 justify-center items-center ">
//               <label className="text-lg text-gray-600 ">Dedcucted.Amt₹:</label>
//               <input
//                 type="text"
//                 value={advDecducAmt}
//                 onChange={(e) => {
//                   const value = e.target.value;

//                   // Allow digits and minus sign anywhere
//                   if (/^[\d-]*$/.test(value)) {
//                     handleAdvDeductAmount(e, "deducted");
//                   }
//                 }}
//                 // onChange={(e) => handleAdvDeductAmount(e, "deducted")}
//                 className="w-full mt-1 outline-none mb-4 p-2 border border-orange-300 rounded-lg "
//               />
//             </div>

//             <div className="flex gap-5 justify-center items-center ">
//               <label className="text-lg text-gray-600 ">Comments:</label>
//               <input
//                 type="text"
//                 value={advDeductCmt}
//                 onChange={handleAdvDeductComment}
//                 className="w-full mt-1 outline-none mb-4 p-2 border border-orange-300 rounded-lg "
//               />
//             </div>
//             <p className="text-red-500 text-sm mb-5 text-center">{deductError}</p>


//             <div className="flex justify-center items-center gap-5">
//               <button
//                 onClick={handleSavePaid}
//                 className="w-full py-2 bg-orange-300 text-white rounded-lg hover:bg-orange-500 transition"
//               >
//                 save
//               </button>
//               <button
//                 onClick={() => setPaidAmtPopUp(false)}
//                 className="w-full py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
//               >
//                 cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}



//       {/* </div> */}
//     </div>
//   );
// };

// export default SalaryDetail;



// import React from "react";
// import { useAttendanceData, useSallaryTrackerDetail } from "./services";

// const SalaryDetail = () => {

//   const { data, isPending } = useAttendanceData()
//   const { data: sallayTrackerdetails } = useSallaryTrackerDetail()

//   console.log(333333333, sallayTrackerdetails)
//   // Extract attendance list
//   const attendanceList = data?.data || []
//   //console.log(121212, attendanceList)
//   //Transform raw attendance list
//   const employeesNew = Object.values(
//     attendanceList.reduce((acc, record) => {
//       const { EmployeeID, EmployeeName, AttendanceStatus, HalfDayHrs } = record;

//       if (!acc[EmployeeID]) {
//         acc[EmployeeID] = {
//           id: EmployeeID,
//           name: EmployeeName,
//           salary: 0, // will fill later
//           AdjustedAmt: 0,
//           PaidLeaves: 0,
//           attendance: [],
//         };
//       }

//       let attendanceValue = 0;
//       if (AttendanceStatus === "1") attendanceValue = 1;
//       else if (AttendanceStatus === "0.5") attendanceValue = 0.5;
//       else if (AttendanceStatus === "0") attendanceValue = 0;
//       else if (HalfDayHrs && Number(HalfDayHrs) > 0) attendanceValue = 0.5;

//       acc[EmployeeID].attendance.push(attendanceValue);

//       return acc;
//     }, {})
//   );

//   //Example salary data

//   //Merge salary
//   const employeesWithSalary = employeesNew.map(emp => {
//     const match = sallayTrackerdetails?.data?.find(s => s.EmployeeID == emp.id);

//     return {
//       ...emp, salary: match ? match.FixSalary : 0, AdjustedAmt: match ? match.AdjustedAmt : 0
//       , PaidLeaves: match ? match.PaidLeaves : 0, CurrentDue: match ? match.CurrentDue : 0,
//       PreviousDue: match ? match.PreviousDue : 0, Comments: match ? match.Comments : 0,
//       PaidAmount: match ? match.PaidAmount : 0


//     };
//   });

//   console.log("employeesWithSalary", employeesWithSalary)


//   // const employees = [
//   //   {
//   //     id: 1,
//   //     name: "Sandeep Pawar",
//   //     department: "Marketing & Sales",
//   //     salary: 60000,
//   //     attendance: [1, 1, 1, 0.5, 1, 1, 1, 1, 0.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
//   //   },
//   //   {
//   //     id: 2,
//   //     name: "Sachin Patil",
//   //     department: "Marketing & Sales",
//   //     salary: 30000,
//   //     attendance: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0],
//   //   },
//   //   {
//   //     id: 3,
//   //     name: "Vikram Mahankal",
//   //     department: "Maintenance & Admin",
//   //     salary: 100000,
//   //     attendance: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0],
//   //   },
//   // ];




//   const getAttendanceSum = (arr) =>
//     arr?.reduce((sum, val) => sum + (typeof val === "number" ? val : 0), 0);

//   function myFunction() {
//     var today = new Date();
//     var month = today.getMonth();
//     return daysInMonth(month + 1, today.getFullYear())
//   }

//   function daysInMonth(month, year) {
//     return new Date(year, month, 0).getDate();
//   }

//   myFunction();



//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       {/* Header */}
//       <div className="bg-gray-50 text-gray-800 text-center p-4 rounded-md mt-20  mb-6">
//         <h1 className="text-2xl font-bold">
//           Attendance & Salary Tracker - November 2025
//         </h1>
//         <p className="text-lg text-gray-700">l's paying Guest Services Pvt.Gopa Ltd</p>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto bg-white text-2xl rounded-lg shadow border border-gray-200">
//         <table className="min-w-auto border-red-500">
//           <thead className="bg-orange-200 font-bold border-b border-gray-300 text-sm  text-gray-700  text-center">
//             <tr>
//               <th className="border border-gray-300 px-2 py-2">EmpID</th>
//               <th className="border border-gray-300 px-2 py-2 text-left">
//                 Employee's Name
//               </th>
//               {/* <th className="border border-gray-300 px-2 py-2">DOJ</th> */}

//               {/* Days 1–30 */}
//               {[...Array(31)].map((_, i) => (
//                 <th key={i} className="border border-gray-300 px-1 py-1 w-6">
//                   {i + 1}
//                 </th>
//               ))}
//               <th className="border border-gray-300 px-2 py-2">Total Days</th>
//               <th className="border border-gray-300 px-2 py-2">Fix Salary</th>
//               <th className="border border-gray-300 px-2 py-2">Per Day</th>
//               <th className="border border-gray-300 px-2 py-2">Adjusted Amt</th>
//               <th className="border border-gray-300 px-2 py-2">Paid Leaves</th>
//               <th className="border border-gray-300 px-2 py-2">Payable Salary</th>
//               <th className="border border-gray-300 px-2 py-2">Paid Amt </th>
//               <th className="border border-gray-300 px-2 py-2">Current Due</th>
//               <th className="border border-gray-300 px-2 py-2">Previous Due</th>
//               <th className="border border-gray-300 w-48 px-2 py-2">Comments</th>
//             </tr>
//           </thead>

//           <tbody>
//             {employeesWithSalary?.filter(emp => emp?.id)?.map((emp, i) => {
//               const attendanceDays = getAttendanceSum(emp.attendance) || 0;
//               const AdjustedAmt = Number(emp.AdjustedAmt) || 0;  // ensure it's a number
//               const PaidLeaves = Number(emp.PaidLeaves) || 0;
//               const salary = Number(emp.salary) || 0;

//               const perDay = salary / 30;
//               const payable = (perDay * attendanceDays) + (PaidLeaves * perDay) + AdjustedAmt;
//               // console.log(11111111111111, payable)
//               return (
//                 <tr
//                   key={emp.id}
//                   className={`text-sm text-gray-800 text-center ${i % 2 === 0 ? "bg-gray-50" : "bg-white"
//                     } hover:bg-yellow-50`}
//                 >
//                   <td className="border border-gray-300 px-2 py-1">{emp.id}</td>
//                   <td className="border border-gray-300 px-2 py-1 text-left font-medium">
//                     {emp.name}
//                     <div className="text-[10px] text-gray-500">{emp.department}</div>
//                   </td>
//                   {/* <td className="border border-gray-300 px-2 py-1">{emp.doj}</td> */}

//                   {/* Attendance Days */}
//                   {emp.attendance.map((a, index) => (
//                     <td
//                       key={index}
//                       className={`border border-gray-300 px-1 py-1 font-semibold ${a === 1
//                         ? "bg-white text-black"
//                         : a === 0.5
//                           ? "bg-yellow-100 text-yellow-700"
//                           : "bg-red-100 text-red-700"
//                         }`}
//                     >
//                       {a}
//                     </td>
//                   ))}

//                   {/* Summary Columns */}

//                   <td className="border border-gray-300 px-2 py-1 font-semibold">
//                     {attendanceDays.toFixed(1)}
//                   </td>
//                   <td className="border border-gray-300 px-2 py-1">
//                     ₹{emp.salary.toLocaleString()}
//                   </td>
//                   <td className="border border-gray-300 px-2 py-1">
//                     ₹{perDay.toFixed(2)}
//                   </td>
//                   <td className="border border-gray-300 px-2 py-1">
//                     ₹{emp.AdjustedAmt}
//                   </td>
//                   <td className="border border-gray-300 px-2 py-1">
//                     {emp.PaidLeaves}
//                   </td>
//                   <td className="border border-gray-300 px-2 py-1 font-semibold text-blue-700">
//                     ₹{payable.toFixed(0)}
//                   </td>
//                   <td className="border border-gray-300 px-2 py-1 text-green-700 font-semibold">
//                     ₹{emp.PaidAmount}
//                   </td>
//                   <td className="border border-gray-300 px-2 py-1  font-semibold">
//                     ₹{emp.CurrentDue}
//                   </td>
//                   <td className="border border-gray-300 px-2 py-1  font-semibold">
//                     ₹{emp.PreviousDue}
//                   </td>
//                   <td className="border border-gray-300 px-2 py-1 w-48 font-semibold">
//                     {emp.Comments}
//                   </td>
//                   {/* <td className="border border-gray-300 px-2 py-1 text-green-700 font-semibold">
//                     ₹{emp.PaidAmount}
//                   </td>
//                   <td className="border border-gray-300 px-2 py-1 text-red-600 font-semibold">
//                     ₹{payable.toFixed(0)}
//                   </td> */}
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       {/* Legend */}
//       {/* <div className="mt-6 text-sm text-gray-600">
//         <p>
//           🟢 <b>1</b> = Full Day | 🟡 <b>0.5</b> = Half Day | 🔴 <b>0</b> =
//           Absent
//         </p>
//         <p>
//           💰 Payable Salary = (Monthly Salary ÷ 30) × Total Attendance Days
//         </p>
//       </div> */}
//     </div>
//   );
// };

// export default SalaryDetail;


/////////////////////////////////////////

// import React, { useState, useEffect } from "react";
// import { useAttendanceData, useSallaryTrackerDetail } from "./services";

// const SalaryDetail = () => {
//   const { data, isPending } = useAttendanceData();
//   const { data: sallayTrackerdetails } = useSallaryTrackerDetail();

//   // Extract attendance list
//   const attendanceList = data?.data || [];

//   // Transform raw attendance list
//   const employeesNew = Object.values(
//     attendanceList.reduce((acc, record) => {
//       const { EmployeeID, EmployeeName, AttendanceStatus, HalfDayHrs } = record;

//       if (!acc[EmployeeID]) {
//         acc[EmployeeID] = {
//           id: EmployeeID,
//           name: EmployeeName,
//           salary: 0,
//           AdjustedAmt: 0,
//           PaidLeaves: 0,
//           PaidAmount : 0,
//           attendance: [],
//         };
//       }

//       let attendanceValue = 0;
//       if (AttendanceStatus === "1") attendanceValue = 1;
//       else if (AttendanceStatus === "0.5") attendanceValue = 0.5;
//       else if (AttendanceStatus === "0") attendanceValue = 0;
//       else if (HalfDayHrs && Number(HalfDayHrs) > 0) attendanceValue = 0.5;

//       acc[EmployeeID].attendance.push(attendanceValue);
//       return acc;
//     }, {})
//   );

//   // Merge salary data
//   const [employees, setEmployees] = useState([]);

//   useEffect(() => {
//     if (employeesNew.length && sallayTrackerdetails?.data) {
//       const merged = employeesNew.map((emp) => {
//         const match = sallayTrackerdetails?.data?.find(
//           (s) => s.EmployeeID == emp.id
//         );
//         return {
//           ...emp,
//           salary: match ? match.FixSalary : 0,
//           AdjustedAmt: match ? match.AdjustedAmt : 0,
//           PaidLeaves: match ? match.PaidLeaves : 0,
//           CurrentDue: match ? match.CurrentDue : 0,
//           PreviousDue: match ? match.PreviousDue : 0,
//           Comments: match ? match.Comments : "",
//           PaidAmount: match ? match.PaidAmount : 0,
//         };
//       });
//       setEmployees(merged);
//     }
//   }, [data, sallayTrackerdetails]);

//   const getAttendanceSum = (arr) =>
//     arr?.reduce((sum, val) => sum + (typeof val === "number" ? val : 0), 0);

//   const handleFieldChange = (id, field, value) => {
//     setEmployees((prev) =>
//       prev.map((emp) =>
//         emp.id === id ? { ...emp, [field]: value } : emp
//       )
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       {/* Header */}
//       <div className="bg-gray-50 text-gray-800 text-center p-4 rounded-md mt-20 mb-6">
//         <h1 className="text-2xl font-bold">
//           Attendance & Salary Tracker - November 2025
//         </h1>
//         <p className="text-lg text-gray-700">
//           Gopal's Paying Guest Services Pvt. Ltd
//         </p>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto bg-white text-2xl rounded-lg shadow border border-gray-200">
//         <table className="min-w-auto border-red-500">
//           <thead className="bg-orange-200 font-bold border-b border-gray-300 text-sm text-gray-700 text-center">
//             <tr>
//               <th className="border border-gray-300 px-2 py-2">EmpID</th>
//               <th className="border border-gray-300 px-2 py-2 text-left">
//                 Employee's Name
//               </th>
//               {[...Array(31)].map((_, i) => (
//                 <th key={i} className="border border-gray-300 px-1 py-1 w-6">
//                   {i + 1}
//                 </th>
//               ))}
//               <th className="border border-gray-300  px-2 py-2">Total Days</th>
//               <th className="border border-gray-300 px-2 py-2">Fix Salary</th>
//               <th className="border border-gray-300 px-2 py-2">Per Day</th>
//               <th className="border border-gray-300 px-2 py-2">Adjusted Amt</th>
//               <th className="border border-gray-300 px-2 py-2">Paid Leaves</th>
//               <th className="border border-gray-300 px-2 py-2">Payable Salary</th>
//               <th className="border border-gray-300 px-2 py-2">Paid Amt</th>
//               <th className="border border-gray-300 px-2 py-2">Current Due</th>
//               <th className="border border-gray-300 px-2 py-2">Previous Due</th>
//               <th className="border border-gray-300 w-48 px-2 py-2">Comments</th>
//             </tr>
//           </thead>

//           <tbody>
//             {employees?.filter(emp => emp?.id)?.map((emp, i) => {
//               const attendanceDays = getAttendanceSum(emp.attendance) || 0;
//               const AdjustedAmt = Number(emp.AdjustedAmt) || 0;
//               const PaidLeaves = Number(emp.PaidLeaves) || 0;
//               const PaidAmt = Number(emp.PaidAmount) || 0;
//               const CurrentDue = Number(emp.CurrentDue) || 0;
//               const salary = Number(emp.salary) || 0;

//               const perDay = salary / 30;
//               const payable =
//                 perDay * attendanceDays + PaidLeaves * perDay + AdjustedAmt;
//              const CurrentDueAmt = CurrentDue - PaidAmt


//               return (
//                 <tr
//                   key={emp.id}
//                   className={`text-sm text-gray-800 text-center ${
//                     i % 2 === 0 ? "bg-gray-50" : "bg-white"
//                   } hover:bg-yellow-50`}
//                 >
//                   <td className="border border-gray-300 px-2 py-1">{emp.id}</td>
//                   <td className="border border-gray-300 px-2 py-1 text-left font-medium">
//                     {emp.name}
//                   </td>

//                   {/* Attendance */}
//                   {emp.attendance.map((a, index) => (
//                     <td
//                       key={index}
//                       className={`border border-gray-300 px-1 py-1 font-semibold ${
//                         a === 1
//                           ? "bg-white text-black"
//                           : a === 0.5
//                           ? "bg-yellow-100 text-yellow-700"
//                           : "bg-red-100 text-red-700"
//                       }`}
//                     >
//                       {a}
//                     </td>
//                   ))}

//                   {/* Totals */}
//                   <td className="border border-gray-300 px-2 py-1 font-semibold">
//                     {attendanceDays.toFixed(1)}
//                   </td>

//                   {/* Editable Fix Salary */}
//                   <td className="border border-gray-300 px-2 py-1">
//                     <input
//                       type="number"
//                       className="w-24 border-none text-center focus:ring-0 bg-transparent outline-none"
//                       value={emp.salary}
//                       onChange={(e) =>
//                         handleFieldChange(emp.id, "salary", e.target.value)
//                       }
//                     />
//                   </td>

//                   <td className="border border-gray-300 px-2 py-1">
//                     ₹{perDay.toFixed(2)}
//                   </td>

//                   {/* Editable Adjusted Amount */}
//                   <td className="border border-gray-300 px-2 py-1">
//                     <input
//                       type="number"
//                       className="w-20 border-none text-center focus:ring-0 bg-transparent outline-none"
//                       value={emp.AdjustedAmt}
//                       onChange={(e) =>
//                         handleFieldChange(emp.id, "AdjustedAmt", e.target.value)
//                       }
//                     />
//                   </td>

//                   {/* Editable Paid Leaves */}
//                   <td className="border border-gray-300 px-2 py-1">
//                     <input
//                       type="number"
//                       className="w-12 border-none text-center focus:ring-0 bg-transparent outline-none"
//                       value={emp.PaidLeaves}
//                       onChange={(e) =>
//                         handleFieldChange(emp.id, "PaidLeaves", e.target.value)
//                       }
//                     />
//                   </td>

//                   <td className="border border-gray-300 px-2 py-1 font-semibold text-blue-700">
//                     ₹{payable.toFixed(0)}
//                   </td>

//                   {/* <td className="border border-gray-300 px-2 py-1 text-green-700 font-semibold">
//                     ₹{emp.PaidAmount}
//                   </td> */}


//                       <td className="border border-gray-300 px-2 py-1">
//                     <input
//                       type="number"
//                       className="w-12 border-none text-center focus:ring-0 bg-transparent outline-none"
//                       value={emp.PaidAmount}
//                       onChange={(e) =>
//                         handleFieldChange(emp.id, "PaidAmount", e.target.value)
//                       }
//                     />
//                   </td>




//                   <td className="border border-gray-300 px-2 py-1 font-semibold">
//                     ₹{CurrentDueAmt}
//                   </td>

//                   <td className="border border-gray-300 px-2 py-1 font-semibold">
//                     ₹{emp.PreviousDue}
//                   </td>

//                   {/* Editable Comments */}
//                   <td className="border border-gray-300 px-2 py-1 w-48 font-semibold">
//                     <input
//                       type="text"
//                       className="w-full border-none focus:ring-0 bg-transparent outline-none"
//                       value={emp.Comments}
//                       onChange={(e) =>
//                         handleFieldChange(emp.id, "Comments", e.target.value)
//                       }
//                     />
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default SalaryDetail;

//////////////////////////////////////////////////////

  //  ye nya code h   
import React, { useState, useEffect } from "react";
import { useAttendanceData, useCreateSallaryDetails, useSallaryTrackerDetail } from "./services";
import { toast } from "react-toastify";
import LoaderPage from "../NewBooking/LoaderPage";
import { useApp } from "../TicketSystem/AppProvider";
import { Controller, useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import { SalarySkeletonTable } from "./SalarySkeletonTable";
// import your API function here for saving data
// e.g. import { saveSalaryData } from "./services";

const SalaryDetail = () => {


  const MONTH_SHORT_NAMES = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];



  const getPreviousMonthFormatted = () => {
    const date = new Date();
    date.setMonth(date.getMonth()); // go to previous month
    const month = MONTH_SHORT_NAMES[date.getMonth()];
    const year = date.getFullYear();
    return `${month}${year}`; // format like "Nov2025"
  };


  const { control, watch } = useForm({
    defaultValues: {
      selectedMonth: getPreviousMonthFormatted(), // previous month as default
    },
  });
  const selectedMonth = watch("selectedMonth") || ""



  const { data, isPending } = useAttendanceData(selectedMonth);
  const { data: sallayTrackerdetails } = useSallaryTrackerDetail(selectedMonth);

  const attendanceList = data?.data || [];



  const employeesNew = Object.values(
    attendanceList.reduce((acc, record) => {
      const { EmployeeID, EmployeeName, AttendanceStatus, HalfDayHrs } = record;
      if (!acc[EmployeeID]) {
        acc[EmployeeID] = {
          id: EmployeeID,
          name: EmployeeName,
          FixSalary: 0,
          AdjustedAmt: 0,
          PaidLeaves: 0,
          PaidAmount: 0,
          attendance: [],
          AdjAmtDetails: 0,
          PaidAmtDetails: 0
        };
      }

      let attendanceValue = 0;
      if (AttendanceStatus === "1") attendanceValue = 1;
      else if (AttendanceStatus === "0.5") attendanceValue = 0.5;
      else if (AttendanceStatus === "0") attendanceValue = 0;
      else if (HalfDayHrs && Number(HalfDayHrs) > 0) attendanceValue = 0.5;

      acc[EmployeeID].attendance.push(attendanceValue);
      return acc;
    }, {})
  );


  const [employees, setEmployees] = useState([]);
  
  const [enteredAdjustedAmount, setEnteredAdjustedAmount] = useState(0);
  const [enteredPaidAmount, setEnteredPaidAmount] = useState(0);
  const [paidAmtPopUp, setPaidAmtPopUp] = useState(false);
  const [adjAmtPopUp, setAdjAmtPopUp] = useState(false);
  const [adjAmtDetails, setAdjAmountDetails] = useState("")
  const [paidAmtDetails, setPaidAmountDetails] = useState("")
  const [splAmt, setSplAmt] = useState("")
  const [splDecducAmt, setDecducAmt] = useState("")
  const [advAmt, setAdvAmt] = useState("")
  const [advDecducAmt, setAdvDecducAmt] = useState("")
  const [handleSplAmtType, setHandleSplAmtType] = useState("")
  const [handleDeducAmtType, setHandleDeducAmtType] = useState("")
  const [handleAdvAmtType, setHandleAdvAmtType] = useState("")
  const [handleAdvDeducAmtType, setHandleAdvDeducAmtType] = useState("")
  const [secularEmpId, setSecularEmpId] = useState("null")
  const [error, setError] = useState("")
  const [deductError, setDeductError] = useState("")
  const [loadingRowId, setLoadingRowId] = useState(null);
  const { decryptedUser } = useApp();

  const [cmt, setCmt] = useState("")
  const [deductCmt, setDeductCmt] = useState("")
  const [advCmt, setAdvCmt] = useState("")
  const [advDeductCmt, setAdvDeductCmt] = useState("")

  const { mutate: createSallaryDetails, isPending: isCreateSallaryDetails } = useCreateSallaryDetails();


  // const [attendanceDays, setAttendanceDays] = useState(0);

  // useEffect(() => {
  //   if (splAmt) {
  //     setError("")
  //   } else if (splDecducAmt) {
  //     setDeductError("")
  //   }

  // }, [splAmt, splDecducAmt])

  // console.log("enteredAdjustedAmount", enteredAdjustedAmount)

  useEffect(() => {
    if (employeesNew.length && sallayTrackerdetails?.data) {
      const merged = employeesNew.map((emp) => {
        const match = sallayTrackerdetails?.data?.find(
          (s) => s.EmployeeID == emp.id
        );
        return {
          ...emp,
          FixSalary: match ? match.FixSalary : 0,
          AdjustedAmt: match ? match.AdjustedAmt : 0,
          PaidLeaves: match ? match.PaidLeaves : 0,
          CurrentDue: match ? match.CurrentDue : 0,
          PreviousDue: match ? match.PreviousDue : 0,
          Comments: match ? match.Comments : "",
          PaidAmount: match ? match.PaidAmount : 0,
          AdjAmtDetails: match ? match.AdjAmtDetails : 0,
          PaidAmtDetails: match ? match.PaidAmtDetails : 0,
          // PerDay: match ? match.PerDay : 0,
          // TotalDays: match ? match.TotalDays : 0,
          PayableSalary: match ? match.PayableSalary : 0,
        };
      });
      setEmployees(merged);
    }



  }, [data, sallayTrackerdetails]);

//  old code ......................................
  // const getAttendanceSum = (arr) => 
  //     Math.min(
  //         arr?.reduce((sum, val) => sum + (typeof val === "number" ? val : 0), 0),
  //         30 // maximum allowed
  //     );
//  old code ......................................
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  // const selectedMonth = "Jan2026";
  const monthStr = selectedMonth.slice(0, 3);  // "Jan"
  const selectedYear = parseInt(selectedMonth.slice(3)); // 2026
  const selectetNewMonth = monthNames.indexOf(monthStr) + 1; // 1 for Jan
  const monthIndex = monthNames.indexOf(monthStr); // 0-based index (0 = Jan)

const lastDateOfSelectedMonth = new Date(selectedYear, monthIndex + 1, 0)






//      const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// const selectedMonth = "Jan2026"; // example
// const monthStr = selectedMonth.slice(0, 3); // "Jan"
// const year = parseInt(selectedMonth.slice(3)); // 2026
// const monthIndex = monthNames.indexOf(monthStr); // 0-based index (0 = Jan)

// const lastDateOfSelectedMonth = new Date(year, monthIndex + 1, 0).getDate();

// console.log("Last date of", selectedMonth, "is", lastDateOfSelectedMonth); // 31

  // const getAttendanceSum = (arr) => {

  //   const daysInMonth = new Date(selectedYear, selectetNewMonth, 0).getDate();
  //   const monthDaysArr = arr.slice(0, daysInMonth);

  //   let sum = 0;

  //   if (daysInMonth === 31) {
  //     sum = monthDaysArr.slice(0, 30).reduce((total, val) => total + (typeof val === "number" ? val : 0), 0);
  //     const lastDay = monthDaysArr[30];
  //     if (lastDay === 0.5) {
  //       sum -= 0.5;
  //     }
  //     if (lastDay === 0) {
  //       sum -= 1;
  //     }
  //   } else  {
  //     sum = monthDaysArr.reduce((total, val) => total + (typeof val === "number" ? val : 0), 0);
  //   } 





  //   return Math.max(0, Math.min(sum, 30));
  // };



  const getAttendanceSum = (arr) => {
    const daysInMonth = new Date(selectedYear, selectetNewMonth, 0).getDate();
    const monthDaysArr = arr.slice(0, daysInMonth);
    let sum = 0;
    if (daysInMonth === 31 && lastDateOfSelectedMonth < new Date() ) {
      sum = monthDaysArr.slice(0, 30).reduce((total, val) => total + (typeof val === "number" ? val : 0), 0);
      const lastDay = monthDaysArr[30];
      if (lastDay === 0.5) {
        sum -= 0.5;
      }
      if (lastDay === 0) {
        sum -= 1;
      }
    }
    else if (daysInMonth === 29 && lastDateOfSelectedMonth < new Date()) {
      sum = monthDaysArr.reduce((total, val) => total + (typeof val === "number" ? val : 0), 0);
      sum += 1;
    } else if (daysInMonth === 28 && lastDateOfSelectedMonth < new Date()) {
      sum = monthDaysArr.reduce((total, val) => total + (typeof val === "number" ? val : 0), 0);
      sum += 2;
    }
    else{
      sum = monthDaysArr.reduce((total, val) => total + (typeof val === "number" ? val : 0), 0);
    }
    return Math.max(0, Math.min(sum, 30));
  };




  //   const getAttendanceSum = (arr) => {
  //   let present = 0;
  //   let leave = 0;
  //   let HalfDay = 0;
  //   const arrayForHalfDay = []
  //   const MaxTotalDays = 30;

  //   for (let i = 0; i < arr.length; i++) {
  //   if (arr[i] === 1) {
  //     if (present < MaxTotalDays) present++;
  // } else if (arr[i] === 0.5) {
  //     if (present + 0.5 <= MaxTotalDays) present += 0.5;
  // } else if (arr[i] === 0) {
  //       leave++; // full leave count
  //     }
  //     else if (arr[i] === 0.5){
  //       arrayForHalfDay.push(arr[i])
  //     }
  //   }

  // let halfDaysPresent = arrayForHalfDay.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  //   let totaldays = MaxTotalDays + halfDaysPresent - leave;

  //   if (totaldays < 0) {
  //     totaldays = 0; // minus me nahi jayega
  //   }

  //   return totaldays;
  // };

  const handleFieldChange = (id, field, value) => {
    if (field == "AdjustedAmt") {
      setEnteredAdjustedAmount(value)
    } else if (field == "PaidAmount") {
      setEnteredPaidAmount(value)
    }

    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === id ? { ...emp, [field]: value } : emp
      )
    );
  };


  const now = new Date();

  // Format date like "22 Nov 2025"
  const formattedDate = now.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // Format time like "3:45 pm"
  const formattedTime = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).toLowerCase(); // optional: ensure "pm" is lowercase

  // Combine date + time
  const dateTimeStamp = `${formattedDate} ${formattedTime}`;

  // Collect non-empty comments
  const commentsList = [
    cmt && `[${dateTimeStamp} ${decryptedUser?.employee?.Name}]${cmt}`,
    deductCmt && `[${dateTimeStamp} ${decryptedUser?.employee?.Name}]${deductCmt}`,
    advCmt && `[${dateTimeStamp} ${decryptedUser?.employee?.Name}]${advCmt}`,
    advDeductCmt && `[${dateTimeStamp} ${decryptedUser?.employee?.Name}]${advDeductCmt}`,
  ].filter(Boolean);

  const allComments = commentsList.join("\n");


// 🔹 0 / empty ko history se hatao
const cleanHistory = (value) => {
  if (!value) return "0";

  const cleaned = value
    .toString()
    .split("+")
    .filter(v => v !== "0" && v !== "")
    .join("+");

  return cleaned || "0";
};

// 🔹 history build karo (NO ghost 0)
const buildHistory = (previous, entered) => {
  const prev = cleanHistory(previous);
  const curr = entered?.toString();
    console.log("buildHistory called with:", {prev, curr });
  // user ne kuch nahi dala ya 0 dala
  if (!curr || curr === "0") {
    return prev;
  }

  // first valid entry
  if (!prev || prev === "0") {
    return curr;
  }

  return `${curr}`;
};

// 🔹 string history → number (NO 100 BUG)
const parseAmountHistory = (value) => {
  if (!value) return 0;

  return value
    .toString()
    .split(/(?=[+-])/g)
    .map(v => Number(v))
    .filter(v => !isNaN(v))
    .reduce((sum, v) => sum + v, 0);
};

const handleSaveRow = async (emp, calc) => {
  setLoadingRowId(emp.id);

  try {
    const empId = emp.id;

    // 🔹 DB record
    const dbRecord = sallayTrackerdetails?.data?.find(
      s => s.EmployeeID == empId
    );

    const prevAdjHistory = dbRecord?.AdjAmtDetails || "0";
    const prevPaidHistory = dbRecord?.PaidAmtDetails || "0";

    // 🔹 user input (sirf current row ka)
    const enteredAdj = enteredAdjustedAmount?.[empId];
    const enteredPaid = enteredPaidAmount?.[empId];

    // ===============================
    // 🔹 BUILD FINAL HISTORY
    // ===============================
    const finalAdjHistory = buildHistory(prevAdjHistory, enteredAdj);
    const finalPaidHistory = buildHistory(prevPaidHistory, enteredPaid);

    // ===============================
    // 🔹 FINAL NUMBERS
    // ===============================
    const AdjustedAmt = parseAmountHistory(finalAdjHistory);
    const PaidAmount = parseAmountHistory(finalPaidHistory);

    // ===============================
    // 🔹 COMMENTS
    // ===============================
    const normalize = c =>
      !c ? [] : Array.isArray(c) ? c : [c];

    const mergedComments = [
      ...normalize(emp.Comments),
      ...normalize(allComments),
    ];

    // ===============================
    // 🔹 PAYLOAD
    // ===============================
    const payload = {
      ...emp,
      EmployeeName: emp.name,

      AdjAmtDetails: finalAdjHistory,
      PaidAmtDetails: finalPaidHistory,

      AdjustedAmt,
      PaidAmount,

      CurrentDue: calc.CurrentDue,
      TotalPresentDays: calc.attendanceDays,
      PayableSalary: calc.payable,
      perDay: calc.perDay,

      Comments: mergedComments,
      UpdatedBy: `${dateTimeStamp} ${decryptedUser?.employee?.Name}`,
    };

    // ===============================
    // 🔹 Attendance flatten
    // ===============================
    if (Array.isArray(emp.attendance)) {
      emp.attendance.forEach((val, idx) => {
        payload[idx + 1] = val;
      });
      delete payload.attendance;
    }

    // ===============================
    // 🔹 API CALL
    // ===============================
    createSallaryDetails(
      { payload, selectedMonth },
      {
        onSuccess: () => {
          toast.success(`✅ Saved for ${emp.name}`);

          // ✅ sirf current row reset
          setEnteredAdjustedAmount(p => ({ ...p, [empId]: "" }));
          setEnteredPaidAmount(p => ({ ...p, [empId]: "" }));

          setLoadingRowId(null);
          
        },
        onError: (err) => {
          toast.error(
            err?.response?.data?.error || "❌ Save failed"
          );
          setLoadingRowId(null);
        },
      }
    );
  } catch (err) {
    console.error(err);
    toast.error("❌ Something went wrong");
    setLoadingRowId(null);
  }
};

  // // Save all employees in bulk
  // const handleSaveAll = async () => {
  //   try {
  //     console.log("Saving all employees:", employees);
  //     // await saveSalaryData(employees);
  //     alert("✅ All employee data saved successfully!");
  //   } catch (err) {
  //     console.error("Bulk save failed:", err);
  //     alert("❌ Error saving all data");
  //   }
  // };



  const appendValueSplToCalculation = (existing, value, type, action = "add") => {
    if (!value) return existing || "";
    let operator = "";

    if (handleSplAmtType === "spl" || handleSplAmtType === "adv") {
      operator = action === "add" ? "+" : "-";
    }
    if (!existing) return value;

    return `${existing}${operator}${value}`;
  };

  const appendValueDeducToCalculation = (existing, value, type, action = "add") => {
    if (!value) return existing || "";
    let operator = "";
    if (handleDeducAmtType === "deduct" || handleDeducAmtType === "deducted") {
      operator = action === "add" ? "-" : "+";
    }
    if (!existing) {
      return `${operator}${value}`;
    }

    return `${existing}${operator}${value}`;
  };



  const appendValueAdvToCalculation = (existing, value, type, action = "add") => {
    if (!value) return existing || "";
    let operator = "";
    if (handleAdvAmtType === "spl" || handleAdvAmtType === "adv") {
      operator = action === "add" ? "+" : "-";
    }
    if (!existing) return value;
    return `${existing}${operator}${value}`;
  };

  const appendValueAdvDeducToCalculation = (existing, value, type, action = "add") => {
    if (!value) return existing || "";
    let operator = "";
    if (handleAdvDeducAmtType === "deduct" || handleAdvDeducAmtType === "deducted") {
      operator = action === "add" ? "-" : "+";
    }
    if (!existing) {
      return `${operator}${value}`;
    }
    return `${existing}${operator}${value}`;
  };




  // useEffect(() => {
  //   if (!amt) return;
  //   if (handleType === "spl" || handleType === "deduct") {
  //     setAdjAmountDetails(prev => appendValueToCalculation(prev, amt, handleType));
  //   }

  //   if (handleType === "adv" || handleType === "deducted") {
  //     setPaidAmountDetails(prev => appendValueToCalculation(prev, amt, handleType));
  //   }

  // }, [amt]);


const handlePopUp = (existingValue, empId, type) => {
  if (type === "PaidAmount") {
    setPaidAmountDetails(
      existingValue && existingValue !== "0" ? existingValue : ""
    );
    setPaidAmtPopUp(true);
  } else {
    setAdjAmountDetails(
      existingValue && existingValue !== "0" ? existingValue : ""
    );
    setAdjAmtPopUp(true);
  }

  setSecularEmpId(empId);
};


  const handleSplAmount = (e, type) => {
    setSplAmt(e.target.value);
    setHandleSplAmtType(type.toLowerCase());
  };

  const handleSplDeductAmount = (e, type) => {
    setDecducAmt(e.target.value);
    setHandleDeducAmtType(type.toLowerCase());
  };

  const handleAdvAmount = (e, type) => {
    setAdvAmt(e.target.value);
    setHandleAdvAmtType(type.toLowerCase());
  };

  const handleAdvDeductAmount = (e, type) => {
    setAdvDecducAmt(e.target.value);
    setHandleAdvDeducAmtType(type.toLowerCase());
  };

  const handleAdvComment = (e) => {
    setAdvCmt(e.target.value)
  }
  const handleAdvDeductComment = (e) => {
    setAdvDeductCmt(e.target.value)
  }


  const handleSplComment = (e) => {
    setCmt(e.target.value)
  }
  const handleDeductAdvSplComment = (e) => {
    setDeductCmt(e.target.value)
  }


  // useEffect(() => {
  //   setEnteredAdjustedAmount(secularEmpId , appendValueDeducToCalculation(appendValueSplToCalculation(adjAmtDetails, splAmt), splDecducAmt))
  // }, [appendValueDeducToCalculation(secularEmpId , appendValueSplToCalculation(adjAmtDetails, splAmt), splDecducAmt)])

  useEffect(() => {
    const finalValue = appendValueDeducToCalculation(
      appendValueSplToCalculation(adjAmtDetails, splAmt),
      splDecducAmt
    );

    setEnteredAdjustedAmount((prev) => ({
      ...prev,
      [secularEmpId]: finalValue
    }));

  }, [secularEmpId, adjAmtDetails, splAmt, splDecducAmt]);

  // useEffect(() => {
  //   setEnteredPaidAmount(secularEmpId , appendValueAdvDeducToCalculation(appendValueAdvToCalculation(paidAmtDetails, advAmt), advDecducAmt))
  // }, [appendValueAdvDeducToCalculation(secularEmpId , appendValueAdvToCalculation(paidAmtDetails, advAmt), advDecducAmt)])

  useEffect(() => {
    const finalValue = appendValueAdvDeducToCalculation(
      appendValueAdvToCalculation(paidAmtDetails, advAmt),
      advDecducAmt
    );

    setEnteredPaidAmount((prev) => ({
      ...prev,
      [secularEmpId]: finalValue
    }));

  }, [secularEmpId, paidAmtDetails, advAmt, advDecducAmt]);

  const handleSaveAdj = () => {
    setError("");
    setDeductError("");
    if (splAmt && !cmt) {
      setError("Comment is required for special perk");
      return;   // stop execution
    }
    if (splDecducAmt && !deductCmt) {
      setDeductError("Comment is required for deduction");
      return;
    }
    setAdjAmtPopUp(false)


  }


  const handleSavePaid = () => {
    setError("");
    setDeductError("");
    if (advAmt && !advCmt) {
      setError("Comment is required for Advance Amt");
      return;   // stop execution
    }
    if (advDecducAmt && !advDeductCmt) {
      setDeductError("Comment is required for deduction");
      return;
    }
    setPaidAmtPopUp(false)

  }


 
  if (isPending) {
    return <div className="h-screen w-full flex justify-center items-center">
      <SalarySkeletonTable />

    </div>
  }

  const date = new Date();

  const month = date.toLocaleString("en-US", { month: "long" }); // e.g., "November"
  const year = date.getFullYear(); // e.g., 2025






  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-gray-50 text-gray-800 text-center  rounded-md mt-20 pb-2">
        <div className="text-2xl flex  flex-col justify-center items-center  font-bold">
          <div className="flex  justify-center items-center  font-bold">
            Attendance & Salary Tracker - <div>
              <Controller
                name="selectedMonth"
                control={control}
                rules={{ required: "Please select a month" }}
                render={({ field }) => {
                  // FIX: Convert "Dec2024" back to a Date object safely
                  let selectedDate = null;

                  if (field.value) {
                    const monthStr = field.value.slice(0, 3); // "Dec"
                    const yearStr = field.value.slice(3);     // "2024"

                    const monthIndex = MONTH_SHORT_NAMES.indexOf(monthStr);

                    if (monthIndex !== -1) {
                      selectedDate = new Date(Number(yearStr), monthIndex, 1);
                    }
                  }

                  return (
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => {
                        if (!date) return field.onChange("");
                        const month = MONTH_SHORT_NAMES[date.getMonth()];
                        const year = date.getFullYear();
                        const formatted = `${month}${year}`;
                        field.onChange(formatted);
                      }}
                      dateFormat="MMM yyyy"
                      showMonthYearPicker
                      popperPlacement="bottom-start"
                      withPortal
                      popperClassName="custom-datepicker-popper z-[9999]"
                      placeholderText="Select month"
                      className="w-[150px]  focus:ring-1 border-none bg-gray-50 px-3 py-2 border-orange-300 outline-orange-200 rounded-md" />
                  );
                }}
              />

              {/* {errors.selectedDate && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.selectedDate.message}
                            </p>
                        )} */}
            </div>

          </div>

        </div>


        {/* Save All Button */}
        {/* <button
          onClick={handleSaveAll}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          💾 Save All
        </button> */}
      </div>

      {/* Table */}
      {/* <div className=" text-2xl"> */}

      <div className="overflow-auto max-w-full rounded-lg max-h-[510px]">
        <table className="min-w-auto border-red-500">
          <thead className="bg-black shadow-sm text-lg font-bold text-white sticky top-[-1px] z-50">
            <tr>
              <th className="border font-bold whitespace-nowrap px-2 py-2 sticky left-0 z-50 bg-black">EmpID</th>
              <th className="border border-gray-300 whitespace-nowrap font-bold  px-2 py-2 sticky left-20 z-50 bg-black  text-left">Employee's Name</th>
              {[...Array(31)].map((_, i) => (
                <th key={i} className="border border-gray-300 px-1 py-1 w-6">
                  {i + 1}
                </th>
              ))}
              <th className="border whitespace-nowrap font-bold  border-gray-300 px-2 py-2 w-[100px]">Total Days</th>
              <th className="border whitespace-nowrap font-bold border-gray-300 px-2 py-2">Fix Salary</th>
              <th className="border whitespace-nowrap font-bold border-gray-300 px-2 py-2">Per Day</th>
              <th className="border whitespace-nowrap font-bold border-gray-300 px-2 py-2">Adjusted Amt</th>
              <th className="border whitespace-nowrap font-bold border-gray-300 px-2 py-2">Paid Leaves</th>
              <th className="border whitespace-nowrap font-bold border-gray-300 px-2 py-2">Payable Salary</th>
              <th className="border whitespace-nowrap font-bold border-gray-300 px-2 py-2">Paid Amt</th>
              <th className="border whitespace-nowrap font-bold border-gray-300 px-2 py-2">Current Due</th>
              <th className="border whitespace-nowrap font-bold border-gray-300 px-2 py-2">Previous Due</th>
              <th className="border whitespace-nowrap font-bold border-gray-300 w-48 px-2 py-2">Comments</th>
              <th className="border whitespace-nowrap font-bold border-gray-300 px-2 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {employees?.filter(emp => emp?.id)?.map((emp, i) => {
              const attendanceDays = getAttendanceSum(emp.attendance) || 0;

              // const AdjustedAmt = (emp.AdjAmtDetails || "0").split(/(?=[+-])/g).reduce((a, b) => a + Number(b), 0);
              const rawValue =
                enteredAdjustedAmount[emp.id] && enteredAdjustedAmount[emp.id] !== "0"
                  ? enteredAdjustedAmount[emp.id]
                  : emp.AdjAmtDetails || "0";

              const AdjustedAmt = rawValue
                .split(/(?=[+-])/g)
                .reduce((a, b) => a + Number(b), 0);


              const SecondrawValue =
                enteredPaidAmount[emp.id] && enteredPaidAmount[emp.id] !== "0"
                  ? enteredPaidAmount[emp.id]
                  : emp.PaidAmtDetails || "0";

              const PaidAmt = SecondrawValue
                .split(/(?=[+-])/g)
                .reduce((a, b) => a + Number(b), 0);


              const PaidLeaves = Number(emp.PaidLeaves) || 0;
              // const PaidAmt = (emp.PaidAmtDetails || "0").split(/(?=[+-])/g).reduce((a, b) => a + Number(b), 0);
              // const CurrentDueAmt = Number(emp.CurrentDue) || 0;
              const salary = Number(emp.FixSalary) || 0;
              const perDay = salary / 30;
              const payable =
                perDay * attendanceDays + PaidLeaves * perDay + AdjustedAmt;
              const CurrentDue = payable - PaidAmt;
              return (
                <tr
                  key={emp.id}
                  className={`text-lg text-gray-800 text-center ${i % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-yellow-50`}
                >
                  <td className="border font-bold border-gray-300 px-2 py-1 sticky left-0 bg-white z-30">{emp.id}</td>
                  <td className="border whitespace-nowrap border-gray-300 px-2 py-1 sticky left-20 font-bold bg-white z-30 text-left ">
                    {emp.name}
                  </td>

                  {/* Attendance cells */}
                  {emp.attendance.map((a, index) => (
                    <td
                      key={index}
                      className={`border border-gray-300 px-1 py-1 font-semibold ${a === 1
                        ? "bg-white text-black"
                        : a === 0.5
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                        }`}
                    >
                      {a}
                    </td>
                  ))}

                  {/* Summary + Editable Fields */}
                  <td className="border border-gray-300 px-2 py-1 font-semibold">
                    {attendanceDays.toFixed(1)}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    <input
                      type="number"
                      className="w-24 text-center border-none bg-transparent outline-none focus:ring-0"
                      value={emp.FixSalary}
                      // readOnly
                      onChange={(e) => handleFieldChange(emp.id, "FixSalary", e.target.value)}
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-1">₹{perDay.toFixed(2)}</td>
                  <td onClick={() => handlePopUp(emp.AdjAmtDetails, emp.id, "AdjustedAmt")} className="border cursor-pointer border-gray-300 px-2 py-1">
                    {AdjustedAmt}
                    {/* <input
                      type="number"
                      className="w-20 text-center border-none bg-transparent outline-none focus:ring-0"
                      value=
                      onChange={(e) => handleFieldChange(emp.id, "AdjustedAmt", e.target.value)}
                    /> */}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    <input
                      type="number"
                      className="w-12 text-center border-none bg-transparent outline-none focus:ring-0"
                      value={emp.PaidLeaves}
                      onChange={(e) => handleFieldChange(emp.id, "PaidLeaves", e.target.value)}
                    />
                  </td>

                  <td className="border border-gray-300 px-2 py-1 font-semibold text-blue-700">
                    ₹{payable.toFixed(0)}
                  </td>

                  <td onClick={() => handlePopUp(emp.PaidAmtDetails, emp.id, "PaidAmount")} className="border cursor-pointer border-gray-300 px-2 py-1">
                    {/* {emp.PaidAmount} */}
                    {PaidAmt}
                    {/* <input
                      type="number"
                      className="w-12 text-center border-none bg-transparent outline-none focus:ring-0"
                      value={emp.PaidAmount}
                      onChange={(e) => handleFieldChange(emp.id, "PaidAmount", e.target.value)}
                    /> */}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 font-semibold">
                    ₹{CurrentDue.toFixed(0)}
                  </td>

                  <td className="border border-gray-300 px-2 py-1 font-semibold">
                    ₹{emp.PreviousDue}
                  </td>

                  <td className="border cursor-pointer border-gray-300 px-2 py-1 w-48 font-semibold relative group">
                    <input
                      type="text"
                      className="w-full border-none cursor-pointer focus:ring-0 bg-transparent outline-none"
                      value={emp.Comments}
                      readOnly
                    />
                    {/* Hover Popup */}
                    {emp.Comments && (
                      <div className="absolute right-10 top-full mt-1 hidden group-hover:block 
                    bg-white border border-gray-300 shadow-lg 
                    p-2 w-auto z-50 rounded text-start text-sm whitespace-pre">
                        {emp.Comments}
                      </div>
                    )}
                  </td>
                  {/* Row Save Button */}
                  <td className="border border-gray-300 px-2 py-1">
                    <button
                      onClick={() => handleSaveRow(emp, {
                        attendanceDays,
                        perDay,
                        payable,
                        CurrentDue,

                      })}
                      className="px-3 py-1 bg-orange-400 text-white rounded text-xs hover:bg-orange-500 flex items-center justify-center"
                    >
                      {isCreateSallaryDetails && loadingRowId === emp.id ? <LoaderPage /> : "Save"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* </div> */}

      {/* <div className="flex flex-col items-center justify-center h-screen bg-gray-100"> */}
      {/* ......................... */}
      {adjAmtPopUp && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-96 relative animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Adj Amt Details</h2>
            {/* Adj Amount */}
            <div className="flex gap-5 justify-center items-center ">
              <label className="text-lg text-gray-600">Label: </label>
              <input
                type="text"
                value={appendValueDeducToCalculation(appendValueSplToCalculation(adjAmtDetails, splAmt), splDecducAmt)}
                readOnly
                className="w-full mt-1 outline-none mb-4 p-2 border border-orange-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div className="flex gap-5 justify-center items-center ">
              <label className="text-lg text-gray-600 ">Spl.Perk₹:</label>
              <input type="text" value={splAmt} onChange={(e) => handleSplAmount(e, "spl")}
                className="w-full mt-1 outline-none mb-4 p-2 border border-orange-300 rounded-lg "
              />
            </div>
            <div className="flex gap-5 justify-center items-center ">
              <label className="text-lg text-gray-600 ">Comments:</label>
              <input
                type="text"
                value={cmt}
                onChange={handleSplComment}
                className="w-full mt-1 outline-none mb-4 p-2 border border-orange-300 rounded-lg"
              />
            </div>
            <p className="text-red-500 text-sm text-center">{error}</p>
            {/* ///////////////////// */}
            <hr className="border border-gray-300 my-5" />
            {/* Adj Amount */}
            <div className="flex gap-5 justify-center items-center ">
              <label className="text-lg text-gray-600">Label:</label>
              <input
                type="text"
                value={appendValueDeducToCalculation(appendValueSplToCalculation(adjAmtDetails, splAmt), splDecducAmt)}
                readOnly
                className="w-full mt-1 outline-none mb-4 p-2 border border-orange-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div className="flex gap-5 justify-center items-center ">
              <label className="text-lg text-gray-600 ">Dedcucted.Amt₹:</label>
              <input
                type="text"
                value={splDecducAmt}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow digits and minus sign anywhere
                  if (/^[\d-]*$/.test(value)) {
                    handleSplDeductAmount(e, "deduct");
                  }
                }}
                className="w-full mt-1 outline-none mb-4 p-2 border border-orange-300 rounded-lg"
              />
            </div>
            <div className="flex gap-5 justify-center items-center ">
              <label className="text-lg text-gray-600 ">Comments:</label>
              <input
                type="text"
                value={deductCmt}
                onChange={handleDeductAdvSplComment}
                className="w-full mt-1 outline-none mb-4 p-2 border border-orange-300 rounded-lg "
              />
            </div>
            <p className="text-red-500 text-sm mb-5 text-center">{deductError}</p>
            {/* <p className="text-gray-500 mb-6 text-sm">
                These are preview values and cannot be edited.
              </p> */}
            <div className="flex justify-center items-center gap-5">
              <button
                onClick={handleSaveAdj}
                className="w-full py-2 bg-orange-300 text-white rounded-lg hover:bg-orange-500 transition"
              >
                save
              </button>
              <button
                onClick={() => setAdjAmtPopUp(false)}
                className="w-full py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
              >
                cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup Modal */}
      {paidAmtPopUp && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-96 relative animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Paid Amt Details</h2>
            {/* Adj Amount */}
            <div className="flex gap-5 justify-center items-center ">
              <label className="text-lg text-gray-600">Label: </label>
              <input
                type="text"
                value={appendValueAdvDeducToCalculation(appendValueAdvToCalculation(paidAmtDetails, advAmt), advDecducAmt)}
                readOnly
                className="w-full mt-1 outline-none mb-4 p-2 border border-orange-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="flex gap-5 justify-center items-center ">
              <label className="text-lg text-gray-600 ">Adv.Amt₹:</label>
              <input
                type="text"
                value={advAmt}
                onChange={(e) => handleAdvAmount(e, "Adv")}
                className="w-full mt-1 outline-none mb-4 p-2 border border-orange-300 rounded-lg "
              />
            </div>

            <div className="flex gap-5 justify-center items-center ">
              <label className="text-lg text-gray-600 ">Comments:</label>
              <input
                type="text"
                value={advCmt}
                onChange={handleAdvComment}
                className="w-full mt-1 outline-none mb-4 p-2 border border-orange-300 rounded-lg  "
              />
            </div>
            <p className="text-red-500 text-sm mb-5 text-center">{error}</p>

            {/* ///////////////////// */}
            <hr className="border border-gray-300 my-5" />
            {/* Adj Amount */}
            <div className="flex gap-5 justify-center items-center ">
              <label className="text-lg text-gray-600">Label:</label>
              <input
                type="text"
                value={appendValueAdvDeducToCalculation(appendValueAdvToCalculation(paidAmtDetails, advAmt), advDecducAmt)}
                readOnly
                className="w-full mt-1 outline-none mb-4 p-2 border border-orange-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="flex gap-5 justify-center items-center ">
              <label className="text-lg text-gray-600 ">Dedcucted.Amt₹:</label>
              <input
                type="text"
                value={advDecducAmt}
                onChange={(e) => {
                  const value = e.target.value;

                  // Allow digits and minus sign anywhere
                  if (/^[\d-]*$/.test(value)) {
                    handleAdvDeductAmount(e, "deducted");
                  }
                }}
                // onChange={(e) => handleAdvDeductAmount(e, "deducted")}
                className="w-full mt-1 outline-none mb-4 p-2 border border-orange-300 rounded-lg "
              />
            </div>

            <div className="flex gap-5 justify-center items-center ">
              <label className="text-lg text-gray-600 ">Comments:</label>
              <input
                type="text"
                value={advDeductCmt}
                onChange={handleAdvDeductComment}
                className="w-full mt-1 outline-none mb-4 p-2 border border-orange-300 rounded-lg "
              />
            </div>
            <p className="text-red-500 text-sm mb-5 text-center">{deductError}</p>


            <div className="flex justify-center items-center gap-5">
              <button
                onClick={handleSavePaid}
                className="w-full py-2 bg-orange-300 text-white rounded-lg hover:bg-orange-500 transition"
              >
                save
              </button>
              <button
                onClick={() => setPaidAmtPopUp(false)}
                className="w-full py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
              >
                cancel
              </button>
            </div>
          </div>
        </div>
      )}



      {/* </div> */}
    </div>
  );
};

export default SalaryDetail;
