import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { format } from "date-fns";

import "react-datepicker/dist/react-datepicker.css";



import { toast } from "react-toastify";

import { useClientDetails, useCreateClientMasterDetails } from "./services";
import { SelectStyles } from "../../Config";
import { useDynamicDetails } from "../TicketSystem/Services";
import LoaderPage from "../NewBooking/LoaderPage";
import ClientMasterSkeleton, { TableSkeleton } from "./ClientMasterSkeleton";
import { Link } from "react-router-dom";
function ClientMasterTable({ setActiveTab, selectUpdateClient, setSelectUpdateClient, mode, setMode }) {
    const { data: dynamicData } = useDynamicDetails();
    const { data: ClientMasterSheetData, isPending: isClientMasterSheetDataPending } = useClientDetails();
    const { mutateAsync: createClientMaster, isPending: isCreating } = useCreateClientMasterDetails();
    const [rows, setRows] = useState([]);
    const [editedRows, setEditedRows] = useState([]);
    const [editingCell, setEditingCell] = useState(null);
    //   const [selectedLeadNos, setSelectedLeadNos] = useState([]);
    const [hasChanges, setHasChanges] = useState(false);
    const rowsPerPage = 20;
    const menuOpenRef = useRef(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    // const [selectedPropertyCodes, setSelectedPropertyCodes] = useState([]);
    const [activeParents, setActiveParents] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const handleImageClick = (url) => setSelectedImage(url);
    const handleClose = () => setSelectedImage(null);
    /* ================= LOAD DATA ================= */
    useEffect(() => {
        if (ClientMasterSheetData?.data) {
            setRows(ClientMasterSheetData?.data);
            setEditedRows(ClientMasterSheetData?.data); // clone for editing
        }
    }, [ClientMasterSheetData]);

    /* ================= SEARCH FILTER ================= */

    /* ================= SEARCH FILTER ================= */

    const filteredRows = editedRows
        ?.map((row, index) => ({ row, originalIndex: index }))
        .filter(({ row }) => {
            if (!searchInput.trim()) return true;

            const search = searchInput.toLowerCase();

            return Object.values(row).some((value) =>
                value?.toString().toLowerCase().includes(search)
            );
        });

    const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

    const paginatedRows = filteredRows.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );


    useEffect(() => {
        setCurrentPage(1);
    }, [searchInput]);
    /* ================= HANDLE EDIT ================= */
    const handleCellEdit = (rowIndex, field, value) => {
        setEditedRows((prev) => {
            const updated = [...prev];

            // Update current field
            updated[rowIndex] = {
                ...updated[rowIndex],
                [field]: value,
            };

            const currentRow = updated[rowIndex];

            // ✅ If New Row and PropertyCode or BedNo changed
            if (
                currentRow?.isNew &&
                (field === "PropertyCode" || field === "BedNo")
            ) {
                const property = currentRow.PropertyCode || "";
                const bed = currentRow.BedNo || "";

                // Only generate if both values available
                if (property && bed) {
                    updated[rowIndex].ClientID =
                        `Client${bed}_${property}_`;
                }
            }

            return updated;
        });

        setHasChanges(true);
    };

    const renderFilePreview = (urls) => {
        if (!urls) return null;

        // 👉 Split by comma and clean spaces
        const urlArray = urls
            .split(",")
            .map((url) => url.trim())
            .filter((url) => url !== "");

        return (
            <div className="flex gap-2  justify-center">
                {urlArray.map((url, index) => {
                    const isPdf = url.toLowerCase().includes(".pdf");
                    const fileName = url.split("/").pop();

                    if (isPdf) {
                        return (
                            <div key={index} className="flex items-center justify-center">
                                <i
                                    className="fas fa-file-pdf text-red-600 text-3xl cursor-pointer"
                                    title={fileName}
                                    onClick={() => window.open(url, "_blank")}
                                ></i>
                            </div>
                        );
                    }

                    return (
                        <img
                            key={index}
                            src={url}
                            alt="preview"
                            className="w-12 h-12 rounded-lg object-cover border cursor-pointer hover:scale-110 transition"
                            title={fileName}
                            // onClick={() => window.open(url, "_blank")}
                            onClick={() => handleImageClick(url)}
                        />
                    );
                })}
            </div>
        );
    };


    const handleSave = async () => {
        try {

            // ✅ Only new rows ghe
            const newRows = editedRows.filter(row => row.isNew);

            if (newRows.length === 0) {
                toast.info("No new rows to save");
                return;
            }

            // ✅ Final Payload structure
            const payload = newRows.map(row => ({
                ClientID: '=CONCATENATE("Client",INDIRECT("C"&ROW()),"_",INDIRECT("B"&ROW()),"_",INDIRECT("G"&ROW()))',
                PropertyCode: row.PropertyCode,
                BedNo: row.BedNo,
                ParentClientID: row.parentCode,
                IsActive: "No",
                Name: row.Name || "",
            }));

            await createClientMaster({ rows: payload });

            toast.success("Data saved successfully");
            setActiveParents([]);
            setHasChanges(false);

        } catch (error) {

            console.error(error);
            toast.error("Something went wrong ❌");

        }
    };


    const handleCheckboxChange = (checked, ClientID, rowIndex) => {

        if (checked) {
            setActiveParents(prev => [...prev, ClientID]);

            const newRow = {
                PropertyCode: "",
                BedNo: "",
                ClientID: "",
                IsActive: "",
                Name: "",
                isNew: true,
                parentCode: ClientID, // ✅ exact clicked parent
            };

            const updated = [...editedRows];

            // ✅ Insert exactly below clicked row
            updated.splice(rowIndex, 0, newRow);

            setEditedRows(updated);

        } else {

            setActiveParents(prev =>
                prev.filter(id => id !== ClientID)
            );

            const filtered = editedRows.filter(
                row => row.parentCode !== ClientID
            );

            setEditedRows(filtered);
        }
    };


    const handleAddRow = (ClientID, rowIndex) => {
        const newRow = {
            PropertyCode: "",
            BedNo: "",
            ClientID: "",
            IsActive: "",
            Name: "",
            isNew: true,
            parentCode: ClientID,
        };

        const updated = [...editedRows];
        updated.splice(rowIndex, 0, newRow);
        setEditedRows(updated);
    };

    const handleRemoveRow = (parentClientID) => {

        // 1️⃣ Find last inserted child row index
        const lastChildIndex = [...editedRows]
            .map((row, index) => ({ ...row, index }))
            .filter(row => row.isNew && row.parentCode === parentClientID)
            .map(row => row.index)
            .pop(); // 👈 last one

        if (lastChildIndex === undefined) return;

        const updatedRows = [...editedRows];
        updatedRows.splice(lastChildIndex, 1);

        setEditedRows(updatedRows);

        // 2️⃣ Check if still children exist
        const stillHasChildren = updatedRows.some(
            row => row.isNew && row.parentCode === parentClientID
        );

        if (!stillHasChildren) {
            setActiveParents(prev =>
                prev.filter(id => id !== parentClientID)
            );
        }
    };

    const handleEdit = (client) => {
        setSelectUpdateClient(client);
        setActiveTab("CreateClient");
        setMode("Update Client")
    };
    console.log(selectUpdateClient, "selected client in master table")
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
        const fieldOrder = [
            "PropertyCode",
            "BedNo",
            "ClientID",
            "IsActive",
            "Name",
            "ActualDOJ",
            "TemporaryPropCode",
            "RentDate",
            "RentDateComments",
            "WhatsAppNo",
            "CallingNo",
            "KYCDocuments",
            "PGLegalDocuments",
            "DigitalSelfDeclearationAccepted",
            "DigitalPGLegalDocAccepted",
            "DigitalSignedDetails",
            "EmgyCont1FullName",
            "EmgyCont1No",
            "EmgyCont2FullName",
            "EmgyCont2No",
            "EmailID",
            "ParkingCharges",
            "BloodGroup",
            "Occupation",
            "Organization",
            "NoticeSD",
            "NoticeLD",
            "ActualVD",
            "Comments",
            "CreatedByID",
            "CreatedDate",
            "UpdatedByID",
            "UpdatedDate",
            "LoginID",
            "Role",
            "Password",
        ];

        const selectFields = ["PermPropCode"];

        const getNextCell = (rowIndex, field, direction = "right") => {
            const colIndex = fieldOrder.indexOf(field);
            let newRow = rowIndex;
            let newCol = colIndex;

            if (direction === "right") {
                newCol++;
                if (newCol >= fieldOrder.length) {
                    newCol = 0;
                    newRow++;
                }
            } else if (direction === "left") {
                newCol--;
                if (newCol < 0) {
                    newCol = fieldOrder.length - 1;
                    newRow--;
                }
            } else if (direction === "down") newRow++;
            else if (direction === "up") newRow--;

            if (newRow < 0) newRow = 0;
            if (newRow >= editedRows.length)
                newRow = editedRows.length - 1;

            return { rowIndex: newRow, field: fieldOrder[newCol] };
        };

        const isEditing =
            editingCell?.rowIndex === rowIndex &&
            editingCell?.field === field;

        const value = editedRows[rowIndex]?.[field] || "";

        /* =============================
           ✅ EDIT PERMISSION LOGIC
        ============================== */

        const rowData = editedRows[rowIndex];
        const isNewRow = rowData?.isNew === true;
        const allowedFields = ["PropertyCode", "BedNo"];
        const canEdit = isNewRow && allowedFields.includes(field);

        /* =============================
           ❌ READ ONLY CELL
        ============================== */

        if (!canEdit || !isEditing) {

            // ✅ ONLY DigitalSignedDetails special UI
            if (field === "DigitalSignedDetails" || field === "WorkLogs") {
                return (
                    <td
                        className="px-2 relative group"
                        onDoubleClick={() => {
                            if (canEdit) {
                                setEditingCell({ rowIndex, field });
                            }
                        }}
                    >
                        {/* Preview */}
                        <div className="text-xs text-gray-700 cursor-pointer whitespace-pre-wrap break-words">
                            {value?.substring(0, 28) || "-"}
                        </div>

                        {/* Hover Popup */}
                        {value && (
                            <div className="absolute z-50 hidden group-hover:block 
                                    bg-white border p-5 rounded-lg shadow-xl 
                                    w-[480px] max-h-[250px] overflow-y-auto 
                                    right-12 whitespace-pre-wrap break-words text-sm">
                                {value}
                            </div>
                        )}
                    </td>
                );
            }

            // ✅ ALL OTHER FIELDS NORMAL
            return (
                <td
                    className="px-5 whitespace-nowrap bg-white"
                    onDoubleClick={() => {
                        if (canEdit) {
                            setEditingCell({ rowIndex, field });
                        }
                    }}
                >
                    {value || "-"}
                </td>
            );
        }




        // if (!canEdit || !isEditing) {
        //     return (
        //         <td
        //             className="px-5 whitespace-nowrap bg-white"
        //             onDoubleClick={() => {
        //                 if (canEdit) {
        //                     setEditingCell({ rowIndex, field });
        //                 }
        //             }}
        //         >
        //             {value || "-"}
        //         </td>
        //     );
        // }

        /* =============================
           ✅ SELECT FIELD
        ============================== */

        if (selectFields.includes(field)) {
            const options = getOptions(field);

            return (
                <td className="border relative text-center whitespace-nowrap">
                    <Select
                        autoFocus
                        isClearable
                        value={
                            options.find(o => o.value === value) || null
                        }
                        options={options}
                        styles={SelectStyles}
                        menuPlacement="bottom"
                        menuPosition="fixed"
                        menuPortalTarget={document.body}
                        onChange={(selected) => {
                            handleCellEdit(
                                rowIndex,
                                field,
                                selected?.value || ""
                            );
                        }}
                        onKeyDown={(e) => {
                            let next;

                            switch (e.key) {
                                case "Tab":
                                    e.preventDefault();
                                    next = getNextCell(
                                        rowIndex,
                                        field,
                                        e.shiftKey ? "left" : "right"
                                    );
                                    setEditingCell(next);
                                    break;

                                case "Enter":
                                    e.preventDefault();
                                    next = getNextCell(rowIndex, field, "right");
                                    setEditingCell(next);
                                    break;

                                case "Escape":
                                    setEditingCell(null);
                                    break;
                            }
                        }}
                    />
                </td>
            );
        }

        /* =============================
           ✅ INPUT FIELD
        ============================== */

        return (
            <td className="border relative">
                <div className="absolute inset-0 flex items-center justify-center z-10 whitespace-nowrap">
                    <input
                        autoFocus
                        defaultValue={value}
                        className="h-full w-full bg-transparent border-2 text-center focus:outline-none"
                        onBlur={(e) => {
                            handleCellEdit(
                                rowIndex,
                                field,
                                e.target.value
                            );
                            setEditingCell(null);
                        }}
                        onKeyDown={(e) => {
                            let next;

                            switch (e.key) {
                                case "Enter":
                                    e.preventDefault();
                                    next = getNextCell(
                                        rowIndex,
                                        field,
                                        e.shiftKey ? "down" : "right"
                                    );
                                    handleCellEdit(
                                        rowIndex,
                                        field,
                                        e.target.value
                                    );
                                    setEditingCell(next);
                                    break;

                                case "Tab":
                                    e.preventDefault();
                                    next = getNextCell(
                                        rowIndex,
                                        field,
                                        e.shiftKey ? "left" : "right"
                                    );
                                    handleCellEdit(
                                        rowIndex,
                                        field,
                                        e.target.value
                                    );
                                    setEditingCell(next);
                                    break;

                                case "ArrowRight":
                                    e.preventDefault();
                                    next = getNextCell(
                                        rowIndex,
                                        field,
                                        "right"
                                    );
                                    handleCellEdit(
                                        rowIndex,
                                        field,
                                        e.target.value
                                    );
                                    setEditingCell(next);
                                    break;

                                case "ArrowLeft":
                                    e.preventDefault();
                                    next = getNextCell(
                                        rowIndex,
                                        field,
                                        "left"
                                    );
                                    handleCellEdit(
                                        rowIndex,
                                        field,
                                        e.target.value
                                    );
                                    setEditingCell(next);
                                    break;

                                case "ArrowDown":
                                    e.preventDefault();
                                    next = getNextCell(
                                        rowIndex,
                                        field,
                                        "down"
                                    );
                                    handleCellEdit(
                                        rowIndex,
                                        field,
                                        e.target.value
                                    );
                                    setEditingCell(next);
                                    break;

                                case "ArrowUp":
                                    e.preventDefault();
                                    next = getNextCell(
                                        rowIndex,
                                        field,
                                        "up"
                                    );
                                    handleCellEdit(
                                        rowIndex,
                                        field,
                                        e.target.value
                                    );
                                    setEditingCell(next);
                                    break;

                                case "Escape":
                                    setEditingCell(null);
                                    break;
                            }
                        }}
                    />
                </div>
            </td>
        );
    };

    if (isClientMasterSheetDataPending) {
        return <TableSkeleton />
    }

    /* ================= RENDER ================= */
    return (
        <div className="max-w-full mx-auto  p-2  max-h-[600px]  bg-gray-50 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-1  px-5" >
                <div className="flex items-center gap-2 bg-white border border-orange-400 px-3 py-1 rounded-md z-30 shadow">

                    <input
                        type="text"
                        value={searchInput}
                        placeholder="Search"
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="w-full text-center outline-none text-sm"
                    />

                    {/* ✅ Clear Button (Only when filter active) */}
                    {searchInput.trim() !== "" && (
                        <button
                            onClick={() => setSearchInput("")}
                            className="text-xs px-2 py-1 rounded transition"
                        >
                            <i class="fa-solid fa-x"></i>
                        </button>
                    )}

                </div>

                <button
                    onClick={handleSave}
                    disabled={isCreating}
                    className={`px-4 py-1 rounded flex items-center justify-center gap-2 min-w-[120px] transition-all 
                    ${isCreating ? "bg-gray-700 cursor-not-allowed" : "bg-black hover:bg-gray-900 text-white"}`}
                >
                    {isCreating && <LoaderPage />}
                    {isCreating ? "Saving..." : "Save"}
                </button>
                <Link to={"/gpgs-actions/new-booking-list"} className="border bg-black text-white p-1 px-2 rounded-md mr-5">
                    <i class="fa-solid fa-arrow-right"></i> New Booking
                </Link>
            </div>
            <div className="overflow-y-auto max-h-[480px] hidden md:block bg-white rounded-lg shadow">
                <table className="min-w-full border">
                    <thead className="bg-black text-center text-white sticky top-0 z-20 whitespace-nowrap ">
                        <tr>
                            <th className="px-4 border">Add New Row</th>
                            <th className="p-4 border">Sr No</th>
                            {/* <th className="px-4 border">Date</th> */}
                            {/* <th className="px-4 border">ID</th> */}
                            <th className="px-4 border">Property Code</th>
                            <th className="px-4 border">Bed No</th>
                            <th className="px-4 border">Client ID</th>
                            <th className="px-4 border">IsActive</th>
                            <th className="px-4 border">Name</th>
                            <th className="px-4 border">DOJ</th>
                            <th className="px-4 border">Actual DOJ</th>
                            <th className="px-4 border">Temporary Prop Code</th>
                            <th className="px-4 border">Rent Date</th>
                            <th className="px-4 border">Rent Date Comments</th>
                            <th className="px-4 border">WhatsApp No</th>
                            <th className="px-4 border">Calling No</th>
                            <th className="px-4 border">KYC Documents</th>
                            <th className="px-4 border">Addhar Card</th>
                            <th className="px-8 border">Photo</th>
                            <th className="px-4 border">Company ID</th>
                            <th className="px-4 border">Collage ID</th>
                            <th className="px-4 border">Client Agreement</th>
                            <th className="px-4 border">Client Police Noc</th>
                            <th className="px-4 border">Pan Card</th>
                                <th className="px-4 border">Possession Attachment</th>
                            <th className="px-4 border">DigitalSelfDeclearationAccepted</th>
                            <th className="px-4 border">DigitalPGLegalDocAccepted</th>
                            <th className="px-4 border">DigitalSignedDetails</th>
                            <th className="px-4 border">EmgyCont1FullName</th>
                            <th className="px-4 border">EmgyCont1No</th>
                            <th className="px-4 border">EmgyCont2FullName</th>
                            <th className="px-4 border">EmgyCont2No</th>
                            <th className="px-4 border">EmailID</th>
                            <th className="px-4 border">ParkingCharges</th>
                            <th className="px-4 border">BloodGroup</th>
                            <th className="px-4 border">Occupation</th>
                            <th className="px-4 border">Organization</th>
                            <th className="px-4 border">NoticeSD</th>
                            <th className="px-4 border">NoticeLD</th>
                            <th className="px-4 border">ActualVD</th>
                            <th className="px-4 border">Comments</th>
                            <th className="px-4 border">WorkLogs</th>
                            <th className="px-4 border">LoginID</th>
                            <th className="px-4 border">Role</th>
                            <th className="px-4 border">Password</th>
                            <th className="px-4 sticky right-0 bg-black text-white z-50">Action</th>
                            {/* <th className="px-4">WorkLogs</th> */}
                        </tr>
                    </thead>

                    <tbody className="py-5">
                        {paginatedRows?.map(({ row: client, originalIndex }, index) => {
                            // const globalIndex = index + 1;
                            // agar pagination ho to:
                            // const globalIndex = index + 1 + (currentPage - 1) * rowsPerPage;
                            const globalIndex = originalIndex;
                            const serialNumber = originalIndex + 1;
                            return (
                                <tr key={globalIndex} className="text-center border ">
                                    <td
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (!client.isNew && activeParents.includes(client.ClientID)) {

                                                if (e.key === "+") {
                                                    e.preventDefault();
                                                    handleAddRow(
                                                        client.ClientID,
                                                        editedRows.findIndex(
                                                            (row) =>
                                                                row.ClientID === client.ClientID && !row.isNew
                                                        )
                                                    );
                                                }

                                                if (e.key === "-") {
                                                    e.preventDefault();
                                                    handleRemoveRow(client.ClientID);
                                                }
                                            }
                                        }}
                                    >
                                        {client.isNew ? null : (
                                            activeParents.includes(client.ClientID) ? (
                                                <>
                                                    <button
                                                        className="py-1 px-3 bg-gray-200 rounded-full mr-2"
                                                        onClick={() =>
                                                            handleAddRow(
                                                                client.ClientID,
                                                                globalIndex
                                                            )
                                                        }
                                                    >
                                                        +
                                                    </button>

                                                    <button
                                                        className="py-1 px-3 bg-red-200 rounded-full"
                                                        onClick={() =>
                                                            handleRemoveRow(client.ClientID)
                                                        }
                                                    >
                                                        -
                                                    </button>
                                                </>
                                            ) : (
                                                <input
                                                    type="checkbox"
                                                    className="scale-125 accent-black"
                                                    checked={activeParents.includes(client.ClientID)}
                                                    onChange={(e) =>
                                                        handleCheckboxChange(
                                                            e.target.checked,
                                                            client.ClientID,
                                                            globalIndex   // 🔥 direct map cha index pass kar
                                                        )
                                                    }
                                                />
                                            )
                                        )}
                                    </td>
                                    <td className="py-7">{serialNumber}</td>
                                    {/* <td className="py-7 whitespace-nowrap">{client.Date}</td> */}

                                    {/* <EditableCell rowIndex={index} field="ID" /> */}
                                    <EditableCell rowIndex={globalIndex} field="PropertyCode" />
                                    <EditableCell rowIndex={globalIndex} field="BedNo" />
                                    <EditableCell rowIndex={globalIndex} field="ClientID" />
                                    <EditableCell rowIndex={globalIndex} field="IsActive" />
                                    <EditableCell rowIndex={globalIndex} field="Name" />
                                    <EditableCell rowIndex={globalIndex} field="DOJ" />
                                    <EditableCell rowIndex={globalIndex} field="ActualDOJ" />
                                    <EditableCell rowIndex={globalIndex} field="TemporaryPropCode" />
                                    <EditableCell rowIndex={globalIndex} field="RentDate" />
                                    <EditableCell rowIndex={globalIndex} field="RentDateComments" />
                                    <EditableCell rowIndex={globalIndex} field="WhatsAppNo" />
                                    <EditableCell rowIndex={globalIndex} field="CallingNo" />
                                    <EditableCell rowIndex={globalIndex} field="KYCDocuments" />
                                    <td className="px-4 py-3">
                                        {renderFilePreview(client.AddharCard)}
                                    </td>

                                    <td className="px-4 py-3">
                                        {renderFilePreview(client.Photo)}
                                    </td>

                                    <td className="px-4 py-3">
                                        {renderFilePreview(client.CompanyID)}
                                    </td>

                                    <td className="px-4 py-3">
                                        {renderFilePreview(client.CollageID)}
                                    </td>

                                    <td className="px-4 py-3">
                                        {renderFilePreview(client.ClientAgreement)}
                                    </td>

                                    <td className="px-4 py-3">
                                        {renderFilePreview(client.ClientPoliceNoc)}
                                    </td>

                                    <td className="px-4 py-3">
                                        {renderFilePreview(client.PanCard)}
                                    </td>
                                    <td className="px-4 py-3">
                                        {renderFilePreview(client.Attachment)}
                                    </td>
                                    <EditableCell rowIndex={globalIndex} field="DigitalSelfDeclearationAccepted" />
                                    <EditableCell rowIndex={globalIndex} field="DigitalPGLegalDocAccepted" />
                                    <EditableCell rowIndex={globalIndex} field="DigitalSignedDetails" />
                                    <EditableCell rowIndex={globalIndex} field="EmgyCont1FullName" />
                                    <EditableCell rowIndex={globalIndex} field="EmgyCont1No" />
                                    <EditableCell rowIndex={globalIndex} field="EmgyCont2FullName" />
                                    <EditableCell rowIndex={globalIndex} field="EmgyCont2No" />
                                    <EditableCell rowIndex={globalIndex} field="EmailID" />
                                    <EditableCell rowIndex={globalIndex} field="ParkingCharges" />
                                    <EditableCell rowIndex={globalIndex} field="BloodGroup" />
                                    <EditableCell rowIndex={globalIndex} field="Occupation" />
                                    <EditableCell rowIndex={globalIndex} field="Organization" />
                                    <EditableCell rowIndex={globalIndex} field="NoticeSD" />
                                    <EditableCell rowIndex={globalIndex} field="NoticeLD" />
                                    <EditableCell rowIndex={globalIndex} field="ActualVD" />
                                    <EditableCell rowIndex={globalIndex} field="Comments" />
                                    <EditableCell rowIndex={globalIndex} field="WorkLogs" />
                                    <EditableCell rowIndex={globalIndex} field="LoginID" />
                                    <EditableCell rowIndex={globalIndex} field="Role" />
                                    <td>{client.Password}</td>



                                    <td className="flex justify-center items-center gap-5 sticky right-0  h-20 bg-gray-100">
                                        {
                                            (
                                                client.IsActive?.toLowerCase()?.trim() === "yes" ||
                                                (
                                                    client.IsActive?.toLowerCase()?.trim() === "no" &&
                                                    client?.Name?.toLowerCase()?.trim()
                                                )
                                            ) && (
                                                <>

                                                    <button
                                                        onClick={() => handleEdit(client)}
                                                        className="text-orange-500 flex text-xl items-center justify-center"
                                                    >
                                                        {/* <FaRegEdit size={20} /> */}
                                                        <i className="fa fa-eye"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(client)}
                                                        className="text-orange-500 flex text-xl items-center justify-center"
                                                    >
                                                        {/* <FaRegEdit size={20} /> */}
                                                        <i className="fas fa-edit"></i>
                                                    </button></>
                                            )}

                                    </td>

                                </tr>
                            );
                        })}

                        {selectedImage && (
                            <tr>
                                <td colSpan={999}>
                                    <div
                                        onClick={handleClose}
                                        className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 cursor-pointer"
                                    >
                                        <img
                                            src={selectedImage}
                                            alt="Preview"
                                            className="max-w-[70%] max-h-[70%] rounded-lg shadow-lg border-4 border-white"
                                        />
                                    </div>
                                </td>
                            </tr>
                        )}

                    </tbody>
                </table>
            </div>
            <div className="flex justify-center items-center gap-6 m-5">
                <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="px-4 py-2 bg-black  text-white rounded disabled:opacity-50"
                >
                    <i className="fa-solid fa-arrow-left"></i> Previous
                </button>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
                >
                    Next <i className="fa-solid fa-arrow-right"></i>
                </button>
            </div>
        </div>
    );
}

export default ClientMasterTable;