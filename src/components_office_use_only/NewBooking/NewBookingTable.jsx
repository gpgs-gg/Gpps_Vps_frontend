// import React, { useEffect, useRef, useState } from "react";
// import Select from "react-select";
// import DatePicker from "react-datepicker";
// import { format, parse } from "date-fns";
// import "react-datepicker/dist/react-datepicker.css";
// import {
//   useDynamicDetails,
// } from "../TicketSystem/Services/index";
// import { useUpdateClientMasterTable, useUpdateNewBookingTable } from "./services";
// import { SelectStyles } from "../../Config";
// import { useUpdateClientCreation } from "../ClientCreation/services";
// import { toast } from "react-toastify";
// import { FullTableSkeleton, TableSkeleton } from "./Skeleton";
// import { Link } from "react-router-dom";

// function NewBookingTable({ activeTab, setActiveTab, setEditingClient, NewBookingSheetData, isNewBookingPending }) {
//   const { data: dynamicData } = useDynamicDetails();
//   // const { data: NewBookingSheetData } = useNewBookingData();
//   const { mutate: updateNewBooking, isPending: isUpdatingBooking } = useUpdateNewBookingTable();
//   const { mutate: updateClientMasterTable, isPending } = useUpdateClientMasterTable();

//   // ========== FILTER STATES ==========
//   const [searchInput, setSearchInput] = useState("");
//   const [dateRange, setDateRange] = useState({ from: null, to: null });
//   const [isDefaultMode, setIsDefaultMode] = useState(true);
//   const [selectedImage, setSelectedImage] = useState(null);


//   const [currentPage, setCurrentPage] = useState(() => {
//     const saved = localStorage.getItem("currentPage");
//     const parsed = Number(saved);
//     return !isNaN(parsed) && parsed > 0 ? parsed : 1;
//   });
//   const [rows, setRows] = useState([]);
//   const [editedRows, setEditedRows] = useState([]);
//   const [editingCell, setEditingCell] = useState(null);
//   const PerPage = 20;
//   //   const [selectedLeadNos, setSelectedLeadNos] = useState([]);
//   const [hasChanges, setHasChanges] = useState(false);
//   const [savingRow, setSavingRow] = useState(null);

//   const menuOpenRef = useRef(false);

//   /* ================= LOAD DATA ================= */
//   useEffect(() => {
//     if (NewBookingSheetData?.data) {
//       setRows(NewBookingSheetData?.data);
//       setEditedRows(NewBookingSheetData?.data); // clone for editing
//     }
//   }, [NewBookingSheetData]);

//   // ========== FILTERING LOGIC ==========
//   const filteredBySearchAndDate = editedRows.filter((row) => {
//     // ✅ Search filter (all columns)
//     if (searchInput.trim() !== "") {
//       const search = searchInput.toLowerCase();

//       const rowString = Object.values(row)
//         .join(" ")
//         .toLowerCase();

//       if (!rowString.includes(search)) return false;
//     }
//     // Date range filter (using the "Date" field)
//     if (dateRange.from || dateRange.to) {
//       const rowDateStr = row.Date;
//       if (!rowDateStr) return false; // no date -> exclude from range filter

//       const rowDate = parse(rowDateStr, "d MMM yyyy", new Date());
//       if (isNaN(rowDate)) return false; // invalid date -> exclude

//       if (dateRange.from) {
//         const from = new Date(dateRange.from);
//         from.setHours(0, 0, 0, 0);
//         if (rowDate < from) return false;
//       }
//       if (dateRange.to) {
//         const to = new Date(dateRange.to);
//         to.setHours(23, 59, 59, 999);
//         if (rowDate > to) return false;
//       }
//     }
//     return true;
//   });

//   // Apply active tab filter
//   const normalize = (val) =>
//     (val ?? "").toString().trim().toLowerCase();

//   const filteredRows =
//     activeTab === "Tab3"
//       ? filteredBySearchAndDate.filter((ele) => {
//         const bookingStatus = normalize(ele.BookingStatus);
//         // const clientMaster = normalize(ele.AddedToClientMaster);
//         const Status = normalize(ele.Status);
//         return bookingStatus === "booked" && Status?.toLowerCase()?.trim() !== "closed";
//       })
//       : filteredBySearchAndDate;

//   // Reset to page 1 when filters change
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchInput, dateRange, activeTab]);

//   const totalPages = Math.ceil(filteredRows.length / PerPage);
//   const paginatedRows = filteredRows.slice(
//     (currentPage - 1) * PerPage,
//     currentPage * PerPage
//   );

//   /* ================= HANDLE EDIT ================= */
//   const handleCellEdit = (rowIndex, field, value) => {
//     setEditedRows((prev) => {
//       const updated = [...prev];
//       updated[rowIndex] = { ...updated[rowIndex], [field]: value };
//       return updated;
//     });
//     setHasChanges(true);
//   };

//   /* ================= OPTIONS ================= */
//   const getOptions = (field) => {
//     if (!dynamicData?.data) return [];

//     const unique = (key) =>
//       Array.from(
//         new Set(dynamicData.data.map((i) => i[key]).filter(Boolean))
//       ).map((v) => ({ label: v, value: v }));

//     switch (field) {
//       case "Gender":
//         return unique("Gender");
//       case "Reason":
//         return unique("Reason");
//       case "LeadStatus":
//         return unique("LeadStatus");
//       case "FieldMember":
//         return unique("FieldMember");
//       default:
//         return [];
//     }
//   };

//   /* ================= EDITABLE CELL ================= */
//   // const EditableCell = ({ rowIndex, field }) => {
//   //   const isEditing =
//   //     editingCell?.rowIndex === rowIndex &&
//   //     editingCell?.field === field;

//   //   const value = editedRows[rowIndex]?.[field] || "";

//   //   const fieldOrder = [
//   //     "EmployeeName",
//   //     "ClientFullName",
//   //     "WhatsAppNo",
//   //     "CallingNo",
//   //     "EmgyCont1FullName",
//   //     "EmgyCont1No",
//   //     "EmgyCont2FullName",
//   //     "EmgyCont2No",
//   //     "TempPropCode",
//   //     "TempRoomNo",
//   //     "TempBedNo",
//   //     "TempACRoom",
//   //     "TempBedDOJ",
//   //     "TempBedLDt",
//   //     "TempBedRentAmtt",
//   //     "TempBedRentComnt",
//   //     "TempBedMonthlyFixRent",
//   //     "PermPropCode",
//   //     "PermBedNo"
//   //   ];

//   //   const selectFields = [
//   //     "PermPropCode",
//   //   ];

//   //   if (!isEditing) {
//   //     return (
//   //       <td
//   //         className="cursor-pointer px-5"
//   //         onDoubleClick={() => setEditingCell({ rowIndex, field })}
//   //       >
//   //         {value || "-"}
//   //       </td>
//   //     );
//   //   }

//   //   const getNextCell = (rowIndex, field, direction = "right") => {
//   //     const colIndex = fieldOrder.indexOf(field);
//   //     let newRow = rowIndex;
//   //     let newCol = colIndex;

//   //     if (direction === "right") {
//   //       newCol++;
//   //       if (newCol >= fieldOrder.length) {
//   //         newCol = 0;
//   //         newRow++;
//   //       }
//   //     } else if (direction === "left") {
//   //       newCol--;
//   //       if (newCol < 0) {
//   //         newCol = fieldOrder.length - 1;
//   //         newRow--;
//   //       }
//   //     } else if (direction === "down") newRow++;
//   //     else if (direction === "up") newRow--;

//   //     if (newRow < 0) newRow = 0;
//   //     if (newRow >= editedRows.length) newRow = editedRows.length - 1;

//   //     return { rowIndex: newRow, field: fieldOrder[newCol] };
//   //   };

//   //   /* ===== SELECT FIELD ===== */
//   //   if (selectFields.includes(field)) {
//   //     const options = getOptions(field);

//   //     return (
//   //       <td className="border relative text-center whitespace-nowrap">
//   //         <Select
//   //           autoFocus
//   //           isClearable
//   //           value={options.find(o => o.value === value) || null}
//   //           options={options}
//   //           styles={SelectStyles}
//   //           menuShouldScrollIntoView
//   //           backspaceRemovesValue={false}
//   //           menuPlacement="bottom"
//   //           menuPosition="fixed"
//   //           menuPortalTarget={document.body}
//   //           onMenuOpen={() => {
//   //             menuOpenRef.current = true;
//   //           }}
//   //           onMenuClose={() => {
//   //             menuOpenRef.current = false;
//   //           }}
//   //           onKeyDown={(e) => {
//   //             if (menuOpenRef.current) return;

//   //             let next;
//   //             switch (e.key) {
//   //               case "Tab":
//   //                 e.preventDefault();
//   //                 setEditingCell(
//   //                   getNextCell(rowIndex, field, e.shiftKey ? "left" : "right")
//   //                 );
//   //                 break;

//   //               case "ArrowRight":
//   //                 e.preventDefault();
//   //                 setEditingCell(getNextCell(rowIndex, field, "right"));
//   //                 break;

//   //               case "ArrowLeft":
//   //                 e.preventDefault();
//   //                 setEditingCell(getNextCell(rowIndex, field, "left"));
//   //                 break;

//   //               case "ArrowDown":
//   //                 e.preventDefault();
//   //                 setEditingCell(getNextCell(rowIndex, field, "down"));
//   //                 break;

//   //               case "ArrowUp":
//   //                 e.preventDefault();
//   //                 setEditingCell(getNextCell(rowIndex, field, "up"));
//   //                 break;

//   //               case "Escape":
//   //                 setEditingCell(null);
//   //                 break;
//   //             }
//   //           }}
//   //           onChange={(selected) => {
//   //             handleCellEdit(rowIndex, field, selected?.value || "");
//   //           }}
//   //         />
//   //       </td>
//   //     );
//   //   }

//   //   /* ===== DATE FIELD ===== */
//   //   // if (field === "FollowupDate") {
//   //   //   return (
//   //   //     <td className="border text-center ">
//   //   //       <DatePicker
//   //   //         selected={value ? new Date(value) : null}
//   //   //         dateFormat="d MMM yyyy"
//   //   //         className="w-full text-center bg-transparent outline-none"
//   //   //         onChange={(date) => {
//   //   //           const formatted = date
//   //   //             ? format(date, "d MMM yyyy")
//   //   //             : "";
//   //   //           handleCellEdit(rowIndex, field, formatted);
//   //   //           setEditingCell(null);
//   //   //         }}
//   //   //         onBlur={() => setEditingCell(null)}
//   //   //       />
//   //   //     </td>
//   //   //   );
//   //   // }

//   //   /* ===== INPUT FIELD ===== */
//   //   return (
//   //     <td className="border relative ">
//   //       <div className="absolute inset-0 flex items-center justify-center z-10">
//   //         <input
//   //           autoFocus
//   //           defaultValue={value}
//   //           className="h-full w-full bg-transparent border-2 text-center focus:outline-none"
//   //           onBlur={(e) => {
//   //             handleCellEdit(rowIndex, field, e.target.value);
//   //             setEditingCell(null);
//   //           }}
//   //           onKeyDown={(e) => {
//   //             let next;

//   //             switch (e.key) {
//   //               case "Enter":
//   //                 e.preventDefault();
//   //                 next = getNextCell(rowIndex, field, e.shiftKey ? "down" : "right");
//   //                 handleCellEdit(rowIndex, field, e.target.value);
//   //                 setEditingCell(next);
//   //                 break;

//   //               case "Tab":
//   //                 e.preventDefault();
//   //                 next = getNextCell(rowIndex, field, e.shiftKey ? "left" : "right");
//   //                 handleCellEdit(rowIndex, field, e.target.value);
//   //                 setEditingCell(next);
//   //                 break;

//   //               case "ArrowRight":
//   //                 e.preventDefault();
//   //                 next = getNextCell(rowIndex, field, "right");
//   //                 handleCellEdit(rowIndex, field, e.target.value);
//   //                 setEditingCell(next);
//   //                 break;

//   //               case "ArrowLeft":
//   //                 e.preventDefault();
//   //                 next = getNextCell(rowIndex, field, "left");
//   //                 handleCellEdit(rowIndex, field, e.target.value);
//   //                 setEditingCell(next);
//   //                 break;

//   //               case "ArrowDown":
//   //                 e.preventDefault();
//   //                 next = getNextCell(rowIndex, field, "down");
//   //                 handleCellEdit(rowIndex, field, e.target.value);
//   //                 setEditingCell(next);
//   //                 break;

//   //               case "ArrowUp":
//   //                 e.preventDefault();
//   //                 next = getNextCell(rowIndex, field, "up");
//   //                 handleCellEdit(rowIndex, field, e.target.value);
//   //                 setEditingCell(next);
//   //                 break;

//   //               case "Escape":
//   //                 setEditingCell(null);
//   //                 break;
//   //             }
//   //           }}
//   //         />
//   //       </div>
//   //     </td>
//   //   );
//   // };

//   const handleSave = (client, rowIndex) => {
//     setSavingRow(rowIndex);

//     const payload = {
//       Role: "client",
//       IsActive: "Yes",
//       PropertyCode: client.PermPropCode,
//       Name: client.ClientFullName,
//       WhatsAppNo: client.WhatsAppNo,
//       CallingNo: client.CallingNo,
//       EmgyCont1FullName: client.EmgyCont1FullName,
//       EmgyCont1No: client.EmgyCont1No,
//       EmgyCont2FullName: client.EmgyCont2FullName,
//       EmgyCont2No: client.EmgyCont2No,
//       EmailID: client.EmailId,
//       LoginID: client.EmailId,
//       BedNo: client.PermBedNo,
//       DOJ: client.PermBedDOJ,
//       TemporaryPropCode: client.TempPropCode,
//       // TempRoomNo: client.TempRoomNo,
//       // TempBedNo: client.TempBedNo,
//       // TempACRoom: client.TempACRoom,
//       // TempBedDOJ: client.TempBedDOJ,
//       // TempBedLDt: client.TempBedLDt,
//       // TempBedRentAmtt: client.TempBedRentAmtt,
//       // TempBedRentComnt: client.TempBedRentComnt,
//       // TempBedMonthlyFixRent: client.TempBedMonthlyFixRent,
//       // PermRoomNo: client.PermRoomNo,
//       // PermACRoom: client.PermACRoom,
//       // PermBedMonthlyFixRent: client.PermBedMonthlyFixRent,
//       // PermBedDepositAmt: client.PermBedDepositAmt,
//       // PermBedLDt: client.PermBedLDt,
//       // PermBedRentAmt: client.PermBedRentAmt,
//       // PermBedRentComnt: client.PermBedRentComnt,
//       // ProcessingFeesAmt: client.ProcessingFeesAmt,
//       // UpcomingRentHikeDt: client.UpcomingRentHikeDt,
//       // UpcomingRentHikeAmt: client.UpcomingRentHikeAmt,
//       // AskForBAOrFA: client.AskForBAOrFA,
//       // BookingAmt: client.BookingAmt,
//       // TotalAmt: client.TotalAmt,
//       // BalanceAmt: client.BalanceAmt,
//       // AmtReceived: client.AmtReceived,
//       // TempPGShtUpdated: client.TempPGShtUpdated,
//       // MainPGSheetUpdated: client.MainPGSheetUpdated,
//       // WorkLogs: client.WorkLogs,
//       // AddToWhatsAppGrp: client.AddToWhatsAppGrp,
//       // Status: client.Status,
//       // UpdatedBy: client.UpdatedBy,
//       // UpdatedDt: client.UpdatedDt,
//       // ReviewedBy: client.ReviewedBy,
//       // ReviewedDate: client.ReviewedDate,
//       // Comments: client.Comments
//     }

//     const NewBookingPayload = {
//       NewBookingId: client.NewBookingId,
//       AddedToClientMaster: "Yes",
//     }

//     updateClientMasterTable(payload, {
//       onSuccess: () => {
//         // toast.success(response?.message || "Client moved successfully!");
//         // setSavingRow(null);
//         updateNewBooking(NewBookingPayload, {
//           onSuccess: (response) => {
//             toast.success("Client moved successfully!");
//             setSavingRow(null);
//           },
//         })
//       },
//       onError: (error) => {
//         toast.error(
//           error?.response?.data?.error ||
//           error?.response?.data?.message ||
//           "Failed to move client. Please try again.",
//         );
//         setSavingRow(null);
//       },
//     });
//   }

//   const handleEdit = (Client) => {
//     setEditingClient(Client);
//     setActiveTab("Tab4");
//   }

//   useEffect(() => {
//     localStorage.setItem("currentPage", currentPage);
//   }, [currentPage]);

//   const goToPrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
//   const goToNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));


//   const [showMsgPopup, setShowMsgPopup] = useState(false);
//   const [selectedClient, setSelectedClient] = useState(null);
//   const [whatsAppMsg, setWhatsAppMsg] = useState("");

//   const generateWhatsappMessage = (c) => {

//     const hasTemp = c.TempPropCode?.trim();
//     const hasPerm = c.PermPropCode?.trim();

//     const permRentExists = Number(c.PermBedRentAmt) > 0;

//     const joinDate = c.PermBedDOJ || c.TempBedDOJ;

//     const isValidHike =
//       c.UpcomingRentHikeDt &&
//       joinDate &&
//       new Date(c.UpcomingRentHikeDt) > new Date(joinDate);

//     let message = `Payment Details For ${c.ClientFullName} (Contact No: ${c.WhatsAppNo})\n\n`;

//     /* ================= TEMP ================= */
//     if (hasTemp) {
//       message +=
//         `Temporary PG Facility Code: ${c.TempPropCode}
// Room No.: ${c.TempRoomNo || "NA"}
// Bed No.: ${c.TempBedNo || "NA"}
// AC Room: ${c.TempACRoom || "NA"}
// Start Date: ${c.TempBedDOJ || "NA"}
// Last Date: ${c.TempBedLDt || "NA"}
// Temporary Bed Rent Amount: ₹${c.TempBedRentAmt || 0}
// (This rent is from ${c.TempBedDOJ || "NA"} to ${c.TempBedLDt || "NA"}, monthly fixed rent is ₹${c.TempBedMonthlyFixRent || 0})

// `;
//     }

//     /* ================= PERMANENT ================= */
//     if (hasPerm) {
//       message +=
//         `Permanent PG Facility Code: ${c.PermPropCode}
// Room No.: ${c.PermRoomNo || "NA"}
// Bed No.: ${c.PermBedNo || "NA"}
// AC Room: ${c.PermACRoom || "NA"}
// Start Date: ${c.PermBedDOJ || "NA"}
// Last Date: ${c.PermBedLDt || "NA"}
// Permanent Bed Rent Amount: ₹${c.PermBedRentAmt || 0}
// (This rent is from ${c.PermBedDOJ || "NA"} to ${c.PermBedLDt || "NA"}, monthly fixed rent is ₹${c.PermBedMonthlyFixRent || c.PermBedRentAmt || 0})
// Permanent Bed Deposit Amount: ₹${c.PermBedDepositAmt || 0}
// `;
//     }

//     /* ================= COMMON ================= */
//     const rentNote = permRentExists
//       ? "( Please Note: Permanent Bed Rent is included )"
//       : "( Please Note: Rent amount is NOT included )";
//     message +=
//       `Processing Fees: ₹${c.ProcessingFeesAmt || 0}
// Total Amount to be paid: ₹${c.TotalAmt || 0} ${rentNote}

// 📌 The booking is confirmed only after full amount ₹${c.TotalAmt || 0} is received by us.
// 📌 Payment is not refundable if you cancel the booking for any reason. Please read the
//      agreement file sent to your WhatsApp and contact us if you have any concerns.

// `;

//     /* ================= RENT HIKE ================= */

//     if (isValidHike) {
//       message +=
//         `📌 Upcoming Rent Hike Details — Date: ${c.UpcomingRentHikeDt} | Amount: ₹${c.UpcomingRentHikeAmt || 0}

// `;
//     }

//     /* ================= FOOTER (FIXED) ================= */

//     message +=
//       `Gopal's Paying Guest Services
// (Customer Care No: 8928191814 | Service Hours: 10AM to 7PM)
// Note: This is a system-generated message and does not require a signature.`;

//     /* ===== FINAL CLEAN (VERY IMPORTANT) ===== */

//     return message
//       .replace(/\u200B/g, "") // remove zero-width chars
//       .replace(/\r/g, "")
//       .normalize("NFC")
//       .trim();
//   };

//   const handleMsgRegenerate = (client) => {
//     setEditingClient(client);
//     setActiveTab("Tab5");
//   };

//   const sendToWhatsapp = () => {
//     if (!selectedClient?.WhatsAppNo) return;

//     const phone = selectedClient.WhatsAppNo.replace(/\D/g, "");
//     const encodedMsg = encodeURIComponent(whatsAppMsg);

//     window.open(
//       `https://api.whatsapp.com/send?phone=91${phone}&text=${encodedMsg}`,
//       "_blank"
//     );

//     setShowMsgPopup(false);
//   };

//   if (isNewBookingPending) {
//     return (
//       <TableSkeleton />
//     );
//   }
//   /* ================= RENDER ================= */
//   return (
//     <div className="max-w-full mx-auto p-2 max-h-[600px] bg-gray-50 shadow-md">
//       {/* Search & Date Range Controls */}
//       <div className="flex justify-between items-center gap-5 mb-2">

//         <div className="flex justify-center items-center gap-5">
//           <div className="flex items-center gap-2 bg-white border border-orange-400 px-3 py-1 rounded-md z-30 shadow">
//             <input
//               type="text"
//               value={searchInput}
//               placeholder="Search"
//               onChange={(e) => setSearchInput(e.target.value)}
//               isClearable={true}
//               className="w-full text-center outline-none text-sm"
//             />
//           </div>

//           <div className="flex items-center gap-2 bg-white border border-orange-400 px-3 py-1 rounded-md z-30 shadow">
//             <span className="text-sm text-orange-600 font-medium">From</span>
//             <DatePicker
//               selected={dateRange.from}
//               onChange={(date) => {
//                 setDateRange((p) => ({ ...p, from: date }));
//                 setIsDefaultMode(false);
//               }}
//               selectsStart
//               startDate={dateRange.from}
//               endDate={dateRange.to}
//               dateFormat="dd MMM yyyy"
//               isClearable
//               placeholderText="Enter Date"
//               className="w-28 text-center outline-none text-sm"
//             />

//             <span className="text-sm text-orange-600 font-medium">To</span>

//             <DatePicker
//               selected={dateRange.to}
//               onChange={(date) => {
//                 setDateRange((p) => ({ ...p, to: date }));
//                 setIsDefaultMode(false);
//               }}
//               selectsEnd
//               startDate={dateRange.from}
//               endDate={dateRange.to}
//               minDate={dateRange.from}
//               isClearable
//               dateFormat="dd MMM yyyy"
//               placeholderText="Enter Date"
//               className="w-28 text-center outline-none text-sm"
//             />
//           </div>

//         </div>
//         <Link to={"/gpgs-actions/client-list"} className="border bg-black text-white p-1 px-2 rounded-md mr-5">
//           <i class="fa-solid fa-arrow-right"></i> Client List
//         </Link>
//       </div>

//       <div className="overflow-y-auto max-h-[480px] bg-white shadow">
//         <table className="min-w-full border border-blue-500">
//           <thead className="bg-black text-center text-white sticky top-0 z-20 whitespace-nowrap">
//             <tr>
//               <th className="p-4 sticky left-[0px] z-20 bg-black border text-white">Booking Id</th>
//               <th className="p-4 sticky left-[60px] z-20 bg-black border text-white">Client Full Name</th>
//               <th className="px-4 border">Date</th>
//               <th className="px-4 border">WhatsApp No</th>
//               <th className="px-4 border">Calling No</th>
//               <th className="px-4 border">Attachments</th>
//               <th className="px-4 border">EmgyCont1 Full Name</th>
//               <th className="px-4 border">EmgyCont1 No</th>
//               <th className="px-4 border">EmgyCont2 Full Name</th>
//               <th className="px-4 border">EmgyCont2 No</th>
//               <th className="px-4 border">TempProp Code</th>
//               <th className="px-4 border">Temp Room No</th>
//               <th className="px-4 border">Temp Bed No</th>
//               <th className="px-4 border">Temp AC Room</th>
//               <th className="px-4 border">Temp Bed DOJ</th>
//               <th className="px-4 border">Temp Bed LDt</th>
//               <th className="px-4 border">Temp Bed Rent Amt</th>
//               <th className="px-4 border">Temp Bed Rent Comnt</th>
//               <th className="px-4 border">Temp Bed Monthly Fix Rent</th>
//               <th className="px-4 border">Perm Prop Code</th>
//               <th className="px-4 border">Perm Bed No</th>
//               <th className="px-4 border">Perm Room No</th>
//               <th className="px-4 border">Perm AC Room</th>
//               <th className="px-4 border">Perm Bed Monthly Fix Rent</th>
//               <th className="px-4 border">Perm Bed Deposit Amt</th>
//               <th className="px-4 border">Perm Bed DOJ</th>
//               <th className="px-4 border">Perm Bed LDt</th>
//               <th className="px-4 border">Perm Bed Rent Amt</th>
//               <th className="px-4 border">Perm Bed Rent Comnt</th>
//               <th className="px-4 border">Processing Fees Amt</th>
//               <th className="px-4 border">Upcoming Rent Hike Dt</th>
//               <th className="px-4 border">Upcoming Rent Hike Amt</th>
//               <th className="px-4 border">Ask For BA Or FA</th>
//               <th className="px-4 border">Booking Amt</th>
//               <th className="px-4 border">Total Amt</th>
//               <th className="px-4 border">Balance Amt</th>
//               <th className="px-4 border">Email Id</th>
//               <th className="px-4 border">Booking Status</th>
//               <th className="px-4 border">Temp PGSht Updated</th>
//               <th className="px-4 border">Main PG Sheet Updated</th>
//               <th className="px-4 border">Worklogs</th>
//               <th className="px-4 border">Add To WhatsApp Grp</th>
//               <th className="px-4 border">Status</th>
//               {/* <th className="px-4 border">Updated By</th>
//               <th className="px-4 border">Updated Dt</th>
//               <th className="px-4 border">Reviewed By</th>
//               <th className="px-4 border">Reviewed Date</th>
//               <th className="px-4 border">Comments</th> */}
//               <th className="px-4 border">ID</th>
//               <th className="px-4 border">Sales Team Member</th>
//               <th className="px-7 sticky right-0 bg-black text-white border z-50">Action</th>
//               {/* <th className="px-4">WorkLogs</th> */}
//             </tr>
//           </thead>

//           <tbody className="py-5">
//             {paginatedRows.map((client, index) => {
//               const actualIndex = (currentPage - 1) * PerPage + index;
//               const displayIndex = actualIndex + 1;

//               return (
//                 <tr key={actualIndex} className="text-center border ">
//                   <td className="sticky left-[0px] bg-gray-100 z-10">
//                     {client.NewBookingId || displayIndex}
//                   </td>

//                   <td className="sticky left-[60px] bg-gray-100 z-10">
//                     {client.ClientFullName}
//                   </td>

//                   <td className="whitespace-nowrap">{client.Date}</td>

//                   <td>{client.WhatsAppNo}</td>
//                   <td>{client.CallingNo}</td>
//                   <div className="flex gap-2 mt-1 max-h-48 overflow-auto">
//                     {client.Attachments ? (
//                       client.Attachments.split(",").map((url, idx) => {
//                         const trimmedUrl = url.trim();
//                         const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(trimmedUrl);
//                         const isVideo = /\.(mp4|webm|avi|mov|mkv)$/i.test(trimmedUrl);

//                         if (!isImage && !isVideo) return null;

//                         return (
//                           <button
//                             key={idx}
//                             type="button"
//                             className="w-10 h-10 border rounded-md overflow-hidden bg-gray-100 hover:ring-2 hover:ring-blue-400 relative cursor-pointer"
//                             title={trimmedUrl}
//                             onClick={() => {
//                               if (isImage) {
//                                 setSelectedImage(trimmedUrl);
//                               } else if (isVideo) {
//                                 // setVideoModalUrl(trimmedUrl);
//                               }
//                             }}
//                           >
//                             {isImage ? (
//                               <img
//                                 src={trimmedUrl}
//                                 alt={`Attachment ${idx + 1}`}
//                                 loading="lazy"
//                                 className="w-full h-full object-cover"
//                               />
//                             ) : (
//                               <video
//                                 src={trimmedUrl}
//                                 className="w-full h-full object-cover"
//                                 muted
//                                 playsInline
//                               />
//                             )}
//                           </button>
//                         );
//                       })
//                     ) : (
//                       <p className="text-sm text-gray-500">No Attachments</p>
//                     )}
//                   </div>
//                   <td>{client.EmgyCont1FullName}</td>
//                   <td>{client.EmgyCont1No}</td>
//                   <td>{client.EmgyCont2FullName}</td>
//                   <td>{client.EmgyCont2No}</td>
//                   <td>{client.TempPropCode}</td>
//                   <td>{client.TempRoomNo}</td>
//                   <td>{client.TempBedNo}</td>
//                   <td>{client.TempACRoom}</td>
//                   <td>{client.TempBedDOJ}</td>
//                   <td>{client.TempBedLDt}</td>
//                   <td>{client.TempBedRentAmtt}</td>
//                   <td>{client.TempBedRentComnt}</td>
//                   <td>{client.TempBedMonthlyFixRent}</td>
//                   <td>{client.PermPropCode}</td>
//                   <td>{client.PermBedNo}</td>
//                   <td>{client.PermRoomNo}</td>
//                   <td>{client.PermACRoom}</td>
//                   <td>{client.PermBedMonthlyFixRent}</td>
//                   <td>{client.PermBedDepositAmt}</td>
//                   <td>{client.PermBedDOJ}</td>
//                   <td>{client.PermBedLDt}</td>
//                   <td>{client.PermBedRentAmt}</td>
//                   <td>{client.PermBedRentComnt}</td>
//                   <td>{client.ProcessingFeesAmt}</td>
//                   <td>{client.UpcomingRentHikeDt}</td>
//                   <td>{client.UpcomingRentHikeAmt}</td>
//                   <td>{client.AskForBAOrFA}</td>
//                   <td>{client.BookingAmt}</td>
//                   <td>{client.TotalAmt}</td>
//                   <td>{client.BalanceAmt}</td>
//                   <td>{client.EmailId}</td>
//                   <td>{client.BookingStatus}</td>
//                   <td>{client.TempPGShtUpdated}</td>
//                   <td>{client.MainPGSheetUpdated}</td>
//                   {/* WorkLogs Hover */}
//                   <td className="relative px-2 group">
//                     {/* ===== Preview (Latest log only) ===== */}
//                     <div className="text-xs text-gray-700 cursor-pointer whitespace-pre-wrap break-words">
//                       {client.WorkLogs
//                         ? client.WorkLogs
//                           .split("\n")               // split logs
//                           .filter(Boolean)[0]        // TOP (latest log)
//                           ?.substring(0, 28)         // preview length
//                         : "No WorkLogs"}
//                     </div>

//                     {/* ===== Full WorkLogs on Hover ===== */}
//                     {client.WorkLogs && (
//                       <div className="absolute z-50 hidden text-start group-hover:block bg-white border p-5 rounded-lg shadow-xl w-[480px] max-h-[250px] overflow-y-auto cursor-pointer right-12 whitespace-pre-wrap break-words text-sm">
//                         {client.WorkLogs
//                           .split(/\n(?=\[)/) // split before every [
//                           .map((log, index) => {
//                             const lines = log.split("\n").filter(Boolean);
//                             if (!lines.length) return null;

//                             const meta = lines[0]; // [date - user]
//                             const message = lines.slice(1).join("\n").trim(); // actual comment

//                             if (!message || message === "undefined") return null;

//                             return (
//                               <div key={index} className="mb-2">
//                                 <div className="text-gray-500 text-xs">{meta}</div>
//                                 <div className="font-semibold text-gray-800">
//                                   {message}
//                                 </div>
//                               </div>
//                             );
//                           })}
//                       </div>
//                     )}
//                   </td>

//                   <td>{client.AddToWhatsAppGrp}</td>
//                   <td>{client.Status}</td>
//                   <td>{client.ID}</td>
//                   <td>{client.EmployeeName}</td>

//                   {/* Action Buttons */}
//                   <td className="flex justify-center items-center gap-5 px-10 sticky right-0 h-20 bg-gray-100">
//                     {activeTab !== "Tab3" && (
//                       <>
//                         <button
//                           className="text-orange-500 text-lg rounded transition"
//                           onClick={() => handleEdit(client, client.NewBookingId)}
//                         >
//                           <i className="fa-solid fa-eye"></i>
//                         </button>

//                         <button
//                           className="text-orange-500 text-lg rounded transition"
//                           onClick={() => handleEdit(client, client.NewBookingId)}
//                         >
//                           <i className="fa-solid fa-pen-to-square"></i>
//                         </button>
//                         <button
//                           className="text-orange-500 text-lg rounded transition"
//                           onClick={() => handleMsgRegenerate(client)}
//                         >
//                           <i
//                             className="fa fa-paper-plane"
//                             style={{ transform: "scaleX(-1)" }}
//                           ></i>
//                         </button>
//                       </>
//                     )}

//                     {activeTab === "Tab3" && (
//                       <button
//                         className={`${client?.AddedToClientMaster?.toLowerCase()?.trim() === "yes" ? "bg-green-500": "bg-orange-500" } text-white px-3 py-1 rounded 
//                         ${client?.AddedToClientMaster?.toLowerCase()?.trim() === "yes" ? " hover:bg-green-600": " hover:bg-orange-600" }
                        
//                         transition disabled:opacity-60`}
//                         onClick={() => handleSave(client, actualIndex)}
//                         disabled={savingRow === actualIndex}
//                       >
//                         {
//                           savingRow === actualIndex
//                             ? "Moving..."
//                             : client?.AddedToClientMaster?.toLowerCase()?.trim() === "yes"
//                               ? "Moved"
//                               : "Move"
//                         }           </button>
//                     )}
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-center items-center gap-6 mt-3">
//         <span className="text-sm text-gray-700">
//           Page {currentPage} of {totalPages}
//         </span>
//         <button
//           disabled={currentPage === 1}
//           onClick={goToPrevious}
//           className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
//         >
//           <i className="fa-solid fa-arrow-left"></i> Previous
//         </button>
//         <button
//           disabled={currentPage === totalPages}
//           onClick={goToNext}
//           className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
//         >
//           Next <i className="fa-solid fa-arrow-right"></i>
//         </button>
//       </div>
//       {/* Image Modal */}
//       {selectedImage && (
//         <div
//           onClick={() => setSelectedImage(null)}
//           className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] cursor-pointer h-screen"
//         >
//           <img
//             src={selectedImage}
//             alt="Full View"
//             className="max-w-[90vw] max-h-[90vh] rounded shadow-lg"
//           />
//         </div>
//       )}
//       {showMsgPopup && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

//           <div className="bg-white w-[800px] rounded-lg shadow-lg p-5">

//             <h2 className="text-lg text-gray-500 font-semibold mb-3">
//               Preview WhatsApp Message
//             </h2>

//             <textarea
//               value={whatsAppMsg}
//               disabled
//               onChange={(e) => setWhatsAppMsg(e.target.value)}
//               className="w-full h-96 border outline-none  rounded p-3 text-sm"
//             />

//             <div className="flex justify-end gap-3 mt-4">

//               <button
//                 onClick={() => setShowMsgPopup(false)}
//                 className="px-4 py-2 bg-gray-300 rounded"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={sendToWhatsapp}
//                 className="px-4 py-2 bg-green-500 text-white rounded"
//               >
//                 <i class="fa-brands fa-whatsapp"></i> Send
//               </button>

//             </div>

//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default NewBookingTable;

import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { format, parse } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { useDynamicDetails } from "../TicketSystem/Services/index";
import {
  useUpdateClientMasterTable,
  useUpdateNewBookingTable,
} from "./services";
import { SelectStyles } from "../../Config";
import { useUpdateClientCreation } from "../ClientCreation/services";
import { toast } from "react-toastify";
import { FullTableSkeleton, TableSkeleton } from "./Skeleton";
import { Link } from "react-router-dom";

function NewBookingTable({
  activeTab,
  setActiveTab,
  setEditingClient,
  NewBookingSheetData,
  isNewBookingPending,
}) {
  const { data: dynamicData } = useDynamicDetails();
  const { mutate: updateNewBooking, isPending: isUpdatingBooking } =
    useUpdateNewBookingTable();
  const { mutate: updateClientMasterTable, isPending } =
    useUpdateClientMasterTable();

  // ========== FILTER STATES ==========
  const [searchInput, setSearchInput] = useState("");
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [isDefaultMode, setIsDefaultMode] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const [currentPage, setCurrentPage] = useState(() => {
    const saved = localStorage.getItem("currentPage");
    const parsed = Number(saved);
    return !isNaN(parsed) && parsed > 0 ? parsed : 1;
  });
  const [rows, setRows] = useState([]);
  const [editedRows, setEditedRows] = useState([]);
  const [editingCell, setEditingCell] = useState(null);
  const PerPage = 20;
  const [hasChanges, setHasChanges] = useState(false);
  const [savingRow, setSavingRow] = useState(null);

  const menuOpenRef = useRef(false);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (NewBookingSheetData?.data) {
      setRows(NewBookingSheetData?.data);
      setEditedRows(NewBookingSheetData?.data);
    }
  }, [NewBookingSheetData]);

  // ========== FILTERING LOGIC ==========
  const filteredBySearchAndDate = editedRows.filter((row) => {
    if (searchInput.trim() !== "") {
      const search = searchInput.toLowerCase();
      const rowString = Object.values(row).join(" ").toLowerCase();
      if (!rowString.includes(search)) return false;
    }
    if (dateRange.from || dateRange.to) {
      const rowDateStr = row.Date;
      if (!rowDateStr) return false;
      const rowDate = parse(rowDateStr, "d MMM yyyy", new Date());
      if (isNaN(rowDate)) return false;
      if (dateRange.from) {
        const from = new Date(dateRange.from);
        from.setHours(0, 0, 0, 0);
        if (rowDate < from) return false;
      }
      if (dateRange.to) {
        const to = new Date(dateRange.to);
        to.setHours(23, 59, 59, 999);
        if (rowDate > to) return false;
      }
    }
    return true;
  });

  const normalize = (val) => (val ?? "").toString().trim().toLowerCase();

  const filteredRows =
    activeTab === "Tab3"
      ? filteredBySearchAndDate.filter((ele) => {
          const bookingStatus = normalize(ele.BookingStatus);
          const Status = normalize(ele.Status);
          return bookingStatus === "booked" && Status !== "closed";
        })
      : filteredBySearchAndDate;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchInput, dateRange, activeTab]);

  const totalPages = Math.ceil(filteredRows.length / PerPage);
  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * PerPage,
    currentPage * PerPage
  );

  /* ================= HANDLE EDIT ================= */
  const handleCellEdit = (rowIndex, field, value) => {
    setEditedRows((prev) => {
      const updated = [...prev];
      updated[rowIndex] = { ...updated[rowIndex], [field]: value };
      return updated;
    });
    setHasChanges(true);
  };

  /* ================= OPTIONS ================= */
  const getOptions = (field) => {
    if (!dynamicData?.data) return [];
    const unique = (key) =>
      Array.from(
        new Set(dynamicData.data.map((i) => i[key]).filter(Boolean))
      ).map((v) => ({ label: v, value: v }));
    switch (field) {
      case "Gender":
        return unique("Gender");
      case "Reason":
        return unique("Reason");
      case "LeadStatus":
        return unique("LeadStatus");
      case "FieldMember":
        return unique("FieldMember");
      default:
        return [];
    }
  };

  const handleSave = (client, rowIndex) => {
    setSavingRow(rowIndex);

    const payload = {
      Role: "client",
      IsActive: "Yes",
      PropertyCode: client.PermPropCode,
      Name: client.ClientFullName,
      WhatsAppNo: client.WhatsAppNo,
      CallingNo: client.CallingNo,
      EmgyCont1FullName: client.EmgyCont1FullName,
      EmgyCont1No: client.EmgyCont1No,
      EmgyCont2FullName: client.EmgyCont2FullName,
      EmgyCont2No: client.EmgyCont2No,
      EmailID: client.EmailId,
      LoginID: client.EmailId,
      BedNo: client.PermBedNo,
      DOJ: client.PermBedDOJ,
      TemporaryPropCode: client.TempPropCode,
    };

    const NewBookingPayload = {
      NewBookingId: client.NewBookingId,
      AddedToClientMaster: "Yes",
    };

    updateClientMasterTable(payload, {
      onSuccess: () => {
        updateNewBooking(NewBookingPayload, {
          onSuccess: (response) => {
            toast.success("Client moved successfully!");
            setSavingRow(null);
          },
        });
      },
      onError: (error) => {
        toast.error(
          error?.response?.data?.error ||
            error?.response?.data?.message ||
            "Failed to move client. Please try again."
        );
        setSavingRow(null);
      },
    });
  };

  const handleEdit = (Client) => {
    setEditingClient(Client);
    setActiveTab("Tab4");
  };

  useEffect(() => {
    localStorage.setItem("currentPage", currentPage);
  }, [currentPage]);

  const goToPrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const [showMsgPopup, setShowMsgPopup] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [whatsAppMsg, setWhatsAppMsg] = useState("");

  const generateWhatsappMessage = (c) => {
    const hasTemp = c.TempPropCode?.trim();
    const hasPerm = c.PermPropCode?.trim();
    const permRentExists = Number(c.PermBedRentAmt) > 0;
    const joinDate = c.PermBedDOJ || c.TempBedDOJ;
    const isValidHike =
      c.UpcomingRentHikeDt &&
      joinDate &&
      new Date(c.UpcomingRentHikeDt) > new Date(joinDate);

    let message = `Payment Details For ${c.ClientFullName} (Contact No: ${c.WhatsAppNo})\n\n`;

    if (hasTemp) {
      message += `Temporary PG Facility Code: ${c.TempPropCode}
Room No.: ${c.TempRoomNo || "NA"}
Bed No.: ${c.TempBedNo || "NA"}
AC Room: ${c.TempACRoom || "NA"}
Start Date: ${c.TempBedDOJ || "NA"}
Last Date: ${c.TempBedLDt || "NA"}
Temporary Bed Rent Amount: ₹${c.TempBedRentAmt || 0}
(This rent is from ${c.TempBedDOJ || "NA"} to ${c.TempBedLDt || "NA"}, monthly fixed rent is ₹${c.TempBedMonthlyFixRent || 0})

`;
    }

    if (hasPerm) {
      message += `Permanent PG Facility Code: ${c.PermPropCode}
Room No.: ${c.PermRoomNo || "NA"}
Bed No.: ${c.PermBedNo || "NA"}
AC Room: ${c.PermACRoom || "NA"}
Start Date: ${c.PermBedDOJ || "NA"}
Last Date: ${c.PermBedLDt || "NA"}
Permanent Bed Rent Amount: ₹${c.PermBedRentAmt || 0}
(This rent is from ${c.PermBedDOJ || "NA"} to ${c.PermBedLDt || "NA"}, monthly fixed rent is ₹${c.PermBedMonthlyFixRent || c.PermBedRentAmt || 0})
Permanent Bed Deposit Amount: ₹${c.PermBedDepositAmt || 0}
`;
    }

    const rentNote = permRentExists
      ? "( Please Note: Permanent Bed Rent is included )"
      : "( Please Note: Rent amount is NOT included )";
    message += `Processing Fees: ₹${c.ProcessingFeesAmt || 0}
Total Amount to be paid: ₹${c.TotalAmt || 0} ${rentNote}

📌 The booking is confirmed only after full amount ₹${c.TotalAmt || 0} is received by us.
📌 Payment is not refundable if you cancel the booking for any reason. Please read the
     agreement file sent to your WhatsApp and contact us if you have any concerns.

`;

    if (isValidHike) {
      message += `📌 Upcoming Rent Hike Details — Date: ${c.UpcomingRentHikeDt} | Amount: ₹${c.UpcomingRentHikeAmt || 0}

`;
    }

    message += `Gopal's Paying Guest Services
(Customer Care No: 8928191814 | Service Hours: 10AM to 7PM)
Note: This is a system-generated message and does not require a signature.`;

    return message
      .replace(/\u200B/g, "")
      .replace(/\r/g, "")
      .normalize("NFC")
      .trim();
  };

  const handleMsgRegenerate = (client) => {
    setEditingClient(client);
    setActiveTab("Tab5");
  };

  const sendToWhatsapp = () => {
    if (!selectedClient?.WhatsAppNo) return;
    const phone = selectedClient.WhatsAppNo.replace(/\D/g, "");
    const encodedMsg = encodeURIComponent(whatsAppMsg);
    window.open(
      `https://api.whatsapp.com/send?phone=91${phone}&text=${encodedMsg}`,
      "_blank"
    );
    setShowMsgPopup(false);
  };

  if (isNewBookingPending) {
    return <TableSkeleton />;
  }

  /* ================= RENDER ================= */
  return (
    <div className="max-w-full mx-auto p-2 max-h-[600px] bg-gray-50 shadow-md">
      {/* Search & Date Range Controls (responsive) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-2">
        <div className="flex flex-col sm:flex-row justify-start items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-white border border-orange-400 px-3 py-1 rounded-md shadow w-full sm:w-auto">
            <input
              type="text"
              value={searchInput}
              placeholder="Search"
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full text-center outline-none text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-white border border-orange-400 px-3 py-1 z-30 rounded-md shadow">
            <span className="text-sm text-orange-600 font-medium">From</span>
            <DatePicker
              selected={dateRange.from}
              onChange={(date) => {
                setDateRange((p) => ({ ...p, from: date }));
                setIsDefaultMode(false);
              }}
              selectsStart
              startDate={dateRange.from}
              endDate={dateRange.to}
              dateFormat="dd MMM yyyy"
              isClearable
              placeholderText="From Date"
              className="w-24 sm:w-28 text-center outline-none text-sm"
            />
            <span className="text-sm text-orange-600 font-medium">To</span>
            <DatePicker
              selected={dateRange.to}
              onChange={(date) => {
                setDateRange((p) => ({ ...p, to: date }));
                setIsDefaultMode(false);
              }}
              selectsEnd
              startDate={dateRange.from}
              endDate={dateRange.to}
              minDate={dateRange.from}
              isClearable
              dateFormat="dd MMM yyyy"
              placeholderText="To Date"
              className="w-24 sm:w-28 text-center outline-none text-sm"
            />
          </div>
        </div>

        <Link
          to={"/gpgs-actions/client-list"}
          className="border bg-black text-white p-1 px-2 rounded-md self-end md:self-auto"
        >
          <i className="fa-solid fa-arrow-right"></i> Client List
        </Link>
      </div>

      {/* ===== DESKTOP TABLE VIEW (hidden on mobile) ===== */}
      <div className="hidden md:block overflow-y-auto max-h-[480px] bg-white shadow">
        <table className="min-w-full border border-blue-500">
          <thead className="bg-black text-center text-white sticky top-0 z-20 whitespace-nowrap">
            <tr>
              <th className="p-4 sticky left-0 z-20 bg-black border text-white">
                Booking Id
              </th>
              <th className="p-4 sticky left-[60px] z-20 bg-black border text-white">
                Client Full Name
              </th>
              <th className="px-4 border">Date</th>
              <th className="px-4 border">WhatsApp No</th>
              <th className="px-4 border">Calling No</th>
              <th className="px-4 border">Attachments</th>
              <th className="px-4 border">EmgyCont1 Full Name</th>
              <th className="px-4 border">EmgyCont1 No</th>
              <th className="px-4 border">EmgyCont2 Full Name</th>
              <th className="px-4 border">EmgyCont2 No</th>
              <th className="px-4 border">TempProp Code</th>
              <th className="px-4 border">Temp Room No</th>
              <th className="px-4 border">Temp Bed No</th>
              <th className="px-4 border">Temp AC Room</th>
              <th className="px-4 border">Temp Bed DOJ</th>
              <th className="px-4 border">Temp Bed LDt</th>
              <th className="px-4 border">Temp Bed Rent Amt</th>
              <th className="px-4 border">Temp Bed Rent Comnt</th>
              <th className="px-4 border">Temp Bed Monthly Fix Rent</th>
              <th className="px-4 border">Perm Prop Code</th>
              <th className="px-4 border">Perm Bed No</th>
              <th className="px-4 border">Perm Room No</th>
              <th className="px-4 border">Perm AC Room</th>
              <th className="px-4 border">Perm Bed Monthly Fix Rent</th>
              <th className="px-4 border">Perm Bed Deposit Amt</th>
              <th className="px-4 border">Perm Bed DOJ</th>
              <th className="px-4 border">Perm Bed LDt</th>
              <th className="px-4 border">Perm Bed Rent Amt</th>
              <th className="px-4 border">Perm Bed Rent Comnt</th>
              <th className="px-4 border">Processing Fees Amt</th>
              <th className="px-4 border">Upcoming Rent Hike Dt</th>
              <th className="px-4 border">Upcoming Rent Hike Amt</th>
              <th className="px-4 border">Ask For BA Or FA</th>
              <th className="px-4 border">Booking Amt</th>
              <th className="px-4 border">Total Amt</th>
              <th className="px-4 border">Balance Amt</th>
              <th className="px-4 border">Email Id</th>
              <th className="px-4 border">Booking Status</th>
              <th className="px-4 border">Temp PGSht Updated</th>
              <th className="px-4 border">Main PG Sheet Updated</th>
              <th className="px-4 border">Worklogs</th>
              <th className="px-4 border">Add To WhatsApp Grp</th>
              <th className="px-4 border">Status</th>
              <th className="px-4 border">ID</th>
              <th className="px-4 border">Sales Team Member</th>
              <th className="px-7 sticky right-0 bg-black text-white border z-50">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="py-5">
            {paginatedRows.map((client, index) => {
              const actualIndex = (currentPage - 1) * PerPage + index;
              return (
                <tr key={actualIndex} className="text-center border">
                  <td className="sticky left-0 bg-gray-100 z-10">
                    {client.NewBookingId || actualIndex + 1}
                  </td>
                  <td className="sticky left-[60px] bg-gray-100 z-10">
                    {client.ClientFullName}
                  </td>
                  <td className="whitespace-nowrap">{client.Date}</td>
                  <td>{client.WhatsAppNo}</td>
                  <td>{client.CallingNo}</td>
                  <td>
                    <div className="flex gap-2 mt-1 max-h-48 overflow-auto">
                      {client.Attachments ? (
                        client.Attachments.split(",").map((url, idx) => {
                          const trimmedUrl = url.trim();
                          const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(
                            trimmedUrl
                          );
                          const isVideo = /\.(mp4|webm|avi|mov|mkv)$/i.test(
                            trimmedUrl
                          );
                          if (!isImage && !isVideo) return null;
                          return (
                            <button
                              key={idx}
                              type="button"
                              className="w-10 h-10 border rounded-md overflow-hidden bg-gray-100 hover:ring-2 hover:ring-blue-400 relative cursor-pointer"
                              title={trimmedUrl}
                              onClick={() => {
                                if (isImage) setSelectedImage(trimmedUrl);
                              }}
                            >
                              {isImage ? (
                                <img
                                  src={trimmedUrl}
                                  alt={`Attachment ${idx + 1}`}
                                  loading="lazy"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <video
                                  src={trimmedUrl}
                                  className="w-full h-full object-cover"
                                  muted
                                  playsInline
                                />
                              )}
                            </button>
                          );
                        })
                      ) : (
                        <p className="text-sm text-gray-500">No Attachments</p>
                      )}
                    </div>
                  </td>
                  <td>{client.EmgyCont1FullName}</td>
                  <td>{client.EmgyCont1No}</td>
                  <td>{client.EmgyCont2FullName}</td>
                  <td>{client.EmgyCont2No}</td>
                  <td>{client.TempPropCode}</td>
                  <td>{client.TempRoomNo}</td>
                  <td>{client.TempBedNo}</td>
                  <td>{client.TempACRoom}</td>
                  <td>{client.TempBedDOJ}</td>
                  <td>{client.TempBedLDt}</td>
                  <td>{client.TempBedRentAmtt}</td>
                  <td>{client.TempBedRentComnt}</td>
                  <td>{client.TempBedMonthlyFixRent}</td>
                  <td>{client.PermPropCode}</td>
                  <td>{client.PermBedNo}</td>
                  <td>{client.PermRoomNo}</td>
                  <td>{client.PermACRoom}</td>
                  <td>{client.PermBedMonthlyFixRent}</td>
                  <td>{client.PermBedDepositAmt}</td>
                  <td>{client.PermBedDOJ}</td>
                  <td>{client.PermBedLDt}</td>
                  <td>{client.PermBedRentAmt}</td>
                  <td>{client.PermBedRentComnt}</td>
                  <td>{client.ProcessingFeesAmt}</td>
                  <td>{client.UpcomingRentHikeDt}</td>
                  <td>{client.UpcomingRentHikeAmt}</td>
                  <td>{client.AskForBAOrFA}</td>
                  <td>{client.BookingAmt}</td>
                  <td>{client.TotalAmt}</td>
                  <td>{client.BalanceAmt}</td>
                  <td>{client.EmailId}</td>
                  <td>{client.BookingStatus}</td>
                  <td>{client.TempPGShtUpdated}</td>
                  <td>{client.MainPGSheetUpdated}</td>
                  <td className="relative px-2 group">
                    <div className="text-xs text-gray-700 cursor-pointer whitespace-pre-wrap break-words">
                      {client.WorkLogs
                        ? client.WorkLogs.split("\n")
                            .filter(Boolean)[0]
                            ?.substring(0, 28)
                        : "No WorkLogs"}
                    </div>
                    {client.WorkLogs && (
                      <div className="absolute z-50 hidden text-start group-hover:block bg-white border p-5 rounded-lg shadow-xl w-[480px] max-h-[250px] overflow-y-auto cursor-pointer right-12 whitespace-pre-wrap break-words text-sm">
                        {client.WorkLogs.split(/\n(?=\[)/).map(
                          (log, index) => {
                            const lines = log.split("\n").filter(Boolean);
                            if (!lines.length) return null;
                            const meta = lines[0];
                            const message = lines.slice(1).join("\n").trim();
                            if (!message || message === "undefined")
                              return null;
                            return (
                              <div key={index} className="mb-2">
                                <div className="text-gray-500 text-xs">
                                  {meta}
                                </div>
                                <div className="font-semibold text-gray-800">
                                  {message}
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    )}
                  </td>
                  <td>{client.AddToWhatsAppGrp}</td>
                  <td>{client.Status}</td>
                  <td>{client.ID}</td>
                  <td>{client.EmployeeName}</td>
                  <td className="flex justify-center items-center gap-5 px-10 sticky right-0 h-20 bg-gray-100">
                    {activeTab !== "Tab3" && (
                      <>
                        <button
                          className="text-orange-500 text-lg rounded transition"
                          onClick={() => handleEdit(client, client.NewBookingId)}
                        >
                          <i className="fa-solid fa-eye"></i>
                        </button>
                        <button
                          className="text-orange-500 text-lg rounded transition"
                          onClick={() => handleEdit(client, client.NewBookingId)}
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button
                          className="text-orange-500 text-lg rounded transition"
                          onClick={() => handleMsgRegenerate(client)}
                        >
                          <i
                            className="fa fa-paper-plane"
                            style={{ transform: "scaleX(-1)" }}
                          ></i>
                        </button>
                      </>
                    )}
                    {activeTab === "Tab3" && (
                      <button
                        className={`${
                          client?.AddedToClientMaster?.toLowerCase()?.trim() ===
                          "yes"
                            ? "bg-green-500"
                            : "bg-orange-500"
                        } text-white px-3 py-1 rounded ${
                          client?.AddedToClientMaster?.toLowerCase()?.trim() ===
                          "yes"
                            ? "hover:bg-green-600"
                            : "hover:bg-orange-600"
                        } transition disabled:opacity-60`}
                        onClick={() => handleSave(client, actualIndex)}
                        disabled={savingRow === actualIndex}
                      >
                        {savingRow === actualIndex
                          ? "Moving..."
                          : client?.AddedToClientMaster?.toLowerCase()?.trim() ===
                            "yes"
                          ? "Moved"
                          : "Move"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ===== MOBILE CARD VIEW (visible only on mobile) ===== */}
      <div className="block md:hidden space-y-4 mt-4">
        {paginatedRows.map((client, index) => {
          const actualIndex = (currentPage - 1) * PerPage + index;
          return (
            <div
              key={actualIndex}
              className="bg-white border border-gray-200 rounded-lg shadow p-4"
            >
              {/* Card Header */}
              <div className="flex justify-between items-center border-b pb-2 mb-2">
                <div>
                  <span className="text-xs text-gray-500">Booking ID:</span>
                  <span className="ml-1 font-semibold">
                    {client.NewBookingId || actualIndex + 1}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500">Date:</span>
                  <span className="ml-1">{client.Date || "-"}</span>
                </div>
              </div>

              {/* Client Name (prominent) */}
              <div className="text-lg font-bold text-orange-700 mb-2">
                {client.ClientFullName}
              </div>

              {/* Fields Grid */}
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
                <FieldRow label="WhatsApp No" value={client.WhatsAppNo} />
                <FieldRow label="Calling No" value={client.CallingNo} />
                <FieldRow
                  label="EmgyCont1 Name"
                  value={client.EmgyCont1FullName}
                />
                <FieldRow label="EmgyCont1 No" value={client.EmgyCont1No} />
                <FieldRow
                  label="EmgyCont2 Name"
                  value={client.EmgyCont2FullName}
                />
                <FieldRow label="EmgyCont2 No" value={client.EmgyCont2No} />
                <FieldRow label="Temp Prop Code" value={client.TempPropCode} />
                <FieldRow label="Temp Room No" value={client.TempRoomNo} />
                <FieldRow label="Temp Bed No" value={client.TempBedNo} />
                <FieldRow label="Temp AC Room" value={client.TempACRoom} />
                <FieldRow label="Temp Bed DOJ" value={client.TempBedDOJ} />
                <FieldRow label="Temp Bed LDt" value={client.TempBedLDt} />
                <FieldRow
                  label="Temp Bed Rent Amt"
                  value={client.TempBedRentAmtt}
                />
                <FieldRow
                  label="Temp Bed Rent Comnt"
                  value={client.TempBedRentComnt}
                />
                <FieldRow
                  label="Temp Bed Monthly Fix Rent"
                  value={client.TempBedMonthlyFixRent}
                />
                <FieldRow label="Perm Prop Code" value={client.PermPropCode} />
                <FieldRow label="Perm Bed No" value={client.PermBedNo} />
                <FieldRow label="Perm Room No" value={client.PermRoomNo} />
                <FieldRow label="Perm AC Room" value={client.PermACRoom} />
                <FieldRow
                  label="Perm Bed Monthly Fix Rent"
                  value={client.PermBedMonthlyFixRent}
                />
                <FieldRow
                  label="Perm Bed Deposit Amt"
                  value={client.PermBedDepositAmt}
                />
                <FieldRow label="Perm Bed DOJ" value={client.PermBedDOJ} />
                <FieldRow label="Perm Bed LDt" value={client.PermBedLDt} />
                <FieldRow
                  label="Perm Bed Rent Amt"
                  value={client.PermBedRentAmt}
                />
                <FieldRow
                  label="Perm Bed Rent Comnt"
                  value={client.PermBedRentComnt}
                />
                <FieldRow
                  label="Processing Fees Amt"
                  value={client.ProcessingFeesAmt}
                />
                <FieldRow
                  label="Upcoming Rent Hike Dt"
                  value={client.UpcomingRentHikeDt}
                />
                <FieldRow
                  label="Upcoming Rent Hike Amt"
                  value={client.UpcomingRentHikeAmt}
                />
                <FieldRow
                  label="Ask For BA Or FA"
                  value={client.AskForBAOrFA}
                />
                <FieldRow label="Booking Amt" value={client.BookingAmt} />
                <FieldRow label="Total Amt" value={client.TotalAmt} />
                <FieldRow label="Balance Amt" value={client.BalanceAmt} />
                <FieldRow label="Email Id" value={client.EmailId} />
                <FieldRow
                  label="Booking Status"
                  value={client.BookingStatus}
                />
                <FieldRow
                  label="Temp PGSht Updated"
                  value={client.TempPGShtUpdated}
                />
                <FieldRow
                  label="Main PG Sheet Updated"
                  value={client.MainPGSheetUpdated}
                />
                <FieldRow
                  label="Add To WhatsApp Grp"
                  value={client.AddToWhatsAppGrp}
                />
                <FieldRow label="Status" value={client.Status} />
                <FieldRow label="ID" value={client.ID} />
                <FieldRow
                  label="Sales Team Member"
                  value={client.EmployeeName}
                />
              </div>

              {/* Attachments */}
              <div className="mt-3 border-t pt-2">
                <span className="text-sm font-semibold">Attachments:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {client.Attachments ? (
                    client.Attachments.split(",").map((url, idx) => {
                      const trimmedUrl = url.trim();
                      const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(
                        trimmedUrl
                      );
                      if (!isImage) return null;
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedImage(trimmedUrl)}
                          className="w-16 h-16 border rounded overflow-hidden"
                        >
                          <img
                            src={trimmedUrl}
                            alt="attachment"
                            className="w-full h-full object-cover"
                          />
                        </button>
                      );
                    })
                  ) : (
                    <span className="text-sm text-gray-500">None</span>
                  )}
                </div>
              </div>

              {/* WorkLogs */}
              <div className="mt-3 border-t pt-2">
                <span className="text-sm font-semibold">WorkLogs:</span>
                <div className="text-sm mt-1 max-h-32 overflow-y-auto bg-gray-50 p-2 rounded">
                  {client.WorkLogs ? (
                    client.WorkLogs.split(/\n(?=\[)/).map((log, i) => {
                      const lines = log.split("\n").filter(Boolean);
                      if (!lines.length) return null;
                      const meta = lines[0];
                      const message = lines.slice(1).join("\n").trim();
                      if (!message || message === "undefined") return null;
                      return (
                        <div key={i} className="mb-1">
                          <div className="text-gray-500 text-xs">{meta}</div>
                          <div className="text-gray-800">{message}</div>
                        </div>
                      );
                    })
                  ) : (
                    <span className="text-gray-500">No WorkLogs</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-4 pt-2 border-t">
                {activeTab !== "Tab3" && (
                  <>
                    <button
                      className="text-orange-500 text-lg"
                      onClick={() => handleEdit(client, client.NewBookingId)}
                      title="View"
                    >
                      <i className="fa-solid fa-eye"></i>
                    </button>
                    <button
                      className="text-orange-500 text-lg"
                      onClick={() => handleEdit(client, client.NewBookingId)}
                      title="Edit"
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button
                      className="text-orange-500 text-lg"
                      onClick={() => handleMsgRegenerate(client)}
                      title="Message"
                    >
                      <i
                        className="fa fa-paper-plane"
                        style={{ transform: "scaleX(-1)" }}
                      ></i>
                    </button>
                  </>
                )}
                {activeTab === "Tab3" && (
                  <button
                    className={`${
                      client?.AddedToClientMaster?.toLowerCase()?.trim() ===
                      "yes"
                        ? "bg-green-500"
                        : "bg-orange-500"
                    } text-white px-4 py-2 rounded w-full ${
                      client?.AddedToClientMaster?.toLowerCase()?.trim() ===
                      "yes"
                        ? "hover:bg-green-600"
                        : "hover:bg-orange-600"
                    } transition disabled:opacity-60`}
                    onClick={() => handleSave(client, actualIndex)}
                    disabled={savingRow === actualIndex}
                  >
                    {savingRow === actualIndex
                      ? "Moving..."
                      : client?.AddedToClientMaster?.toLowerCase()?.trim() ===
                        "yes"
                      ? "Moved"
                      : "Move"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination (same for both views) */}
      <div className="flex justify-center items-center gap-6 mt-3">
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === 1}
          onClick={goToPrevious}
          className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
        >
          <i className="fa-solid fa-arrow-left"></i> Previous
        </button>
        <button
          disabled={currentPage === totalPages}
          onClick={goToNext}
          className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
        >
          Next <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] cursor-pointer h-screen"
        >
          <img
            src={selectedImage}
            alt="Full View"
            className="max-w-[90vw] max-h-[90vh] rounded shadow-lg"
          />
        </div>
      )}

      {/* Message Popup */}
      {showMsgPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[800px] rounded-lg shadow-lg p-5">
            <h2 className="text-lg text-gray-500 font-semibold mb-3">
              Preview WhatsApp Message
            </h2>
            <textarea
              value={whatsAppMsg}
              disabled
              onChange={(e) => setWhatsAppMsg(e.target.value)}
              className="w-full h-96 border outline-none rounded p-3 text-sm"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowMsgPopup(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={sendToWhatsapp}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                <i className="fa-brands fa-whatsapp"></i> Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper component for mobile field row
const FieldRow = ({ label, value }) => (
  <>
    <span className="text-gray-600 font-medium">{label}:</span>
    <span className="text-gray-800 break-words">{value || "-"}</span>
  </>
);

export default NewBookingTable;