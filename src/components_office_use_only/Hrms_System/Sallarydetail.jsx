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
//         <p className="text-lg text-gray-700">Gopal's paying Guest Services Pvt. Ltd</p>
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


import React, { useState, useEffect } from "react";
import { useAttendanceData, useSallaryTrackerDetail } from "./services";
// import your API function here for saving data
// e.g. import { saveSalaryData } from "./services";

const SalaryDetail = () => {
  const { data, isPending } = useAttendanceData();
  const { data: sallayTrackerdetails } = useSallaryTrackerDetail();

  const attendanceList = data?.data || [];

  const employeesNew = Object.values(
    attendanceList.reduce((acc, record) => {
      const { EmployeeID, EmployeeName, AttendanceStatus, HalfDayHrs } = record;
      if (!acc[EmployeeID]) {
        acc[EmployeeID] = {
          id: EmployeeID,
          name: EmployeeName,
          salary: 0,
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
  const [cmt, setCmt] = useState("")
  const [handleSplAmtType, setHandleSplAmtType] = useState("")
  const [handleDeducAmtType, setHandleDeducAmtType] = useState("")
  const [handleAdvAmtType, setHandleAdvAmtType] = useState("")
  const [handleAdvDeducAmtType, setHandleAdvDeducAmtType] = useState("")

  console.log("enteredAdjustedAmount", enteredAdjustedAmount)

  useEffect(() => {
    if (employeesNew.length && sallayTrackerdetails?.data) {
      const merged = employeesNew.map((emp) => {
        const match = sallayTrackerdetails?.data?.find(
          (s) => s.EmployeeID == emp.id
        );
        return {
          ...emp,
          salary: match ? match.FixSalary : 0,
          AdjustedAmt: match ? match.AdjustedAmt : 0,
          PaidLeaves: match ? match.PaidLeaves : 0,
          CurrentDue: match ? match.CurrentDue : 0,
          PreviousDue: match ? match.PreviousDue : 0,
          Comments: match ? match.Comments : "",
          PaidAmount: match ? match.PaidAmount : 0,
          AdjAmtDetails: match ? match.AdjAmtDetails : 0,
          PaidAmtDetails: match ? match.PaidAmtDetails : 0,
        };
      });
      setEmployees(merged);
    }
  }, [data, sallayTrackerdetails]);

  const getAttendanceSum = (arr) =>
    arr?.reduce((sum, val) => sum + (typeof val === "number" ? val : 0), 0);

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

  // Save single row
  const handleSaveRow = async (emp) => {
    try {
      // Get previous value from DB record (string OR number)
      const dbRecord = sallayTrackerdetails?.data?.find(
        (s) => s.EmployeeID == emp.id
      );

      const previousAdjusted = dbRecord?.AdjAmtDetails ?? "0";
      const previousPaidAmount = dbRecord?.PaidAmtDetails ?? "0";

      // New entry typed by user

      // const newAdjusted = emp.AdjustedAmt;
      // const newPaidAmount = emp.PaidAmount;


      // If previous value already contains "+", append more

      const finalAdjustedAmt =
        previousAdjusted?.toString().includes("+")
          ? `${enteredAdjustedAmount ? "" : previousAdjusted}${enteredAdjustedAmount == 0 ? "" : `${enteredAdjustedAmount}`}`
          : `${enteredAdjustedAmount ? "" : previousAdjusted}${enteredAdjustedAmount == 0 ? "" : `${enteredAdjustedAmount}`}`;


      const finalPaidAmount =
        previousAdjusted?.toString().includes("+")
          ? `${enteredPaidAmount ? "" : previousPaidAmount}${enteredPaidAmount == 0 ? "" : `${enteredPaidAmount}`}`
          : `${enteredPaidAmount ? "" : previousPaidAmount}${enteredPaidAmount == 0 ? "" : `${enteredPaidAmount}`}`;


      const payload = {
        ...emp,
        AdjAmtDetails: finalAdjustedAmt,
        PaidAmtDetails: finalPaidAmount,// expression string
        PaidAmount: "J",
        AdjustedAmt: "H"
      };


      // Convert attendance array to an object with 1-based keys for 31 days.
      if (payload.attendance) {
        if (Array.isArray(payload.attendance) && payload.attendance.length >= 31) {
          const oldArray = payload.attendance;
          const newAttendance = {};
          for (let day = 1; day <= 31; day++) {
            newAttendance[day] = oldArray[day - 1];
          }
          payload.attendance = newAttendance;
        } else {
          // Handle error? Or leave as is?
          // According to requirement, we expect 31 days, so if not, we can throw an error or log a warning.
          console.warn('Attendance array does not have 31 elements');
        }
      }

      console.log("💡 Final AdjustedAmt =", finalAdjustedAmt);
      console.log("📤 Payload sent =", payload);
      setEnteredAdjustedAmount(0)
      setEnteredPaidAmount(0)
      setSplAmt("")
      setDecducAmt("")
      setAdvAmt("")
      setAdvDecducAmt("")
      alert(`✅ Saved successfully for ${emp.name}`);
    } catch (err) {
      console.error("Save failed:", err);
      alert("❌ Error saving data");
    }
  };

  // Save all employees in bulk
  const handleSaveAll = async () => {
    try {
      console.log("Saving all employees:", employees);
      // await saveSalaryData(employees);
      alert("✅ All employee data saved successfully!");
    } catch (err) {
      console.error("Bulk save failed:", err);
      alert("❌ Error saving all data");
    }
  };



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
    if (!existing) return value;

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
    if (!existing) return value;
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


  const handlePopUp = (existingValue, type) => {
    if (type === "PaidAmount") {
      setPaidAmountDetails(existingValue || "");
      setPaidAmtPopUp(true);
    } else {
      setAdjAmountDetails(existingValue || "");
      setAdjAmtPopUp(true);
    }

    // setSplAmt("");
    // setDecducAmt("")
    // setCmt("");
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


  const handleComment = (e) => {
    setCmt(e.target.value)
  }

  useEffect(() => {
    setEnteredAdjustedAmount(appendValueDeducToCalculation(appendValueSplToCalculation(adjAmtDetails, splAmt), splDecducAmt))
  }, [appendValueDeducToCalculation(appendValueSplToCalculation(adjAmtDetails, splAmt), splDecducAmt)])

  useEffect(() => {
    setEnteredPaidAmount(appendValueAdvDeducToCalculation(appendValueAdvToCalculation(paidAmtDetails, advAmt), advDecducAmt))
  }, [appendValueAdvDeducToCalculation(appendValueAdvToCalculation(paidAmtDetails, advAmt), advDecducAmt)])


  const handleSaveAdj = () => {
    setAdjAmtPopUp(false)

  }
  const handleSavePaid = () => {
    setPaidAmtPopUp(false)

  }


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-gray-50 text-gray-800 text-center p-4 rounded-md mt-20 mb-6">
        <h1 className="text-2xl font-bold">
          Attendance & Salary Tracker - November 2025
        </h1>
        <p className="text-lg text-gray-700">
          Gopal's Paying Guest Services Pvt. Ltd
        </p>

        {/* Save All Button */}
        {/* <button
          onClick={handleSaveAll}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          💾 Save All
        </button> */}
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white text-2xl rounded-lg shadow border border-gray-200">
        <table className="min-w-auto border-red-500">
          <thead className="bg-orange-200 font-bold border-b border-gray-300 text-lg text-gray-700 text-center">
            <tr>
              <th className="border border-gray-300 px-2 py-2">EmpID</th>
              <th className="border border-gray-300 px-2 py-2  text-left">Employee's Name</th>
              {[...Array(31)].map((_, i) => (
                <th key={i} className="border border-gray-300 px-1 py-1 w-6">
                  {i + 1}
                </th>
              ))}
              <th className="border border-gray-300 px-2 py-2 w-[100px]">Total Days</th>
              <th className="border border-gray-300 px-2 py-2">Fix Salary</th>
              <th className="border border-gray-300 px-2 py-2">Per Day</th>
              <th className="border border-gray-300 px-2 py-2">Adjusted Amt</th>
              <th className="border border-gray-300 px-2 py-2">Paid Leaves</th>
              <th className="border border-gray-300 px-2 py-2">Payable Salary</th>
              <th className="border border-gray-300 px-2 py-2">Paid Amt</th>
              <th className="border border-gray-300 px-2 py-2">Current Due</th>
              <th className="border border-gray-300 px-2 py-2">Previous Due</th>
              <th className="border border-gray-300 w-48 px-2 py-2">Comments</th>
              <th className="border border-gray-300 px-2 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {employees?.filter(emp => emp?.id)?.map((emp, i) => {
              const attendanceDays = getAttendanceSum(emp.attendance) || 0;
              const AdjustedAmt = (emp.AdjAmtDetails || "0").split(/(?=[+-])/g).reduce((a, b) => a + Number(b), 0);
              const PaidLeaves = Number(emp.PaidLeaves) || 0;
              const PaidAmt = (emp.PaidAmtDetails || "0").split(/(?=[+-])/g).reduce((a, b) => a + Number(b), 0);
              const CurrentDue = Number(emp.CurrentDue) || 0;
              const salary = Number(emp.salary) || 0;
              const perDay = salary / 30;
              const payable =
                perDay * attendanceDays + PaidLeaves * perDay + AdjustedAmt;
              const CurrentDueAmt = CurrentDue - PaidAmt;
              return (
                <tr
                  key={emp.id}
                  className={`text-lg text-gray-800 text-center ${i % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-yellow-50`}
                >
                  <td className="border border-gray-300 px-2 py-1">{emp.id}</td>
                  <td className="border border-gray-300 px-2 py-1 text-left font-medium">
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
                      value={emp.salary}
                      onChange={(e) => handleFieldChange(emp.id, "salary", e.target.value)}
                    />
                  </td>

                  <td className="border border-gray-300 px-2 py-1">₹{perDay.toFixed(2)}</td>

                  <td onClick={() => handlePopUp(emp.AdjAmtDetails, "AdjustedAmt")} className="border cursor-pointer border-gray-300 px-2 py-1">
                    {AdjustedAmt ? AdjustedAmt : emp.AdjustedAmt}
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

                  <td onClick={() => handlePopUp(emp.PaidAmtDetails, "PaidAmount")} className="border cursor-pointer border-gray-300 px-2 py-1">
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
                    ₹{CurrentDueAmt}
                  </td>

                  <td className="border border-gray-300 px-2 py-1 font-semibold">
                    ₹{emp.PreviousDue}
                  </td>

                  <td className="border border-gray-300 px-2 py-1 w-48 font-semibold">
                    <input
                      type="text"
                      className="w-full border-none focus:ring-0 bg-transparent outline-none"
                      value={emp.Comments}
                      onChange={(e) => handleFieldChange(emp.id, "Comments", e.target.value)}
                    />
                  </td>

                  {/* Row Save Button */}
                  <td className="border border-gray-300 px-2 py-1">
                    <button
                      onClick={() => handleSaveRow(emp)}
                      className="px-3 py-1 bg-orange-400 text-white rounded text-xs hover:bg-orange-500"
                    >
                      Save
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">


        {/* ......................... */}
        {adjAmtPopUp && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">

            <div className="bg-white rounded-xl shadow-xl p-6 w-96 relative animate-fadeIn">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Adj Amt Details

              </h2>

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
                <input
                  type="text"
                  value={splAmt}
                  onChange={(e) => handleSplAmount(e, "spl")}
                  className="w-full mt-1 outline-none mb-4 p-2 border border-orange-300 rounded-lg "
                />
              </div>
              <div className="flex gap-5 justify-center items-center ">
                <label className="text-lg text-gray-600 ">Comments:</label>
                <input
                  type="text"
                  value={cmt}
                  onChange={handleComment}
                  className="w-full mt-1 outline-none mb-4 p-2 border border-orange-300 rounded-lg"
                />
              </div>

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
                  onChange={(e) => handleSplDeductAmount(e, "deduct")}
                  className="w-full mt-1 outline-none mb-4 p-2 border border-orange-300 rounded-lg  "
                />
              </div>
              <div className="flex gap-5 justify-center items-center ">
                <label className="text-lg text-gray-600 ">Comments:</label>
                <input
                  type="text"
                  // value={adjAmtDetails}
                  className="w-full mt-1 outline-none mb-4 p-2 border border-orange-300 rounded-lg "
                />
              </div>
              {/* <p className="text-gray-500 mb-6 text-sm">
                These are preview values and cannot be edited.
              </p> */}
              <button
                onClick={handleSaveAdj}
                className="w-full py-2 bg-orange-300 text-white rounded-lg hover:bg-orange-500 transition"
              >
                save
              </button>
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
                  // value={adjAmtDetails}
                  onChange={(e) => handleAdvAmount(e, "Adv")}
                  className="w-full mt-1 outline-none mb-4 p-2 border border-orange-300 rounded-lg "
                />
              </div>
              <div className="flex gap-5 justify-center items-center ">
                <label className="text-lg text-gray-600 ">Comments:</label>
                <input
                  type="text"
                  // value={adjAmtDetails}
                  onChange={handleComment}
                  className="w-full mt-1 outline-none mb-4 p-2 border border-orange-300 rounded-lg  "
                />
              </div>
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
                  // value={adjAmtDetails}
                  onChange={(e) => handleAdvDeductAmount(e, "deducted")}
                  className="w-full mt-1 outline-none mb-4 p-2 border border-orange-300 rounded-lg "
                />

              </div>
              <div className="flex gap-5 justify-center items-center ">
                <label className="text-lg text-gray-600 ">Comments:</label>
                <input
                  type="text"
                  // value={adjAmtDetails}
                  onChange={handleComment}
                  className="w-full mt-1 outline-none mb-4 p-2 border border-orange-300 rounded-lg "
                />

              </div>

              {/* <p className="text-gray-500 mb-6 text-sm">
                These are preview values and cannot be edited.
              </p> */}

              <button
                onClick={handleSavePaid}
                className="w-full py-2 bg-orange-300 text-white rounded-lg hover:bg-orange-500 transition"
              >
                save
              </button>
            </div>
          </div>
        )}



      </div>
    </div>
  );
};

export default SalaryDetail;
