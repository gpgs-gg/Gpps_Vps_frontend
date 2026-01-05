import React, { useEffect, useRef, useState } from 'react';
import { Copy, X, FileDown, Send } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'react-toastify';
import LoaderPage from './LoaderPage';

const ConfirmationModel = ({
  showConfirmModal,
  setShowConfirmModal,
  formPreviewData,
  handleFinalSubmit,
  applyPermBedRent,
  setApplyPermBedRent,
  isBookingLoading,
  isPending
}) => {


  const invoiceRef = useRef();

  const formatCurrency = (amt) =>
    amt ? `₹${parseInt(amt).toLocaleString('en-IN')}` : '-';

  const handleCopy = async () => {
    try {
      const text = invoiceRef.current.innerText;
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard');
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const downloadPDF = () => {
    const element = invoiceRef.current;
    html2canvas(element, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`PG_Payment_${formPreviewData.ClientFullName}.pdf`);
    });
  };

  let endOfDOJMonth = null;

  if (formPreviewData?.PermBedDOJ) {
    const dojDate = new Date(formPreviewData.PermBedDOJ);

    if (!isNaN(dojDate)) {
      const year = dojDate.getFullYear();
      const month = dojDate.getMonth();
      // Get the actual last day of the month
      const actualLastDay = new Date(year, month + 1, 0).getDate();
      // Use 30 if month has more than 30 days, otherwise use actual last day (like Feb)
      const customEndDay = actualLastDay >= 30 ? 30 : actualLastDay;
      const customEndDate = new Date(year, month, customEndDay);
      endOfDOJMonth = customEndDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
  }

  let tempEndOfDOJMonth = null;
  if (formPreviewData?.TempBedDOJ) {
    const dojDate = new Date(formPreviewData.TempBedDOJ);
    if (!isNaN(dojDate)) {
      const year = dojDate.getFullYear();
      const month = dojDate.getMonth();
      // Get the actual last day of the month
      const actualLastDay = new Date(year, month + 1, 0).getDate();
      // Use 30 if month has more than 30 days, otherwise use actual last day (e.g., February)
      const customEndDay = actualLastDay >= 30 ? 30 : actualLastDay;
      const customEndDate = new Date(year, month, customEndDay);
      tempEndOfDOJMonth = customEndDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
  }


  const shareOnWhatsApp = () => {
    const {
      ClientFullName,
      WhatsAppNo,
      TempPropCode,
      TempRoomNo,
      TempBedNo,
      TempACRoom,
      TempBedDOJ,
      TempBedLDt,
      TempBedRentAmt,
      TempBedMonthlyFixRent,
      PermPropCode,
      PermRoomNo,
      PermBedNo,
      PermACRoom,
      PermBedDOJ,
      PermBedLDt,
      PermBedRentAmt,
      PermBedMonthlyFixRent,
      PermBedDepositAmt,
      ProcessingFeesAmt,
      AskForBAOrFA,
      CallingNo,
      UpcomingRentHikeDt,
      UpcomingRentHikeAmt
    } = formPreviewData;


    // console.log(2323,UpcomingRentHikeDt , UpcomingRentHikeAmt)

 const parsePermBedDOJ = (dateStr) => {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split(" ");
    return new Date(`${year}-${month}-${day}`);
  };


    const formatDate = (dateStr) =>
      dateStr
        ? new Date(dateStr).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        : "NA";

    const fallbackLastDate = formatDate(
      new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
    );

    const formattedTempBedDOJ = formatDate(TempBedDOJ);
    const formattedTempBedLDt = formatDate(TempBedLDt) || fallbackLastDate;

    const formattedPermBedDOJ = formatDate(PermBedDOJ);
    const formattedPermBedLDt = formatDate(PermBedLDt) || fallbackLastDate;

    const totalAmount =
      (applyPermBedRent ? Number(PermBedRentAmt || 0) : 0) +
      Number(PermBedDepositAmt || 0) +
      Number(ProcessingFeesAmt || 0) +
      Number(TempBedRentAmt || 0);

    const balanceAmount =
      totalAmount - (AskForBAOrFA === "Booking_Amount " ? Number(PermBedMonthlyFixRent) : 0);

    let msg = `Payment Details For ${ClientFullName} ( Contact No : ${CallingNo} )`;
    msg += "\n";
    if (TempPropCode) {
      msg += "\n";
      msg += `
Temporary PG Facility Code: ${TempPropCode}
Room No.: ${TempRoomNo}
Bed No.: ${TempBedNo}
AC Room: ${TempACRoom}
Start Date: ${formattedTempBedDOJ}
Last Date: ${formattedTempBedLDt}
Temporary Bed Rent Amount: ₹${TempBedRentAmt} (This rent is from ${formattedTempBedDOJ} to ${formPreviewData.TempBedLDt || tempEndOfDOJMonth}, monthly fixed rent is ₹${TempBedMonthlyFixRent})
    `.trim() + "\n";
    }
    msg += "\n";
    msg += `
Permanent PG Facility Code: ${PermPropCode}
Room No.: ${PermRoomNo}
Bed No.: ${PermBedNo}
AC Room: ${PermACRoom}
Start Date: ${formattedPermBedDOJ}
Last Date: ${formattedPermBedLDt}
Permanent Bed Rent Amount: ₹${PermBedRentAmt} (This rent is from ${formattedPermBedDOJ} to ${formPreviewData.PermBedLDt || endOfDOJMonth}, monthly fixed rent is ₹${PermBedMonthlyFixRent})
Permanent Bed Deposit Amount: ₹${PermBedDepositAmt}
Processing Fees: ₹${ProcessingFeesAmt}
Total Amount to be paid: ₹${totalAmount}
`.trim();
    if (applyPermBedRent) {
      msg += "  ( Please Note : Permanent Bed Rent is included )"
    } else {
      msg += "  ( Please Note : Permanent Bed Rent is not included )"
    }

    msg += "\n\n";

    if (AskForBAOrFA === "Booking_Amount ") {
      msg += `📌 The booking is confirmed only after the booking amount ₹${PermBedMonthlyFixRent} is received by us. The balance amount ₹${balanceAmount} is to be paid before possession on the date of joining.\n`;
    } else if (AskForBAOrFA === "Full_Amount ") {
      msg += `📌 The booking is confirmed only after full amount ₹${totalAmount} is received by us.\n`;
    }

    msg += `📌 Payment is not refundable if you cancel the booking for any reason. Please read the agreement file sent to your WhatsApp and contact us if you have any concerns.\n\n`;

    if (
      UpcomingRentHikeDt && new Date(UpcomingRentHikeDt) > parsePermBedDOJ(PermBedDOJ) &&
      new Date(UpcomingRentHikeDt) > new Date() && new Date(PermBedDOJ) > new Date()
    ) {
      msg +=
        "📌 Upcoming Rent Hike Details — " +
        "Date: " +
        formatDate(UpcomingRentHikeDt) +
        " | Amount: " +
        (UpcomingRentHikeAmt ? `₹${UpcomingRentHikeAmt}\n\n` : "NA");
    }

    msg += `Gopal's Paying Guest Services\n(Customer Care No: 8928191814 | Service Hours: 10AM to 7PM)\nNote: This is a system-generated message and does not require a signature.\n\n`;



    const encodedMsg = encodeURIComponent(msg);
    const number = WhatsAppNo?.replace(/\D/g, "") || "";

    // window.open(`https://wa.me/${number}?text=${encodedMsg}`, "_blank");

    window.open(
      `https://api.whatsapp.com/send?phone=91${number}&text=${encodedMsg}`,
      "_blank"
    );

    // =HYPERLINK("https://api.whatsapp.com/send?phone="&ENCODEURL(91&$AE4)&"&text="&ENCODEURL($AC4),"Click Me")(

  };

  const parsePermBedDOJ = (dateStr) => {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split(" ");
    return new Date(`${year}-${month}-${day}`);
  };

  useEffect(() => {
    if (isBookingLoading) {
      shareOnWhatsApp();
      // window.location.reload()
    }
  }, [isBookingLoading]);

  if (!showConfirmModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-start pt-10 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 relative">
        <button
          onClick={() => setShowConfirmModal(false)}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
        >
          <X size={24} />
        </button>

        {/* Invoice Preview */}
        <div ref={invoiceRef} className=" border  p-6 border-gray-300 rounded-md bg-white text-gray-800 space-y-4">
          <h1 className="text-xl font-bold text-center border-b pb-2 text-orange-500 ">Payment Details For {formPreviewData.ClientFullName} ( {formPreviewData.CallingNo} )</h1>

          {formPreviewData?.TempPropCode && (
            <div className='flex justify-between p-2'>
              <section className='max-w-[50%]'>
                <div>
                  {formPreviewData?.TempPropCode && (
                    <p>
                      <strong>Temporary PG Facility Code :</strong>{" "}
                      {formPreviewData.TempPropCode}
                    </p>
                  )}

                  {formPreviewData?.TempRoomNo && (
                    <p>
                      <strong>Room No. :</strong> {formPreviewData.TempRoomNo}
                    </p>
                  )}

                  {formPreviewData?.TempBedNo && (
                    <p>
                      <strong>Bed No. :</strong> {formPreviewData.TempBedNo}
                    </p>
                  )}

                  {formPreviewData?.TempACRoom && (
                    <p>
                      <strong>AC Room :</strong> {formPreviewData.TempACRoom}
                    </p>
                  )}

                  {formPreviewData?.TempBedDOJ && (
                    <p>
                      <strong>Start Date :</strong>{" "}
                      {formPreviewData?.TempBedDOJ
                        ? new Date(formPreviewData.TempBedDOJ).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                        : "NA"}

                    </p>
                  )}

                  {
                    formPreviewData?.TempBedLDt && (

                      <p>
                        <strong>Last Date :</strong>{" "}
                        {
                          formPreviewData?.TempBedLDt
                            ? new Date(formPreviewData.TempBedLDt).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                            : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                        }
                      </p>

                    )
                  }
                </div>
              </section>

              <section className='max-w-[50%]'>
                <div>
                  {(formPreviewData?.TempBedRentAmt ||
                    formPreviewData?.TempBedRentAmt ||
                    formPreviewData?.TempBedLDt ||
                    formPreviewData?.TempBedMonthlyFixRent) && (
                      <p>
                        <strong>Temporary Bed Rent Amount :</strong> ₹{" "}
                        {formPreviewData.TempBedRentAmt} (This rent is from{" "}
                        {formPreviewData.TempBedDOJ} to{" "}
                        {formPreviewData.TempBedLDt || tempEndOfDOJMonth}
                        , also please note the monthly fixed rent of this bed is ₹{" "}
                        {formPreviewData.TempBedMonthlyFixRent})
                      </p>

                    )}

                </div>
              </section>
            </div>
          )}


          {formPreviewData?.TempPropCode && (
            <hr />
          )}

          <div className='flex justify-between p-2'>

            <section className='max-w-[50%]'>
              <div>
                {/* <h2 className="font-semibold text-orange-600 mb-1">
                  Permanent PG Details
                </h2> */}
                <p>
                  <strong>Permanent PG Facility Code :</strong>{" "}
                  {formPreviewData.PermPropCode}
                </p>
                <p>
                  <strong> Room No. :</strong>{" "}
                  {formPreviewData.PermRoomNo}
                </p>
                <p>
                  <strong> Bed No. :</strong>{" "}
                  {formPreviewData.PermBedNo}
                </p>
                <p>
                  <strong> AC Room : </strong>{" "}
                  {formPreviewData.PermACRoom}
                </p>
                <p>
                  <strong> Start Date :</strong>{" "}
                  {formPreviewData?.PermBedDOJ
                    ? new Date(formPreviewData.PermBedDOJ).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                    : "NA"}

                </p>
                <p>
                  <strong>  Last Date :</strong>{" "}
                  {formPreviewData?.PermBedLDt
                    ? new Date(formPreviewData.PermBedLDt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                    : "NA"}

                </p>
              </div>
              <div className="flex items-center  gap-2 mt-2 text-orange-400">
                <input
                  type="checkbox"
                  id="permanent-bed-rent"
                  checked={applyPermBedRent} // 🔗 bind to state
                  onChange={(e) => setApplyPermBedRent(e.target.checked)} // 🔁 update state
                  className="w-5 h-5 accent-orange-500 border border-orange-500"
                />
                {
                  applyPermBedRent ? (<label htmlFor="permanent-bed-rent" className='text-sm'>Permanent Bed Rent Applied</label>) : (<label htmlFor="permanent-bed-rent" className='text-sm'>Permanent Bed Rent Not Applied</label>)
                }
              </div>


            </section>

            <section className='max-w-[50%]'>
              <div>
                {/* <h2 className="font-semibold text-orange-600 mb-1">
                  Payment Details
                </h2> */}
                <p>
                  <strong>Permanent Bed Rent Amount :</strong> ₹{" "}
                  {formPreviewData.PermBedRentAmt} ( This rent is from{" "}
                  {new Date(formPreviewData.PermBedDOJ).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })} to{" "}
                  {
                    formPreviewData.PermBedLDt ||
                    endOfDOJMonth
                  }, also please note the monthly fix rent of this bed is ₹{" "}
                  {formPreviewData.PermBedMonthlyFixRent})
                </p>

                <p>
                  <strong>Permanent Bed Deposit Amount :</strong> ₹{" "}
                  {formPreviewData.PermBedDepositAmt}
                </p>
                <p>
                  <strong>Processing Fees :</strong> ₹{" "}
                  {formPreviewData.ProcessingFeesAmt}
                </p>
                <p>
                  <strong>Total Amount To Be paid :</strong> ₹{" "}
                  {
                    (applyPermBedRent ? Number(formPreviewData.PermBedRentAmt || 0) : 0)
                    +
                    Number(formPreviewData.PermBedDepositAmt) +
                    Number(formPreviewData.ProcessingFeesAmt) +
                    (formPreviewData.TempBedRentAmt ? Number(formPreviewData.TempBedRentAmt) : 0)
                  }
                  <br />
                  <p className="text-xs italic text-orange-500 mt-1">

                    {applyPermBedRent
                      ? "( Please Note : Permanent Bed Rent is included )"
                      : "( Please Note : Permanent Bed Rent is not included )"}
                  </p>

                </p>
              </div>
            </section>
          </div>
          <section className="text-sm p-2 text-gray-600 border-t pt-2">
            {formPreviewData.AskForBAOrFA === "Booking_Amount " && (
              <p>
                📌 The booking is confirmed only after the booking amount ₹{" "}
                {formPreviewData.PermBedMonthlyFixRent} is received by us.
                The balance amount ₹{" "}

                {(applyPermBedRent ? Number(formPreviewData.PermBedRentAmt || 0) : 0) +
                  Number(formPreviewData.PermBedDepositAmt) +
                  Number(formPreviewData.ProcessingFeesAmt) + (formPreviewData.TempBedRentAmt ? Number(formPreviewData.TempBedRentAmt) : 0)
                  - formPreviewData.PermBedMonthlyFixRent}{" "}
                is to be paid before possession on the date of joining.
              </p>
            )}
            {formPreviewData.AskForBAOrFA === "Full_Amount " && (
              <p>
                📌 The booking is confirmed only after full amount ₹{" "}
                {
                  (applyPermBedRent ? Number(formPreviewData.PermBedRentAmt || 0) : 0) +
                  Number(formPreviewData.PermBedDepositAmt) +
                  Number(formPreviewData.ProcessingFeesAmt) +
                  (formPreviewData.TempBedRentAmt ? Number(formPreviewData.TempBedRentAmt) : 0)
                } is received by us.
              </p>
            )}
            <p>
              📌 Payment is not refundable if you cancel the booking for any
              reason, so before making any payment please read the agreement
              file sent on your WhatsApp and if you have any concerns please let
              us know.
            </p>
          </section>
          <footer className=" text-sm text-center  border-t">
            <p className='text-orange-500 text-bold '>Gopal's Paying Guest Services</p>
            <p>( Customer Care No : 89281918wer14 | Service Hours : 10AM to 7PM )</p>

            {new Date(formPreviewData?.UpcomingRentHikeDt) > parsePermBedDOJ(formPreviewData?.PermBedDOJ) &&
              new Date(formPreviewData?.UpcomingRentHikeDt) > new Date() && (
                <p className="text-[12px] text-red-600">
                  <strong>📌</strong> Upcoming Rent Hike Details —
                  <span className="ml-1">
                    Date: {formPreviewData?.UpcomingRentHikeDt || "NA"}
                  </span>
                  {" | "}
                  <span>
                    Amount:{" "}
                    {formPreviewData?.UpcomingRentHikeAmt
                      ? `₹${formPreviewData.UpcomingRentHikeAmt}`
                      : "NA"}
                  </span>
                </p>
              )}


            <p className='text-[12px]'>Note: This is a system-generated document and does not require a signature.
            </p>

            {/* {new Date(formPreviewData?.UpcomingRentHikeDt) > new Date() && (
              <p className="text-[12px] text-red-600">
                <strong>Note:</strong> Upcoming Rent Hike Details —
                <span className="ml-1">
                  Date:{" "}
                  {formPreviewData?.UpcomingRentHikeDt || "NA"}
                </span>
                {" | "}
                <span>
                  Amount:{" "}
                  {formPreviewData?.UpcomingRentHikeAmt
                    ? `₹${formPreviewData.UpcomingRentHikeAmt}`
                    : "NA"}
                </span>
              </p>
            )} */}

          </footer>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded"
          >
            <Copy size={18} /> Copy
          </button>
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-600 rounded"
          >
            <FileDown size={18} /> Download PDF
          </button>

          <button
            onClick={() => {
              // shareOnWhatsApp();
              handleFinalSubmit();
            }} className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded"
          >
            {isPending ? <p className='flex justify-center items-center gap-2'>
              <LoaderPage /> <Send size={18} /> Save & Share on WhatsApp
            </p> : "Save & Share on WhatsApp"}
          </button>

        </div>
      </div>
    </div>
  );
};
export default ConfirmationModel;











