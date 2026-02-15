import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useApp } from "../TicketSystem/AppProvider";
import { useCheckInOut } from "./services";
import { toast } from "react-toastify";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import LoaderPage from "../NewBooking/LoaderPage";

// Validation 

const strictTimeRegex = /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i;

const schema = yup.object().shape({
    InTime: yup
        .string()
        .required("InTime is required")
        .matches(
            strictTimeRegex,
            "Enter valid time like 10:00 AM/PM"
        ),

    OutTime: yup
        .string()
        .nullable()
        .test(
            "valid-time-format",
            "Enter valid time like 11:00 AM/PM",
            (value) => {
                if (!value) return true;
                return strictTimeRegex.test(value.trim());
            }
        ),
    comment: yup
        .string()
        .required("Comment is required")
});

function AttendanceApprovalForm({ isOpen, setIsOpen, editableData, setEditableData, selectedMonth, MinHours, HalfDayHrs }) {

    const [modalType, setModalType] = useState("Check In");

    useEffect(() => {
        if (editableData?.InTime) {
            setModalType("Check Out");
        } else {
            setModalType("Check In");
        }
    }, [editableData]);



    const [filePreview, setFilePreview] = useState(null);
    const [imageBlob, setImageBlob] = useState(null);
    const { mutate: submitCheckInOut, isPending } = useCheckInOut(modalType)
    const { decryptedUser } = useApp()

    const {
        handleSubmit,
        setValue,
        register,
        formState: { errors },
        watch,
        reset,
        getValues
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            Date: "",
            EmployeeID: "",
            EmployeeName: "",
            InTime: "",
            OutTime: "",
            TotalHours: "",
            OverTime: "",
            DeficitHours: "",
            AttendanceStatus: "",
        },
    });


      const getChangeText = (oldVal, newVal, label) => {
    if ((oldVal || "") !== (newVal || "")) {
      return `${label} changed from ${oldVal || "N/A"} to ${newVal || "N/A"}`;
    }
    return null;
  };

    // --------------------------------------------
    //  Utility: Attendance Calculation Function
    // --------------------------------------------
    const calculateAttendance = (inTimeStr, outTimeStr, MinHours = 9, HalfDayHrs = 5) => {

        const parseTime = (timeStr) => {
            if (!timeStr.includes(" ")) {
                const [h, m, s = 0] = timeStr.split(":").map(Number);
                return h * 3600 + m * 60 + s;
            }

            const [time, modifierRaw] = timeStr.split(" ");
            const modifier = modifierRaw.trim().toUpperCase();

            const [hours, minutes, seconds = 0] = time.split(":").map(Number);
            let h = hours;

            if (modifier === "PM" && hours < 12) h += 12;
            if (modifier === "AM" && hours === 12) h = 0;

            return h * 3600 + minutes * 60 + seconds;
        };

        const inSec = parseTime(inTimeStr);
        const outSec = parseTime(outTimeStr);

        let diff = outSec - inSec;
        if (diff < 0) diff += 24 * 3600;

        const hours = Math.floor(diff / 3600);
        const minutes = Math.floor((diff % 3600) / 60);

        const toHM = (sec) => {
            const h = Math.floor(sec / 3600);
            const m = Math.floor((sec % 3600) / 60);
            return `${h}H ${m}M`;
        };

        const minSeconds = MinHours * 3600;
        const difference = diff - minSeconds;

        let overtime = "0H 0M";
        let deficit = "0H 0M";

        if (difference > 0) overtime = toHM(difference);
        if (difference < 0) deficit = toHM(Math.abs(difference));

        let status = 0;
        if (hours >= MinHours) status = 1;
        else if (hours >= HalfDayHrs) status = 0.5;

        return {
            totalHours: `${hours}H ${minutes}M`,
            overtime,
            deficit,
            status,
        };
    };


    const adjustOutTime = () => {
        const currentTime = getValues("OutTime") || editableData.OutTime;
        const input = document.getElementById("adjustValue").value;
        const minutes = parseInt(input, 10);

        if (!currentTime || isNaN(minutes)) return;

        const [time, rawModifier] = currentTime.split(" ");
        const mod = rawModifier.toLowerCase();
        let [hours, mins] = time.split(":").map(Number);

        if (mod === "pm" && hours !== 12) hours += 12;
        if (mod === "am" && hours === 12) hours = 0;

        const date = new Date(1970, 0, 1, hours, mins);
        date.setMinutes(date.getMinutes() + minutes);

        let newHours = date.getHours();
        let newMinutes = date.getMinutes();
        let newMod = newHours >= 12 ? "pm" : "am";
        newHours = newHours % 12 || 12;

        // --- Preserve exact user casing of AM/PM ---
        const matchCasing = (orig, now) => {
            let result = "";
            for (let i = 0; i < orig.length; i++) {
                result += orig[i] === orig[i].toUpperCase()
                    ? now[i].toUpperCase()
                    : now[i].toLowerCase();
            }
            return result;
        };

        newMod = matchCasing(rawModifier, newMod);

        const formatted =
            `${String(newHours).padStart(2, "0")}:` +
            `${String(newMinutes).padStart(2, "0")} ` +
            newMod;
        setValue("OutTime", formatted);
    };







  const formatLogDate = () => {
    return new Date().toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };








    
    // -----------------------------------------------------
    //  1️⃣ Set Initial Values When Popup Opens (editableData)
    // -----------------------------------------------------
    useEffect(() => {
        if (!editableData) return;

        setValue("Date", editableData?.Date || "");
        setValue("EmployeeID", editableData?.EmployeeID || "");
        setValue("EmployeeName", editableData?.EmployeeName || "");
        setValue("InTime", editableData?.InTime || "");
        setValue("viewcomment", editableData.comment);

        if (!editableData?.OutTime) return; // Only InTime received → Wait for OutTime

        // Auto calculate if OutTime is already available
        const { totalHours, overtime, deficit, status } = calculateAttendance(editableData.InTime, editableData.OutTime, MinHours, HalfDayHrs);

        setValue("OutTime", editableData.OutTime);
        setValue("TotalHours", totalHours);
        setValue("OverTime", overtime);
        setValue("DeficitHours", deficit);
        setValue("Status", status);
    }, [editableData, setValue]);

    // -------------------------------------------------------------------
    //  2️⃣ Auto Calculation When User Manually Changes OutTime in the Form
    // -------------------------------------------------------------------
    const inTime = watch("InTime");
    const outTime = watch("OutTime");

    useEffect(() => {
        if (!inTime || !outTime) return;

        const { totalHours, overtime, deficit, status } =
            calculateAttendance(inTime, outTime);

        setValue("TotalHours", totalHours);
        setValue("OverTime", overtime);
        setValue("DeficitHours", deficit);
        setValue("Status", status);
    }, [outTime, inTime, setValue]);


    if (!isOpen) return null;

    const onSubmit = (data) => {



 const hasAnyFieldChanged =
        editableData.OutTime !== data.OutTime ||
        editableData.Status !== data.Status?.value ||
        editableData.InTime !== data.InTime
        
   const changes = [];

      const phoneChange = getChangeText(
        editableData.OutTime,
        data?.OutTime?.trim(),
        "Out Time"
      );

      const whatsappChange = getChangeText(
        editableData.Status,
        data?.Status?.value,
        "Status"
      );

      const bookingStatusChange = getChangeText(
        editableData.InTime,
        data?.InTime?.trim(),
        "In Time"
      );

      if (phoneChange) changes.push(phoneChange);
      if (whatsappChange) changes.push(whatsappChange);
    //   if (visitedChange) changes.push(visitedChange);
      if (bookingStatusChange) changes.push(bookingStatusChange);

      /* ---------- 3️⃣ Block update if NOTHING changed ---------- */
      if (!hasAnyFieldChanged && !changes.length && !data?.comment?.trim()) {
        toast.warn("No changes to update");
        return;
      }

   /* ---------- 4️⃣ Prepare WorkLogs (ONLY when needed) ---------- */

const oldComments = editableData?.comment?.trim() || "";
let log = "";

/* Build new log only if something changed */
if (changes.length || data?.comment?.trim()) {
  const userComment = data?.comment?.trim() || "";

  const changeText = changes
    .map(c => c.trim())
    .join("\n");

  log = `[${formatLogDate()} - (${decryptedUser?.employee?.EmployeeID}) ${decryptedUser?.employee?.Name}]
${changeText}${userComment ? `\n${userComment}` : ""}`;
}

/* ---------- 🔥 FINAL COMMENT (NO DUPLICATES) ---------- */
let finalWorkLog = "";

/* Case 1: New log + old comments */
if (log && oldComments) {
  finalWorkLog = `${log}\n\n${oldComments}`;
}

/* Case 2: Only new log */
else if (log) {
  finalWorkLog = log;
}

/* Case 3: Only old comments (rare but safe) */
else {
  finalWorkLog = oldComments;
}


        const updatedData = {
            ...data,
            AttendanceStatus: data?.Status || editableData?.AttendanceStatus,
            selectedMonth: selectedMonth,
            comment: finalWorkLog,
            ApprovedBy: `${decryptedUser?.employee?.EmployeeID} - ${decryptedUser?.employee?.Name} - ${new Date().toString().split(" GMT")[0]
                }`,
        };

        const formData = new FormData();
        // Add all fields
        Object.keys(updatedData).forEach((key) => {
            formData.append(key, updatedData[key]);
        });

        // Send action so backend knows it's checkout
        formData.append(
            "action",
            editableData?.InTime ? "Check Out" : "Check In"
        );
        // Send name for Google Drive folder
        formData.append("Name", decryptedUser?.employee?.Name);
        // Upload OutSelfie
        if (imageBlob) {
            editableData?.InTime ?
                formData.append("OutSelfie", imageBlob)
                : formData.append("InSelfie", imageBlob);
        }

        submitCheckInOut(formData, {
            onSuccess: () => {
                toast.success("Approved Successfully!");
                setIsOpen(false);
                setModalType("")
                reset()
                setFilePreview(null);
                setImageBlob(null);
                setEditableData("")
            },
            onError: (response) => {
                toast.error(response?.response?.data?.error || "Failed to submit");
            },
        });
    };
    const handleCancel = () => {
        setIsOpen(false)
        setEditableData("")
        reset("")
        setFilePreview(null);
        setImageBlob(null);
    }


    //   const onSubmit = (data) => {
    //   const formData = new FormData();

    //   Object.keys(data).forEach((key) => {
    //     if (key !== "Attechment") {
    //       formData.append(key, data[key]);
    //     }
    //   });

    //   // Append file if exists
    //   if (fileObject) {
    //     formData.append("Attechment", fileObject);
    //   }

    //   // Add ApprovedBy
    //   const approvedBy = `${decryptedUser.id} - ${decryptedUser.name} - ${new Date()
    //     .toString()
    //     .split(" GMT")[0]}`;

    //   formData.append("ApprovedBy", approvedBy);


    //   // Now you can send `formData` via Axios / fetch (multipart/form-data)
    //   // axios.post("/api/attendance-approval", formData)
    // };


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-xl shadow-lg  max-w-4xl p-6">

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Attendance Approval</h2>
                </div>

                <form className="mt-4"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-2 overflow-auto gap-5">

                        {/* Date */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 relative after:content-['*'] after:ml-1 after:text-red-500">Date</label>
                            <input
                                disabled={editableData?.Date ? true : false}

                                className="w-full px-3 py-[8px] border border-orange-400 rounded-md focus:ring-2 focus:ring-orange-300 focus:outline-none"
                                {...register("Date")}
                            />
                        </div>

                        {/* Employee ID */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 relative after:content-['*'] after:ml-1 after:text-red-500">Employee ID</label>
                            <input
                                disabled={editableData?.EmployeeID ? true : false}
                                className="w-full px-3 py-[8px] border border-orange-400 rounded-md focus:ring-2 focus:ring-orange-300 focus:outline-none"
                                {...register("EmployeeID")}
                            />
                        </div>

                        {/* Employee Name */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 relative after:content-['*'] after:ml-1 after:text-red-500">Employee Name</label>
                            <input
                                disabled={editableData?.EmployeeName ? true : false}
                                className="w-full px-3 py-[8px] border border-orange-400 rounded-md focus:ring-2 focus:ring-orange-300 focus:outline-none"
                                {...register("EmployeeName")}
                            />
                        </div>

                        {/* In Time */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 relative after:content-['*'] after:ml-1 after:text-red-500">In Time</label>
                            <input
                                // disabled={editableData?.InTime ? true : false}
                                className="w-full px-3 py-[8px] border border-orange-400 rounded-md focus:ring-2 focus:ring-orange-300 focus:outline-none"
                                {...register("InTime")}
                            />
                            {errors.InTime && (
                                <p className="text-red-500 text-sm mt-1">{errors.InTime.message}</p>
                            )}
                        </div>

                        {/* Out Time */}
                        {modalType === "Check In" ? null :

                            <div>
                                <label className="text-sm font-medium text-gray-700 relative after:content-['*'] after:ml-1 after:text-red-500">Out Time</label>
                                <input
                                    // disabled={editableData?.OutTime ? true : false}
                                    className="w-full px-3 py-[8px] border border-orange-400 rounded-md focus:ring-2 focus:ring-orange-300 focus:outline-none "
                                    {...register("OutTime")}
                                />
                                {errors.OutTime && (
                                    <p className="text-red-500 text-sm mt-1">{errors.OutTime.message}</p>
                                )}
                            </div>
                        }
                        
                        {editableData?.OutTime && (
                            <div>
                                <div className="">
                                    <label className="text-sm font-medium text-gray-700">Adjust Minutes</label>

                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            id="adjustValue"
                                            className="w-full px-3 py-[8px] border border-orange-400 rounded-md focus:ring-2 focus:ring-orange-300 focus:outline-none" placeholder="Minutes"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => adjustOutTime()}
                                            className="px-3 py-1 bg-orange-500 text-white rounded"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Total Hours */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 relative after:content-['*'] after:ml-1 after:text-red-500">Total Hours</label>
                            <input
                                disabled
                                className="w-full px-3 py-[8px] border border-orange-400 rounded-md focus:ring-2 focus:ring-orange-300 focus:outline-none"
                                {...register("TotalHours")}
                            />
                        </div>

                        {/* Overtime */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 relative after:content-['*'] after:ml-1 after:text-red-500">OverTime</label>
                            <input
                                disabled
                                className="w-full px-3 py-[8px] border border-orange-400 rounded-md focus:ring-2 focus:ring-orange-300 focus:outline-none"
                                {...register("OverTime")}
                            />

                        </div>

                        {/* Deficit */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 relative after:content-['*'] after:ml-1 after:text-red-500">Deficit Hours</label>
                            <input
                                disabled
                                className="w-full px-3 py-[8px] border border-orange-400 rounded-md focus:ring-2 focus:ring-orange-300 focus:outline-none"
                                {...register("DeficitHours")}
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 relative after:content-['*'] after:ml-1 after:text-red-500">Status</label>
                            <input
                                disabled
                                className="w-full px-3 py-[8px] border border-orange-400 rounded-md focus:ring-2 focus:ring-orange-300 focus:outline-none"
                                value={
                                    watch("Status") === 1
                                        ? "Present"
                                        : watch("Status") === 0.5
                                            ? "Halfday"
                                            : "Absent"
                                }
                            />

                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700 relative after:ml-1 after:text-red-500">
                                {modalType === "Check In" ? "In Time Valid Attachment" : "Out Time Valid Attachment"}
                                {/* Attachment */}
                            </label>

                            <input
                                type="file"
                                accept="image/*"
                                className="w-full h-11 px-3 py-[8px] border border-orange-400 rounded-md focus:ring-2 focus:ring-orange-300 focus:outline-none"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        setImageBlob(file);                // the original file
                                        setFilePreview(URL.createObjectURL(file)); // preview
                                    }
                                }}
                            />

                            {filePreview && (
                                <div className="relative inline-block mt-2">
                                    <img
                                        src={filePreview}
                                        alt="Preview"
                                        className="h-20 w-20 object-cover rounded border"
                                    />

                                    {/* Remove button */}
                                    <button
                                        onClick={() => {
                                            setFilePreview(null);
                                            setImageBlob(null);
                                        }}
                                        className="absolute top-1 right-1 text-red-600 text-xs bg-white rounded-full px-2 shadow z-10"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="">
                            <label className="text-sm font-medium text-gray-700 relative after:content-['*'] after:ml-1 after:text-red-500">Comment</label>
                            <textarea
                                className="w-full h-11 px-3 py-[8px] border border-orange-400 rounded-md focus:ring-2 focus:ring-orange-300 focus:outline-none"
                                {...register("comment")}
                            />
                            {errors.comment && (
                                <p className="text-red-500 text-sm mt-1">{errors.comment.message}</p>
                            )}
                        </div>

                        {editableData.comment && (
                            <div className="md:col-span-3 col-span-2">
                                <label className="text-sm font-medium text-gray-700 relative after:content-[''] after:ml-1 after:text-red-500">View Comments</label>
                                <textarea
                                    disabled
                                    className="w-full border-none px-3 text-sm py-[8px] border border-orange-400 rounded-md focus:ring-2 focus:ring-orange-300 focus:outline-none"
                                    {...register("viewcomment")}
                                />
                                {/* {errors.comment && (
                   <p className="text-red-500 text-sm mt-1">{errors.comment.message}</p>
               )} */}
                            </div>
                        )}


                    </div>

                    <div className="mt-6 flex justify-center gap-4">
                        <button type="button" onClick={handleCancel}
                            className="px-4 py-2 bg-gray-300 rounded-md">Cancel</button>

                        <button type="submit"
                            className="px-4 py-2 bg-orange-500 text-white rounded-md">
                            {isPending ? <div className="flex justify-center items-center gap-2">
                                <LoaderPage />
                                Submiting...
                            </div> : "Submit"}
                        </button>
                    </div>
                </form>

            </div>

              
        </div>
    );
}

export default AttendanceApprovalForm;




