import { useState, useMemo } from "react";
import LoaderPage from "../NewBooking/LoaderPage";
import { useApp } from "../TicketSystem/AppProvider";
import { usePropertyLists, useDeleteProperty } from "./services";
import CreateAndEditProperty from "./CreateAndEditProperty";
import PropertyManagementSkeleton from "./PropertyManagementSkelton";

/* ================= TABLE WIDTHS ================= */
const SR_NO_WIDTH = 64;
const DEFAULT_COL_WIDTH = 200;
const ACTION_COL_WIDTH = 120;
const ITEMS_PER_PAGE = 10;

// custom column width
const COLUMN_WIDTHS = {
  SrNo: 64,
  PropertyCode: 180,

  // 👇 CUSTOM DATE WIDTHS
  PropertyStartDt: 190,
  PropertyEndDt: 190,
  AgreementStartDate: 240,
  AgreementEndDate: 240,
  BillStartDate: 210,
  BillEndDate: 210,
  PropertyDealDetails: 250,
  GPGSTeamComments: 240,

  // Optional examples
  PropertyLocation: 160,
  BedCount: 60,
  Gender: 200,
};
const getColumnWidth = (colIndex, columnKey, isAction = false) => {
  if (isAction) return ACTION_COL_WIDTH;
  if (COLUMN_WIDTHS[columnKey]) return COLUMN_WIDTHS[columnKey];
  if (colIndex === 0) return SR_NO_WIDTH;
  return DEFAULT_COL_WIDTH;
};

// const getColumnWidth = (colIndex, isAction = false) => {
//   if (isAction) return ACTION_COL_WIDTH;
//   if (colIndex === 0) return SR_NO_WIDTH;
//   return DEFAULT_COL_WIDTH;
// };

const TOOLTIP_COLUMNS = new Set([
  "PropertyAddress",
  "PGMainSheetID",
  "EBPCWebLink",
  "ITTeamComments",
  "PGEBSheetID",
  "GPGSTeamComments",
  "PGACSheetID",
]);

const ATTACHMENT_COLUMNS = new Set([
  "AttachmentsPropertyAgreementANDPropertyPoliceNOC",
]);

// tooltip
// const CellWithTooltip = ({ value, fullValue, colIndex, columnKey }) => {
//   const [show, setShow] = useState(false);

//   // ✅ Tooltip allowed ONLY for specific columns
//   const enableTooltip = TOOLTIP_COLUMNS.has(columnKey);

//   // ✅ Use value directly
//   const displayValue = value ?? "-";

//   // ✅ Tooltip position control
//   const isLeftTooltip = columnKey === "ITTeamComments";

//   return (
//     <div
//       className="relative w-full"
//       onMouseEnter={() => enableTooltip && setShow(true)}
//       onMouseLeave={() => enableTooltip && setShow(false)}
//     >
//       <div
//         className={`truncate overflow-hidden text-ellipsis ${
//           enableTooltip ? "cursor-pointer" : ""
//         }`}
//         // title={enableTooltip ? String(fullValue || value) : undefined}
//       >
//         {displayValue}
//       </div>

//       {enableTooltip && show && (
//         <div
//           className={`
//             absolute top-0 z-[330] w-[200px]
//             bg-red-500 border border-gray-300 rounded-lg shadow-xl p-3 text-xs break-words
//             ${
//               isLeftTooltip
//                 ? "right-full mr-2" // 👈 LEFT side tooltip
//                 : "left-full ml-2" // 👉 RIGHT side tooltip
//             }
//           `}
//         >
//           <pre className="whitespace-pre-wrap">{fullValue ?? "-"}</pre>
//         </div>
//       )}
//     </div>
//   );
// };
const CellWithTooltip = ({ value, fullValue, columnKey }) => {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const enableTooltip = TOOLTIP_COLUMNS.has(columnKey);
  const displayValue = value ?? "-";

  const handleMouseEnter = (e) => {
    if (!enableTooltip) return;

    const rect = e.currentTarget.getBoundingClientRect();

    setPos({
      top: rect.top,
      left: rect.right + 8, // tooltip on right
    });

    setShow(true);
  };
  const handleDoubleClick = async () => {
    if (!enableTooltip) return;

    try {
      await navigator.clipboard.writeText(String(fullValue ?? ""));
      console.log(`Copied ${columnKey}:`, fullValue);
      // optional toast
      // toast.success("Copied to clipboard");
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <>
      <div
        className={`truncate overflow-hidden text-ellipsis ${
          enableTooltip ? "cursor-pointer select-none" : ""
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setShow(false)}
        onDoubleClick={handleDoubleClick}
        title={enableTooltip ? "Double-click to copy" : undefined}
      >
        {displayValue}
      </div>

      {enableTooltip && show && (
        <div
          className="
            fixed z-[9999] w-[350px]
             bg-white border border-gray-300 rounded-lg shadow-xl p-3 text-xs break-words
          "
          style={{
            top: pos.top,
            left: pos.left,
          }}
        >
          <pre className="whitespace-pre-wrap">{fullValue ?? "-"}</pre>
        </div>
      )}
    </>
  );
};

// confirmation model for deleting property
const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  propertyCode,
  isDeleting,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-6 animate-scaleIn">
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-2">
          Delete Property
        </h2>

        <p className="text-gray-600 text-center mb-6">
          Are you sure you want to delete
          <span className="block mt-1 font-semibold text-red-600">
            {propertyCode}
          </span>
          This action cannot be undone.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
          >
            No
          </button>

          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

// attachment cell renderer
const AttachmentCell = ({ value }) => {
  if (!value || value === "-") return <span>-</span>;

  const urls = value
    .split(",")
    .map((u) => u.trim())
    .filter(Boolean);

  return (
    <div className="flex gap-2 ">
      {urls.map((url, i) => (
        <div
          key={i}
          className="w-10 h-10 border rounded cursor-pointer overflow-hidden"
          onClick={() => window.open(url, "_blank")}
          title="Open attachment"
        >
          {" "}
          <img
            src={url} // https://picsum.photos/536/354
            alt="attachment"
            className=" w-full h-full object-cover block"
          />
          {/* <div>
            {/\.(jpg|jpeg|png|gif|webp)$/i.test(url) ? (
              <img src={url} alt="attachment" className=" block" />
            ) : (
              <video src={url} className="w-full h-full object-cover" muted />
            )}
          </div> */}
        </div>
        // <a
        //   key={i}
        //   href={url}
        //   target="_blank"
        //   rel="noopener noreferrer"
        //   className="flex items-center gap-2 text-blue-600 hover:underline"
        // >
        //   📎 Attachment {i + 1}
        // </a>
      ))}
    </div>
  );
};

const PropertyManagement = () => {
  const { decryptedUser } = useApp();
  const { data = [], isLoading, isError } = usePropertyLists();
  const deleteMutation = useDeleteProperty();

  const [editingRow, setEditingRow] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);

  // handle delete

  const handleDeleteConfirm = () => {
    if (!rowToDelete) return;

    deleteMutation.mutate(
      { __rowNumber: rowToDelete.__rowNumber },
      {
        onSuccess: () => {
          setShowDeleteModal(false);
          setRowToDelete(null);
        },
      },
    );
  };

  //
  /* ================= FILTER DATA BASED ON SEARCH ================= */
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;

    const query = searchQuery.toLowerCase().trim();
    return data.filter((row) => {
      // Search through all string values in the row
      return Object.values(row).some((value) => {
        if (typeof value === "string") {
          return value.toLowerCase().includes(query);
        }
        return false;
      });
    });
  }, [data, searchQuery]);

  /* ================= PAGINATION ================= */

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  /* ================= TABLE COLUMNS ================= */

  const TABLE_COLUMNS = useMemo(() => {
    if (!Array.isArray(filteredData) || filteredData.length === 0) {
      if (!Array.isArray(data) || data.length === 0) return [];

      const sampleRow = data[0];
      const excludeKeys = new Set(["_id", "__v", "__rowNumber", "__srNo"]);

      const allKeys = Object.keys(sampleRow || {});

      const orderedColumns = ["SrNo", "PropertyCode"];

      allKeys.forEach((key) => {
        if (!excludeKeys.has(key) && !orderedColumns.includes(key)) {
          orderedColumns.push(key);
        }
      });

      return orderedColumns;
    }

    const excludeKeys = new Set(["_id", "__v", "__rowNumber", "__srNo"]);
    const allKeys = Object.keys(filteredData[0] || {});

    const orderedColumns = ["SrNo", "PropertyCode"];

    allKeys.forEach((key) => {
      if (!excludeKeys.has(key) && !orderedColumns.includes(key)) {
        orderedColumns.push(key);
      }
    });

    return orderedColumns;
  }, [filteredData, data]);

  /* ================= CUSTOM HEADER LABELS ================= */
  const COLUMN_LABELS = {
    __srNo: "SrNo",
    PropertyCode: "Property Code",
    PropertyLocation: "Location",
    BedCount: "Beds",
    Gender: "PG Type Gender",
    ACRoom: "AC / Non-AC",
    InternetVendor: "Internet Vendor",
    InternetUserID: "Internet User ID",
    InternetVendorContactNo1: "Internet Contact 1",
    InternetVendorContactNo2: "Internet Contact 2",
    PropertyAddress: "Address",
    WiFiName: "WiFi Name",
    WiFiPwd: "WiFi Password",
    EBConsumerNo: "EB Consumer No",
    EBBillingUnit: "EB Billing Unit",
    EBPCWebLink: "EB Portal Link",
    PropertyOwner: "Property Owner",
    POContactNo1: "Owner Contact 1",
    POContactNo2: "Owner Contact 2",
    PropertyStartDt: "Start Date",
    PropertyEndDt: "End Date",
    BillStartDate: "EB Start Date",
    BillEndDate: "EB End Date",
    GPGSRegisteredNo: "GPGS Registered No",
    PropertyAgreement: "Property Agreement",
    PropertyPoliceNOC: "Property Police NOC",
    PropertyDealDetails: "Property Deal Details",
    GPGSTeamComments: "GPGS Team Comments",
    PGMainSheetID: "PG Main Sheet ID",
    PGEBSheetID: "PG EB Sheet ID",
    PGACSheetID: "PG AC Sheet ID",
    ITTeamComments: "IT Team Comments",
    AttachmentsPropertyAgreementANDPropertyPoliceNOC: "Attachments",
    AgreementEndDate: "Agreement End Date",
    AgreementStartDate: "Agreement Start Date	",
    PropertyStatus: "Property Status",
  };

  // header formatter
  const formatHeader = (key) => COLUMN_LABELS[key] || key;

  // first two column sticky positioning
  const getStickyLeft = (colIndex) => {
    let left = 0;
    for (let i = 0; i < colIndex; i++) {
      const key = TABLE_COLUMNS[i];
      left += getColumnWidth(i, key);
    }
    return left;
  };

  // Reset to first page when search changes
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  /* ================= GUARDS ================= */
  if (!decryptedUser) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600 text-lg">
        Please login to access Property Management
      </div>
    );
  }

  if (isLoading) {
    return <PropertyManagementSkeleton />;
  }

  if (isError) {
    return <div>Error loading properties</div>;
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";

    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr; // safety fallback

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  const DATE_COLUMNS = new Set([
    "PropertyStartDt",
    "PropertyEndDt",
    "BillStartDate",
    "BillEndDate",
  ]);
  // PAGE MODE: Create
  if (showCreateForm) {
    return (
      <CreateAndEditProperty
        existingProperties={data}
        onClose={() => setShowCreateForm(false)}
      />
    );
  }

  // PAGE MODE: Edit
  if (editingRow) {
    return (
      <CreateAndEditProperty
        existingProperties={data}
        editingRow={editingRow}
        onClose={() => setEditingRow(null)}
      />
    );
  }

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* NAVBAR */}
      <nav className="px-4 sm:px-6 shadow-sm pt-12 pb-1 mt-2">
        <div className="flex flex-col md:flex-row lg:justify-between lg:items-center gap-4 mb-4">
          {/* LEFT: Title + Search */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 lg:gap-8">
            <h2 className="text-lg sm:text-xl font-bold text-orange-600">
              GPGS Properties
            </h2>

            {/* SEARCH BAR */}
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search property...."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="
            w-full sm:w-[200px]
            pl-2 pr-8 py-2
            border-2 border-orange-300 rounded-md
            focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300
          "
              />

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </div>

          {/* RIGHT: Add Button */}
          <div className="flex justify-start md:justify-end">
            <button
              onClick={() => setShowCreateForm(true)}
              className="w-full sm:w-auto px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              + Add Property
            </button>
          </div>
        </div>

        {/* Search results count */}
        {searchQuery && (
          <div className="text-sm text-gray-600 mb-2">
            Found {filteredData.length} properties matching "{searchQuery}"
          </div>
        )}
      </nav>

      {/* TABLE */}
      <div className="mt-0 mx-6 bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto max-h-[63vh]">
          {paginatedData.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              {searchQuery
                ? `No properties found for "${searchQuery}"`
                : "No properties found"}
            </div>
          ) : (
            <table className="min-w-full table-fixed text-sm lg:h-[300px]">
              <thead className="bg-orange-300 sticky top-0 z-[100]">
                <tr>
                  {/* DYNAMIC COLUMNS */}
                  {TABLE_COLUMNS.map((key, idx) => (
                    <th
                      key={key}
                      className={`px-3 py-3 text-left font-bold text-black text-lg whitespace-nowrap
                        ${idx < 2 ? "sticky bg-orange-300 z-50" : ""}
                      `}
                      style={{
                        width: getColumnWidth(idx, key),
                        minWidth: getColumnWidth(idx, key),
                        maxWidth: getColumnWidth(idx, key),
                        left: idx < 2 ? getStickyLeft(idx) : undefined,
                      }}
                    >
                      {formatHeader(key)}
                    </th>
                  ))}

                  {/* ACTION COLUMN */}
                  <th
                    className="px-4 py-3 font-bold text-lg sticky right-0 z-[120] bg-orange-300 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.1)]"
                    style={{ width: ACTION_COL_WIDTH }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 text-sm">
                {paginatedData.map((row, idx) => (
                  <tr key={row._id || idx} className="hover:bg-[#F8F9FB]">
                    {/* CELLS */}
                    {TABLE_COLUMNS.map((key, colIndex) => {
                      const isSticky = colIndex < 2;
                      let cellValue = row[key] ?? "-";

                      // ✅ format date like EB Calculation
                      if (DATE_COLUMNS.has(key)) {
                        cellValue = formatDate(cellValue);
                      }

                      // Clean up cell values
                      const cleanValue =
                        typeof cellValue === "string"
                          ? cellValue.replace(/[^\w\s\-\/.,@()]/g, "").trim()
                          : cellValue;

                      return (
                        <td
                          key={`${row._id}-${key}`}
                          className={`px-3 py-3 truncate
                            ${isSticky ? "sticky z-40" : ""}
                            ${colIndex === 0 ? "text-center" : ""}
                            ${isSticky ? "bg-orange-300 text-md" : ""}
                          `}
                          style={{
                            width: getColumnWidth(colIndex, key),
                            minWidth: getColumnWidth(colIndex, key),
                            maxWidth: getColumnWidth(colIndex, key),

                            left: isSticky
                              ? getStickyLeft(colIndex)
                              : undefined,
                          }}
                        >
                          {ATTACHMENT_COLUMNS.has(key) ? (
                            <AttachmentCell value={cellValue} /> // 👈 RAW VALUE
                          ) : (
                            <CellWithTooltip
                              value={cleanValue}
                              fullValue={cellValue}
                              colIndex={colIndex}
                              columnKey={key}
                            />
                          )}
                        </td>
                      );
                    })}

                    {/* ACTIONS */}
                    <td className="sticky right-0 bg-white">
                      <div className="flex justify-around px-2">
                        <button
                          onClick={() =>
                            setEditingRow({
                              ...row,
                              rowIndex: row.__rowNumber - 2,
                            })
                          }
                          className="text-red-600 hover:text-red-900 p-1"
                          title="View"
                        >
                          <i className="fa fa-eye"></i>
                        </button>
                        <button
                          onClick={() => setEditingRow(row)}
                          className="text-green-600 hover:text-green-800 p-1"
                          title="Edit"
                        >
                          <i className="fas fa-edit" />
                        </button>
                        {/* <button
                          onClick={() => {
                            setRowToDelete(row);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Delete"
                        >
                          <i className="fas fa-trash" />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center items-center gap-6 pt-4 pb-2 border-t border-gray-200">
          <span className="text-sm text-gray-700">
            Page {currentPage} of{" "}
            {Math.ceil(filteredData.length / ITEMS_PER_PAGE)}
            {searchQuery &&
              ` (Filtered: ${filteredData.length} of ${data.length} total)`}
          </span>

          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <button
            disabled={
              currentPage >= Math.ceil(filteredData.length / ITEMS_PER_PAGE)
            }
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      {/* MODALS */}
      {/* {showCreateForm && (
        <CreateAndEditProperty
          existingProperties={data}
          onClose={() => setShowCreateForm(false)}
        />
      )}

      {editingRow && (
        <CreateAndEditProperty
          existingProperties={data}
          editingRow={editingRow}
          onClose={() => setEditingRow(null)}
        />
      )} */}

      {showDeleteModal && (
        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          propertyCode={rowToDelete?.PropertyCode}
          isDeleting={deleteMutation.isLoading}
          onClose={() => {
            setShowDeleteModal(false);
            setRowToDelete(null);
          }}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
};

export default PropertyManagement;