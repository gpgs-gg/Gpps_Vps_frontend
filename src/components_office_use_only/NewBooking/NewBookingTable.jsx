import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import {
    useDynamicDetails,

} from "../TicketSystem/Services/index";
import { useNewBookingData } from "./services";
function NewBookingTable() {
    const { data: dynamicData } = useDynamicDetails();
    const { data: NewBookingSheetData } = useNewBookingData();

    const [rows, setRows] = useState([]);
    const [editedRows, setEditedRows] = useState([]);
    const [editingCell, setEditingCell] = useState(null);
    //   const [selectedLeadNos, setSelectedLeadNos] = useState([]);
    const [hasChanges, setHasChanges] = useState(false);

    const menuOpenRef = useRef(false);

    /* ================= LOAD DATA ================= */
    useEffect(() => {
        if (NewBookingSheetData?.data) {
            setRows(NewBookingSheetData?.data);
            setEditedRows(NewBookingSheetData?.data); // clone for editing
        }
    }, [NewBookingSheetData]);

    const paginatedRows = editedRows; // (pagination logic add karu shakto later)

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

    /* ================= EDITABLE CELL ================= */
    const EditableCell = ({ rowIndex, field }) => {
        const isEditing =
            editingCell?.rowIndex === rowIndex &&
            editingCell?.field === field;

        const value = editedRows[rowIndex]?.[field] || "";

        const selectFields = [
            "Gender",
            "LeadStatus",
            "Reason",
            "FieldMember",
        ];

        if (!isEditing) {
            return (
                <td
                    className="cursor-pointer px-5"
                    onDoubleClick={() => setEditingCell({ rowIndex, field })}
                >
                    {value || "-"}
                </td>
            );
        }

        /* ===== SELECT FIELD ===== */
        if (selectFields.includes(field)) {
            const options = getOptions(field);

            return (
                <td className="border relative text-center whitespace-nowrap">
                    <Select
                        autoFocus
                        value={options.find((o) => o.value === value) || null}
                        options={options}
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        onChange={(selected) => {
                            handleCellEdit(rowIndex, field, selected?.value || "");
                            setEditingCell(null);
                        }}
                        onBlur={() => setEditingCell(null)}
                    />
                </td>
            );
        }

        /* ===== DATE FIELD ===== */
        // if (field === "FollowupDate") {
        //   return (
        //     <td className="border text-center ">
        //       <DatePicker
        //         selected={value ? new Date(value) : null}
        //         dateFormat="d MMM yyyy"
        //         className="w-full text-center bg-transparent outline-none"
        //         onChange={(date) => {
        //           const formatted = date
        //             ? format(date, "d MMM yyyy")
        //             : "";
        //           handleCellEdit(rowIndex, field, formatted);
        //           setEditingCell(null);
        //         }}
        //         onBlur={() => setEditingCell(null)}
        //       />
        //     </td>
        //   );
        // }

        /* ===== INPUT FIELD ===== */
        return (
            <td className="border relative ">
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <input
                        autoFocus
                        defaultValue={value}
                        className="h-full w-full bg-transparent border-2 text-center focus:outline-none"
                        onBlur={(e) => {
                            handleCellEdit(rowIndex, field, e.target.value);
                            setEditingCell(null);
                        }}
                    />
                </div>
            </td>
        );
    };

    /* ================= RENDER ================= */
    return (
        <div className="max-w-full mx-auto mt-40 p-2  max-h-[600px] bg-gray-50 rounded-lg shadow-md">
            <div className="overflow-y-auto max-h-[480px] hidden md:block bg-white rounded-lg shadow">
                <table className="min-w-full border">
                    <thead className="bg-black text-center text-white sticky top-0 z-20 whitespace-nowrap ">
                        <tr>
                            <th className="p-4 border">Sr No</th>
                            <th className="px-4 border">Date</th>
                            <th className="px-4 border">ID</th>
                            <th className="px-4 border">Employee Name</th>
                            <th className="px-4 border">Client Full Name</th>
                            <th className="px-4 border">WhatsApp No</th>
                            <th className="px-4 border">Calling No</th>
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
                            <th className="px-4 border">Temp Bed Rent Amtt</th>
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
                            <th className="px-4 border">Amt Received</th>
                            <th className="px-4 border">Temp PGSht Updated</th>
                            <th className="px-4 border">Main PG Sheet Updated</th>
                            <th className="px-4 border">Worklogs</th>
                            <th className="px-4 border">Add To WhatsApp Grp</th>
                            <th className="px-4 border">Status</th>
                            <th className="px-4 border">Updated By</th>
                            <th className="px-4 border">Updated Dt</th>
                            <th className="px-4 border">Reviewed By</th>
                            <th className="px-4 border">Reviewed Date</th>
                            <th className="px-4 border">Comments</th>
                            {/* <th className="px-4">WorkLogs</th> */}
                        </tr>
                    </thead>

                    <tbody className="py-5">
                        {paginatedRows?.slice(0, 20).map((client, index) => {
                            const globalIndex = index + 1;
                            // agar pagination ho to:
                            // const globalIndex = index + 1 + (currentPage - 1) * rowsPerPage;

                            return (
                                <tr key={globalIndex} className="text-center border">
                                    <td className="py-7">{globalIndex}</td>
                                    <td className="py-7 whitespace-nowrap">{client.Date}</td>

                                    <EditableCell rowIndex={index} field="ID" />
                                    <EditableCell rowIndex={index} field="EmployeeName" />
                                    <EditableCell rowIndex={index} field="ClientFullName" />
                                    <EditableCell rowIndex={index} field="WhatsAppNo" />
                                    <EditableCell rowIndex={index} field="CallingNo" />
                                    <EditableCell rowIndex={index} field="EmgyCont1FullName" />
                                    <EditableCell rowIndex={index} field="EmgyCont1No" />
                                    <EditableCell rowIndex={index} field="EmgyCont2FullName" />
                                    <EditableCell rowIndex={index} field="EmgyCont2No" />
                                    <EditableCell rowIndex={index} field="TempPropCode" />
                                    <EditableCell rowIndex={index} field="TempRoomNo" />
                                    <EditableCell rowIndex={index} field="TempBedNo" />
                                    <EditableCell rowIndex={index} field="TempACRoom" />
                                    <EditableCell rowIndex={index} field="TempBedDOJ" />
                                    <EditableCell rowIndex={index} field="TempBedLDt" />
                                    <EditableCell rowIndex={index} field="TempBedRentAmtt" />
                                    <EditableCell rowIndex={index} field="TempBedRentComnt" />
                                    <EditableCell rowIndex={index} field="TempBedMonthlyFixRent" />
                                    <EditableCell rowIndex={index} field="PermPropCode" />
                                    <EditableCell rowIndex={index} field="PermBedNo" />
                                    <EditableCell rowIndex={index} field="PermRoomNo" />
                                    <EditableCell rowIndex={index} field="PermACRoom" />
                                    <EditableCell rowIndex={index} field="PermBedMonthlyFixRent" />
                                    <EditableCell rowIndex={index} field="PermBedDepositAmt" />
                                    <EditableCell rowIndex={index} field="PermBedDOJ" />
                                    <EditableCell rowIndex={index} field="PermBedLDt" />
                                    <EditableCell rowIndex={index} field="PermBedRentAmt" />
                                    <EditableCell rowIndex={index} field="PermBedRentComnt" />
                                    <EditableCell rowIndex={index} field="ProcessingFeesAmt" />
                                    <EditableCell rowIndex={index} field="UpcomingRentHikeDt" />
                                    <EditableCell rowIndex={index} field="UpcomingRentHikeAmt" />
                                    <EditableCell rowIndex={index} field="AskForBAOrFA" />
                                    <EditableCell rowIndex={index} field="BookingAmt" />
                                    <EditableCell rowIndex={index} field="TotalAmt" />
                                    <EditableCell rowIndex={index} field="BalanceAmt" />
                                    <EditableCell rowIndex={index} field="EmailId" />
                                    <EditableCell rowIndex={index} field="AmtReceived" />
                                    <EditableCell rowIndex={index} field="TempPGShtUpdated" />
                                    <EditableCell rowIndex={index} field="MainPGSheetUpdated" />
                                    <td className="relative px-2 group">
                                        {/* ===== Preview (Short Address) ===== */}
                                        <div className="text-xs text-gray-700 cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                                            {client["WorkLogs"]
                                                ? client["WorkLogs"].substring(0, 25)
                                                : "-"}
                                        </div>

                                        {/* ===== Full Address on Hover ===== */}
                                        {client["WorkLogs"] && (
                                            <div className="absolute z-50 hidden group-hover:block bg-white border p-4 rounded-lg shadow-xl 
      w-[350px] max-h-[200px] overflow-y-auto right-10 whitespace-pre-wrap break-words text-sm">
                                                {client["WorkLogs"]}
                                            </div>
                                        )}
                                    </td>
                                    <EditableCell rowIndex={index} field="AddToWhatsAppGrp" />
                                    <EditableCell rowIndex={index} field="Status" />
                                    <EditableCell rowIndex={index} field="UpdatedBy" />
                                    <EditableCell rowIndex={index} field="UpdatedDt" />
                                    <EditableCell rowIndex={index} field="ReviewedBy" />
                                    <EditableCell rowIndex={index} field="ReviewedDate" />
                                    <EditableCell rowIndex={index} field="Comments" />

                                </tr>
                            );
                        })}

                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default NewBookingTable;