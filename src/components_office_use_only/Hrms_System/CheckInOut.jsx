import React, { use, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { useAttendanceData, useCheckInOut } from "./services";
import LoaderPage from "../NewBooking/LoaderPage";
import { CheckInOutSkeleton } from "./CheckInOutSkeleton";

const OFFICE_LOCATION = { latitude: 19.067422, longitude: 72.921907 };
const MAX_DISTANCE_METERS = 500;

const CheckInOut = () => {
    const webcamRef = useRef(null);
    const [photo, setPhoto] = useState(null);
    const [error, setError] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [totalHours, setTotalHours] = useState(0);
    const [isDisabled, setIsDisabled] = useState(false);
    const [isOutDisabled, setOutIsDisabled] = useState(false);


    const { user } = useAuth();
    const { mutate: submitCheckInOut, isPending } = useCheckInOut(modalType);

     const now = new Date();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const selectedMonth = `${monthNames[now.getMonth()]}${now.getFullYear()}`;

    const { data: attendanceData, isPending: isPendingAttendance } = useAttendanceData(selectedMonth);

    const filteredAttendanceData =
        attendanceData?.data?.filter((ele) => ele.EmployeeID ===    user.employee?.EmployeeID) || [];


    // filter data for current date (TotalHours Cal)

    const currentDate = new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    const filteredDataForTotalHours =
        attendanceData?.data?.find(ele => ele.EmployeeID === user.employee?.EmployeeID && ele.Date === currentDate) || [];


    const formatDate = (date) => {
        const day = date.getDate();
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);



    const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
        const R = 6371000;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };




    const dataURLtoBlob = (dataurl) => {
        const arr = dataurl.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        const u8arr = new Uint8Array(bstr.length);
        for (let i = 0; i < bstr.length; i++) u8arr[i] = bstr.charCodeAt(i);
        return new Blob([u8arr], { type: mime });
    };



    // useEffect(() => {
    // }, [filteredDataForTotalHours]);



    useEffect(() => {
        // Format current date like "5 Nov 2025"
        const currentDate = new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
        const todayAttendance = filteredAttendanceData?.find(
            (ele) => ele.Date === currentDate
        );
        const isSameDate = !!todayAttendance;
        const hasIntime = isSameDate ? !!todayAttendance?.InTime : false;
        setIsDisabled(isSameDate && hasIntime);
    }, [filteredAttendanceData]);

    useEffect(() => {
        // Format current date like "5 Nov 2025"
        const currentDate = new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
        const todayAttendance = filteredAttendanceData?.find(
            (ele) => ele.Date === currentDate
        );
        const isSameDate = !!todayAttendance;
        const hasIntime = isSameDate ? !!todayAttendance?.OutTime : false;
        setOutIsDisabled(isSameDate && hasIntime);
    }, [filteredAttendanceData]);

    // const capture = async (action) => {
    //     setModalType(action);
    //     if (!navigator.geolocation) {
    //         setError("Geolocation not supported by your browser.");
    //         return;
    //     }

    //     // navigator.geolocation.getCurrentPosition(
    //     //     async (position) => {
    //     //         const userLat = parseFloat(position.coords.latitude.toFixed(6));
    //     //         const userLon = parseFloat(position.coords.longitude.toFixed(6));
    //     //         const officeLat = parseFloat(OFFICE_LOCATION.latitude.toFixed(6));
    //     //         const officeLon = parseFloat(OFFICE_LOCATION.longitude.toFixed(6));

    //     //         const distance = getDistanceFromLatLonInMeters(userLat, userLon, officeLat, officeLon);

    //     // Optional location restriction
    //     // if (distance > MAX_DISTANCE_METERS) {
    //     //   toast.error(`You are too far (${distance.toFixed(2)}m) from the office.`);
    //     //   return;
    //     // }

    //     const imageSrc = webcamRef.current.getScreenshot();
    //     const imageBlob = dataURLtoBlob(imageSrc);
    //     const now = new Date();

    //     const formData = new FormData();
    //     formData.append("EmployeeID", user?.id);
    //     formData.append("Name", user?.name);
    //     formData.append("Date", formatDate(now));
    //     formData.append("action", action);
    //     // formData.append("latitude", userLat);
    //     // formData.append("longitude", userLon);

    //     if (action === "Check In") {
    //         formData.append("InTime", now.toLocaleTimeString());
    //         formData.append("InSelfie", imageBlob, "in_selfie.jpg");
    //     } else {
    //         formData.append("OutTime", now.toLocaleTimeString());
    //         formData.append("OutSelfie", imageBlob, "out_selfie.jpg");

    //         const { InTime, OutTime, MinHours, HalfDayHrs } = filteredDataForTotalHours || {};

    //         if (InTime && now.toLocaleTimeString()) {
    //             const parseTime = (timeStr) => {
    //                 const [time, modifier] = timeStr.split(' ');
    //                 const [hours, minutes, seconds] = time.split(':').map(Number);

    //                 let h = hours;
    //                 if (modifier === 'PM' && hours < 12) h += 12;
    //                 if (modifier === 'AM' && hours === 12) h = 0;

    //                 return h * 3600 + minutes * 60 + seconds;
    //             };

    //             const inSeconds = parseTime(InTime);
    //             const outSeconds = parseTime(now.toLocaleTimeString());

    //             let diffSeconds = outSeconds - inSeconds;
    //             if (diffSeconds < 0) diffSeconds += 24 * 3600;

    //             const hours = Math.floor(diffSeconds / 3600);
    //             const minutes = Math.floor((diffSeconds % 3600) / 60);

    //             formData.append("TotalHours", `${hours}h ${minutes}m`);
    //             formData.append("AttendanceStatus", hours >= HalfDayHrs && hours < MinHours ? 0.5 : hours >= HalfDayHrs && hours >= MinHours ? 1 : hours < HalfDayHrs ? 0 : 0);


    //             // calculate here total overtime  and DeficitHours
    //             const totalWorkedSeconds = diffSeconds; // total worked time in seconds
    //             // Minimum expected time in seconds
    //             const minSeconds = MinHours * 3600;
    //             // Calculate difference in seconds
    //             let differenceSeconds = totalWorkedSeconds - minSeconds;
    //             // Determine Overtime and Deficit
    //             let overtimeSeconds = 0;
    //             let deficitSeconds = 0;
    //             if (differenceSeconds > 0) {
    //                 // Worked more than minimum → Overtime
    //                 overtimeSeconds = differenceSeconds;
    //             } else if (differenceSeconds < 0) {
    //                 // Worked less than minimum → Deficit
    //                 deficitSeconds = Math.abs(differenceSeconds);
    //             }
    //             // Convert seconds to hours and minutes
    //             const formatTime = (seconds) => {
    //                 const h = Math.floor(seconds / 3600);
    //                 const m = Math.floor((seconds % 3600) / 60);
    //                 return `${h}h ${m}m`;
    //             };
    //             // Append to formData
    //             formData.append("OverTime", overtimeSeconds > 0 ? formatTime(overtimeSeconds) : "0h 0m");
    //             formData.append("DeficitHours", deficitSeconds > 0 ? formatTime(deficitSeconds) : "0h 0m");
    //             setTotalHours();
    //         } else {
    //             setTotalHours("0h 0m");
    //         }
    //     }
    //     setPhoto(imageSrc);
    //     submitCheckInOut(formData, {
    //         onSuccess: (response) => {

    //             toast.success(
    //                 <div className="flex items-center space-x-3">
    //                     <div>
    //                         <span className="font-semibold">{action} Successful!</span>
    //                     </div>
    //                 </div>
    //             );
    //         },
    //         onError: (response) => {
    //             toast.error(
    //                 <div>
    //                     <p className="font-semibold">Failed to submit check-in/out.</p>
    //                     <p className="text-sm text-gray-400">{response?.response?.data?.error || "Unknown error"}</p>
    //                 </div>
    //             );
    //         },
    //     });
    //     //     onSuccess: () => toast.success(<div className="flex items-center space-x-3">
    //     //         <img
    //     //             src="https://cdn.dribbble.com/userupload/15097592/file/original-11af0dab65a0913fe4ea1d71d9d48f4a.gif"
    //     //             alt="success"
    //     //             className="w-10 h-10 rounded-full"
    //     //         />
    //     //         <span className="font-semibold">{action} Successful!</span>
    //     //     </div>),
    //     //     onError: (err) => {
    //     //         console.error(err);
    //     //         toast.error("Failed to submit check-in/out.");
    //     //     },
    //     // });
    //     //     },
    //     // );
    // };
    // const capture = async (action) => {
    //     try {
    //         setModalType(action);

    //         if (!navigator.geolocation) {
    //             setError("Geolocation not supported by your browser.");
    //             return;
    //         }

    //         const imageSrc = webcamRef.current.getScreenshot();
    //         const imageBlob = dataURLtoBlob(imageSrc);
    //         const now = new Date();

    //         // ✅ Get data from state or localStorage
    //         let { InTime, MinHours, HalfDayHrs } = filteredDataForTotalHours || {};
    //         // Fallback if state is not yet updated
    //         if (!InTime) {
    //             const savedData = JSON.parse(localStorage.getItem("lastCheckInData"));
    //             InTime = savedData?.InTime || null;
    //             MinHours = savedData?.MinHours || 9;
    //             HalfDayHrs = savedData?.HalfDayHrs || 5;
    //         }
    //         // Prepare form data
    //         const formData = new FormData();
    //         formData.append("EmployeeID", user?.id);
    //         formData.append("Name", user?.name);
    //         formData.append("Date", formatDate(now));
    //         formData.append("action", action);

    //         if (action === "Check In") {
    //             formData.append("InTime", now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
    //             formData.append("InSelfie", imageBlob, "in_selfie.jpg");
    //             // ✅ Save locally for later use
    //             localStorage.setItem(
    //                 "lastCheckInData",
    //                 JSON.stringify({
    //                     InTime: now.toLocaleTimeString(),
    //                     MinHours: 9,
    //                     HalfDayHrs: 5,
    //                 })
    //             );
    //         } else if (action === "Check Out") {
    //             formData.append("OutTime", now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
    //             formData.append("OutSelfie", imageBlob, "out_selfie.jpg");

    //             if (!InTime) {
    //                 toast.error("InTime not found. Please check in first.");
    //                 return;
    //             }

    //             // ✅ Time calculation
    //             // const parseTime = (timeStr) => {   
    //             //     const [time, modifier] = timeStr.split(" ");
    //             //     const [hours, minutes, seconds] = time.split(":").map(Number);
    //             //     let h = hours;
    //             //     if (modifier === "PM" && hours < 12) h += 12;
    //             //     if (modifier === "AM" && hours === 12) h = 0;
    //             //     return h * 3600 + minutes * 60 + seconds;
    //             // };

    //             const parseTime = (timeStr) => {
    //                 const [time, modifier] = timeStr.split(" ");
    //                 const [hours, minutes, seconds = 0] = time.split(":").map(Number); // ✅ default 0
    //                 let h = hours;
    //                 if (modifier === "PM" && hours < 12) h += 12;
    //                 if (modifier === "AM" && hours === 12) h = 0;
    //                 return h * 3600 + minutes * 60 + seconds;
    //             };


    //             const inSeconds = parseTime(InTime);
    //             const outSeconds = parseTime(now.toLocaleTimeString());

    //             let diffSeconds = outSeconds - inSeconds;
    //             if (diffSeconds < 0) diffSeconds += 24 * 3600;

    //             const hours = Math.floor(diffSeconds / 3600);
    //             const minutes = Math.floor((diffSeconds % 3600) / 60);

    //             // ✅ Append total working hours
    //             formData.append("TotalHours", `${hours}H ${minutes}M`);

    //             // ✅ Calculate attendance status
    //             let attendanceStatus = 0;
    //             if (hours >= MinHours) attendanceStatus = 1;
    //             else if (hours >= HalfDayHrs) attendanceStatus = 0.5;
    //             formData.append("AttendanceStatus", attendanceStatus);

    //             // ✅ Calculate overtime / deficit
    //             const totalWorkedSeconds = diffSeconds;
    //             const minSeconds = MinHours * 3600;
    //             const differenceSeconds = totalWorkedSeconds - minSeconds;

    //             const formatTime = (seconds) => {
    //                 const h = Math.floor(seconds / 3600);
    //                 const m = Math.floor((seconds % 3600) / 60);
    //                 return `${h}H ${m}M`;
    //             };

    //             let overtime = "0H 0M";
    //             let deficit = "0H 0M";

    //             if (differenceSeconds > 0) overtime = formatTime(differenceSeconds);
    //             else if (differenceSeconds < 0)
    //                 deficit = formatTime(Math.abs(differenceSeconds));

    //             formData.append("OverTime", overtime);
    //             formData.append("DeficitHours", deficit);


    //             console.log({
    //                 InTime,
    //                 OutTime: now.toLocaleTimeString(),
    //                 TotalHours: `${hours}H ${minutes}H`,
    //                 OverTime: overtime,
    //                 DeficitHours: deficit,
    //                 AttendanceStatus: attendanceStatus,
    //             });
    //         }
    //         // ✅ Set captured image preview
    //         setPhoto(imageSrc);
    //         // ✅ Submit data to backend
    //         submitCheckInOut(formData, {
    //             onSuccess: (response) => {
    //                 toast.success(
    //                     <div className="flex items-center space-x-3">
    //                         <div>
    //                             <span className="font-semibold">{action} Successful!</span>
    //                         </div>
    //                     </div>
    //                 );
    //             },
    //             onError: (response) => {
    //                 toast.error(
    //                     <div>
    //                         <p className="font-semibold">Failed to submit check-in/out.</p>
    //                         <p className="text-sm text-gray-400">
    //                             {response?.response?.data?.error || "Unknown error"}
    //                         </p>
    //                     </div>
    //                 );
    //             },
    //         });
    //     } catch (error) {
    //         console.error("Error in capture:", error);
    //         toast.error("Something went wrong. Try again.");
    //     }
    // };


    const capture = async (action) => {
        try {
            setModalType(action);

            if (!navigator.geolocation) {
                setError("Geolocation not supported by your browser.");
                return;
            }

            const imageSrc = webcamRef.current.getScreenshot();
            const imageBlob = dataURLtoBlob(imageSrc);
            const now = new Date();

            // Get saved Check-in data
            let { InTime, MinHours, HalfDayHrs } = filteredDataForTotalHours || {};

            // if (!InTime) {
            //     const saved = JSON.parse(localStorage.getItem("lastCheckInData"));
            //     InTime = saved?.InTime || null;
            //     MinHours = saved?.MinHours || 9;
            //     HalfDayHrs = saved?.HalfDayHrs || 5;
            // }

            const formatTime12 = (dateObj) =>
                dateObj.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                });

            /** FIXED TIME PARSER → Supports 24h & 12h formats */
            // const parseTime = (timeStr) => {
            //     if (!timeStr.includes(" ")) {
            //         const [h, m, s = 0] = timeStr.split(":").map(Number);
            //         return h * 3600 + m * 60 + s;
            //     }

            //     const [time, modifier] = timeStr.split(" ");
            //     const [hours, minutes, seconds = 0] = time.split(":").map(Number);

            //     let h = hours;
            //     if (modifier === "PM" && hours < 12) h += 12;
            //     if (modifier === "AM" && hours === 12) h = 0;

            //     return h * 3600 + minutes * 60 + seconds;
            // };


            const parseTime = (timeStr) => {
                if (!timeStr.includes(" ")) {
                    const [h, m, s = 0] = timeStr.split(":").map(Number);
                    return h * 3600 + m * 60 + s;
                }

                const [time, modifierRaw] = timeStr.split(" ");
                const modifier = modifierRaw.trim().toUpperCase(); // <-- FIX HERE

                const [hours, minutes, seconds = 0] = time.split(":").map(Number);
                let h = hours;

                if (modifier === "PM" && hours < 12) h += 12;
                if (modifier === "AM" && hours === 12) h = 0;

                return h * 3600 + minutes * 60 + seconds;
            };


            // Prepare form data
            const formData = new FormData();
            formData.append("EmployeeID", user?.employee.EmployeeID);
            formData.append("Name", user?.employee?.Name);
            formData.append("Date", formatDate(now));
            formData.append("action", action);

            /** ============================
             *        CHECK IN
             *  ============================ */
            if (action === "Check In") {
                const inTimeFormatted = formatTime12(now);

                formData.append("InTime", inTimeFormatted);
                formData.append("InSelfie", imageBlob, "in_selfie.jpg");

                // Save 12-hour formatted time
                // localStorage.setItem(
                //     "lastCheckInData",
                //     JSON.stringify({
                //         InTime: inTimeFormatted,
                //         MinHours: 9,
                //         HalfDayHrs: 5,
                //     })
                // );
            }

            /** ============================
             *        CHECK OUT
             *  ============================ */
            else if (action === "Check Out") {
                const outTimeFormatted = formatTime12(now);
                formData.append("OutTime", outTimeFormatted);
                formData.append("OutSelfie", imageBlob, "out_selfie.jpg");

                if (!InTime) {
                    toast.dismiss()
                    toast.error("InTime not found. Please check in first.");
                    return;
                }

                // Convert times to seconds
                const inSeconds = parseTime(InTime);
                const outSeconds = parseTime(outTimeFormatted);

                // Calculate diff
                let diffSeconds = outSeconds - inSeconds;
                if (diffSeconds < 0) diffSeconds += 24 * 3600;

                const hours = Math.floor(diffSeconds / 3600);
                const minutes = Math.floor((diffSeconds % 3600) / 60);

                formData.append("TotalHours", `${hours}H ${minutes}M`);

                // Attendance status calculation
                let attendanceStatus = 0;
                if (hours >= MinHours) attendanceStatus = 1;
                else if (hours >= HalfDayHrs) attendanceStatus = 0.5;

                formData.append("AttendanceStatus", attendanceStatus);

                // Overtime / deficit
                const minSeconds = MinHours * 3600;
                const differenceSeconds = diffSeconds - minSeconds;

                const formatTime = (seconds) => {
                    const h = Math.floor(seconds / 3600);
                    const m = Math.floor((seconds % 3600) / 60);
                    return `${h}H ${m}M`;
                };

                let overtime = "0H 0M";
                let deficit = "0H 0M";

                if (differenceSeconds > 0) overtime = formatTime(differenceSeconds);
                else if (differenceSeconds < 0)
                    deficit = formatTime(Math.abs(differenceSeconds));

                formData.append("OverTime", overtime);
                formData.append("DeficitHours", deficit);

                console.log({
                    InTime,
                    OutTime: outTimeFormatted,
                    TotalHours: `${hours}H ${minutes}M`,
                    OverTime: overtime,
                    DeficitHours: deficit,
                    AttendanceStatus: attendanceStatus,
                });
            }

            // Preview captured image
            setPhoto(imageSrc);

            // Submit to backend
            submitCheckInOut(formData, {
                onSuccess: () => {
                    toast.success(
                        <div className="flex items-center space-x-3">
                            <span className="font-semibold">{action} Successful!</span>
                        </div>
                    );
                },
                onError: (response) => {
                    toast.error(
                        <div>
                            <p className="font-semibold">Failed to submit.</p>
                            <p className="text-sm text-gray-400">
                                {response?.response?.data?.error || "Unknown error"}
                            </p>
                        </div>
                    );
                },
            });
        } catch (error) {
            console.error("Error in capture:", error);
            toast.error("Something went wrong. Try again.");
        }
    };

    if (isPendingAttendance) {
        return <CheckInOutSkeleton isMobile={isMobile} />;
    }

    return (
        <div className="bg-gray-100 min-h-screen md:flex  py-10  gap-5">
            {/* Header Section */}
            <div>
                <div>
                    <div className="bg-white shadow-md rounded-xl px-8 py-6 w-full max-w-3xl text-center mb-8">
                        {/* <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Employee Attendance Portal
        </h1>
        <p className="text-gray-500">Mark your attendance with live selfie verification</p> */}
                    </div>
                </div>


                {/* Webcam Card */}
                <div>
                    <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-3xl">
                        <h1></h1>
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            mirrored={true}
                            screenshotFormat="image/jpeg"
                            className="rounded-lg w-full border border-gray-300"
                        />

                        <div className="flex justify-center gap-6 mt-1">
                            {/* Check In Button */}

                            <div className="flex flex-col justify-end items-center">
                                {filteredDataForTotalHours.InTime && <span>{filteredDataForTotalHours.InTime}</span>}

                                <button
                                    onClick={() => capture("Check In")}
                                    disabled={isDisabled || (isPending && modalType === "Check In")}
                                    className={`px-8 py-3 rounded-lg text-white font-semibold shadow transition-all 
                                ${(isPending && modalType === "Check In")
                                            ? "bg-green-400 cursor-wait"
                                            : "bg-green-600 hover:bg-green-700"}`
                                    }
                                >
                                    {isPending && modalType === "Check In" ? (
                                        <p className="flex justify-center items-center gap-2">
                                            <LoaderPage /> Processing...
                                        </p>
                                    ) : isDisabled ? "Checked In" : "Check In"}
                                </button>
                            </div>


                            <div className="flex flex-col justify-end items-center">
                                {filteredDataForTotalHours.OutTime && <span>{filteredDataForTotalHours.OutTime}</span>}
                                {/* Check Out Button */}
                                <button
                                    onClick={() => capture("Check Out")}
                                    disabled={isOutDisabled || (isPending && modalType === "Check Out")}
                                    className={`px-8 py-3 rounded-lg text-white font-semibold shadow transition-all 
                                 ${(isPending && modalType === "Check Out")
                                            ? "bg-red-400 cursor-wait"
                                            : "bg-orange-400 hover:bg-orange-500"}`
                                    }
                                >
                                    {isPending && modalType === "Check Out" ? (
                                        <p className="flex justify-center items-center gap-2">
                                            <LoaderPage /> Processing...
                                        </p>
                                    ) : isOutDisabled ? "Checked Out" : "Check Out"}
                                </button>
                            </div>

                        </div>
                        {console.log("filteredDataForTotalHours?.InTime", filteredDataForTotalHours.InTime)}

                        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
                    </div>

                </div>

            </div>

            {/* Attendance Table */}

            {
                isMobile ?
                    <div className="mt-20 w-full max-w-6xl">
                        {isPendingAttendance ? (
                            <div className="text-center py-10 text-gray-500">
                                Loading attendance records...
                            </div>
                        ) : filteredAttendanceData.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">
                                No attendance records found.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredAttendanceData.map((entry, i) => (
                                    <div
                                        key={i}
                                        className="bg-white shadow-lg rounded-lg border border-gray-200 p-4 flex flex-col space-y-3 hover:shadow-xl transition"
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold text-gray-800">{entry.EmployeeName}</span>
                                            <span
                                                className={`px-4 py-3 font-semibold ${entry.AttendanceStatus == 1
                                                    ? "text-green-600"
                                                    : entry.AttendanceStatus == 0.5 ? "text-red-500" : entry.AttendanceStatus == 0 ? "" : ""
                                                    }`}
                                            >
                                                {entry.AttendanceStatus == 1 ? "Present" : entry.AttendanceStatus == 0.5 ? "Half Day" : entry.AttendanceStatus == 0 ? "Absent" : ""}
                                            </span>
                                        </div>

                                        <div className="text-gray-500 text-sm">Employee ID: {entry.EmployeeID}</div>
                                        <div className="text-gray-500 text-sm">Date: {entry.Date}</div>

                                        <div className="flex justify-between items-center space-x-4">
                                            <div className="flex flex-col items-center">
                                                <span className="text-gray-500 text-sm">In Time</span>
                                                <span className="font-medium">{entry.InTime || "--:--"}</span>
                                                {entry.InSelfie && (
                                                    <img
                                                        src={entry.InSelfie}
                                                        alt="In"
                                                        className="w-16 h-16 rounded-lg object-cover border mt-2"
                                                    />
                                                )}
                                            </div>

                                            <div className="flex flex-col items-center">
                                                <span className="text-gray-500 text-sm">Out Time</span>
                                                <span className="font-medium">{entry.OutTime || "--:--"}</span>
                                                {entry.OutSelfie && (
                                                    <img
                                                        src={entry.OutSelfie}
                                                        alt="Out"
                                                        className="w-16 h-16 rounded-lg object-cover border mt-2"
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3">
                                            <div className="text-gray-500 text-sm">
                                                TotalHours: <span className="font-medium">{entry.TotalHours || "0h"}</span>
                                            </div>
                                            <div className="text-gray-500 text-sm">
                                                OverTime: <span className="font-medium">{entry.OverTime || "0h"}</span>
                                            </div>
                                            <div className="text-gray-500 text-sm">
                                                DeficitHours: <span className="font-medium">{entry.DeficitHours || "0h"}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    :
                    <div className="mt-20 w-full max-w-6xl">
                        {/* <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-orange-200 pb-2">
          Attendance Log
        </h2> */}
                        {isPendingAttendance ? (
                            <div className="text-center py-10 text-gray-500">Loading attendance records...</div>
                        ) : filteredAttendanceData.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">No attendance records found.</div>
                        ) : (
                            <div className="overflow-auto bg-white shadow-lg rounded-lg border h-[600px] border-gray-200">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-black sticky top-0 text-white">
                                        <tr>
                                            {["Date", "Employee ID", "Employee Name", "In Time", "In Selfie", "Out Time", "Out Selfie", "Total Hours", , "OverTime", "DeficitHours", "Status"].map(
                                                (header) => (
                                                    <th key={header} className="px-4 py-3 text-left font-semibold border-b border-gray-200">
                                                        {header}
                                                    </th>
                                                )
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredAttendanceData.map((entry, i) => (
                                            <tr
                                                key={i}
                                                className={`transition hover:bg-gray-200 ${i % 2 === 0 ? "bg-gray-50 border" : "bg-gray-50 border"
                                                    }`}
                                            >
                                                <td className="px-4 py-3">{entry.Date}</td>
                                                <td className="px-4 py-3">{entry.EmployeeID}</td>
                                                <td className="px-4 py-3 font-medium text-gray-800">{entry.EmployeeName}</td>
                                                <td className="px-4 py-3">{entry.InTime}</td>
                                                <td className="px-4 py-3">
                                                    {entry.InSelfie && (
                                                        <img src={entry.InSelfie} alt="In" className="w-12 h-12 rounded-lg object-cover border" />
                                                    )

                                                    }

                                                </td>
                                                <td className="px-4 py-3">{entry.OutTime}</td>
                                                <td className="px-4 py-3">
                                                    {entry.OutSelfie && (
                                                        <img src={entry.OutSelfie} alt="Out" className="w-12 h-12 rounded-lg object-cover border" />
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">{entry.TotalHours}</td>
                                                {/* <td className="px-4 py-3">{entry.MinHours}</td> */}
                                                <td className="px-4 py-3">{entry.OverTime}</td>
                                                <td className="px-4 py-3">{entry.DeficitHours}</td>
                                                <td
                                                    className={`px-4 py-3 font-semibold ${entry.AttendanceStatus == 1
                                                        ? "text-green-600"
                                                        : entry.AttendanceStatus == 0.5 ? "text-red-500" : entry.AttendanceStatus == 0 ? "" : ""
                                                        }`}
                                                >
                                                    {entry.AttendanceStatus == 1 ? "Present" : entry.AttendanceStatus == 0.5 ? "Half Day" : entry.AttendanceStatus == 0 ? "Absent" : ""}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
            }




        </div>
    );
};

export default CheckInOut;
