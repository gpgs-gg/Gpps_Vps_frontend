import { useState } from "react";
import { useNoticeSheetData } from "./Services";

const FNFList = ({ setEditingClient, setActiveTab }) => {
  const { data: NoticeData, isPending } = useNoticeSheetData();
  const [showClosedOnly, setShowClosedOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  if (isPending) return <div>Loading...</div>;
  const tableData =
    NoticeData?.data
      ?.filter((ele) => {
        if (ele.NoticeStatus?.toLowerCase() === "cancelled") return false;

        if (showClosedOnly) {
          return ele.FNFStatus?.toLowerCase() === "closed";
        }

        return ele.FNFStatus?.toLowerCase() !== "closed";
      })
      ?.filter((row) =>
        Object.values(row)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      ) || [];

  const headers = tableData.length ? Object.keys(tableData[0]) : [];
  const handleFNFEdit = (row) => {
    setActiveTab("Tab5");
    setEditingClient(row);
  };


  const fields = [
    { label: "Ticket No", key: "TicketNo" },
    { label: "Property Code", key: "PropCode" },
    { label: "Client Name", key: "FullName" },
    { label: "FNF Status", key: "FNFStatus" },
    { label: "Rent DOJ", key: "RentDOJ" },
    { label: "NSD", key: "NSD" },
    { label: "NLD", key: "NLD" },
    { label: "CVD", key: "CVD" },
    { label: "Rent Amt", key: "RentAmt" },
    { label: "EB Amt", key: "EBAmt" },
    { label: "Adj EB", key: "AdjEB" },
    { label: "Previous Due Amt", key: "PreDueAmt" },
    { label: "Current Due Amt", key: "CurDueAmt" },
    { label: "Adj Amt", key: "AdjAmt" },
    { label: "DA", key: "DA" },
    { label: "FNF Refundable Amt", key: "F&FRefundableAmt" },
    { label: "Bank Details", key: "BankDetails" },
    { label: "FNF Msg", key: "FNFMsg" },
    { label: "PG Main Sheet Updated", key: "PGMainSheetUpdated" },
    { label: "Removed From WhatsApp Group", key: "RemovedFromWhatsAppGrp" },
    { label: "Deactivated The Client", key: "DeactivatedTheClient" },


    // { label: "Red Flag", key: "RedFlag" },
    { label: "Sharing", key: "SharingType" },
    { label: "AC Room", key: "ACRoom" },
    // { label: "Bed Available From", key: "BedAvailableFrom" },
    { label: "MFR", key: "MFR" },

    { label: "URHD", key: "URHD" },
    { label: "URHA", key: "URHA" },
    { label: "Bath Attached", key: "BathAttached" },
    { label: "Bed No", key: "BedNo" },
    { label: "Room No", key: "RoomNo" },

    { label: "Existing Client Cantact", key: "WhatsAppNo" },
    { label: "Comments", key: "Comments" },
    { label: "Location", key: "PropLocation" },
    { label: "Bed Available", key: "BedAvailable" },
    { label: "Gender", key: "MPG/FPG" },

    // ✅ Added ONLY remaining fields after Gender

    { label: "Expenses", key: "Expenses" },
    { label: "OUT Amt", key: "OUTAmt" },

    { label: "To Rcable Amt", key: "ToRcableAmt" },
    { label: "To Rcved Amt", key: "ToRcvedAmt" },
    { label: "Flat EB", key: "FlatEB" },

    { label: "Days Count", key: "DaysCount" },

    { label: "Pro Fees", key: "ProFees" },

    { label: "Payment Comments", key: "PaymentComments" },

    { label: "EB DOJ", key: "EBDOJ" },

    { label: "SDMF", key: "SDMF" },
    { label: "DA Rcved", key: "DARcved" },
    { label: "DA Due", key: "DADue" },
    { label: "DA Comment", key: "DAComment" },

    { label: "Docs Status", key: "DocsStatus" },
    { label: "Rent Date", key: "RentDate" },
    { label: "Free EB Per Day", key: "FreeEBPerDay" },

    { label: "Rent And EB Message", key: "RentAndEBMessage" },
    { label: "Send Rent EB Msg", key: "SendRentEBMsg" },

    { label: "Client ID", key: "ClientID" },
    { label: "PRHD", key: "PRHD" },

    { label: "Notice Reason", key: "NoticeReason" },
    { label: "Notice Discussion Proofs", key: "NoticeDiscussionProofs(Attach)" },

    { label: "Bed Additional Status", key: "BedAdtnlStatus" },

    { label: "New Client DOJ", key: "NewClntDOJ" },
    { label: "New Client FullName", key: "NewClntFullName" },
    { label: "New Client Comments", key: "NewClntComments" },

    { label: "Temp ASD", key: "TempASD" },
    { label: "Temp ALD", key: "TempALD" },
    { label: "Temp Client FullName", key: "TempClntFullName" },
    { label: "Temp Client WA No", key: "TempClntWANo" },
    { label: "Temp Client Call No", key: "TempClntCallNo" },
    { label: "Temp Client Comments", key: "TempClntComments" },

    { label: "Created Date", key: "CreatedDate" },
    { label: "AC Sub Meter Reading", key: "ACSubMtrReading" },

    { label: "Due Rent Amt", key: "DueRentAmt" },
    { label: "Comment For Due Rent Amt", key: "CommentForDueRentAmt" },

    { label: "Due EB Amt", key: "DueEBAmt" },
    { label: "Comment For Due EB Amt", key: "CommentForDueEBAmt" },

    { label: "Approx EB Amt", key: "ApproxEBAmt" },
    { label: "Comment For Approx EB Amt", key: "CommentForApproxEBAmt" },
    { label: "Comment For Previous Due Amt", key: "CommentForPreviousDueAmt" },

    { label: "Handover Taken By", key: "HandoverTakenBy" },
    { label: "Handover Checklist Attach", key: "HandoverCheckListAttach" },

    { label: "GPGS Review Link Decision", key: "GPGSReviewLinkDecision" },

    { label: "Deduction Amt", key: "DeductionAmt" },
    { label: "Comment For Deduction Amt", key: "CommentForDeductionAmt" },

    { label: "Total Due Amt", key: "TotalDueAmt" },
    { label: "Client Excess Amt", key: "ClientExcessAmt" },



    { label: "Action Button To Send FnF Msg", key: "ActionButtonToSendFnFMsgforClient" },


    { label: "Send GPGS Review Link", key: "SendGPGSReviewLink" },

    { label: "Reviewer", key: "Reviewer" },
    { label: "Notice & FNF Status", key: "Notice&FNFStatus" },
    { label: "Work Logs", key: "WorkLogs" },
    { label: "Actions", key: "Actions" },
  ];




  return (
    <div className="">

      {/* ===== Toggle Switch ===== */}
      <div className="flex justify-between items-center">

        {/* Global Search */}
        <input
          type="text"
          placeholder="Search anythings"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-2 border-orange-300 rounded-md px-3 py-1 text-md ml-5 outline-none focus:border-orange-500"
        />

        {/* Toggle */}
        <label className="flex items-center border border-orange-200 bg-orange-50 rounded-lg p-1 cursor-pointer hover:bg-orange-100 transition">

          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              checked={showClosedOnly}
              onChange={(e) => setShowClosedOnly(e.target.checked)}
            />

            <div
              className={`w-11 h-6 flex items-center rounded-full p-1 transition ${showClosedOnly ? "bg-orange-500" : "bg-gray-300"
                }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${showClosedOnly ? "translate-x-5" : ""
                  }`}
              />
            </div>
          </div>

          <div className="px-4">
            <p className="text-sm font-semibold text-orange-700">
              Show Closed FNF Only
            </p>
          </div>

        </label>

      </div>

      <div className="overflow-auto max-h-[80vh]">
        <table className="min-w-full border-collapse">

          {/* ================= HEADER ================= */}
          <thead className="bg-black sticky  top-0 z-20">
            <tr>
              {fields.map((col, idx) => (
                <th
                  key={col.key}
                  className={`px-2 py-2 text-white border-b border-gray-300 whitespace-nowrap
          ${idx === 0
                      ? "sticky left-0 z-20 bg-black"
                      : idx === 1
                        ? "sticky left-[100px] z-20 bg-black"
                        : ""
                    }`}
                >
                  {col.label}
                </th>
              ))}

              <th className="border px-4 py-2 text-white text-sm whitespace-nowrap text-left sticky right-0 bg-black z-30">
                Action
              </th>
            </tr>
          </thead>

          {/* ================= BODY ================= */}
          <tbody>
            {tableData.length === 0 ? (
              <tr>
                <td colSpan={headers.length + 1} className="text-center py-10">
                  <div className="flex justify-center items-center">
                    <img
                      src="https://ispperio.com/ASPX_Images/not_found.jpg"
                      alt="No records found"
                      className="max-h-[230px]"
                    />
                  </div>
                </td>
              </tr>
            ) : (
              tableData.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-100">

                  {fields.map((col, idx) => (
                    <td
                      key={col.key}
                      className={`px-2 py-2 text-[15px] whitespace-nowrap
                ${idx === 0
                          ? "sticky left-0 z-20 bg-gray-100 font-bold"
                          : idx === 1
                            ? "sticky left-[100px] z-20 bg-gray-100 font-bold"
                            : ""
                        }`}
                    >
                      {row?.[col.key]}
                    </td>
                  ))}
                  <td className="px-4 whitespace-nowrap sticky right-0 bg-gray-200 z-10">
                    <button
                      onClick={() => handleFNFEdit(row)}
                      className="text-md text-orange-500 px-3 rounded"
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                  </td>

                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default FNFList;