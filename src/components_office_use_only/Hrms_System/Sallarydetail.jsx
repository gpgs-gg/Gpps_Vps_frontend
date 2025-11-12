import React from "react";
import { useAttendanceData, useSallaryTrackerDetail } from "./services";

const SalaryDetail = () => {

  const { data, isPending } = useAttendanceData()
  const { data: sallayTrackerdetails } = useSallaryTrackerDetail()

  console.log(333333333, sallayTrackerdetails)
  // Extract attendance list
  const attendanceList = data?.data || []
  //console.log(121212, attendanceList)
  //Transform raw attendance list
  const employeesNew = Object.values(
    attendanceList.reduce((acc, record) => {
      const { EmployeeID, EmployeeName, AttendanceStatus, HalfDayHrs } = record;

      if (!acc[EmployeeID]) {
        acc[EmployeeID] = {
          id: EmployeeID,
          name: EmployeeName,
          salary: 0, // will fill later
          AdjustedAmt: 0,
          PaidLeaves: 0,
          attendance: [],
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

  //Example salary data

  //Merge salary
  const employeesWithSalary = employeesNew.map(emp => {
    const match = sallayTrackerdetails?.data?.find(s => s.EmployeeID == emp.id);

    return {
      ...emp, salary: match ? match.FixSalary : 0, AdjustedAmt: match ? match.AdjustedAmt : 0
      , PaidLeaves: match ? match.PaidLeaves : 0 , CurrentDue: match ? match.CurrentDue : 0,
       PreviousDue: match ? match.PreviousDue : 0 , Comments: match ? match.Comments : 0 ,
        PaidAmount: match ? match.PaidAmount : 0


    };
  });

  console.log("employeesWithSalary", employeesWithSalary)


  // const employees = [
  //   {
  //     id: 1,
  //     name: "Sandeep Pawar",
  //     department: "Marketing & Sales",
  //     salary: 60000,
  //     attendance: [1, 1, 1, 0.5, 1, 1, 1, 1, 0.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  //   },
  //   {
  //     id: 2,
  //     name: "Sachin Patil",
  //     department: "Marketing & Sales",
  //     salary: 30000,
  //     attendance: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0],
  //   },
  //   {
  //     id: 3,
  //     name: "Vikram Mahankal",
  //     department: "Maintenance & Admin",
  //     salary: 100000,
  //     attendance: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0],
  //   },
  // ];




  const getAttendanceSum = (arr) =>
    arr?.reduce((sum, val) => sum + (typeof val === "number" ? val : 0), 0);

  function myFunction() {
    var today = new Date();
    var month = today.getMonth();
    return daysInMonth(month + 1, today.getFullYear())
  }

  function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  myFunction();



  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-gray-50 text-gray-800 text-center p-4 rounded-md mt-20  mb-6">
        <h1 className="text-2xl font-bold">
          Attendance & Salary Tracker - November 2025
        </h1>
        <p className="text-lg text-gray-700">Gopal's paying Guest Services Pvt. Ltd</p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white text-2xl rounded-lg shadow border border-gray-200">
        <table className="min-w-auto border-red-500">
          <thead className="bg-orange-200 font-bold border-b border-gray-300 text-sm  text-gray-700  text-center">
            <tr>
              <th className="border border-gray-300 px-2 py-2">EmpID</th>
              <th className="border border-gray-300 px-2 py-2 text-left">
                Employee's Name
              </th>
              {/* <th className="border border-gray-300 px-2 py-2">DOJ</th> */}

              {/* Days 1–30 */}
              {[...Array(31)].map((_, i) => (
                <th key={i} className="border border-gray-300 px-1 py-1 w-6">
                  {i + 1}
                </th>
              ))}

              <th className="border border-gray-300 px-2 py-2">Total Days</th>
              <th className="border border-gray-300 px-2 py-2">Fix Salary</th>
              <th className="border border-gray-300 px-2 py-2">Per Day</th>
              <th className="border border-gray-300 px-2 py-2">Adjusted Amt</th>
              <th className="border border-gray-300 px-2 py-2">Paid Leaves</th>
              <th className="border border-gray-300 px-2 py-2">Payable Salary</th>
              <th className="border border-gray-300 px-2 py-2">Paid Amt </th>
              <th className="border border-gray-300 px-2 py-2">Current Due</th>
              <th className="border border-gray-300 px-2 py-2">Previous Due</th>
              <th className="border border-gray-300 w-48 px-2 py-2">Comments</th>
            </tr>
          </thead>

          <tbody>
            {employeesWithSalary?.filter(emp => emp?.id)?.map((emp, i) => {
              const attendanceDays = getAttendanceSum(emp.attendance);
              const perDay = emp.salary / 30;
              const payable = perDay * attendanceDays;

              return (
                <tr
                  key={emp.id}
                  className={`text-sm text-gray-800 text-center ${i % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-yellow-50`}
                >
                  <td className="border border-gray-300 px-2 py-1">{emp.id}</td>
                  <td className="border border-gray-300 px-2 py-1 text-left font-medium">
                    {emp.name}
                    <div className="text-[10px] text-gray-500">{emp.department}</div>
                  </td>
                  {/* <td className="border border-gray-300 px-2 py-1">{emp.doj}</td> */}

                  {/* Attendance Days */}
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

                  {/* Summary Columns */}

                  <td className="border border-gray-300 px-2 py-1 font-semibold">
                    {attendanceDays.toFixed(1)}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    ₹{emp.salary.toLocaleString()}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    ₹{perDay.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    ₹{emp.AdjustedAmt}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    {emp.PaidLeaves}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 font-semibold text-blue-700">
                    ₹{payable.toFixed(0)}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-green-700 font-semibold">
                    ₹{emp.PaidAmount}
                  </td>
                  <td className="border border-gray-300 px-2 py-1  font-semibold">
                    ₹{emp.CurrentDue}
                  </td>
                  <td className="border border-gray-300 px-2 py-1  font-semibold">
                    ₹{emp.PreviousDue}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 w-48 font-semibold">
                    {emp.Comments}
                  </td>
                  {/* <td className="border border-gray-300 px-2 py-1 text-green-700 font-semibold">
                    ₹{emp.PaidAmount}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-red-600 font-semibold">
                    ₹{payable.toFixed(0)}
                  </td> */}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      {/* <div className="mt-6 text-sm text-gray-600">
        <p>
          🟢 <b>1</b> = Full Day | 🟡 <b>0.5</b> = Half Day | 🔴 <b>0</b> =
          Absent
        </p>
        <p>
          💰 Payable Salary = (Monthly Salary ÷ 30) × Total Attendance Days
        </p>
      </div> */}
    </div>
  );
};

export default SalaryDetail;
