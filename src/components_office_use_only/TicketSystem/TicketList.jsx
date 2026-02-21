import React, { useState, useMemo, useEffect, useRef } from "react";
import { useApp } from "./AppProvider";
import { TicketFilters } from "./TicketFilters";
import LoaderPage from "../NewBooking/LoaderPage";
import { toast } from "react-toastify";

const TicketRow = React.memo(({ ticket, headers,isPending ,formatDate, onEdit, onImageClick, videoModalUrl, setVideoModalUrl, isSelected, onSelect }) => {
        
  return (
    <tr key={ticket.TicketID} className="hover:bg-[#F8F9FB] border">
      {/* Selection Checkbox */}
      <td className="px-4 py-3 sticky left-0 bg-white z-20">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(ticket.TicketID)}
          className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
        />
      </td>

      {headers.map(({ key }) => {
        const value = ticket[key];
        const isTicketID = key === "TicketID";

        const stickyStyle = isTicketID
          ? "sticky left-8 bg-white z-20 px-4 py-3 bg-orange-300 whitespace-nowrap text-gray-900 font-semibold border-r"
          : "px-4 py-3 whitespace-nowrap text-gray-900";

        if (key === "Status") {
          return (
            <td key={key} className={stickyStyle}>
              <span className="px-2 py-1 rounded-full">{value}</span>
            </td>
          );
        }

        if (key === "Title") {
          return (
            <td key={key} className={stickyStyle}>
              <div>
                <div className="font-medium">{value?.substring(0, 25) || "N/A"}...</div>
                <div className="text-xs text-gray-500 break-words max-w-[300px] whitespace-nowrap overflow-hidden text-ellipsis">
                  {ticket.Description ? `${ticket.Description.substring(0, 60)}...` : "No Description"}
                </div>
              </div>
            </td>
          );
        }

        if (key === "Attachment") {
          return (
            <td key={key} className={stickyStyle}>
              <div className="flex gap-2 mt-1 max-h-48 overflow-auto">
                {value ? (
                  value.split(",").map((url, idx) => {
                    const trimmedUrl = url.trim();
                    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(trimmedUrl);
                    const isVideo = /\.(mp4|webm|avi|mov|mkv)$/i.test(trimmedUrl);

                    if (!isImage && !isVideo) return null;

                    return (
                      <button
                        key={idx}
                        type="button"
                        className="w-10 h-10 border rounded-md overflow-hidden bg-gray-100 hover:ring-2 hover:ring-blue-400 relative cursor-pointer"
                        title={trimmedUrl}
                        onClick={() => {
                          if (isImage) {
                            onImageClick(trimmedUrl);
                          } else if (isVideo) {
                            setVideoModalUrl(trimmedUrl);
                          }
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

              {/* Video Modal */}
              {videoModalUrl && (
                <div className="fixed inset-0 bg-black bg-opacity-70 z-[9999] flex items-center justify-center h-screen">
                  <div className="relative w-full max-w-3xl p-4">
                    <video
                      src={videoModalUrl}
                      controls
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-auto rounded shadow-lg"
                      onClick={() => setVideoModalUrl(null)}
                    />
                  </div>
                </div>
              )}
            </td>
          );
        }

        if (key === "DateCreated") {
          return (
            <td key={key} className={stickyStyle}>
              {formatDate(value)}
            </td>
          );
        }

        if (key === "WorkLogs") {
          return (
            <td key={key} className={stickyStyle}>
              <div className="relative group">
                <div className="text-xs text-gray-700 cursor-pointer whitespace-pre-wrap break-words max-w-[1000px]">
                  {value ? `${value.substring(0, 28)}` : "No WorkLogs"}
                </div>
                {value && (
                  <div className="absolute z-50 hidden group-hover:block bg-white border p-3 rounded shadow-md w-96 max-h-96 overflow-y-auto cursor-pointer top-full mt-1 left-0 whitespace-pre-wrap break-words text-sm">
                    {value}
                  </div>
                )}
              </div>
            </td>
          );
        }

        return (
          <td key={key} className={stickyStyle}>
            {value || "N/A"}
          </td>
        );
      })}

      {/* Actions */}
      <td className="px-5 py-7 flex gap-3 whitespace-nowrap text-lg font-medium sticky border-l right-0 bg-white z-10">
        <button
          onClick={() => onEdit(ticket)}
          className="text-red-600 hover:text-red-900"
          title="View"
        >
          <i className="fa fa-eye"></i>
        </button>
        <button
          onClick={() => onEdit(ticket)}
          className="text-green-600 hover:text-green-900 mr-3"
          title="Edit"
        >
          <i className="fas fa-edit"></i>
        </button>
      </td>
    </tr>
  );
});

const TicketCard = ({isPending ,  ticket, headers, formatDate, onEdit, onImageClick, videoModalUrl, setVideoModalUrl, isSelected, onSelect }) => {
   if(isPending){
            return <LoaderPage/>
          }
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4 space-y-3 border border-gray-200">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(ticket.TicketID)}
            className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
          />
          <h3 className="text-lg font-semibold text-orange-600">Ticket ID: {ticket.TicketID}</h3>
        </div>
        <div>
          <button
            onClick={() => onEdit(ticket)}
            className="text-red-600 hover:text-red-900 mr-3"
            title="View"
          >
            <i className="fa fa-eye"></i>
          </button>
          <button
            onClick={() => onEdit(ticket)}
            className="text-green-600 hover:text-green-900"
            title="Edit"
          >
            <i className="fas fa-edit"></i>
          </button>
        </div>
      </div>

      {headers.map(({ key, label }) => {
        if (key === "TicketID") return null;

        const value = ticket[key];
        if (key === "DateCreated") {
          return (
            <div key={key}>
              <span className="font-semibold">{label}:</span>{" "}
              {formatDate(value)}
            </div>
          );
        }
        if (key === "Title") {
          return (
            <div key={key}>
              <span className="font-semibold">{label}:</span>{" "}
              <div className="font-medium">{value?.substring(0, 25) || "N/A"}...</div>
              <div className="text-sm text-gray-500">{ticket.Description ? ticket.Description.substring(0, 60) + "..." : "No Description"}</div>
            </div>
          );
        }
        if (key === "Attachment") {
          return (
            <div key={key}>
              <span className="font-semibold">{label}:</span>
              <div className="flex gap-2 mt-1 max-h-48 overflow-auto">
                {value ? (
                  value.split(",").map((url, idx) => {
                    const trimmedUrl = url.trim();
                    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(trimmedUrl);
                    const isVideo = /\.(mp4|webm|avi|mov|mkv)$/i.test(trimmedUrl);

                    if (!isImage && !isVideo) return null;

                    return (
                      <button
                        key={idx}
                        type="button"
                        className="w-10 h-10 border rounded-md overflow-hidden bg-gray-100 hover:ring-2 hover:ring-blue-400 relative cursor-pointer"
                        title={trimmedUrl}
                        onClick={() => {
                          if (isImage) {
                            onImageClick(trimmedUrl);
                          } else if (isVideo) {
                            setVideoModalUrl(trimmedUrl);
                          }
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

              {videoModalUrl && (
                <div className="fixed inset-0 bg-black bg-opacity-70 z-[9999] flex items-center justify-center h-screen">
                  <div className="relative w-full max-w-3xl p-4">
                    <video
                      src={videoModalUrl}
                      controls
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-auto rounded shadow-lg"
                      onClick={() => setVideoModalUrl(null)}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        }
        if (key === "Status") {
          return (
            <div key={key}>
              <span className="font-semibold">{label}:</span>{" "}
              <span className="px-2 py-1 rounded-full text-gray-900">{value}</span>
            </div>
          );
        }
        if (key === "WorkLogs") {
          return (
            <div key={key}>
              <span className="font-semibold">{label}:</span>{" "}
              <div className="text-sm max-h-24 overflow-auto whitespace-pre-wrap border p-2 rounded">
                {value || "No WorkLogs"}
              </div>
            </div>
          );
        }
        return (
          <div key={key}>
            <span className="font-semibold">{label}:</span> {value || "N/A"}
          </div>
        );
      })}
    </div>
  );
};

export const TicketList = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [videoModalUrl, setVideoModalUrl] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(() => {
    const saved = localStorage.getItem("currentPage");
    return saved ? parseInt(saved, 10) : 1;
  });
  const [selectedTickets, setSelectedTickets] = useState(new Set());
  const [selectedColumns, setSelectedColumns] = useState(new Set());
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  const { decryptedUser, filters, searchTerm, filteredTickets, setCurrentView, setSelectedTicket , isPending } = useApp();
  const TICKETS_PER_PAGE = 10;
  const totalPages = Math.ceil(filteredTickets.length / TICKETS_PER_PAGE);
  

  const prevFiltersRef = useRef(filters);

  // Check window size for mobile/tablet
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const hasAnyFilterValue = Object.values(filters).some(value =>
      Array.isArray(value) ? value.some(v => v !== '') : value !== ''
    );

    const filtersChanged = JSON.stringify(filters) !== JSON.stringify(prevFiltersRef.current);

    if ((hasAnyFilterValue && filtersChanged) || searchTerm) {
      setCurrentPage(1);
    }

    prevFiltersRef.current = filters;
  }, [filters, searchTerm]);

  useEffect(() => {
    localStorage.setItem("currentPage", currentPage);
  }, [currentPage]);

  // Initialize selected columns with all headers
 

  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * TICKETS_PER_PAGE;
    return filteredTickets.slice(start, start + TICKETS_PER_PAGE);
  }, [filteredTickets, currentPage]);

  const editTicket = (ticket) => {
    setSelectedTicket(ticket);
    setCurrentView("edit");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const [datePart, timePart] = dateString.split(",").map((str) => str.trim());
    const [day, month, year] = datePart.split("/");
    const [hour = "00", minute = "00", second = "00"] = (timePart || "").split(":");
    const isoString = `${year}-${month}-${day}T${hour}:${minute}:${second}`;
    const date = new Date(isoString);
    if (isNaN(date)) return "Invalid Date";
    const options = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    const formatted = date.toLocaleString("en-GB", options);
    const [dPart, tPart] = formatted.split(", ");
    return `${dPart}, ${tPart?.toUpperCase()}`;
  };

  const fullHeaders = [
    { label: "TicketID", key: "TicketID" },
    { label: "Date Created", key: "DateCreated" },
    { label: "Property Code", key: "PropertyCode" },
    { label: "Title", key: "Title" },
    { label: "Attachment", key: "Attachment" },
    { label: "Customer Impacted", key: "CustomerImpacted" },
    { label: "Escalated", key: "Escalated" },
    { label: "Target Date", key: "TargetDate" },
    { label: "Category", key: "Category" },
    { label: "Status", key: "Status" },
    { label: "Priority", key: "Priority" },
    { label: "Department", key: "Department" },
    { label: "Manager", key: "Manager" },
    { label: "Assignee", key: "Assignee" },
    { label: "Created By Id", key: "CreatedById" },
    { label: "Created By Name", key: "CreatedByName" },
    { label: "Updated By ID", key: "UpdatedById" },
    { label: "Updated By Name", key: "UpdatedByName" },
    { label: "Updated Date Time", key: "UpdatedDateTime" },
    { label: "WorkLogs", key: "WorkLogs" },
    { label: "Internal Comments", key: "InternalComments" },
    { label: "Estimated Time To Resolve", key: "EstimatedTimeToResolve" },
    { label: "Actual Time Spent", key: "ActualTimeSpent" },
  ];

  const clientHeaders = [
    { label: "Ticket ID", key: "TicketID" },
    { label: "Date Created", key: "DateCreated" },
    { label: "Department", key: "Department" },
    { label: "Category", key: "Category" },
    { label: "Attachment", key: "Attachment" },
    { label: "Status", key: "Status" },
    { label: "WorkLogs", key: "WorkLogs" },
    { label: "Title", key: "Title" },
  ];

  const headers = useMemo(() => {
    return decryptedUser?.employee?.Role === "client" ? clientHeaders : fullHeaders;
  }, [decryptedUser]);

  // Selection handlers
  const handleTicketSelect = (ticketId) => {
    setSelectedTickets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(ticketId)) {
        newSet.delete(ticketId);
      } else {
        newSet.add(ticketId);
      }
      return newSet;
    });
  };

  //  useEffect(() => {
  //   const allColumnKeys = headers.map(header => header.key);
  //   setSelectedColumns(new Set(allColumnKeys));
  // }, [headers]);

  
  const handleSelectAll = () => {
    if (selectedTickets.size === paginatedTickets.length) {
      setSelectedTickets(new Set());
    } else {
      const allTicketIds = paginatedTickets.map(ticket => ticket.TicketID);
      setSelectedTickets(new Set(allTicketIds));
    }
  };

  const handleColumnSelect = (columnKey) => {
    setSelectedColumns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(columnKey)) {
        newSet.delete(columnKey);
      } else {
        newSet.add(columnKey);
      }
      return newSet;
    });
  };

  const handleSelectAllColumns = () => {
    if (selectedColumns.size === headers.length) {
      setSelectedColumns(new Set());
    } else {
      const allColumnKeys = headers.map(header => header.key);
      setSelectedColumns(new Set(allColumnKeys));
    }
  };
  // Export functionality
  const handleSelectedColoum = () => { // Get selected tickets data
 setShowColumnSelector(!showColumnSelector)
  };

  const handleExport = () =>{
       const ticketsToExport = filteredTickets.filter(ticket => 
      selectedTickets.size > 0 ? selectedTickets.has(ticket.TicketID) : true
    );

    // Get selected columns
    const columnsToExport = headers.filter(header => 
      selectedColumns.size > 0 ? selectedColumns.has(header.key) : true
    );
 
    if (ticketsToExport.length === 0) {
      toast.error("No tickets selected for export!")
      return;
    }
    if (columnsToExport.length === 0) {
       toast.error("No columns selected for export!")
      return;
    }

    // Prepare CSV content
    const headersRow = columnsToExport.map(header => header.label).join(',');
    
    const dataRows = ticketsToExport.map(ticket => {
      return columnsToExport.map(header => {
        let value = ticket[header.key] || '';
        // Handle special formatting for dates
        if (header.key === 'DateCreated' && value) {
          value = formatDate(value);
        }
        // Handle commas in values by wrapping in quotes
        if (typeof value === 'string' && value.includes(',')) {
          value = `"${value}"`;
        }
        return value;
      }).join(',');
    });

    const csvContent = [headersRow, ...dataRows].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tickets-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    setShowColumnSelector(false)
  }



 


  const goToPrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="space-y-6">
      {/* Export Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-lg shadow">
        <div className="flex flex-wrap gap-2 items-center">
          <button 
            onClick={handleSelectedColoum}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 flex items-center gap-2"
          >
            <i className="fas fa-download"></i>
            Export {selectedTickets.size > 0 ? `(${selectedTickets.size} selected)` : '(All)'}
          </button>
          
         {/* <button 
            onClick={() => setShowColumnSelector(!showColumnSelector)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center gap-2"
          >
            <i className="fas fa-columns"></i>
            Select Columns
          </button>  */}

          {selectedTickets.size > 0 && (
            <span className="text-sm text-gray-600">
              {selectedTickets.size} ticket(s) selected
            </span>
          )}
        </div>

        {/* Column Selector Modal */}
        {showColumnSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-96 overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Select Columns to Export</h3>
                  <button 
                    onClick={() => setShowColumnSelector(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
              
              <div className="p-4 max-h-64 overflow-y-auto">
                <div className="flex items-center gap-2 mb-3 p-2 bg-gray-50 rounded">
                  <input
                    type="checkbox"
                    checked={selectedColumns.size === headers.length}
                    onChange={handleSelectAllColumns}
                    className="h-4 w-4 text-orange-600 rounded focus:ring-orange-500"
                  />
                  <label className="font-medium">Select All Columns</label>
                </div>
                
                {headers.map((header) => (
                  <div key={header.key} className="flex items-center gap-2 mb-2 p-2 hover:bg-gray-50 rounded">
                    <input
                      type="checkbox"
                      checked={selectedColumns?.has(header.key)}
                      onChange={() => handleColumnSelect(header.key)}
                      className="h-4 w-4 text-orange-600 rounded focus:ring-orange-500"
                    />
                    <label>{header.label}</label>
                  </div>
                ))}
              </div>
              
              <div className="p-4 flex justify-center items-center border-t bg-gray-50">
                <button 
                  onClick={handleExport}
                  className="px-4 py-2 bg-orange-500  text-white rounded hover:bg-orange-600"
                >
                   <pre> Export</pre>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <TicketFilters />

      {isMobile ? (
        <div>
          {paginatedTickets.map((ticket) => (
            <TicketCard
              key={ticket.TicketID}
              ticket={ticket}
              headers={headers}
              formatDate={formatDate}
              onEdit={editTicket}
              onImageClick={setSelectedImage}
              videoModalUrl={videoModalUrl}
              setVideoModalUrl={setVideoModalUrl}
              isSelected={selectedTickets.has(ticket.TicketID)}
              onSelect={handleTicketSelect}
              isPending = {isPending}
            />
          ))}
        </div>
      ) : isPending ? <LoaderPage/> :  ( 
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-black text-white sticky top-0 z-30">
                <tr>
                  {/* Selection Checkbox Header */}
                  <th className="px-6 py-3 text-left font-bold text-white text-lg sticky left-0 z-40 bg-black">
                    <input
                      type="checkbox"
                      checked={selectedTickets.size === paginatedTickets.length && paginatedTickets.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                  </th>
                  
                  {headers.map(({ label, key }) => (
                    <th
                      key={label}
                      className={`px-6 py-3 text-left font-bold text-white text-lg whitespace-nowrap ${key === "TicketID" ? "sticky left-8 z-40 bg-black" : ""
                        }`}
                      title={label}
                    >
                      {label.substring(0, 20)}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-white font-bold text-lg sticky right-0 bg-black z-30 max-w-[150px]" title="Actions">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-[18px]">
                {paginatedTickets.map((ticket) => (
                  <TicketRow
                    key={ticket.TicketID}
                    ticket={ticket}
                    headers={headers}
                    formatDate={formatDate}
                    onEdit={editTicket}
                    onImageClick={setSelectedImage}
                    videoModalUrl={videoModalUrl}
                    setVideoModalUrl={setVideoModalUrl}
                    isSelected={selectedTickets.has(ticket.TicketID)}
                    onSelect={handleTicketSelect}
                         isPending = {isPending}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-6 pb-5">
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === 1}
          onClick={goToPrevious}
          className="px-4 py-2 bg-black text-white  rounded disabled:opacity-50"
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
    </div>
  );
}









// import React, { useState, useMemo, useEffect, useRef } from "react";
// import { useApp } from "./AppProvider";
// import { TicketFilters } from "./TicketFilters";

// const TicketRow = React.memo(({ ticket, headers, formatDate, onEdit, onImageClick, videoModalUrl, setVideoModalUrl, isSelected, onSelect }) => {
//   return (
//     <tr key={ticket.TicketID} className="hover:bg-[#F8F9FB] border">
//       {/* Selection Checkbox */}
//       <td className="px-4 py-3 sticky left-0 bg-white z-20">
//         <input
//           type="checkbox"
//           checked={isSelected}
//           onChange={() => onSelect(ticket.TicketID)}
//           className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
//         />
//       </td>

//       {headers.map(({ key }) => {
//         const value = ticket[key];
//         const isTicketID = key === "TicketID";

//         const stickyStyle = isTicketID
//           ? "sticky left-8 bg-white z-20 px-4 py-3 bg-orange-300 whitespace-nowrap text-gray-900 font-semibold border-r"
//           : "px-4 py-3 whitespace-nowrap text-gray-900";

//         if (key === "Status") {
//           return (
//             <td key={key} className={stickyStyle}>
//               <span className="px-2 py-1 rounded-full">{value}</span>
//             </td>
//           );
//         }

//         if (key === "Title") {
//           return (
//             <td key={key} className={stickyStyle}>
//               <div>
//                 <div className="font-medium">{value?.substring(0, 25) || "N/A"}...</div>
//                 <div className="text-xs text-gray-500 break-words max-w-[300px] whitespace-nowrap overflow-hidden text-ellipsis">
//                   {ticket.Description ? `${ticket.Description.substring(0, 60)}...` : "No Description"}
//                 </div>
//               </div>
//             </td>
//           );
//         }

//         if (key === "Attachment") {
//           return (
//             <td key={key} className={stickyStyle}>
//               <div className="flex gap-2 mt-1 max-h-48 overflow-auto">
//                 {value ? (
//                   value.split(",").map((url, idx) => {
//                     const trimmedUrl = url.trim();
//                     const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(trimmedUrl);
//                     const isVideo = /\.(mp4|webm|avi|mov|mkv)$/i.test(trimmedUrl);

//                     if (!isImage && !isVideo) return null;

//                     return (
//                       <button
//                         key={idx}
//                         type="button"
//                         className="w-10 h-10 border rounded-md overflow-hidden bg-gray-100 hover:ring-2 hover:ring-blue-400 relative cursor-pointer"
//                         title={trimmedUrl}
//                         onClick={() => {
//                           if (isImage) {
//                             onImageClick(trimmedUrl);
//                           } else if (isVideo) {
//                             setVideoModalUrl(trimmedUrl);
//                           }
//                         }}
//                       >
//                         {isImage ? (
//                           <img
//                             src={trimmedUrl}
//                             alt={`Attachment ${idx + 1}`}
//                             loading="lazy"
//                             className="w-full h-full object-cover"
//                           />
//                         ) : (
//                           <video
//                             src={trimmedUrl}
//                             className="w-full h-full object-cover"
//                             muted
//                             playsInline
//                           />
//                         )}
//                       </button>
//                     );
//                   })
//                 ) : (
//                   <p className="text-sm text-gray-500">No Attachments</p>
//                 )}
//               </div>

//               {/* Video Modal */}
//               {videoModalUrl && (
//                 <div className="fixed inset-0 bg-black bg-opacity-70 z-[9999] flex items-center justify-center h-screen">
//                   <div className="relative w-full max-w-3xl p-4">
//                     <video
//                       src={videoModalUrl}
//                       controls
//                       autoPlay
//                       muted
//                       playsInline
//                       className="w-full h-auto rounded shadow-lg"
//                       onClick={() => setVideoModalUrl(null)}
//                     />
//                   </div>
//                 </div>
//               )}
//             </td>
//           );
//         }

//         if (key === "DateCreated") {
//           return (
//             <td key={key} className={stickyStyle}>
//               {formatDate(value)}
//             </td>
//           );
//         }

//         if (key === "WorkLogs") {
//           return (
//             <td key={key} className={stickyStyle}>
//               <div className="relative group">
//                 <div className="text-xs text-gray-700 cursor-pointer whitespace-pre-wrap break-words max-w-[1000px]">
//                   {value ? `${value.substring(0, 28)}` : "No WorkLogs"}
//                 </div>
//                 {value && (
//                   <div className="absolute z-50 hidden group-hover:block bg-white border p-3 rounded shadow-md w-96 max-h-96 overflow-y-auto cursor-pointer top-full mt-1 left-0 whitespace-pre-wrap break-words text-sm">
//                     {value}
//                   </div>
//                 )}
//               </div>
//             </td>
//           );
//         }

//         return (
//           <td key={key} className={stickyStyle}>
//             {value || "N/A"}
//           </td>
//         );
//       })}

//       {/* Actions */}
//       <td className="px-5 py-7 flex gap-3 whitespace-nowrap text-lg font-medium sticky border-l right-0 bg-white z-10">
//         <button
//           onClick={() => onEdit(ticket)}
//           className="text-red-600 hover:text-red-900"
//           title="View"
//         >
//           <i className="fa fa-eye"></i>
//         </button>
//         <button
//           onClick={() => onEdit(ticket)}
//           className="text-green-600 hover:text-green-900 mr-3"
//           title="Edit"
//         >
//           <i className="fas fa-edit"></i>
//         </button>
//       </td>
//     </tr>
//   );
// });

// const TicketCard = ({ ticket, headers, formatDate, onEdit, onImageClick, videoModalUrl, setVideoModalUrl, isSelected, onSelect }) => {
//   return (
//     <div className="bg-white rounded-lg shadow p-4 mb-4 space-y-3 border border-gray-200">
//       <div className="flex justify-between items-center">
//         <div className="flex items-center gap-2">
//           <input
//             type="checkbox"
//             checked={isSelected}
//             onChange={() => onSelect(ticket.TicketID)}
//             className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
//           />
//           <h3 className="text-lg font-semibold text-orange-600">Ticket ID: {ticket.TicketID}</h3>
//         </div>
//         <div>
//           <button
//             onClick={() => onEdit(ticket)}
//             className="text-red-600 hover:text-red-900 mr-3"
//             title="View"
//           >
//             <i className="fa fa-eye"></i>
//           </button>
//           <button
//             onClick={() => onEdit(ticket)}
//             className="text-green-600 hover:text-green-900"
//             title="Edit"
//           >
//             <i className="fas fa-edit"></i>
//           </button>
//         </div>
//       </div>

//       {headers.map(({ key, label }) => {
//         if (key === "TicketID") return null;

//         const value = ticket[key];
//         if (key === "DateCreated") {
//           return (
//             <div key={key}>
//               <span className="font-semibold">{label}:</span>{" "}
//               {formatDate(value)}
//             </div>
//           );
//         }
//         if (key === "Title") {
//           return (
//             <div key={key}>
//               <span className="font-semibold">{label}:</span>{" "}
//               <div className="font-medium">{value?.substring(0, 25) || "N/A"}...</div>
//               <div className="text-sm text-gray-500">{ticket.Description ? ticket.Description.substring(0, 60) + "..." : "No Description"}</div>
//             </div>
//           );
//         }
//         if (key === "Attachment") {
//           return (
//             <div key={key}>
//               <span className="font-semibold">{label}:</span>
//               <div className="flex gap-2 mt-1 max-h-48 overflow-auto">
//                 {value ? (
//                   value.split(",").map((url, idx) => {
//                     const trimmedUrl = url.trim();
//                     const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(trimmedUrl);
//                     const isVideo = /\.(mp4|webm|avi|mov|mkv)$/i.test(trimmedUrl);

//                     if (!isImage && !isVideo) return null;

//                     return (
//                       <button
//                         key={idx}
//                         type="button"
//                         className="w-10 h-10 border rounded-md overflow-hidden bg-gray-100 hover:ring-2 hover:ring-blue-400 relative cursor-pointer"
//                         title={trimmedUrl}
//                         onClick={() => {
//                           if (isImage) {
//                             onImageClick(trimmedUrl);
//                           } else if (isVideo) {
//                             setVideoModalUrl(trimmedUrl);
//                           }
//                         }}
//                       >
//                         {isImage ? (
//                           <img
//                             src={trimmedUrl}
//                             alt={`Attachment ${idx + 1}`}
//                             loading="lazy"
//                             className="w-full h-full object-cover"
//                           />
//                         ) : (
//                           <video
//                             src={trimmedUrl}
//                             className="w-full h-full object-cover"
//                             muted
//                             playsInline
//                           />
//                         )}
//                       </button>
//                     );
//                   })
//                 ) : (
//                   <p className="text-sm text-gray-500">No Attachments</p>
//                 )}
//               </div>

//               {videoModalUrl && (
//                 <div className="fixed inset-0 bg-black bg-opacity-70 z-[9999] flex items-center justify-center h-screen">
//                   <div className="relative w-full max-w-3xl p-4">
//                     <video
//                       src={videoModalUrl}
//                       controls
//                       autoPlay
//                       muted
//                       playsInline
//                       className="w-full h-auto rounded shadow-lg"
//                       onClick={() => setVideoModalUrl(null)}
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>
//           );
//         }
//         if (key === "Status") {
//           return (
//             <div key={key}>
//               <span className="font-semibold">{label}:</span>{" "}
//               <span className="px-2 py-1 rounded-full text-gray-900">{value}</span>
//             </div>
//           );
//         }
//         if (key === "WorkLogs") {
//           return (
//             <div key={key}>
//               <span className="font-semibold">{label}:</span>{" "}
//               <div className="text-sm max-h-24 overflow-auto whitespace-pre-wrap border p-2 rounded">
//                 {value || "No WorkLogs"}
//               </div>
//             </div>
//           );
//         }
//         return (
//           <div key={key}>
//             <span className="font-semibold">{label}:</span> {value || "N/A"}
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export const TicketList = () => {
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [videoModalUrl, setVideoModalUrl] = useState(null);
//   const [isMobile, setIsMobile] = useState(false);
//   const [currentPage, setCurrentPage] = useState(() => {
//     const saved = localStorage.getItem("currentPage");
//     return saved ? parseInt(saved, 10) : 1;
//   });
//   const [selectedTickets, setSelectedTickets] = useState(new Set());
//   const [selectedColumns, setSelectedColumns] = useState(new Set());
//   const [showColumnSelector, setShowColumnSelector] = useState(false);

//   const { decryptedUser, filters, searchTerm, filteredTickets, setCurrentView, setSelectedTicket } = useApp();
//   const TICKETS_PER_PAGE = 10;
//   const totalPages = Math.ceil(filteredTickets.length / TICKETS_PER_PAGE);

//   const prevFiltersRef = useRef(filters);

//   // Check window size for mobile/tablet
//   useEffect(() => {
//     const checkMobile = () => setIsMobile(window.innerWidth < 768);
//     checkMobile();
//     window.addEventListener("resize", checkMobile);
//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   useEffect(() => {
//     const hasAnyFilterValue = Object.values(filters).some(value =>
//       Array.isArray(value) ? value.some(v => v !== '') : value !== ''
//     );

//     const filtersChanged = JSON.stringify(filters) !== JSON.stringify(prevFiltersRef.current);

//     if ((hasAnyFilterValue && filtersChanged) || searchTerm) {
//       setCurrentPage(1);
//     }

//     prevFiltersRef.current = filters;
//   }, [filters, searchTerm]);

//   useEffect(() => {
//     localStorage.setItem("currentPage", currentPage);
//   }, [currentPage]);



//   const paginatedTickets = useMemo(() => {
//     const start = (currentPage - 1) * TICKETS_PER_PAGE;
//     return filteredTickets.slice(start, start + TICKETS_PER_PAGE);
//   }, [filteredTickets, currentPage]);

//   const editTicket = (ticket) => {
//     setSelectedTicket(ticket);
//     setCurrentView("edit");
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const [datePart, timePart] = dateString.split(",").map((str) => str.trim());
//     const [day, month, year] = datePart.split("/");
//     const [hour = "00", minute = "00", second = "00"] = (timePart || "").split(":");
//     const isoString = `${year}-${month}-${day}T${hour}:${minute}:${second}`;
//     const date = new Date(isoString);
//     if (isNaN(date)) return "Invalid Date";
//     const options = {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     };
//     const formatted = date.toLocaleString("en-GB", options);
//     const [dPart, tPart] = formatted.split(", ");
//     return `${dPart}, ${tPart?.toUpperCase()}`;
//   };

//   const fullHeaders = [
//     { label: "TicketID", key: "TicketID" },
//     { label: "Date Created", key: "DateCreated" },
//     { label: "Property Code", key: "PropertyCode" },
//     { label: "Title", key: "Title" },
//     { label: "Attachment", key: "Attachment" },
//     { label: "Customer Impacted", key: "CustomerImpacted" },
//     { label: "Escalated", key: "Escalated" },
//     { label: "Target Date", key: "TargetDate" },
//     { label: "Category", key: "Category" },
//     { label: "Status", key: "Status" },
//     { label: "Priority", key: "Priority" },
//     { label: "Department", key: "Department" },
//     { label: "Manager", key: "Manager" },
//     { label: "Assignee", key: "Assignee" },
//     { label: "Created By Id", key: "CreatedById" },
//     { label: "Created By Name", key: "CreatedByName" },
//     { label: "Updated By ID", key: "UpdatedById" },
//     { label: "Updated By Name", key: "UpdatedByName" },
//     { label: "Updated Date Time", key: "UpdatedDateTime" },
//     { label: "WorkLogs", key: "WorkLogs" },
//     { label: "Internal Comments", key: "InternalComments" },
//     { label: "Estimated Time To Resolve", key: "EstimatedTimeToResolve" },
//     { label: "Actual Time Spent", key: "ActualTimeSpent" },
//   ];

//   const clientHeaders = [
//     { label: "Ticket ID", key: "TicketID" },
//     { label: "Date Created", key: "DateCreated" },
//     { label: "Department", key: "Department" },
//     { label: "Category", key: "Category" },
//     { label: "Attachment", key: "Attachment" },
//     { label: "Status", key: "Status" },
//     { label: "WorkLogs", key: "WorkLogs" },
//     { label: "Title", key: "Title" },
//   ];

//   const headers = useMemo(() => {
//     return decryptedUser?.employee?.Role === "client" ? clientHeaders : fullHeaders;
//   }, [decryptedUser]);


//     // Initialize selected columns with all headers
//   // useEffect(() => {
//   //   const allColumnKeys = headers.map(header => header.key);
//   //   setSelectedColumns(new Set(allColumnKeys));
//   // }, [headers]);


//   // Selection handlers
//   const handleTicketSelect = (ticketId) => {
//     setSelectedTickets(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(ticketId)) {
//         newSet.delete(ticketId);
//       } else {
//         newSet.add(ticketId);
//       }
//       return newSet;
//     });
//   };

//   const handleSelectAll = () => {
//     if (selectedTickets.size === paginatedTickets.length) {
//       setSelectedTickets(new Set());
//     } else {
//       const allTicketIds = paginatedTickets.map(ticket => ticket.TicketID);
//       setSelectedTickets(new Set(allTicketIds));
//     }
//   };

//   const handleColumnSelect = (columnKey) => {
//     setSelectedColumns(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(columnKey)) {
//         newSet.delete(columnKey);
//       } else {
//         newSet.add(columnKey);
//       }
//       return newSet;
//     });
//   };

//   const handleSelectAllColumns = () => {
//     if (selectedColumns.size === headers.length) {
//       setSelectedColumns(new Set());
//     } else {
//       const allColumnKeys = headers.map(header => header.key);
//       setSelectedColumns(new Set(allColumnKeys));
//     }
//   };

//   // Export functionality
//   const handleExport = () => {
//     // Get selected tickets data
//     const ticketsToExport = filteredTickets.filter(ticket => 
//       selectedTickets.size > 0 ? selectedTickets.has(ticket.TicketID) : true
//     );

//     // Get selected columns
//     const columnsToExport = headers.filter(header => 
//       selectedColumns.size > 0 ? selectedColumns.has(header.key) : true
//     );

//     if (ticketsToExport.length === 0) {
//       alert("No tickets selected for export!");
//       return;
//     }

//     if (columnsToExport.length === 0) {
//       alert("No columns selected for export!");
//       return;
//     }

//     // Prepare CSV content
//     const headersRow = columnsToExport.map(header => header.label).join(',');
    
//     const dataRows = ticketsToExport.map(ticket => {
//       return columnsToExport.map(header => {
//         let value = ticket[header.key] || '';
//         // Handle special formatting for dates
//         if (header.key === 'DateCreated' && value) {
//           value = formatDate(value);
//         }
//         // Handle commas in values by wrapping in quotes
//         if (typeof value === 'string' && value.includes(',')) {
//           value = `"${value}"`;
//         }
//         return value;
//       }).join(',');
//     });

//     const csvContent = [headersRow, ...dataRows].join('\n');

//     // Create and trigger download
//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = `tickets-export-${new Date().toISOString().split('T')[0]}.csv`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     window.URL.revokeObjectURL(url);
//   };

//   const goToPrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
//   const goToNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

//   return (
//     <div className="space-y-6">
//       {/* Export Controls */}
//       <div className="flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-lg shadow">
//         <div className="flex flex-wrap gap-2 items-center">
//           <button 
//             onClick={handleExport}
//             className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 flex items-center gap-2"
//           >
//             <i className="fas fa-download"></i>
//             Export {selectedTickets.size > 0 ? `(${selectedTickets.size} selected)` : '(All)'}
//           </button>
          
//           <button 
//             onClick={() => setShowColumnSelector(!showColumnSelector)}
//             className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center gap-2"
//           >
//             <i className="fas fa-columns"></i>
//             Select Columns ({selectedColumns.size}/{headers.length})
//           </button>

//           {selectedTickets.size > 0 && (
//             <span className="text-sm text-gray-600">
//               {selectedTickets.size} ticket(s) selected
//             </span>
//           )}
//         </div>

//         {/* Column Selector Modal */}
//         {showColumnSelector && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//             <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-96 overflow-hidden">
//               <div className="p-4 border-b">
//                 <div className="flex justify-between items-center">
//                   <h3 className="text-lg font-semibold">Select Columns to Export</h3>
//                   <button 
//                     onClick={() => setShowColumnSelector(false)}
//                     className="text-gray-500 hover:text-gray-700"
//                   >
//                     <i className="fas fa-times"></i>
//                   </button>
//                 </div>
//               </div>
              
//               <div className="p-4 max-h-64 overflow-y-auto">
//                 <div className="flex items-center gap-2 mb-3 p-2 bg-gray-50 rounded">
//                   <input
//                     type="checkbox"
//                     checked={selectedColumns.size === headers.length}
//                     onChange={handleSelectAllColumns}
//                     className="h-4 w-4 text-orange-600 rounded focus:ring-orange-500"
//                   />
//                   <label className="font-medium">Select All Columns</label>
//                 </div>
                
//                 {headers.map((header) => (
//                   <div key={header.key} className="flex items-center gap-2 mb-2 p-2 hover:bg-gray-50 rounded">
//                     <input
//                       type="checkbox"
//                       checked={selectedColumns.has(header.key)}
//                       onChange={() => handleColumnSelect(header.key)}
//                       className="h-4 w-4 text-orange-600 rounded focus:ring-orange-500"
//                     />
//                     <label>{header.label}</label>
//                   </div>
//                 ))}
//               </div>
              
//               <div className="p-4 border-t bg-gray-50">
//                 <button 
//                   onClick={() => setShowColumnSelector(false)}
//                   className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
//                 >
//                   Done
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <TicketFilters />

//       {isMobile ? (
//         <div>
//           {paginatedTickets.map((ticket) => (
//             <TicketCard
//               key={ticket.TicketID}
//               ticket={ticket}
//               headers={headers}
//               formatDate={formatDate}
//               onEdit={editTicket}
//               onImageClick={setSelectedImage}
//               videoModalUrl={videoModalUrl}
//               setVideoModalUrl={setVideoModalUrl}
//               isSelected={selectedTickets.has(ticket.TicketID)}
//               onSelect={handleTicketSelect}
//             />
//           ))}
//         </div>
//       ) : (
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200 text-sm">
//               <thead className="bg-orange-300 sticky top-0 z-30">
//                 <tr>
//                   {/* Selection Checkbox Header */}
//                   <th className="px-4 py-3 text-left font-bold text-black text-lg sticky left-0 z-40 bg-orange-300 w-12">
//                     <input
//                       type="checkbox"
//                       checked={selectedTickets.size === paginatedTickets.length && paginatedTickets.length > 0}
//                       onChange={handleSelectAll}
//                       className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
//                     />
//                   </th>
                  
//                   {headers.map(({ label, key }) => (
//                     <th
//                       key={label}
//                       className={`px-4 py-3 text-left font-bold text-black text-lg whitespace-nowrap ${key === "TicketID" ? "sticky left-12 z-40 bg-orange-300" : ""
//                         }`}
//                       title={label}
//                     >
//                       <div className="flex items-center gap-2">
//                         <input
//                           type="checkbox"
//                           checked={selectedColumns.has(key)}
//                           onChange={() => handleColumnSelect(key)}
//                           className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
//                         />
//                         <span>{label.substring(0, 20)}</span>
//                       </div>
//                     </th>
//                   ))}
//                   <th className="px-6 py-3 text-left text-black font-bold text-lg sticky right-0 bg-orange-300 z-30 max-w-[150px]" title="Actions">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200 text-[18px]">
//                 {paginatedTickets.map((ticket) => (
//                   <TicketRow
//                     key={ticket.TicketID}
//                     ticket={ticket}
//                     headers={headers}
//                     formatDate={formatDate}
//                     onEdit={editTicket}
//                     onImageClick={setSelectedImage}
//                     videoModalUrl={videoModalUrl}
//                     setVideoModalUrl={setVideoModalUrl}
//                     isSelected={selectedTickets.has(ticket.TicketID)}
//                     onSelect={handleTicketSelect}
//                   />
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* Pagination */}
//       <div className="flex justify-center items-center gap-6 pb-5">
//         <span className="text-sm text-gray-700">
//           Page {currentPage} of {totalPages}
//         </span>
//         <button
//           disabled={currentPage === 1}
//           onClick={goToPrevious}
//           className="px-4 py-2 bg-orange-400 text-white rounded disabled:opacity-50"
//         >
//           <i className="fa-solid fa-arrow-left"></i> Previous
//         </button>
//         <button
//           disabled={currentPage === totalPages}
//           onClick={goToNext}
//           className="px-4 py-2 bg-orange-400 text-white rounded disabled:opacity-50"
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
//     </div>
//   );
// };
