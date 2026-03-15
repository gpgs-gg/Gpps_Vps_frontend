// import React, { useMemo, useState } from "react";
// import Select from "react-select";
// import DatePicker from "react-datepicker";
// import { useForm, Controller } from "react-hook-form";
// import "react-datepicker/dist/react-datepicker.css";
// import { SelectStyles } from "../../Config";
// import LoaderPage from "../NewBooking/LoaderPage";
// import { usePropertyData } from "../NewBooking/services";
// import { useCreateNotice, useMainSheetData, useUpdateMainSheetData } from "./Services";
// import { addMonths, subDays, format } from "date-fns";
// import { toast } from "react-toastify";

// /* ================= SKELETON ================= */

// const TableSkeleton = ({ columns = 6, rows = 6 }) => {
//   return (
//     <>
//       {[...Array(rows)].map((_, i) => (
//         <tr key={i} className="animate-pulse">
//           <td className="p-2 border">
//             <div className="h-4 bg-gray-300 rounded"></div>
//           </td>

//           {[...Array(columns)].map((_, j) => (
//             <td key={j} className="p-2 border">
//               <div className="h-4 bg-gray-300 rounded"></div>
//             </td>
//           ))}
//         </tr>
//       ))}
//     </>
//   );
// };

// /* ================= MAIN ================= */

// const NoticeForm = ({ setActiveTab, editingClient }) => {
//     console.log("editingClient",editingClient)        


//   const MONTH_SHORT_NAMES = [
//     "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
//   ];

//   const getPreviousMonthFormatted = () => {
//     const date = new Date();
//     const month = MONTH_SHORT_NAMES[date.getMonth()];
//     const year = date.getFullYear();
//     return `${month}${year}`;
//   };

//   const {
//     handleSubmit,
//     control,
//     watch,
//     setValue,
//     reset,
//   } = useForm({
//     defaultValues: {
//       selectedMonth: getPreviousMonthFormatted(),
//       noticeReason: "",
//     }
//   });

//   const [search, setSearch] = useState("");
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [warning , setWarning] = useState("")


//   /* ================= PROPERTY ================= */

//   const { data: propertyList } = usePropertyData();

//   const propertyListOption =
//     propertyList?.data?.map((item) => ({
//       value: `${item["PG Main  Sheet ID"]}`,
//       label: item["Property Code"],
//     })) || [];

//   const propertyCode = watch("PropertyCode");
//   const selectedMonth = watch("selectedMonth") || "";

//   const sheetId = useMemo(() => {
//     return propertyCode?.value || "";
//   }, [propertyCode]);

//   const combinedParam = useMemo(() => {
//     if (!sheetId || !selectedMonth) return "";
//     return `${sheetId},${selectedMonth}`;
//   }, [sheetId, selectedMonth]);

//   // api Call here 
//   const { data: PropertyData, isLoading } = useMainSheetData(combinedParam);
//   const { mutate: CreateNotice, isPending: isCreateNotice } = useCreateNotice();
//   const { mutate: UpdateMainSheetData, isPending: isUpdateMainSheetData } = useUpdateMainSheetData(combinedParam);
//   // api Call here 

//   const tableData = useMemo(() => {
//     if (!PropertyData?.data) return [];
//     return PropertyData.data;
//   }, [PropertyData]);

//   const tableColumns = useMemo(() => {
//     if (!tableData.length) return [];
//     return Object.keys(tableData[0]);
//   }, [tableData]);

//   /* ================= SEARCH ================= */

//   const filteredData = useMemo(() => {
//     if (!search) return tableData;

//     return tableData.filter((row) =>
//       Object.values(row).some((val) =>
//         String(val).toLowerCase().includes(search.toLowerCase())
//       )
//     );
//   }, [tableData, search]);

//   /* ================= SELECTION ================= */

//   const handleRowSelect = (row) => {

//     /* ===== CHECK IN FULL TABLE DATA ===== */

//     const selectedName = (row.FullName || "")
//       .trim()
//       .toLowerCase();

//     const sameNameCount = tableData.filter(
//       (r) =>
//         (r.FullName || "").trim().toLowerCase() === selectedName
//     ).length;
//     // ✅ Warning if same name exists multiple times in sheet
//     if (sameNameCount > 1) {
//      setWarning(`${row.FullName} appears ${sameNameCount} times in this data. Please confirm correct client.`)
//     }

//     /* ===== NORMAL SELECTION ===== */

//     setSelectedRows((prev) => {
//       const exists = prev.includes(row);

//       return exists
//         ? prev.filter((item) => item !== row)
//         : [...prev, row];
//     });
//   };
//   const handleSelectAll = (checked) => {
//     setSelectedRows(checked ? filteredData : []);
//   };

//   /* ================= SUBMIT ================= */

//   const onSubmit = (formData) => {

//     const PayloadForNoticeSheet = {
//       NSD: formData.NSD
//         ? format(formData.NSD, "dd MMM yyyy")
//         : "",

//       NLD: formData.NLD
//         ? format(formData.NLD, "dd MMM yyyy")
//         : "",

//       CVD: formData.CVD
//         ? format(formData.CVD, "dd MMM yyyy")
//         : "",
//       BedAvailable: "Yes",
//       NoticeReason: formData.NoticeReason,
//       selectedRows,
//     };

//     const PayloadForMainsheet = {
//       NSD: formData.NSD
//         ? format(formData.NSD, "dd MMM yyyy")
//         : "",
//       NLD: formData.NLD
//         ? format(formData.NLD, "dd MMM yyyy")
//         : "",
//       CVD: formData.CVD
//         ? format(formData.CVD, "dd MMM yyyy")
//         : "",
//       BedAvailable: "Yes",
//       NoticeReason: formData.NoticeReason,
//       // ✅ only ClientID array send
//       ClientID: selectedRows.map(row => row.ClientID),
//     };


//    CreateNotice(PayloadForNoticeSheet, {
//   onSuccess: () => {
//     toast.success("Notice Created successfully!");

//     // 👉 second API after first success
//     UpdateMainSheetData(
//       {
//         sheetId,
//         data: PayloadForMainsheet,
//       },
//       {
//         onSuccess: () => {
//           toast.success("Main Sheet Updated successfully!");

//           // ✅ run once
//           reset();
//           setActiveTab("Tab2");
//         },
//         onError: (error) => {
//           toast.error(
//             error?.response?.data?.message ||
//               "Failed to update main sheet"
//           );
//         },
//       }
//     );
//   },

//   onError: (error) => {
//     toast.error(
//       error?.response?.data?.message ||
//         "Failed to create notice"
//     );
//   },
// });





//   };

//   /* ================= UI ================= */

//   return (
//     <div>

//       {/* FILTER SECTION */}

//       <div className="grid md:grid-cols-5 sm:grid-cols-2 grid-cols-1 gap-5 p-5">

//         {/* MONTH */}
//         <div>
//           <label className="text-sm font-medium text-gray-600">
//             Select Month
//           </label>

//           <Controller
//             name="selectedMonth"
//             control={control}
//             render={({ field }) => {

//               let selectedDate = null;

//               if (field.value) {
//                 const monthStr = field.value.slice(0, 3);
//                 const yearStr = field.value.slice(3);
//                 const monthIndex =
//                   MONTH_SHORT_NAMES.indexOf(monthStr);

//                 if (monthIndex !== -1) {
//                   selectedDate = new Date(
//                     Number(yearStr),
//                     monthIndex,
//                     1
//                   );
//                 }
//               }

//               return (
//                 <DatePicker
//                   selected={selectedDate}
//                   onChange={(date) => {
//                     if (!date) return field.onChange("");
//                     const month =
//                       MONTH_SHORT_NAMES[date.getMonth()];
//                     const year = date.getFullYear();
//                     field.onChange(`${month}${year}`);
//                   }}
//                   dateFormat="MMM yyyy"
//                   showMonthYearPicker
//                   isClearable
//                   placeholderText="Select month"
//                   wrapperClassName="w-full"
//                   className="border w-full px-3 py-2 border-orange-500 rounded-md outline-none"
//                 />
//               );
//             }}
//           />
//         </div>

//         {/* PROPERTY */}
//         <div>
//           <label className="text-sm text-gray-700">
//             Property Code
//           </label>

//           <Controller
//             name="PropertyCode"
//             control={control}
//             render={({ field }) => (
//               <Select
//                 {...field}
//                 placeholder="Select Property"
//                 isClearable
//                 styles={SelectStyles}
//                 options={propertyListOption}
//               />
//             )}
//           />
//         </div>

//         {/* SEARCH */}
//         <div className="flex flex-col justify-end">
//           <label className="text-sm text-gray-700">
//             Search
//           </label>

//           <input
//             type="text"
//             placeholder="Search"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="border border-orange-500 px-3 py-2 rounded-md w-full outline-none"
//           />
//         </div>

//       </div>

//       {/* TABLE */}

//       <div className="mt-4 px-5 rounded-md overflow-auto max-h-[250px]">
//         <h1 className="text-yellow-300 px-5  bg-black w-fit">
//           {warning}
//         </h1>
//         <table className="min-w-full border border-gray-300 text-sm">

//           <thead className="bg-black text-white sticky top-0">
//             <tr>

//               <th className="p-2 border">
//                 <input
//                   type="checkbox"
//                   onChange={(e) =>
//                     handleSelectAll(e.target.checked)
//                   }
//                 />
//               </th>

//               <th className="p-2 border">Month</th>

//               {tableColumns.map((col) => (
//                 <th key={col} className="p-2 border whitespace-nowrap">
//                   {col}
//                 </th>
//               ))}

//             </tr>
//           </thead>

//           <tbody>

//             {isLoading && (
//               <TableSkeleton
//                 columns={tableColumns.length + 1}
//                 rows={6}
//               />
//             )}

//             {!isLoading &&
//               filteredData.map((row, index) => {

//                 const isChecked =
//                   selectedRows.includes(row);

//                 return (
//                   <tr key={index} className="hover:bg-gray-50">

//                     <td className="p-2 border text-center">
//                       <input
//                         type="checkbox"
//                         checked={isChecked}
//                         onChange={() => handleRowSelect(row)}
//                       />
//                     </td>

//                     <td className="p-2 border text-center font-medium">
//                       {selectedMonth}
//                     </td>

//                     {tableColumns.map((col) => (
//                       <td key={col} className="p-2 border whitespace-nowrap">
//                         {row[col]}
//                       </td>
//                     ))}

//                   </tr>
//                 );
//               })}

//           </tbody>

//         </table>

//       </div>

//       {/* FORM */}

//       <form
//         className="mt-5 p-5"
//         onSubmit={handleSubmit(onSubmit)}
//       >

//         <div className="grid md:grid-cols-4 gap-5">

//           {/* START DATE */}
//           <div>
//             <label className="text-sm font-medium text-gray-700">
//               Notice Start Date
//             </label>

//             <Controller
//               name="NSD"
//               control={control}
//               render={({ field }) => (
//                 <DatePicker
//                   selected={field.value}
//                   onChange={(date) => {
//                     field.onChange(date);

//                     if (date) {
//                       const nextMonth = addMonths(date, 1);
//                       const lastDate = subDays(nextMonth, 1);

//                       setValue("NLD", lastDate);
//                       setValue("CVD", lastDate);
//                     }
//                   }}
//                   dateFormat="dd MMM yyyy"
//                   placeholderText="Select Start Date"
//                   wrapperClassName="w-full"
//                   className="border w-full px-3 py-2 border-orange-500 rounded-md outline-none"
//                 />
//               )}
//             />
//           </div>

//           {/* LAST DATE */}
//           <div>
//             <label className="text-sm font-medium text-gray-700">
//               Notice Last Date
//             </label>

//             <Controller
//               name="NLD"
//               control={control}
//               render={({ field }) => (
//                 <DatePicker
//                   selected={field.value}
//                   onChange={field.onChange}
//                   dateFormat="dd MMM yyyy"
//                   placeholderText="Select Last Date"
//                   wrapperClassName="w-full"
//                   className="border w-full px-3 py-2 border-orange-500 rounded-md outline-none"
//                 />
//               )}
//             />
//           </div>

//           {/* VACATING */}
//           <div>
//             <label className="text-sm font-medium text-gray-700">
//               Client Vacating Date
//             </label>

//             <Controller
//               name="CVD"
//               control={control}
//               render={({ field }) => (
//                 <DatePicker
//                   selected={field.value}
//                   onChange={field.onChange}
//                   dateFormat="d MMM yyyy"
//                   placeholderText="Select Vacating Date"
//                   wrapperClassName="w-full"
//                   className="border w-full px-3 py-2 border-orange-500 rounded-md outline-none"
//                 />
//               )}
//             />
//           </div>

//           {/* NOTICE REASON */}
//           <div>
//             <label className="text-sm font-medium text-gray-700">
//               Notice Reason (VIMP)
//             </label>

//             <Controller
//               name="NoticeReason"
//               control={control}
//               render={({ field }) => (
//                 <textarea
//                   {...field}
//                   className="border w-full px-3 py-2 border-orange-500 rounded-md outline-none resize-none"
//                 />
//               )}
//             />
//           </div>

//           {/* SUBMIT */}
//           <div className="flex items-end">
//             <button
//               type="submit"
//               className="bg-orange-500 text-white px-4 py-2 rounded-md w-full"
//             >
//               Submit Selected
//             </button>
//           </div>

//         </div>

//       </form>

//     </div>
//   );
// };

// export default NoticeForm;

import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { useForm, Controller } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css";
import { generateWorklog, SelectStyles } from "../../Config";
import { usePropertyData } from "../NewBooking/services";
import { useCreateNotice, useMainSheetData, useUpdateMainSheetData, useUpdateNoticeList } from "./Services";
import { addMonths, subDays, format, parse, isValid } from "date-fns";
import { toast } from "react-toastify";
import LoaderPage from "../NewBooking/LoaderPage";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useApp } from "../TicketSystem/AppProvider";
import { useDynamicDetails } from "../TicketSystem/Services";




/* ================= SKELETON ================= */
const TableSkeleton = ({ columns = 6, rows = 6 }) => {

  return (
    <>
      {[...Array(rows)].map((_, i) => (
        <tr key={i} className="animate-pulse">
          <td className="p-2 border">
            <div className="h-4 bg-gray-300 rounded"></div>
          </td>
          {[...Array(columns)].map((_, j) => (
            <td key={j} className="p-2 border">
              <div className="h-4 bg-gray-300 rounded"></div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

/* ================= MAIN ================= */
const schema = yup.object().shape({
  NoticeCancel: yup.boolean(),

  NoticeCancelReason: yup.string().when("NoticeCancel", {
    is: true, // ✅ jab checkbox checked ho
    then: (schema) =>
      schema.required("Notice Cancel Reason is required"),
    otherwise: (schema) =>
      schema.notRequired(),
  }),

  NSD: yup.date().nullable().required("Notice start date is required"),
  NLD: yup.date().nullable().required("Notice Last date is required"),
  CVD: yup.date().nullable().required("Client Vacate date is required"),

  NoticeReason: yup
    .string()
    .nullable()
    .required("Notice reason is required"),

  NoticeComment: yup.string().when("NoticeReason", {
    is: (reason) => reason === "Other Reason",
    then: (schema) =>
      schema.required("Notice Comment is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  // Name: yup.string().required("Full name is required"),
  // RentDate: yup.string().required("Rent Date is required"),
  // WhatsAppNo: yup.string().required("WhatsApp No is required"),
  // CallingNo: yup.string().required("Calling No is required"),
  // EmailID: yup.string().required("Email ID is required"),
  // DOJ: yup.string().required("DOJ is required"),
  // EmgyCont1FullName: yup.string().required("Emgy Cont1 FullName is required"),
  // EmgyCont1No: yup.string().required("Emgy Cont1 No is required"),
  // // Occupation: yup.string().required("Occupation is required"),
  // // Organization: yup.string().required("Organization is required"),
  // ParkingCharges: yup.string().required("Parking Charges is required"),
});

const NoticeForm = ({ setActiveTab, editingClient }) => {

  const MONTH_SHORT_NAMES = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const getPreviousMonthFormatted = () => {
    const date = new Date();
    const month = MONTH_SHORT_NAMES[date.getMonth()];
    const year = date.getFullYear();
    return `${month}${year}`;
  };
  const { decryptedUser } = useApp();

  // ✅ 2. useForm
  const {
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      selectedMonth: getPreviousMonthFormatted(),
      NoticeReason: null,
      NoticeCancel: false,
      NoticeCancelReason: "",
    },
  });

  // ✅ 3. watch after useForm
  const noticeCancel = watch("NoticeCancel");

  const [search, setSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [warning, setWarning] = useState("");
  const [showWarningPopup, setShowWarningPopup] = useState(false);
  useEffect(() => {
    if (warning && warning.trim() !== "") {
      setShowWarningPopup(true);
    }
  }, [warning]);
  /* ================= PROPERTY ================= */

  const { data: propertyList, isPending: isPropertyList } = usePropertyData();
  const { data: dynamicData } = useDynamicDetails();

  const buildOptions = (key) =>
    Array.from(
      new Set(dynamicData?.data?.map((item) => item[key]).filter(Boolean))
    ).map((value) => ({
      value: value.trim(),
      label: value.trim(),
    })) || [];

  const selectOptionNoticeReason = buildOptions("NoticeReason");



  const propertyListOption = useMemo(() =>
    propertyList?.data?.map((item) => ({
      value: `${item["PG Main  Sheet ID"]}`,
      label: item["Property Code"],
    })) || [],
    [propertyList]
  );

  const propertyCode = watch("PropertyCode");
  const selectedMonth = watch("selectedMonth") || "";

  const sheetId = useMemo(() => {
    return propertyCode?.value || "";
  }, [propertyCode]);

  const combinedParam = useMemo(() => {
    if (!sheetId || !selectedMonth) return "";
    return `${sheetId},${selectedMonth}`;
  }, [sheetId, selectedMonth]);



  // API calls
  const { data: PropertyData, isLoading } = useMainSheetData(combinedParam);
  const { mutate: CreateNotice, isPending: isCreateNotice } = useCreateNotice();
  const { mutate: UpdateMainSheetData, isPending: isUpdateMainSheetData } = useUpdateMainSheetData(combinedParam);
  const { mutate: UpdateNoticeEntry, isPending: isUpdateNotice } = useUpdateNoticeList();
  const tableData = useMemo(() => {
    if (!PropertyData?.data) return [];
    return PropertyData.data;
  }, [PropertyData]);

  const tableColumns = useMemo(() => {
    if (!tableData.length) return [];
    return Object.keys(tableData[0]);
  }, [tableData]);

  /* ================= SEARCH ================= */

  const filteredData = useMemo(() => {
    if (!search) return tableData;
    return tableData.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [tableData, search]);


  // ..............................................................................................................
  /* ================= PARSE DATE SAFELY (memoized) ================= */
  const parseDateSafely = useMemo(() => (dateStr) => {
    if (!dateStr) return null;
    const formats = ["dd MMM yyyy", "dd-MMM-yyyy", "dd/MMM/yyyy", "yyyy-MM-dd"];
    for (let fmt of formats) {
      try {
        const d = parse(dateStr, fmt, new Date());
        if (isValid(d)) return d;
      } catch (e) { }
    }
    return null;
  }, []);

  const populatedClientIdRef = useRef(null);

  /* ================= EDITING CLIENT EFFECT ================= */
  useEffect(() => {

    /* ================= RESET ================= */
    if (!editingClient) {
      populatedClientIdRef.current = null;
      setSelectedRows([]);
      reset({
        selectedMonth: getPreviousMonthFormatted(),
        NoticeReason: null,
      });
      return;
    }

    // wait until options loaded
    if (!propertyListOption?.length) return;
    // stop only if already FULLY populated
    if (editingClient.ClientID === populatedClientIdRef.current) return;
    /* -------- Dates -------- */
    ["NSD", "NLD", "CVD"].forEach((field) => {
      if (editingClient[field]) {
        const d = parseDateSafely(editingClient[field]);
        if (d) setValue(field, d);
      }
    });
    if (editingClient.NoticeReason) {
      setValue("NoticeReason", editingClient.NoticeReason);
    }
    /* ================= PROPERTY SELECT FIX ================= */
    let propertyMatched = false;
    if (editingClient.PropCode) {
      const matchedOption = propertyListOption.find(
        (opt) =>
          opt.label?.trim().toLowerCase() ===
          editingClient.PropCode?.trim().toLowerCase()
      );

      if (matchedOption) {
        setValue("PropertyCode", matchedOption);
        propertyMatched = true;
      }
    }
    /* -------- Month -------- */
    if (editingClient.NSD) {
      const d = parseDateSafely(editingClient.NSD);
      if (d && isValid(d)) {
        const month = MONTH_SHORT_NAMES[d.getMonth()];
        setValue("selectedMonth", `${month}${d.getFullYear()}`);
      }
    } else if (editingClient.Month) {
      setValue("selectedMonth", editingClient.Month);
    }

    /* ✅ MARK POPULATED ONLY AFTER SUCCESS */
    if (propertyMatched) {
      populatedClientIdRef.current = editingClient.ClientID;
    }

  }, [
    editingClient,
    propertyListOption,
    setValue,
    reset,
    parseDateSafely,
  ]);
  /* ================= FIND CLIENT IN CURRENT DATA ================= */
  useEffect(() => {
    if (editingClient && tableData.length > 0) {
      const foundClient = tableData.find(row => row.ClientID === editingClient.ClientID);
      if (foundClient) {
        // Only update if the found client is not already selected
        setSelectedRows(prev => {
          if (prev.length === 1 && prev[0]?.ClientID === foundClient.ClientID) {
            return prev; // already selected
          }
          return [foundClient];
        });
        setWarning("");
      } else {
        setSelectedRows([]);
        setWarning("⚠The client you are editing is not found in the current property/month data. Please adjust property/month or cancel edit.");
      }
    }
  }, [tableData, editingClient]);

  // ..............................................................................................................



  /* ================= SELECTION HANDLERS (useCallback) ================= */

  const handleRowSelect = useCallback((row) => {
    if (editingClient) {
      if (row.ClientID === editingClient.ClientID) {
        toast.info("Editing mode: selection cannot be changed.");
      }
      return;
    }

    const selectedName = (row.FullName || "").trim().toLowerCase();
    const sameNameCount = tableData.filter(
      (r) => (r.FullName || "").trim().toLowerCase() === selectedName
    ).length;
    if (sameNameCount > 1) {
      setWarning(`${row.FullName} appears ${sameNameCount} times. Please confirm correct client.`);
    }

    setSelectedRows((prev) => {
      const exists = prev.includes(row);
      return exists ? prev.filter((item) => item !== row) : [...prev, row];
    });
  }, [editingClient, tableData]);

  const handleSelectAll = useCallback((checked) => {
    if (editingClient) {
      toast.info("Editing mode: select all is disabled.");
      return;
    }
    setSelectedRows(checked ? filteredData : []);
  }, [editingClient, filteredData]);

  /* ================= SUBMIT (useCallback) ================= */

  // const onSubmit = useCallback((formData) => {
  //   const PayloadForMainsheet = {
  //     NSD: formData.NSD ? format(formData.NSD, "dd MMM yyyy") : "",
  //     NLD: formData.NLD ? format(formData.NLD, "dd MMM yyyy") : "",
  //     CVD: formData.CVD ? format(formData.CVD, "dd MMM yyyy") : "",
  //     BedAvailable: "Yes",
  //     NoticeReason: formData.NoticeReason,
  //     ClientID: editingClient
  //       ? [editingClient.ClientID]
  //       : selectedRows.map(row => row.ClientID),
  //   };

  //   if (editingClient) {
  //     if (selectedRows.length === 0) {
  //       toast.error("Cannot update: client not found in current data.");
  //       return;
  //     }
  //     UpdateMainSheetData(
  //       { sheetId, data: PayloadForMainsheet },
  //       {
  //         onSuccess: () => {
  //           toast.success("Notice updated successfully!");
  //           reset();
  //           setActiveTab("Tab2");
  //         },
  //         onError: (error) => {
  //           toast.error(error?.response?.data?.message || "Failed to update notice");
  //         },
  //       }
  //     );
  //   } else {
  //     if (selectedRows.length === 0) {
  //       toast.error("Please select at least one client.");
  //       return;
  //     }
  //     const PayloadForNoticeSheet = {
  //       ...PayloadForMainsheet,
  //       selectedRows,
  //     };
  //     CreateNotice(PayloadForNoticeSheet, {
  //       onSuccess: () => {
  //         toast.success("Notice Created successfully!");
  //         UpdateMainSheetData(
  //           { sheetId, data: PayloadForMainsheet },
  //           {
  //             onSuccess: () => {
  //               toast.success("Main Sheet Updated successfully!");
  //               reset();
  //               setActiveTab("Tab2");
  //             },
  //             onError: (error) => {
  //               toast.error(error?.response?.data?.message || "Failed to update main sheet");
  //             },
  //           }
  //         );
  //       },
  //       onError: (error) => {
  //         toast.error(error?.response?.data?.message || "Failed to create notice");
  //       },
  //     });
  //   }
  // }, [editingClient, selectedRows, sheetId, UpdateMainSheetData, CreateNotice, reset, setActiveTab]);
  const onSubmit = useCallback((formData) => {
    // 2️⃣ Show warning popup if NoticeCancel checked
    // if (formData.NoticeCancel) {
    //   setShowWarningPopup(true);
    //    setWarning("The client you are editing is not found in the current property/month data. Please adjust property/month or cancel edit.");
    // }
    const formattedData = {
      NSD: formData.NoticeCancel ? "" : formData.NSD ? format(formData.NSD, "dd MMM yyyy") : "",
      NLD: formData.NoticeCancel ? "" : formData.NLD ? format(formData.NLD, "dd MMM yyyy") : "",
      CVD: formData.NoticeCancel ? "" : formData.CVD ? format(formData.CVD, "dd MMM yyyy") : "",
      BedAvailable: formData.NoticeCancel ? "No" : "Yes",
      NoticeStatus: formData.NoticeCancel ? "Cancelled" : "Received",
      NoticeReason: formData.NoticeReason?.value,
      ClientID: editingClient
        ? [editingClient.ClientID]
        : selectedRows.map((row) => row.ClientID),
      FNFStatus: editingClient ? editingClient.FNFStatus : "Open",
    };


    // ✅ Generate new log
    const newWorkLog = generateWorklog(
      editingClient || {},
      formattedData,
      decryptedUser?.employee?.Name,
      decryptedUser?.employee?.EmployeeID
    );

    // ✅ Preserve old + append new (STRING FORMAT)
    formattedData.WorkLogs = [
      editingClient?.WorkLogs || "",
      newWorkLog
    ]
      .filter(Boolean)
      .join("\n\n");   // IMPORTANT



    /* ================= UPDATE MODE ================= */
    if (editingClient) {
      if (selectedRows.length === 0) {
        toast.error("No row selected for update");
        return;
      }
      const updatePayload = {
        ...formattedData,
        TicketNo: editingClient.TicketNo,
        selectedRows,
      };
      UpdateNoticeEntry(updatePayload, {
        onSuccess: () => {
          toast.success("Notice updated successfully!");

          // ✅ Update Main Sheet AFTER notice update
          UpdateMainSheetData(
            { sheetId, data: formattedData },
            {
              onSuccess: () => {
                toast.success("Main Sheet Updated successfully!");

                reset();
                setActiveTab("Tab2");
              },
              onError: (error) => {
                toast.error(
                  error?.response?.data?.message ||
                  "Failed to update main sheet"
                );
              },
            }
          );
        },
        onError: (error) => {
          toast.error(
            error?.response?.data?.message ||
            "Failed to update notice"
          );
        },
      });

      return;
    }
    /* ================= CREATE MODE ================= */
    if (selectedRows.length === 0) {
      toast.error("Please select at least one client.");
      return;
    }
    const createPayload = {
      ...formattedData,
      selectedRows,
    };

    CreateNotice(createPayload, {
      onSuccess: () => {
        toast.success("Notice Created successfully!");

        UpdateMainSheetData(
          { sheetId, data: formattedData },
          {
            onSuccess: () => {
              toast.success("Main Sheet Updated successfully!");
              reset();
              setActiveTab("Tab2");
            },
          }
        );
      },
      onError: (error) => {
        toast.error(
          error?.response?.data?.message || "Failed to create notice"
        );
      },
    });

  }, [
    editingClient,
    selectedRows,
    sheetId,
    UpdateMainSheetData,
    CreateNotice,
    reset,
    setActiveTab
  ]);


  /* ================= UI ================= */

  return (
    <div>
      {/* FILTER SECTION */}
      <div className="grid md:grid-cols-5 sm:grid-cols-2 grid-cols-1 gap-5 p-5">
        {/* MONTH */}
        <div>
          <label className="text-sm font-medium text-gray-600">Select Month</label>
          <Controller
            name="selectedMonth"
            control={control}
            render={({ field }) => {
              let selectedDate = null;
              if (field.value) {
                const monthStr = field.value.slice(0, 3);
                const yearStr = field.value.slice(3);
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
                    field.onChange(`${month}${year}`);
                  }}
                  dateFormat="MMM yyyy"
                  showMonthYearPicker
                  isClearable
                  placeholderText="Select month"
                  wrapperClassName="w-full"
                  className="border w-full px-3 py-2 border-orange-500 rounded-md outline-none"
                />
              );
            }}
          />
        </div>

        {/* PROPERTY */}
        <div>
          <label className="text-sm text-gray-700">Property Code</label>

          {isPropertyList ? (
            /* ---------- LOADER ---------- */
            <div className="h-[38px] flex items-center px-3 border rounded-md bg-gray-50">
              <span className="text-sm text-gray-500 flex justify-center items-center gap-2 animate-pulse">
                <LoaderPage /> Loading properties...
              </span>
            </div>
          ) : (
            /* ---------- SELECT ---------- */
            <Controller
              name="PropertyCode"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Select Property"
                  isClearable
                  styles={SelectStyles}
                  options={propertyListOption}
                />
              )}
            />
          )}
        </div>

        {/* SEARCH */}
        <div className="flex flex-col justify-end">
          <label className="text-sm text-gray-700">Search</label>
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-orange-500 px-3 py-2 rounded-md w-full outline-none"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="mt-4 px-5 rounded-md overflow-auto max-h-[250px]">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-black text-white sticky top-0">
            <tr>
              <th className="p-2 border">
                <input
                  type="checkbox"
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  disabled={!!editingClient}
                  checked={editingClient ? selectedRows.length > 0 : false}
                />
              </th>
              <th className="p-2 border">Month</th>
              {tableColumns.map((col) => (
                <th key={col} className="p-2 border whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading && <TableSkeleton columns={tableColumns.length + 1} rows={6} />}
            {!isLoading &&
              filteredData.map((row, index) => {
                const isEditingThisRow = editingClient && row.ClientID === editingClient.ClientID;
                const isChecked = selectedRows.includes(row) || isEditingThisRow;
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-2 border text-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleRowSelect(row)}
                        disabled={!!editingClient && !isEditingThisRow}
                      />
                    </td>
                    <td className="p-2 border text-center font-medium">{selectedMonth}</td>
                    {tableColumns.map((col) => (
                      <td key={col} className="p-2 border whitespace-nowrap">
                        {row[col]}
                      </td>
                    ))}
                  </tr>
                );
              })}
          </tbody>
        </table>
        {showWarningPopup && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => setShowWarningPopup(false)}
          >
            <div
              className="bg-white rounded-lg shadow-lg p-6 w-[400px]"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold text-red-600 mb-3">
                ⚠ Warning
              </h2>

              <p className="text-gray-700">{warning}</p>

              <div className="flex justify-end mt-5">
                <button
                  onClick={() => setShowWarningPopup(false)}
                  className="px-4 py-2 bg-black text-white rounded"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FORM */}
      <form className="mt-5 p-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid md:grid-cols-4 gap-5">
          {/* START DATE */}
          <div>
            <label className="text-sm text-gray-700 after:content-['*'] after:ml-1 after:text-red-500">
              Notice Start Date
            </label>

            <Controller
              name="NSD"
              control={control}
              render={({ field }) => (
                <DatePicker
                  selected={field.value ? new Date(field.value) : null}
                  onChange={(date) => {
                    field.onChange(date);

                    if (date) {
                      const nextMonth = addMonths(date, 1);
                      const lastDate = subDays(nextMonth, 1);

                      setValue("NLD", lastDate, {
                        shouldValidate: true,
                        shouldDirty: true
                      });

                      setValue("CVD", lastDate, {
                        shouldValidate: true,
                        shouldDirty: true
                      });
                    }
                  }}
                  dateFormat="dd MMM yyyy"
                  placeholderText="Select Start Date"
                  wrapperClassName="w-full"
                  className="border w-full px-3 py-2 border-orange-500 rounded-md outline-none"
                />
              )}
            />

            {errors.NSD && (
              <p className="text-red-500 text-sm">{errors.NSD.message}</p>
            )}
          </div>

          {/* LAST DATE */}
          <div>
            <label className="text-sm text-gray-700 after:content-['*'] after:ml-1 after:text-red-500">Notice Last Date</label>
            <Controller
              name="NLD"
              control={control}
              render={({ field }) => (
                <DatePicker
                  selected={field.value ? new Date(field.value) : null}
                  onChange={(date) => field.onChange(date)}
                  dateFormat="d MMM yyyy"
                  placeholderText="Select Last Date"
                  wrapperClassName="w-full"
                  className="border w-full px-3 py-2 border-orange-500 rounded-md outline-none"
                />
              )}
            />
            {errors.NLD && <p className="text-red-500 text-sm">{errors.NLD.message}</p>}
          </div>



          {/* VACATING DATE */}
          <div>
            <label className="text-sm text-gray-700 after:content-['*'] after:ml-1 after:text-red-500">Client Vacating Date</label>
            <Controller
              name="CVD"
              control={control}
              render={({ field }) => (
                <DatePicker
                  selected={field.value ? new Date(field.value) : null}
                  onChange={field.onChange}
                  dateFormat="d MMM yyyy"
                  placeholderText="Select Vacating Date"
                  wrapperClassName="w-full"
                  className="border w-full px-3 py-2 border-orange-500 rounded-md outline-none"
                />
              )}
            />
            {errors.CVD && <p className="text-red-500 text-sm">{errors.CVD.message}</p>}
          </div>

          <div>
            <label className="text-sm text-gray-700 after:content-['*'] after:ml-1 after:text-red-500">
              Notice Reason
            </label>

            <Controller
              name="NoticeReason"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="Select Notice Reason"
                  options={selectOptionNoticeReason}
                  isClearable
                  styles={SelectStyles}

                  // string → object (display)
                  value={
                    selectOptionNoticeReason.find(
                      (opt) => opt.value === field.value
                    ) || null
                  }

                  // object → string (store)
                  onChange={(option) => field.onChange(option?.value || "")}
                />
              )}
            />

            {errors.NoticeReason && (
              <p className="text-red-500 text-sm">
                {errors.NoticeReason.message}
              </p>
            )}
          </div>

          {/* NOTICE REASON */}
          <div>
            <label className="text-sm font-medium text-gray-700">Notice Comment</label>
            <Controller
              name="NoticeComment"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  className="border w-full px-3 py-2 border-orange-500 rounded-md outline-none resize-none"
                />
              )}
            />
            {errors.NoticeComment && <p className="text-red-500 text-sm">{errors.NoticeComment.message}</p>}
          </div>
          {/* ✅ NOTICE CANCEL CHECKBOX */}
    {noticeCancel && (
              <div className="">
                <label className="text-sm font-medium text-gray-700">
                  Reason For Notice Cancellation
                </label>

                <Controller
                  name="NoticeCancelReason"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <textarea
                      {...field}
                      placeholder="Enter cancellation reason..."
                      className="border w-full px-3 py-2 border-orange-500 rounded-md outline-none resize-none"
                    />
                  )}
                />
                {errors.NoticeCancelReason && <p className="text-red-500 text-sm">{errors.NoticeCancelReason.message}</p>}

              </div>
            )}
          <div className="flex items-center  gap-3">
            {/* ✅ SHOW ONLY WHEN CANCEL IS TRUE */}
        

            {/* CANCEL NOTICE CHECKBOX */}
            {editingClient && (
              <div className="mt-4">
                <Controller
                  name="NoticeCancel"
                  control={control}
                  defaultValue={false}
                  render={({ field }) => (
                    <label className="flex items-center justify-between border border-red-200 bg-red-50 rounded-lg px-4 py-3 cursor-pointer hover:bg-red-100 transition">
                
            {/* Toggle Switch */}
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={field.value || false}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                        <div
                          className={`w-11 h-6 flex items-center rounded-full p-1 transition ${field.value ? "bg-red-600" : "bg-gray-300"  }`}
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${field.value ? "translate-x-5" : ""
                              }`}
                          />
                        </div>
                      </div>


                      {/* Left Content */}
                      <div className="px-5">
                        <p className="text-sm font-semibold text-red-700">
                          Cancel Notice
                        </p>
                        {/* <p className="text-xs text-red-500">
                          This will cancel the active notice for this client
                        </p> */}
                      </div>

                   
                    </label>
                  )}
                />
              </div>
            )}


          </div>


        </div>
        {/* SUBMIT BUTTON */}
        <div className="flex w-fit items-end">
          <button
            type="submit"
            className="bg-orange-500 text-white px-4 py-2 rounded-md w-full flex items-center gap-2 justify-center"
            disabled={
              isCreateNotice ||
              isUpdateNotice ||
              isUpdateMainSheetData ||
              (editingClient && selectedRows.length === 0)
            }
          >
            {isCreateNotice || isUpdateNotice || isUpdateMainSheetData ? (
              <>
                <LoaderPage />
                {editingClient ? "Updating Notice..." : "Creating Notice..."}
              </>
            ) : (
              editingClient ? "Update Notice" : "Create Notice"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoticeForm;