import React, { useEffect, useState, useRef } from "react";

import { CiFilter } from "react-icons/ci";
import Select from "react-select";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Skeleton, { TableSkeleton } from "./Skeleton";
import { useExpensesDetails, useUpdateExpensesDetails } from "./services";
import { useDynamicDetails } from "../TicketSystem/Services";
import { useApp } from "../TicketSystem/AppProvider";
import LoaderPage from "../NewBooking/LoaderPage";
import { sr } from "date-fns/locale";

function ExpenseList() {
    // ------------- API HOOKS ---------------
    const { data, refetch, isPending } = useExpensesDetails();
    const { mutateAsync: updateExpense, isPending: isUpdating } = useUpdateExpensesDetails();
    const { decryptedUser } = useApp();
    const apiData = data?.data || [];
    const { data: dynamicData } = useDynamicDetails();

    //  --------------- COLUMNS & HEADINGS ---------------
    const employeeSelectStyles = {
        control: (base, state) => ({
            ...base,
            padding: "0.14rem 0.5rem",
            borderWidth: "1px",
            border: "none",
            width: "100%",
            outline: "none",
            borderRadius: "0.375rem",
            boxShadow: state.isFocused
                ? "0 0 0 2px rgba(251,146,60,0.4)"
                : "none",
            minHeight: "38px",
            cursor: "pointer",
        }),
        option: (base, state) => ({
            ...base,
            cursor: "pointer",
            Size: "10px",
            backgroundColor: state.isFocused
                ? "#fed7aa"
                : state.isSelected
                    ? "#fb923c"
                    : "white",
            color: state.isSelected ? "white" : "#f97316",
            fontWeight: state.isSelected ? "600" : "400",
        }),
        menuList: (base) => ({
            ...base,
            maxHeight: "200px",
            paddingTop: 0,
            paddingBottom: 0,
        }),
        menu: (base) => ({
            ...base,
            zIndex: 9999,
        }),
    };

    const columns = [
        "SrNo",
        "Date",
        "Amount",
        "Category",
        "Vendor",
        "Comments",
        "VehicleNo",
        "WorkLog"
    ];

    const Heading = [
        "SrNo",
        "Date",
        "Amount",
        "Category",
        "Vendor",
        "Comments",
        "Vehicle No",
        "WorkLog"
    ];

    // Select fields for navigation
    const selectFields = ["Category", "VehicleNo"];

    // ------------- LOG DATE FORMATTER ---------------
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

    // ------------ STATE ---------------
    const [originalRows, setOriginalRows] = useState([]);
    const [rows, setRows] = useState([]);
    const [editingCell, setEditingCell] = useState(null);
    const [dateRange, setDateRange] = useState({
        from: null,
        to: null,
    });
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const [searchInput, setSearchInput] = useState("");
    const [searchData, setSearchData] = useState("");
    const [openFilter, setOpenFilter] = useState(null);
    // Ref for menu open state
    const menuOpenRef = useRef(false);

    // ------------ LOAD API DATA ---------------
    useEffect(() => {
        if (!apiData.length) return;

        const dataWithSrNo = apiData.map((row, index) => ({
            SrNo: index + 1,
            ...row,
            __isNew: false,
            __isEdited: false,
        }));


        setRows(dataWithSrNo);
        setOriginalRows(dataWithSrNo);
    }, [apiData]);

    // ------------ FILTER STATE ---------------
    const [filters, setFilters] = useState({
        Category: [],
        search: []
    });

    // ------------ SEARCH DEBOUNCE ---------------
    useEffect(() => {
        const handler = setTimeout(() => {
            setSearchData(searchInput);
        }, 1000);
        return () => clearTimeout(handler);
    }, [searchInput]);

    // ------------ FILTER OPTIONS ---------------
    const visitedOptions = Array.from(
        new Set(dynamicData?.data?.map((i) => i.CategoriesExpenses).filter(Boolean))
    ).map((v) => ({ value: v, label: v })) || [];

    const filterConfig = [
        { key: "Category", label: "Category", options: visitedOptions },
    ];

    // ------------ FILTER LOGIC ---------------
    const isAnyFilterApplied =
        Object.values(filters).some(arr => arr.length > 0) ||
        dateRange.from !== null ||
        dateRange.to !== null;

    const normalizeDate = (date) => {
        if (!date) return null;
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d;
    };

    const filteredRows = rows.filter((r) => {
        const rowDate = normalizeDate(r.Date);
        const fromDate = normalizeDate(dateRange.from);
        const toDate = normalizeDate(dateRange.to);

        const matchesDate =
            (!fromDate || rowDate >= fromDate) &&
            (!toDate || rowDate <= toDate);

        const matchesFilters =
            filters.Category.length === 0 || filters.Category.includes(r.Category);

        const matchesSearch = searchData
            ? [
                r.SrNo,
                r.Date,
                r.Amount,
                r.Category,
                r.VehicleNo,
                r.Vendor,
                r.Comments,
            ].some(v =>
                String(v ?? "")
                    .toLowerCase()
                    .includes(searchData.trim().toLowerCase())
            )
            : true;

        return matchesDate && matchesSearch && matchesFilters;
    });

    const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

    const paginatedRows = filteredRows.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [filters]);

    // ------------- CREATE EMPTY ROW ---------------
    const createEmptyRow = () => {
        const maxSrNo = Math.max(...rows.map(r => r.SrNo || 0), 0);
        const row = {
            SrNo: maxSrNo + 1,
            __isNew: true,
            __isEdited: true
        };
        columns.forEach(c => {
            if (c !== "SrNo" && c !== "Date" && c !== "WorkLog") {
                row[c] = "";
            }
        });
        return row;
    };

    // ------------ HANDLE CELL EDIT ---------------
    const handleCellEdit = (rowIndex, field, value) => {
        setRows(prev => {
            const newRows = [...prev];
            newRows[rowIndex] = { ...newRows[rowIndex], [field]: value, __isEdited: true };
            return newRows;
        });
    };

    // ------------ CLEAR FILTERS ---------------
    const handleClearAllFilters = () => {
        setFilters({ Category: [], search: [] });
        setDateRange({ from: null, to: null });
        setSearchInput("");
    };

    // ------------- SAVE ALL CHANGES ---------------
    const saveAll = async () => {
        // STEP 1: VEHICLE VALIDATION
        const vehicleRequiredCategories = [
            "Petrol",
            "Maintenance",
            "Insurance",
            "PUC",
        ];

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const category = row.Category;
            const vehicleNo = row.VehicleNo;
            const SrNo = row.SrNo;
            if (
                vehicleRequiredCategories.includes(category) &&
                !vehicleNo?.trim()
            ) {
                toast.dismiss();
                toast.error(
                    `Vehicle number is required for Sr. No. ${SrNo} in the ${category} category.`,
                    { toastId: "vehicle-required" }
                );
                return;
            }
        }

        // STEP 2: SAVE LOGIC
        const payload = rows
            .filter((r) => r.__isNew || r.__isEdited)
            .map((r) => {
                const clean = { ...r };
                const original = originalRows.find((o) => o.SrNo === r.SrNo);

                const oldLog = clean.WorkLog || "";
                const logHeader = `[${formatLogDate()} -(${decryptedUser?.employee?.EmployeeID}) ${decryptedUser?.employee?.Name}]`;

                let changeLogs = [];

                // FIELD CHANGE DETECTION
                if (original) {
                    Object.keys(r).forEach((key) => {
                        if (
                            !["WorkLog", "Comments", "__isNew", "__isEdited", "SrNo", "Date"].includes(key) &&
                            r[key] !== original[key]
                        ) {
                            changeLogs.push(
                                `${key} changed from "${original[key] || ""}" to "${r[key] || ""}"`
                            );
                        }
                    });
                } else {
                    // New row - add creation log
                    changeLogs.push("Expense Created");

                    // Log all fields that were filled
                    Object.keys(r).forEach((key) => {
                        if (
                            !["WorkLog", "Comments", "__isNew", "__isEdited", "SrNo", "Date", "Amount"].includes(key) &&
                            r[key] && r[key] !== ""
                        ) {
                            changeLogs.push(`${key} set to "${r[key]}"`);
                        }
                    });
                }

                // COMMENT LOG
                const newComment = clean.Comments?.trim();
                if (newComment) {
                    changeLogs.push(`Comment: ${newComment}`);
                }

                // FINAL WORKLOG BUILD
                if (changeLogs.length > 0) {
                    const finalLog = `${logHeader}\n${changeLogs.join("\n")}`;
                    clean.WorkLog = oldLog
                        ? `${finalLog}\n\n${oldLog}`
                        : finalLog;

                }

                clean.Comments = "";

                // Clean up temporary flags but KEEP SrNo for API
                delete clean.__isNew;
                delete clean.__isEdited;

                return clean;
            });

        if (!payload.length) {
            toast.warn("No changes found");
            return;
        }
        console.log("Payload to save:", payload);
        await updateExpense({ data: payload });
        toast.success("Expenses Updated successfully!");

        // Refresh data
        await refetch();

        setEditingCell(null);
    };

    const addNewRow = () => {
        const newRow = createEmptyRow();

        setRows(prev => [newRow, ...prev]);

        // focus first editable cell
        setTimeout(() => {
            setEditingCell({
                rowIndex: 0,
                field: "Amount"
            });
        }, 100);
    };

    const deleteLastNewRow = () => {
        setRows(prev => {
            const lastNewIndex = [...prev]
                .map((row, index) => ({ row, index }))
                .reverse()
                .find(item => item.row.__isNew)?.index;

            if (lastNewIndex === undefined) return prev;

            return prev.filter((_, index) => index !== lastNewIndex);
        });

        setEditingCell(null);
    };
    // ------------- GLOBAL KEY HANDLER ---------------
    useEffect(() => {
        const handleKey = async (e) => {
            // ➕ Add New Row
            if (e.key === "+" || (e.key === "=" && e.shiftKey)) {
                e.preventDefault();
                const newRow = createEmptyRow();
                setRows(prev => [newRow, ...prev]);

                // Find the index of the new row
                setTimeout(() => {
                    setEditingCell({ rowIndex: 0, field: "Amount" });
                }, 100);
            }

            // 💾 Save
            if ((e.ctrlKey || e.metaKey) && e.key === "s") {
                e.preventDefault();
                await saveAll();
            }

            // ❌ ESC → Remove Unsaved New Row
            if (e.key === "Escape" || e.key === "-") {
                setRows(prev => {
                    const lastNewIndex = [...prev]
                        .map((row, index) => ({ row, index }))
                        .reverse()
                        .find(item => item.row.__isNew)?.index;

                    if (lastNewIndex === undefined) return prev;

                    return prev.filter((_, index) => index !== lastNewIndex);
                });

                // setEditingCell(null);
            }
        }

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [rows]);

    // ------------ GET OPTIONS FOR SELECT FIELDS ---------------
    const getOptions = (field) => {
        if (!dynamicData?.data) return [];

        const unique = (key) =>
            Array.from(
                new Set(dynamicData.data.map(i => i[key]).filter(Boolean))
            ).map(v => ({ label: v, value: v }));

        switch (field) {
            case "Category":
                return unique("CategoriesExpenses");
            case "VehicleNo":
                return unique("VehicleNo");
            default:
                return [];
        }
    };

    // Field order for navigation (excluding read-only fields)
    const fieldOrder = columns.filter(
        (col) => col !== "SrNo" && col !== "Date" && col !== "WorkLog"
    );

    // Get next cell based on current position and direction
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
        } else if (direction === "down") {
            newRow++;
        } else if (direction === "up") {
            newRow--;
        }

        if (newRow < 0) newRow = 0;
        if (newRow >= rows.length) newRow = rows.length - 1;

        return { rowIndex: newRow, field: fieldOrder[newCol] };
    };
    const selectRef = useRef(null);
    // ------------ EDITABLE CELL COMPONENT ---------------
    const EditableCell = ({ rowData, rowIndex, colIndex }) => {
        const field = columns[colIndex];
        const value = rowData?.[field] || "";

        const isReadOnly =
            field === "SrNo" ||
            field === "Date" ||
            field === "WorkLog";

        const isEditing =
            editingCell?.rowIndex === rowIndex &&
            editingCell?.field === field;

        // Vehicle disabled condition
        const vehicleEnabledCategories = [
            "Petrol",
            "Maintenance",
            "Insurance",
            "PUC",
        ];
        const selectedCategory = rows[rowIndex]?.Category;
        const isVehicleDisabled = field === "VehicleNo" &&
            !vehicleEnabledCategories.includes(selectedCategory);

        /* ================= READ ONLY ================= */
        if (isReadOnly) {

            if (field === "WorkLog") {
                const logs = value
                    ? value.split(/\n\s*\n/) // split by empty line
                    : [];

                return (
                    <td className="relative px-2 py-2 border-b group text-center">
                        <div className="text-xs text-gray-700 cursor-pointer whitespace-pre-wrap break-words">
                            {value ? value.substring(0, 28) + "..." : "No WorkLog"}
                        </div>

                        {value && (
                            <div
                                className="absolute z-50 hidden group-hover:block bg-white border
          p-5 rounded-xl shadow-2xl w-[480px] max-h-[250px]
          overflow-y-auto right-12 text-left"
                            >
                                {logs.map((log, index) => {
                                    const lines = log.split("\n");
                                    const timestamp = lines[0];
                                    const message = lines.slice(1).join("\n");


                                    return (
                                        <div key={index} className="mb-5 last:mb-0">
                                            {/* Timestamp */}
                                            <div className="text-xs text-gray-500 mb-1">
                                                {timestamp}
                                            </div>

                                            {/* Main Log Content */}
                                            <div className="font-semibold text-gray-800 whitespace-pre-wrap leading-relaxed text-sm">
                                                {message}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </td>
                );

            }

            return (
                <td className="px-3 py-4 border-b text-center whitespace-nowrap">
                    {value || "-"}
                </td>
            );
        }




        /* ================= NORMAL VIEW ================= */
        if (!isEditing) {
            return (
                <td
                    className="px-3 py-2 border-b text-center cursor-pointer hover:bg-orange-50"
                    onDoubleClick={() => setEditingCell({ rowIndex, field })}
                >
                    {value || "-"}
                </td>
            );
        }


        const openSelectMenu = () => {
            if (selectRef.current) {
                // Try to open the menu
                selectRef.current.onMenuOpen();
            }
        };

        /* ================= SELECT FIELD ================= */
        if (selectFields.includes(field)) {
            const options = getOptions(field);
            const selectedOption = options.find(o => o.value === value) || null;

            return (
                <td className="border-b relative py-3 min-w-[150px]">
                    <div className="flex items-center justify-center">
                        <Select
                            autoFocus
                            ref={selectRef}
                            isClearable
                            isDisabled={isVehicleDisabled}
                            value={selectedOption}
                            options={options}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            styles={employeeSelectStyles}
                            placeholder={`Select ${field}`}
                            onMenuOpen={() => {
                                menuOpenRef.current = true;
                            }}
                            onMenuClose={() => {
                                menuOpenRef.current = false;
                            }}
                            onChange={(selected) => {
                                if (isVehicleDisabled) return;
                                handleCellEdit(rowIndex, field, selected?.value || "");
                            }}
                            onKeyDown={(e) => {
                                // Space key to open dropdown
                                if (e.key === " " || e.key === "Space") {
                                    e.preventDefault();
                                    if (!menuOpenRef.current) {
                                        // Force open dropdown by focusing and triggering menu
                                        openSelectMenu();


                                    }
                                    return;
                                }


                                // If menu is open, let Select handle navigation
                                if (menuOpenRef.current) {
                                    // Allow default behavior for navigation keys
                                    if (e.key === "ArrowDown" || e.key === "ArrowUp" ||
                                        e.key === "Enter" || e.key === "Escape") {
                                        return;
                                    }
                                }

                                let next;
                                switch (e.key) {
                                    case "Tab":
                                        e.preventDefault();
                                        handleCellEdit(rowIndex, field, selectedOption?.value || "");
                                        next = getNextCell(
                                            rowIndex,
                                            field,
                                            e.shiftKey ? "left" : "right"
                                        );
                                        setEditingCell(next);
                                        break;

                                    case "Enter":
                                        e.preventDefault();
                                        if (menuOpenRef.current) {
                                            // Menu open hai to sirf value save karo
                                            handleCellEdit(rowIndex, field, selectedOption?.value || "");
                                            // Menu automatically close ho jayega
                                        } else {
                                            // Menu closed hai to next cell mein jao
                                            handleCellEdit(rowIndex, field, selectedOption?.value || "");
                                            next = getNextCell(rowIndex, field, "right");
                                            setEditingCell(next);
                                        }
                                        break;

                                    case "ArrowRight":
                                        e.preventDefault();
                                        if (!menuOpenRef.current) {
                                            handleCellEdit(rowIndex, field, selectedOption?.value || "");
                                            next = getNextCell(rowIndex, field, "right");
                                            setEditingCell(next);
                                        }
                                        break;

                                    case "ArrowLeft":
                                        e.preventDefault();
                                        if (!menuOpenRef.current) {
                                            handleCellEdit(rowIndex, field, selectedOption?.value || "");
                                            next = getNextCell(rowIndex, field, "left");
                                            setEditingCell(next);
                                        }
                                        break;

                                    case "ArrowDown":
                                        e.preventDefault();
                                        if (!menuOpenRef.current) {
                                            handleCellEdit(rowIndex, field, selectedOption?.value || "");
                                            next = getNextCell(rowIndex, field, "down");
                                            setEditingCell(next);
                                        }
                                        break;

                                    case "ArrowUp":
                                        e.preventDefault();
                                        if (!menuOpenRef.current) {
                                            handleCellEdit(rowIndex, field, selectedOption?.value || "");
                                            next = getNextCell(rowIndex, field, "up");
                                            setEditingCell(next);
                                        }
                                        break;
                                }
                            }}
                        />
                    </div>
                </td>
            );
        }


        /* ================= INPUT FIELD ================= */
        return (
            <td className="border relative">
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <input
                        autoFocus
                        type={field === "Amount" ? "number" : "text"}
                        defaultValue={value}
                        isDisabled={isReadOnly}
                        className="h-full w-full bg-transparent border-2 text-center focus:outline-none"
                        onBlur={(e) => {
                            handleCellEdit(rowIndex, field, e.target.value);
                            setEditingCell(null);
                        }}
                        onKeyDown={(e) => {
                            let next;

                            switch (e.key) {
                                case "Enter":
                                    e.preventDefault();
                                    next = getNextCell(rowIndex, field, "right");
                                    handleCellEdit(rowIndex, field, e.target.value);
                                    setEditingCell(next);
                                    break;

                                case "Tab":
                                    e.preventDefault();
                                    next = getNextCell(rowIndex, field, e.shiftKey ? "left" : "right");
                                    handleCellEdit(rowIndex, field, e.target.value);
                                    setEditingCell(next);
                                    break;

                                case "ArrowRight":
                                    e.preventDefault();
                                    next = getNextCell(rowIndex, field, "right");
                                    handleCellEdit(rowIndex, field, e.target.value);
                                    setEditingCell(next);
                                    break;

                                case "ArrowLeft":
                                    e.preventDefault();
                                    next = getNextCell(rowIndex, field, "left");
                                    handleCellEdit(rowIndex, field, e.target.value);
                                    setEditingCell(next);
                                    break;

                                case "ArrowDown":
                                    e.preventDefault();
                                    next = getNextCell(rowIndex, field, "down");
                                    handleCellEdit(rowIndex, field, e.target.value);
                                    setEditingCell(next);
                                    break;

                                case "ArrowUp":
                                    e.preventDefault();
                                    next = getNextCell(rowIndex, field, "up");
                                    handleCellEdit(rowIndex, field, e.target.value);
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


    if (isPending) return (
        <TableSkeleton />

    );

    // ------------- MAIN UI ---------------
    return (
        <div className="max-w-full mx-auto p-2 bg-[#F8F9FB] rounded shadow  ">
            {/* FILTER SECTION */}
            <div className="flex flex-wrap justify-center items-center gap-3 mb-3 relative  ">
                <div className="flex flex-wrap gap-2 items-center mx-auto">
                    {/* Search Input */}
                    <div className="flex items-center gap-2 bg-white border border-orange-400 px-3 py-1 rounded-xl shadow">
                        <input
                            type="text"
                            value={searchInput}
                            placeholder="Search..."
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-28 text-center outline-none text-sm"
                        />
                    </div>

                    {/* Date Range Picker */}
                    <div className="flex items-center gap-2 bg-white border border-orange-400 px-3 py-1 z-30 rounded-xl shadow">
                        <span className="text-sm text-orange-600 font-medium">From</span>
                        <DatePicker
                            selected={dateRange.from}
                            onChange={(date) => setDateRange((p) => ({ ...p, from: date }))}
                            selectsStart
                            startDate={dateRange.from}
                            endDate={dateRange.to}
                            dateFormat="dd MMM yyyy"
                            placeholderText="Start Date"
                            className="w-24 text-center outline-none text-sm"
                        />
                        <span className="text-sm text-orange-600 font-medium">To</span>
                        <DatePicker
                            selected={dateRange.to}
                            onChange={(date) => setDateRange((p) => ({ ...p, to: date }))}
                            selectsEnd
                            startDate={dateRange.from}
                            endDate={dateRange.to}
                            minDate={dateRange.from}
                            dateFormat="dd MMM yyyy"
                            placeholderText="End Date"
                            className="w-24 text-center outline-none text-sm"
                        />
                    </div>

                    {/* Category Filter */}
                    {filterConfig.map((f) => (
                        <div
                            key={f.key}
                            className="relative"
                            onMouseEnter={() => setOpenFilter(f.key)}
                            onMouseLeave={() => setOpenFilter(null)}
                        >
                            <button className="border border-orange-400 px-4 py-1 text-orange-500 rounded-xl bg-white shadow flex items-center gap-2 whitespace-nowrap">
                                {f.icon}{f.label}
                                {filters[f.key].length > 0 && (
                                    <span className="text-sm bg-orange-400 text-white px-2 rounded-full">
                                        {filters[f.key].length}
                                    </span>
                                )}
                            </button>

                            {openFilter === f.key && (
                                <div className="absolute right-0 w-52 bg-white border rounded-xl shadow-xl z-50 p-5 border-orange-300">
                                    <div className="flex gap-2 mb-2 flex-wrap">
                                        <button
                                            onClick={() =>
                                                setFilters((p) => ({
                                                    ...p,
                                                    [f.key]: f.options.map(o => o.value),
                                                }))
                                            }
                                            className="bg-green-100 text-green-700 text-[13px] py-1 px-2 rounded"
                                        >
                                            Select All
                                        </button>
                                        <button
                                            onClick={() =>
                                                setFilters((p) => ({ ...p, [f.key]: [] }))
                                            }
                                            className="bg-red-100 text-red-600 px-2 text-[13px] rounded"
                                        >
                                            Clear
                                        </button>
                                    </div>

                                    {f.options.map((opt) => {
                                        const value = opt.value ?? opt;
                                        return (
                                            <label key={value} className="flex gap-2 text-md whitespace-nowrap items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={filters[f.key].includes(value)}
                                                    onChange={(e) =>
                                                        setFilters((p) => ({
                                                            ...p,
                                                            [f.key]: e.target.checked
                                                                ? [...p[f.key], value]
                                                                : p[f.key].filter((x) => x !== value),
                                                        }))
                                                    }
                                                />
                                                {opt.label ?? opt}
                                            </label>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Clear Filters Button */}
                    {isAnyFilterApplied && (
                        <button
                            onClick={handleClearAllFilters}
                            className="flex items-center bg-orange-100 justify-between h-8 gap-2 px-4 py-1 border border-orange-500 text-orange-600 rounded-xl hover:bg-orange-50 shadow-sm transition-all whitespace-nowrap"
                        >
                            <span className="font-medium flex items-center gap-2">
                                <CiFilter /> Clear
                            </span>
                        </button>
                    )}

                    {/* Save Button */}
                    <div className="flex">
                        <button
                            onClick={saveAll}
                            disabled={isUpdating}
                            className="px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-500 disabled:opacity-50 min-w-[80px]"
                        >
                            {isUpdating ? (
                                <div className="flex items-center justify-center gap-2">
                                    <LoaderPage /> <span>Saving</span>
                                </div>
                            ) : "Save"}
                        </button>
                    </div>

                    <button
                        onClick={addNewRow}
                        className="px-4 py-2 bg-green-600 text-white rounded"
                    >
                        + Add Row
                    </button>

                    <button
                        onClick={deleteLastNewRow}
                        className="px-4 py-2 bg-red-600 text-white rounded"
                    >
                        Delete New Row
                    </button>
                </div>
            </div>

            {/* TABLE SECTION */}
            <div className="overflow-auto max-h-[400px] bg-white rounded ">
                <table className="min-w-full border-collapse">
                    {/* Table Headers */}
                    <thead className="bg-black text-white sticky top-0 z-10">
                        <tr>
                            {Heading.map((c, index) => (
                                <th key={index} className="px-5 py-3 text-center whitespace-nowrap border">
                                    {c}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody>
                        {filteredRows.length > 0 ? (
                            paginatedRows.map((row, idx) => {
                                // Find actual index in original rows array
                                const actualIndex = rows.findIndex(r => r.SrNo === row.SrNo);
                                return (
                                    <tr key={row.SrNo} className="hover:bg-gray-50">
                                        {columns.map((column, colIndex) => (
                                            <EditableCell
                                                key={`${row.SrNo}-${column}`}
                                                rowData={row}
                                                rowIndex={actualIndex}
                                                colIndex={colIndex}
                                            />
                                        ))}
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="text-center py-8 text-gray-500">
                                    No expenses found
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
                    className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
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

export default ExpenseList;