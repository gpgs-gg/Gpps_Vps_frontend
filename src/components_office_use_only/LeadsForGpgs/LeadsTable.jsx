import { useEffect, useRef, useState } from "react";
import {
  useLeadsDetails,
  useUpdateClientDetails,
} from "./services";
import { FaRegEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { useDynamicDetails } from "../TicketSystem/Services";
import LoaderPage from "../NewBooking/LoaderPage";
import { toast } from "react-toastify";
import { useApp } from "../TicketSystem/AppProvider";
import { FaBed, FaWhatsapp } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { PiPhoneCallFill } from "react-icons/pi";
import Select from "react-select";
import { AiOutlineClear } from "react-icons/ai";
import { SignalZero } from "lucide-react";


function LeadsTable({ setActiveTab, activeLead, setActiveLead }) {
  const { decryptedUser, selectedClient, setSelectedClient } = useApp();
  const navigate = useNavigate();
  const { data, isPending } = useLeadsDetails();
  const { mutateAsync: updateClient } = useUpdateClientDetails();
  const { data: dynamicData } = useDynamicDetails();
  const clientList = data?.data || [];
  const menuOpenRef = useRef(false);
  const [rows, setRows] = useState([]);
  const [editedRows, setEditedRows] = useState([]);
  const [editingCell, setEditingCell] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  /* ================= PAGINATION ================= */
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20; // you can change this

  /* ================= FILTER STATES ================= */
  const [filters, setFilters] = useState({
    BookingStatus: [],
    Visited: [],
    PhoneCalls: [],
    WhatsAppMsgs: [],
  });

  const [openFilter, setOpenFilter] = useState(null);

  /* ================= FILTER OPTIONS ================= */
  const phoneCallOptions =
    Array.from(
      new Set(dynamicData?.data?.map((i) => i.CallStatus).filter(Boolean))
    ).map((v) => ({ value: v, label: v })) || [];

  const whatsappOptions =
    Array.from(
      new Set(dynamicData?.data?.map((i) => i.WhatsAppStatus).filter(Boolean))
    ).map((v) => ({ value: v, label: v })) || [];

  const bookingStatusOptions =
    Array.from(
      new Set(dynamicData?.data?.map((i) => i.BookingStatus).filter(Boolean))
    ).map((v) => ({ value: v, label: v })) || [];
  const visitedOptions = Array.from(
    new Set(dynamicData?.data?.map((i) => i.Visited).filter(Boolean))
  ).map((v) => ({ value: v, label: v })) || [];
  const filterConfig = [
    { key: "BookingStatus", label: "Booking Status", options: bookingStatusOptions, icon: <FaBed /> },
    { key: "Visited", label: "Visited", options: visitedOptions, icon: <MdLocationOn /> },
    { key: "PhoneCalls", label: "Phone Call", options: phoneCallOptions, icon: <PiPhoneCallFill /> },
    { key: "WhatsAppMsgs", label: "WhatsApp", options: whatsappOptions, icon: <FaWhatsapp /> },
  ];

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    if (!clientList.length) return;
    setRows(clientList);
    setEditedRows(JSON.parse(JSON.stringify(clientList)));
    setHasChanges(false);
  }, [clientList]);


  /* ---------------- APPLY FILTER ---------------- */
  const filteredRows = editedRows.filter((c) =>
    (filters.BookingStatus.length === 0 || filters.BookingStatus.includes(c.BookingStatus)) &&
    (filters.Visited.length === 0 || filters.Visited.includes(c.Visited)) &&
    (filters.PhoneCalls.length === 0 || filters.PhoneCalls.includes(c.PhoneCalls)) &&
    (filters.WhatsAppMsgs.length === 0 || filters.WhatsAppMsgs.includes(c.WhatsAppMsgs))
  );
  // ==================== Clear All Filter ======================================
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleClearAllFilters = () => {
    setFilters({
      BookingStatus: [],
      Visited: [],
      PhoneCalls: [],
      WhatsAppMsgs: [],
    });
  };
  const isAnyFilterApplied = Object.values(filters).some(
    (arr) => arr.length > 0
  );

  /* ---------------- EDIT CELL ---------------- */
  const handleCellEdit = (rowIndex, field, value) => {
    setEditedRows((prev) => {
      const updated = [...prev];
      updated[rowIndex] = { ...updated[rowIndex], [field]: value };
      return updated;
    });

    // 🔥 Check if anything changed including newWorkLog
    const original = rows[rowIndex];
    if (field === "newWorkLog" || value !== original[field]) {
      setHasChanges(true);
    }
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
  /* ------------------- Handle Edit Client --------------------- */
  const handleEdit = (client) => {
    setSelectedClient(client);
    setActiveTab("CreateLead");
    setActiveLead("CreateSingleLead");

  };

  /* ---------------- SAVE ---------------- */
  const handleSave = async () => {
    setSaving(true);

    try {
      const payload = [];

      editedRows.forEach((edited, index) => {
        const original = rows[index];
        const changedFields = [];
        const updateData = {};

        Object.keys(edited).forEach((key) => {
          if (key === "newWorkLog") return;

          if (edited[key] !== original[key]) {
            updateData[key] = edited[key];

            // 🔥 Human readable field names
            const fieldLabels = {
              PhoneCalls: "Phone Call",
              WhatsAppMsgs: "WhatsAppMsgs",
              BookingStatus: "Booking Status",
              Visited: "Visited",
              LeadSource: "Lead Source",
              Gender: "Gender",
              Location: "Location",
            };

            changedFields.push(
              `${fieldLabels[key] || key} changed from ${original[key] || ''} To ${edited[key] || ''}`
            );
          }
        });

        let finalWorkLog = original.workLogs || "";

        // ✅ Auto log for field changes
        if (changedFields.length > 0) {
          finalWorkLog +=
            `${finalWorkLog ? "\n" : ""}` +
            `Updated by [${formatLogDate()} - (${decryptedUser.id}) ${decryptedUser.name}]\n` +
            changedFields.join("\n");
        }

        // ✅ Manual comment also appended
        if (edited.newWorkLog?.trim()) {
          finalWorkLog +=
            `${finalWorkLog ? "\n" : ""}` +
            `Comment:\n${edited.newWorkLog}`;
        }

        if (changedFields.length > 0 || edited.newWorkLog?.trim()) {
          payload.push({
            LeadNo: edited.LeadNo,
            ...updateData,
            workLogs: finalWorkLog,
          });
        }
      });

      if (!payload.length) {
        toast.warn("No changes found");
        setSaving(false);
        return;
      }

      await updateClient({ data: payload });

      // ✅ Reset newWorkLog
      const updatedRows = editedRows.map((row) => ({
        ...row,
        newWorkLog: "",
      }));

      setRows(JSON.parse(JSON.stringify(updatedRows)));
      setEditedRows(JSON.parse(JSON.stringify(updatedRows)));

      setHasChanges(false);
      toast.success("Leads updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };


  const employeeSelectStyles = {
    control: (base, state) => ({
      ...base,
      padding: "0.14rem 0.5rem",
      borderWidth: "1px",
      // borderColor: state.isFocused ? "#fb923c" : "#f97316",
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

    /* ✅ MOST IMPORTANT FIX */
    option: (base, state) => ({
      ...base,
      cursor: "pointer",
      Size: "10px",
      /* 🔥 arrow ने hover केल्यावर */
      backgroundColor: state.isFocused
        ? "#fed7aa"           // light orange
        : state.isSelected
          ? "#fb923c"           // selected
          : "white",

      color: state.isSelected ? "white" : "#f97316",

      fontWeight: state.isSelected ? "600" : "400",
    }),

    /* menu scroll fix */
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

  /* ---------------- EDITABLE CELL WITH SHEETS STYLE NAVIGATION ---------------- */
  const EditableCell = ({ rowIndex, field }) => {
    const isEditing =
      editingCell?.rowIndex === rowIndex &&
      editingCell?.field === field;

    const value = editedRows[rowIndex]?.[field] || "";

    const fieldOrder = [
      "ClientName",
      "Gender",
      "CallingNo",
      "WhatsAppNo",
      "LeadSource",
      "WhatsAppMsgs",
      "PhoneCalls",
      "Visited",
      "BookingStatus",
      "Location",
      "newWorkLog",
    ];

    const selectFields = [
      "Gender",
      "Visited",
      "BookingStatus",
      "LeadSource",
      "WhatsAppMsgs",
      "PhoneCalls",
      "Visited",
      "Location"
    ];

    const getOptions = (field) => {
      if (!dynamicData?.data) return [];

      const unique = (key) =>
        Array.from(
          new Set(dynamicData.data.map(i => i[key]).filter(Boolean))
        ).map(v => ({ label: v, value: v }));

      switch (field) {
        case "Gender": return unique("Gender");
        case "Visited": return unique("Visited");
        case "BookingStatus": return unique("BookingStatus");
        case "LeadSource": return unique("LeadSourcee");
        case "WhatsAppMsgs": return unique("WhatsAppStatus");
        case "PhoneCalls": return unique("CallStatus");
        case "Location": return unique("Location");
        default: return [];
      }
    };

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
      if (newRow >= editedRows.length) newRow = editedRows.length - 1;

      return { rowIndex: newRow, field: fieldOrder[newCol] };
    };

    /* ---------- NORMAL CELL ---------- */
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

    /* ---------- SELECT CELL ---------- */
    if (selectFields.includes(field)) {
      const options = getOptions(field);

      return (
        <td className="border relative text-center  whitespace-nowrap">
          <Select
            autoFocus
            value={options.find(o => o.value === value) || null}
            options={options}
            styles={employeeSelectStyles}
            menuPlacement="auto"

            /* 🔥 IMPORTANT */
            menuShouldScrollIntoView
            backspaceRemovesValue={false}

            onMenuOpen={() => {
              menuOpenRef.current = true;
            }}
            onMenuClose={() => {
              menuOpenRef.current = false;
            }}

            onKeyDown={(e) => {
              // ✅ Dropdown OPEN → DO NOTHING
              // react-select will handle arrows + highlight
              if (menuOpenRef.current) {
                return;
              }

              // ✅ Dropdown CLOSED → Excel navigation
              let next;

              switch (e.key) {
                case "Tab":
                  e.preventDefault();
                  next = getNextCell(rowIndex, field, e.shiftKey ? "left" : "right");
                  setEditingCell(next);
                  break;

                case "ArrowRight":
                  e.preventDefault();
                  next = getNextCell(rowIndex, field, "right");
                  setEditingCell(next);
                  break;

                case "ArrowLeft":
                  e.preventDefault();
                  next = getNextCell(rowIndex, field, "left");
                  setEditingCell(next);
                  break;

                case "ArrowDown":
                  e.preventDefault();
                  next = getNextCell(rowIndex, field, "down");
                  setEditingCell(next);
                  break;

                case "ArrowUp":
                  e.preventDefault();
                  next = getNextCell(rowIndex, field, "up");
                  setEditingCell(next);
                  break;

                case "Escape":
                  setEditingCell(null);
                  break;
              }
            }}

            onChange={(selected) => {
              handleCellEdit(rowIndex, field, selected?.value || "");
              // ❌ edit mode बंद करू नको
            }}
          />
        </td>




      );
    }

    /* ---------- INPUT CELL ---------- */
    return (
      <td className="border relative px-5">
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <input
            autoFocus
            defaultValue={value}
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
                  next = getNextCell(rowIndex, field, e.shiftKey ? "down" : "right");
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
    <div className="min-h-screen flex items-center justify-center">
      <LoaderPage />
    </div>
  );

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-full mx-auto mt-3 p-2 bg-gray-50 rounded-lg shadow-md">
      {/* ===== FILTER BAR ===== */}
      <div className="flex flex-wrap justify-center items-center gap-3 mb-3 relative">
        <div className="flex flex-wrap gap-3 items-center mx-auto">
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
                <div className="absolute right-0 w-52 sm:w-48 bg-white border rounded-xl shadow-xl z-50 p-5 border-orange-300">
                  <div className="flex gap-2 mb-2 flex-wrap">
                    <button
                      onClick={() =>
                        setFilters((p) => ({
                          ...p,
                          [f.key]: f.options.map(o => o.value ?? o),
                        }))
                      }
                      className="bg-green-100 text-green-700 text-[13px] px-2 rounded"
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
                      <label key={value} className="flex gap-2 text-sm items-center">
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

          {isAnyFilterApplied && (
            <button className="flex items-center bg-orange-100 justify-between h-8 sm:justify-center gap-2 px-4 py-1 border border-orange-500 text-orange-600 rounded-xl hover:bg-orange-50 shadow-sm transition-all whitespace-nowrap">
              <span onClick={handleClearAllFilters} className="font-medium flex items-center gap-2">
                <AiOutlineClear /> Clear Filters
              </span>
            </button>
          )}
        </div>

        {hasChanges && (
          <div className="absolute right-0 sm:right-10 mt-3 sm:mt-0">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-1 bg-orange-400 text-white rounded"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>



      {/* ===== TABLE ===== */}
      <div className="overflow-y-auto max-h-[600px] bg-white border rounded-lg shadow">
        <table className="min-w-full border">
          <thead className="bg-orange-300 sticky top-0 text-center whitespace-nowrap z-20 rounded">
            <tr>
              <th className="p-4 rounded-l">Lead No</th>
              <th className="px-4">Date</th>
              <th className="px-4">Client Name</th>
              <th className="px-4">Gender</th>
              <th className="px-4">Calling No</th>
              <th className="px-4">WhatsApp No</th>
              <th className="px-4">Lead Source</th>
              <th className="px-4">WhatsAppMsgs</th>
              <th className="px-4">PhoneCalls</th>
              <th className="px-4">Visited</th>
              <th className="px-4">Booking Status</th>
              <th className="px-4">Location</th>
              <th className="px-4">Comments</th>
              <th className="rounded-r px-3">WorkLogs</th>
              <th className="px-3 sticky right-0 bg-orange-300">Action</th>

            </tr>
          </thead>

          <tbody>
            {paginatedRows.map((client) => {
              const index = editedRows.findIndex(r => r.LeadNo === client.LeadNo);

              return (
                <tr key={client.LeadNo} className="text-center border ">
                  <td>{client.LeadNo}</td>
                  <td className="whitespace-nowrap">{client.Date}</td>

                  <EditableCell rowIndex={index} field="ClientName" />
                  <EditableCell rowIndex={index} field="Gender" />
                  <EditableCell rowIndex={index} field="CallingNo" />
                  <EditableCell rowIndex={index} field="WhatsAppNo" />
                  <EditableCell rowIndex={index} field="LeadSource" />
                  <EditableCell rowIndex={index} field="WhatsAppMsgs" />
                  <EditableCell rowIndex={index} field="PhoneCalls" />
                  <EditableCell rowIndex={index} field="Visited" />
                  <EditableCell rowIndex={index} field="BookingStatus" />
                  <EditableCell rowIndex={index} field="Location" />
                  <EditableCell rowIndex={index} field="newWorkLog" />

                  <td className="relative px-2 group">
                    {/* ===== Preview (Latest log only) ===== */}
                    <div className="text-xs text-gray-700 cursor-pointer whitespace-pre-wrap break-words">
                      {client.workLogs
                        ? client.workLogs
                          .split("\n")               // split logs
                          .filter(Boolean)[0]        // TOP (latest log)
                          ?.substring(0, 28)         // preview length
                        : "No WorkLogs"}
                    </div>

                    {/* ===== Full WorkLogs on Hover ===== */}
                    {client.workLogs && (
                      <div
                        className="absolute z-50 hidden group-hover:block bg-white border p-3 rounded-lg shadow-xl w-[380px] max-h-[250px] overflow-y-auto cursor-pointer top-full right-12 mt-1 whitespace-pre-wrap break-words text-sm"
                      >
                        {client.workLogs}
                      </div>
                    )}
                  </td>


                  <td className="px-3 sticky right-0 bg-white text-center">
                    <button
                      onClick={() => handleEdit(client)}
                      className="text-orange-500 flex items-center justify-center"
                    >
                      <FaRegEdit size={20} />
                    </button>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
        {/* ===== PAGINATION ===== */}

      </div>
        <div className="flex justify-center items-center gap-6 m-5">
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="px-4 py-2 bg-orange-400 text-white rounded disabled:opacity-50"
          >
            <i className="fa-solid fa-arrow-left"></i> Previous
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="px-4 py-2 bg-orange-400 text-white rounded disabled:opacity-50"
          >
            Next <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
    </div>
  );
}

export default LeadsTable;