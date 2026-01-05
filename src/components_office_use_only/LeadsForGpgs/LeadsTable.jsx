
import { useState } from "react";
// import { useClientDetails } from "./service/api";
import { FaRegEdit } from "react-icons/fa";
import { useLeadsDetails } from "./services";
import { useApp } from "../TicketSystem/AppProvider";
import { Navigate, useNavigate } from "react-router-dom";
import LoaderPage from "../NewBooking/LoaderPage";

function LeadsTable() {
  const { data, isPending } = useLeadsDetails();
  const clientList = data?.data || [];
  const { selectedClient, setSelectedClient } = useApp()
  const navigate = useNavigate()

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const totalPages = Math.ceil(clientList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = clientList.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  const handleEdit = (cleint) => {
    setSelectedClient(cleint)
    navigate("/gpgs-actions/client-leads")
  }

  if (isPending) {
    return <div className="h-screen w-full flex justify-center items-center">
      <LoaderPage />
    </div>
  }


  return (
    <div className="max-w-full mx-auto mt-28 p-2">
      {/* 🌟 DESKTOP TABLE VIEW */}
      <div className="flex justify-end items-center">
        <button
          // type="submit",
          onClick={() => navigate("/gpgs-actions/client-leads")}
          className={`px-4 py-2 rounded-md text-[16px] hover:text-orange-600 text-black  `}
        >
          + Create  Leads
        </button>
      </div>
      <div className="overflow-y-auto max-h-[600px] hidden md:block">

        <table className="min-w-full border-orange-400 rounded-lg">
          <thead className="bg-orange-300 text-center sticky text-lg top-0 z-10">
            <tr>
              <th className="px-4 py-4 whitespace-nowrap">Lead No</th>
              <th className="px-4 py-4 whitespace-nowrap">Date</th>
              <th className="px-4 py-4 whitespace-nowrap">Client Name</th>
              <th className="px-4 py-4 whitespace-nowrap">Gender</th>
              <th className="px-4 py-4 whitespace-nowrap">Calling No</th>
              <th className="px-4 py-4 whitespace-nowrap">WhatsApp No</th>
              <th className="px-4 py-4 whitespace-nowrap">Lead Source</th>
              <th className="px-4 py-4 whitespace-nowrap">WhatsApp Communication</th>
              <th className="px-4 py-4 whitespace-nowrap">Phone Call Communication</th>
              <th className="px-4 py-4 whitespace-nowrap">Visited</th>
              <th className="px-4 py-4 whitespace-nowrap">Location</th>
              <th className="px-4 py-4 whitespace-nowrap">Comment</th>
              <th className="px-4 py-4 sticky right-0 bg-orange-300">Action</th>
            </tr>
          </thead>

          <tbody>
            {currentData.map((client, index) => {
              const isSelected =
                selectedClient &&
                selectedClient.CallingNo === client.CallingNo &&
                selectedClient.LeadNo === client.LeadNo;

              return (
                <tr
                  key={index}
                  className={`text-center border hover:bg-gray-200`}
                >
                  <td className="py-5  whitespace-nowrap">{client.LeadNo}</td>
                  <td className="py-5  whitespace-nowrap">{client.Date}</td>
                  <td className="py-5 whitespace-nowrap">{client.ClientName}</td>
                  <td className="py-5  whitespace-nowrap">{client.MaleFemale}</td>
                  <td className="px-4 py-5  whitespace-nowrap">{client.CallingNo}</td>
                  <td className="px-4 py-5  whitespace-nowrap">{client.WhatsAppNo}</td>
                  <td className="px-4 py-5  whitespace-nowrap">{client.LeadSource}</td>
                  <td className="px-4 py-5  whitespace-nowrap">{client.WhatsAppCommunication}</td>
                  <td className="px-4 py-5  whitespace-nowrap">{client.PhoneCallCommunication}</td>
                  <td className="px-4 py-5  whitespace-nowrap">{client.Visited}</td>
                  <td className="px-4 py-5  whitespace-nowrap">{client.Location}</td>
                  <td className="px-4 py-5  whitespace-nowrap">{client.Comments}</td>

                  <td className="px-4 py-2 sticky right-0 bg-white">
                    <button
                      onClick={() => handleEdit(client)}
                      className="text-orange-500 flex items-center gap-1"
                    >
                      <FaRegEdit size={22} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 🌟 MOBILE CARD VIEW */}
      <div className="md:hidden space-y-4 mt-3">
        {currentData.map((client, index) => (
          <div
            key={index}
            className="p-4 border rounded-xl shadow-lg bg-white space-y-2"
          >
            {/* <p><b className="text-orange-400">Sr No:</b> {startIndex + index + 1}</p> */}
            <p><b className="text-orange-400">Date:</b> {client.Date}</p>
            <p><b className="text-orange-400">Name:</b> {client.ClientName}</p>
            <p><b className="text-orange-400">Gender:</b> {client.MaleFemale}</p>
            <p><b className="text-orange-400">Calling No:</b> {client.CallingNo}</p>
            <p><b className="text-orange-400">WhatsApp No:</b> {client.WhatsAppNo}</p>
            <p><b className="text-orange-400">Lead Source:</b> {client.LeadSource}</p>
            <p><b className="text-orange-400">WhatsApp Comm:</b> {client.WhatsAppCommunication}</p>
            <p><b className="text-orange-400">Phone Call Comm:</b> {client.PhoneCallCommunication}</p>
            <p><b className="text-orange-400">Visited:</b> {client.Visited}</p>
            <p><b className="text-orange-400">Location:</b> {client.InterestedLocation}</p>
            <p><b className="text-orange-400">Comment:</b> {client.Comments}</p>

            <button
              onClick={() => handleEdit(client)}
              className="w-full bg-orange-500 text-black py-2 rounded-xl flex items-center justify-center gap-2"
            >
              <FaRegEdit /> Edit
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {clientList.length > itemsPerPage && (
        <div className="flex justify-center items-center mt-4 gap-4">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-orange-400 text-white rounded disabled:opacity-50"
          >
            <i className="fa-solid fa-arrow-left"></i> Previous
          </button>


          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-orange-400 text-white rounded disabled:opacity-50"
          >
            Next  <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      )}
    </div>
  );
}

export default LeadsTable;