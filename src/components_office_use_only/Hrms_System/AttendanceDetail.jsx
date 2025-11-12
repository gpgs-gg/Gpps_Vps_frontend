import React, { useState, useMemo } from 'react'
import { useAttendanceData } from './services'
import { Controller, useForm } from 'react-hook-form'
import Select from "react-select";
import LoaderPage from '../NewBooking/LoaderPage';

const AttendanceDetail = () => {
    const { data, isPending } = useAttendanceData()
    const { control, watch } = useForm({})

    const [selectedImage, setSelectedImage] = useState(null);
    const handleImageClick = (imgSrc) => {
        setSelectedImage(imgSrc);
    };
    const handleClose = () => {
        setSelectedImage(null);
    };
    // Extract attendance list
    const attendanceList = data?.data || []
    // ✅ Watch EmployeeID once and memoize its value
    const selectedEmployee = watch("EmployeeID")?.value || ""
    const selectedDate = watch("Date") || ""; // '2025-11-27'
    const formatDate = (date) => {
        const day = date.getDate();
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };
    // Convert the string to a Date object before formatting
    const formattedDate = selectedDate ? formatDate(new Date(selectedDate)) : "";
    // ✅ Filtered data (memoized efficiently)
    const filteredData = useMemo(() => {
        if (!attendanceList?.length) return [];
        // If no employee and no date are selected, return all
        if (!selectedEmployee && !formattedDate) return attendanceList;
        // Filter by selected employee and/or selected date
        return attendanceList.filter(entry => {
            const matchesEmployee = selectedEmployee ? entry.EmployeeID === selectedEmployee : true;
            const matchesDate = formattedDate ? entry.Date === formattedDate : true;
            return matchesEmployee && matchesDate;
        });
    }, [attendanceList, selectedEmployee, formattedDate]);



    const EmployeeForOptions = useMemo(() => [
        { label: "All Employees", value: "" },
        ...(
            attendanceList
                ?.filter((emp) => emp?.EmployeeName)
                .reduce((unique, emp) => {
                    if (!unique.some((e) => e.value === emp.EmployeeID)) {
                        unique.push({
                            value: emp.EmployeeID,
                            label: `${emp.EmployeeName}-${emp.EmployeeID}`,
                        })
                    }
                    return unique
                }, []) || []
        )
    ], [attendanceList])




    const SelectStylesfilter = {
        control: (base, state) => ({
            ...base,
            width: "300px",
            paddingTop: "0.25rem",
            paddingBottom: "0.10rem",
            paddingLeft: "0.75rem",
            paddingRight: "0.50rem",
            marginTop: "0.30rem",
            borderWidth: "2px",
            borderStyle: "solid",
            borderColor: state.isFocused ? "#fb923c" : "#fdba74",
            borderRadius: "0.375rem",
            boxShadow: state.isFocused
                ? "0 0 0 2px rgba(251,146,60,0.5)"
                : "0 1px 2px rgba(0,0,0,0.05)",
            backgroundColor: "white",
            minHeight: "40px",
            "&:hover": { borderColor: "#fb923c" },
        }),

        option: (provided, state) => ({
            ...provided,
            color: state.isSelected ? "white" : "#fb923c",
            backgroundColor: state.isSelected ? "#fb923c" : "white",
            "&:hover": { backgroundColor: "#fed7aa" },
        }),

        menu: (provided) => ({
            ...provided,
            zIndex: 9999,
            maxHeight: "200px",
            // overflowY: "auto",
        }),

        menuPortal: (base) => ({
            ...base,
            zIndex: 9999,
        }),
    };



    return (
        <div className="mt-28 w-full px-4">
            {/* --- Filter Section --- */}
            <div className="flex flex-wrap items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-700">
                    Attendance Records
                </h2>

                <div className="flex gap-4 items-center">
                    <div>
                        <label className="block text-lg font-medium text-black-700 mb-1">Employee</label>
                        <Controller
                            name="EmployeeID"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    styles={SelectStylesfilter}
                                    isClearable={true}
                                    placeholder="Select Employee name"
                                    options={EmployeeForOptions}
                                    menuPosition="absolute"
                                />
                            )}
                        />
                    </div>
                    <div>
                        <label className="block text-lg font-medium text-black mb-2">
                            Date
                        </label>
                        <Controller
                            control={control}
                            name="Date"
                            defaultValue=""
                            render={({ field }) => (
                                <div className="relative w-full">
                                    <input
                                        type="date"
                                        {...field}
                                        value={field.value || ""}
                                        className="w-full border-2 mt-[-3px] border-orange-300 rounded px-3 py-[8px] pr-10 focus:outline-none focus:ring-1 focus:ring-orange-300 focus:border-orange-300"
                                    />
                                    {field.value && (
                                        <button
                                            type="button"
                                            onClick={() => field.onChange("")}
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-600"
                                        >
                                            &#10005;
                                        </button>
                                    )}
                                </div>
                            )}
                        />
                    </div>
                </div>
            </div>

            {/* --- Table Section --- */}
            {isPending ? (
                <div className="text-center py-10 text-gray-500">
                    <LoaderPage />  Loading attendance records...
                </div>
            ) : filteredData.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                    No attendance records found.
                </div>
            ) : (
                <div className="overflow-auto bg-white shadow-lg rounded-lg border h-[600px] border-gray-200">
                    <table className="min-w-full text-md">
                        <thead className="bg-orange-300 sticky top-0 text-black">
                            <tr>
                                {[
                                    'Date',
                                    'Employee ID',
                                    'Employee Name',
                                    'In Time',
                                    'In Selfie',
                                    'Out Time',
                                    'Out Selfie',
                                    'Total Hours',
                                    'OverTime',
                                    'DeficitHours',
                                    'Status',
                                ].map((header) => (
                                    <th
                                        key={header}
                                        className="px-4 py-3 text-left font-semibold border-b border-gray-200"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((entry, i) => (
                                <tr
                                    key={i}
                                    className={`transition hover:bg-gray-200 ${i % 2 === 0 ? 'border' : 'bg-white border'
                                        }`}
                                //      className={`transition  ${
                                //     entry.AttendanceStatus == 1 ? 'bg-green-400 text-white border-b-2 border-gray-100' : entry.AttendanceStatus == 0.5 ? 'bg-orange-300  border-b-2 border-gray-100' : "bg-white border-b-2 border-gray-100"
                                //   }`}
                                >
                                    <td className="px-4 py-3">{entry.Date}</td>
                                    <td className="px-4 py-3">{entry.EmployeeID}</td>
                                    <td className="px-4 py-3 font-medium ">
                                        {entry.EmployeeName}
                                    </td>
                                    <td className="px-4 py-3">{entry.InTime}</td>
                                    <td className="px-4 py-3">
                                        {entry.InSelfie && (
                                            <img
                                                src={entry.InSelfie}
                                                alt="In"
                                                onClick={() => handleImageClick(entry.InSelfie)}
                                                className="w-12 h-12 rounded-lg object-cover border"
                                            />
                                        )}
                                    </td>
                                    <td className="px-4 py-3">{entry.OutTime}</td>
                                    <td className="px-4 py-3">
                                        {entry.OutSelfie && (
                                            <img
                                                src={entry.OutSelfie}
                                                alt="Out"
                                                onClick={() => handleImageClick(entry.OutSelfie)}
                                                className="w-12 h-12 rounded-lg object-cover border"
                                            />
                                        )}
                                    </td>
                                    <td className="px-4 py-3">{entry.TotalHours}</td>
                                    <td className="px-4 py-3">{entry.OverTime}</td>
                                    <td className="px-4 py-3">{entry.DeficitHours}</td>
                                    <td className={`px-4 py-3 font-semibold ${entry.AttendanceStatus == 1
                                            ? 'text-green-600'
                                            : entry.AttendanceStatus == 0.5
                                                ? 'text-yellow-600'
                                                : entry.AttendanceStatus == 0
                                                    ? 'text-gray-500'
                                                    : ''
                                        }`}>
                                        {entry.AttendanceStatus === undefined || entry.AttendanceStatus === null || entry.AttendanceStatus === ''
                                            ? '' // 👉 show nothing
                                            : entry.AttendanceStatus == 1
                                                ? 'Present'
                                                : entry.AttendanceStatus == 0.5
                                                    ? 'Half Day'
                                                    : 'Absent'}
                                    </td>

                                </tr>
                            ))}

                            {selectedImage && (
                                <div
                                    onClick={handleClose}
                                    className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 cursor-pointer"
                                >
                                    <img
                                        src={selectedImage}
                                        alt="Preview"
                                        className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg border-4 border-white"
                                    />
                                </div>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default AttendanceDetail
