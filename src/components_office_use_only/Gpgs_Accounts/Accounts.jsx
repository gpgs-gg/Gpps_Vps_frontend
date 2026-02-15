import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { useAddBooking, useFetchSingleSheetData, usePropertySheetData } from "./services/index";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useClientDetails } from "../ClientCreation/services";
import { FiCheck } from "react-icons/fi";
import LoaderPage from "../NewBooking/LoaderPage";
import { FaWhatsapp } from "react-icons/fa";

// import useFetchSingleSheetData, { useAddBooking, usePropertySheetData } from "./services/index";
// import { useAddBooking, useFetchSingleSheetData, usePropertySheetData } from "./Server/index";

const Accounts = () => {
  const { control, watch, handleSubmit, formState: { errors } } = useForm();
  const [sheetId, setSheetId] = useState(null);
  const [result, setResult] = useState(null);
  const [rnrSheetData, setRnrSheetData] = useState({})
  const [showNumbers, setShowNumbers] = useState(false)
  // Fetch all properties
  const { data: fetchSingleSheetData, error, isError } = useFetchSingleSheetData();

  // Fetch property sheet data for selected property + month
  const { data: propertySheetData, isLoading, isSuccess } = usePropertySheetData(sheetId, !!sheetId);
  const { data: clientMasterData } = useClientDetails();
  // Watch form values
  const selectedMonth = watch("selectedMonth");
  const selectedProperty = watch("selectedProperty");

  // akash code //
  const findClient = (name) => {
    if (!showNumbers) return null;
    if (!clientMasterData) return null;

    const clean = (str) =>
      str?.toLowerCase().trim().replace(/\s+/g, " ");

    const target = clean(name);

    const found = clientMasterData?.data?.find(
      (c) => clean(c.Name) === target // <-- Correct Key here
    );
    return found || null;
  };

  // akash code //




  useEffect(() => {
    if (isSuccess && propertySheetData?.data) {
      const validItems = propertySheetData.data.filter(
        item => typeof item.FullName === "string" && item.FullName.trim() !== ""
      );

      // Build formula string like: "=123 + 456", skipping 0s
      const buildFormulaString = (values) => {
        const filtered = values
          .map(v => Number(v))
          .filter(v => !isNaN(v) && v > 0);

        return filtered.length > 0 ? `= ${filtered.join(" + ")}` : "";
      };

      // Helper function for custom currentDue calculation
      const calculateCurrentDue = (item) => {
        const cur = Number(item.CurDueAmt);
        const pre = Number(item.PreDueAmt);
        if (isNaN(cur) && isNaN(pre)) return 0;
        if (isNaN(pre)) return cur;
        if (!isNaN(cur)) return pre < 0 ? cur + pre : cur;
        return 0;
      };

      // Helper function for custom previousDue calculation
      const calculatePreviousDue = (item) => {
        const pre = Number(item.PreDueAmt);
        const cur = Number(item.CurDueAmt);
        if (isNaN(pre) && isNaN(cur)) return 0;
        if (isNaN(cur)) return pre;
        if (!isNaN(pre)) return cur < 0 ? pre + cur : pre;
        return 0;
      };

      // Get FullNames with calculated current due > 0
      const getNamesByCalculatedCurrentDue = () =>
        validItems
          .filter(item => calculateCurrentDue(item) > 0)
          .map(item => item.FullName.trim())
          .join("\n");

      // Get FullNames with calculated previous due > 0
      const getNamesByCalculatedPreviousDue = () =>
        validItems
          .filter(item => calculatePreviousDue(item) > 0)
          .map(item => item.FullName.trim())
          .join("\n");

      // Other due name filters (simple > 0 checks)
      const getNamesByDueCondition = (key) =>
        validItems
          .filter(item => Number(item[key]) > 0)
          .map(item => item.FullName.trim())
          .join("\n");

      const ClientNameCurrentDue = getNamesByCalculatedCurrentDue();
      const ClientNameDepositDue = getNamesByDueCondition("DADue");
      const ClientNamePreviousDue = getNamesByCalculatedPreviousDue();

      // Build total formula strings
      const currentDue = buildFormulaString(validItems.map(calculateCurrentDue));
      const daDue = buildFormulaString(validItems.map(item => item.DADue));
      const preDue = buildFormulaString(validItems.map(calculatePreviousDue));

      // akash code //
      const addNumbersToNames = (namesString) => {
        if (!namesString) return "None";

        return namesString
          .split("\n")
          .map((name) => {
            const trimmed = name.trim();
            const client = findClient(trimmed);

            if (client) {
              return `${trimmed} ${client.CallingNo || ""} | ${client.WhatsAppNo || ""} (${client.RentDate})`;
            }
            return trimmed;
          })
          .join("\n");
      };
      // akash code //





      // Final object
      const transformed = [
        {
          PropertyCode: selectedProperty.label,
          // ClientNameCurrentDue: ClientNameCurrentDue || "None",
          // ClientNameDepositDue: ClientNameDepositDue || "None",
          // ClientNamePreviousDue: ClientNamePreviousDue || "None",

          // akash code //
          ClientNameCurrentDue: addNumbersToNames(ClientNameCurrentDue) || "None",
          ClientNameDepositDue: addNumbersToNames(ClientNameDepositDue) || "None",
          ClientNamePreviousDue: addNumbersToNames(ClientNamePreviousDue) || "None",
          // akash code //

          CurrentDue: currentDue,
          DepositDue: daDue,
          PreviousDue: preDue,
        }
      ];

      setRnrSheetData(transformed);
    }
  }, [isSuccess, propertySheetData]);
  const { mutate: submitBooking, isPending: isBookingLoading } = useAddBooking();



  // When property is selected, build sheetId and fetch data automatically
  useEffect(() => {
    if (selectedMonth && selectedProperty && fetchSingleSheetData?.data) {
      const selectedData = fetchSingleSheetData.data.find(
        (item) => item["PG Main  Sheet ID"] === selectedProperty.value
      );

      const calculatedValue = selectedData?.["Bed Count"]
        ? parseInt(selectedData["Bed Count"]) * 2
        : 0;

      setResult(calculatedValue);

      const newSheetId = `${selectedProperty.value},${selectedMonth.value},${calculatedValue / 2}`;
      setSheetId(newSheetId);

    }
  }, [selectedMonth, selectedProperty, fetchSingleSheetData]);

  // Manual submit action
  const onSubmit = (data) => {
    submitBooking(
      {
        rnrSheetData: rnrSheetData[0],
        selectedMonth: selectedMonth?.value,
      },
      {
        onSuccess: () => {
          toast.success("Data successfully sent to Google Sheet!");
        },
        onError: (error) => {
          // Try to extract error message from response
          toast.error(error)
          console.error("Submission error:", error);
          const message =
            error?.response?.data?.error || error.message || "❌ Unknown error occurred while submitting data.";

          alert(`❌ Failed to submit data:\n${message}`);
        },
      }
    );
  };

  // Property options
  const propertyOptions =
    fetchSingleSheetData?.data?.map((item) => ({
      value: item["PG Main  Sheet ID"],
      label: item["Property Code"],
    })) || [];


  // 🔐 Manual short month map to avoid "Sept" issue
  const MONTH_SHORT_NAMES = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const today = new Date();

  const monthOptions = Array.from({ length: 2 }, (_, i) => {
    const baseDate = new Date(today.getFullYear(), today.getMonth() + i, 1);

    const year = baseDate.getFullYear();
    const monthIndex = baseDate.getMonth(); // 0 = Jan, 8 = Sep
    const shortMonth = MONTH_SHORT_NAMES[monthIndex]; // Always "Sep", never "Sept"
    const fullMonth = baseDate.toLocaleString("default", { month: "long" }); // e.g., "September"

    return {
      value: `${shortMonth}${year}`,   // ✅ Always "Sep2025"
      label: `${fullMonth} ${year}`    // e.g., "September 2025"
    };
  });


  // Custom styles
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      width: "100%",
      paddingTop: "0.25rem",
      paddingBottom: "0.10rem",
      paddingLeft: "0.75rem",
      paddingRight: "0.50rem",
      marginTop: "0.30rem",
      borderWidth: "2px",
      borderStyle: "solid",
      borderColor: state.isFocused ? "#fb923c" : "#f97316",
      borderRadius: "0.375rem",
      boxShadow: state.isFocused
        ? "0 0 0 2px rgba(251,146,60,0.5)"
        : "0 1px 2px rgba(0,0,0,0.05)",
      backgroundColor: "white",
      minHeight: "40px",
      "&:hover": { borderColor: "#fb923c" },
    }),
    valueContainer: (base) => ({
      ...base,
      padding: 0,
    }),
    placeholder: (base) => ({
      ...base,
      color: "#000",
      marginLeft: 0,
    }),
    input: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#fb923c"
        : state.isFocused
          ? "rgba(251,146,60,0.1)"
          : "white",
      color: state.isSelected ? "white" : "#000",
      cursor: "pointer",
      "&:active": {
        backgroundColor: "#fb923c",
        color: "white",
      },
    }),
  };



  const handleShareOnWhatsApp = (name, currentDue, preDue, depositDue) => {

    // Extract phone number safely
    const Phone = name.includes("|") ? name.split("|")[1].trim() : "";

    // CLEAN VALUES (remove =, spaces, '-') 
    const clean = (value) => {
      if (!value) return null;
      const v = value.replace("=", "").trim();
      if (v === "" || v === "-" || v === "0") return null;
      return v;
    };

    const cd = clean(currentDue);
    const pd = clean(preDue);
    const dd = clean(depositDue);

    // DETAILS (ONLY SHOW IF VALUE EXISTS)
    let details = "";
    if (cd) details += `Rs. ${cd} , Current Month Rent\n`;
    if (pd) details += `Rs. ${pd} , Previous Due\n`;
    if (dd) details += `Rs. ${dd} , Deposit Due\n`;

    // TOTAL
    let total = 0;
    if (cd) total += Number(cd);
    if (pd) total += Number(pd);
    if (dd) total += Number(dd);

    const message =
      `Hello ${name.replace(/[0-9|]/g, '').trim()},

Kindly make the payment.

Total Amount: Rs. ${total}.00
Details are given below:

${details}

If you have any concerns please let us know immediately.

Gopal's Paying Guest Services
Customer Care / Emergency No. 1 : 8928191814
Customer Care / Emergency No. 2 : 9326325181
(Service Hours : 10 AM to 7 PM)
`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://api.whatsapp.com/send?phone=91${Phone}&text=${encodedMessage}`;
    // const whatsappURL = `https://web.whatsapp.com/send?phone=91${Phone}&text=${encodedMessage}`;
    const newWindow = window.open(whatsappURL, "_blank");
    if (!newWindow) window.location.href = whatsappURL;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold text-center mb-6 text-orange-600">
          Update RNR Details
        </h2>

        {/* Form wrapper for submit */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Month */}
          <div>
            <label className="text-sm font-medium text-gray-700 relative after:content-['*'] after:ml-1 after:text-red-500">
              Month
            </label>
            <Controller
              name="selectedMonth"
              control={control}
              rules={{ required: "Please select a month" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={monthOptions}
                  placeholder="Select a month"
                  styles={selectStyles}
                />
              )}
            />
            {errors.selectedMonth && (
              <p className="text-red-500 text-sm mt-1">
                {errors.selectedMonth.message}
              </p>
            )}
          </div>
          <div className="flex justify-start items-center">

            <div
              onClick={() => setShowNumbers(!showNumbers)}
              className={`h-5 w-5 flex  items-center justify-center rounded-md border-2 
                                            transition-all cursor-pointer
                                            ${showNumbers ? "bg-orange-500 border-orange-500" : "bg-white border-gray-400"}
                                            `}
            >
              {showNumbers && <FiCheck className="text-white text-[20px]  font-bold" />}
            </div>
            <span className="ml-2">Show Numbers (Optional)</span>
          </div>
          {/* Property */}
          <div className={`${!selectedMonth ? "cursor-not-allowed" : ""}`}>
            <label className="text-sm font-medium  text-gray-700 relative after:content-['*'] after:ml-1 after:text-red-500">
              Property Code
            </label>
            <Controller
              name="selectedProperty"
              control={control}
              rules={{ required: "Please select a property" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={propertyOptions}
                  placeholder="Select & Search a property"
                  styles={selectStyles}
                  isDisabled={!selectedMonth} // ✅ disable until month selected
                />
              )}
            />
            {errors.selectedProperty && (
              <p className="text-red-500 text-sm mt-1">
                {errors.selectedProperty.message}
              </p>
            )}
          </div>

          {/* ✅ Submit Button */}
          <button
            type="submit"
            disabled={!isSuccess}
            className={`w-full px-4 py-2 ${!isSuccess ? "bg-orange-300" : "bg-orange-300"} text-black rounded-lg transition focus:outline-none focus:ring-2 focus:ring-orange-400`}
          >
            {isBookingLoading || isLoading ? <div className="flex justify-center items-center gap-2">
              <LoaderPage />
              {isLoading ? "Loading.." : "Update RNR Sheet"}

            </div> : " Update RNR Sheet"}
            {/* Update RNR Sheet */}
          </button>
        </form>

        {/* Error */}
        {isError && (
          <div className="mt-4 text-center text-red-500">
            <p>Error: {error.message}</p>
          </div>
        )}

        {/* Result */}

        {/* Property Sheet Data Debug */}


      </div>
      {sheetId && propertySheetData && rnrSheetData.length > 0 && (
        <div className="mt-2 mx-auto max-w-5xl bg-[#F8F9FB] text-black rounded-2xl shadow-lg p-6">

          {/* <h2 className="text-2xl text-orange-500 font-bold text-center mb-6">
            Loaded Data
          </h2> */}

          <table className="w-full border-collapse">
            <thead className="text-lg">
              <tr className="bg-orange-300 text-left">
                <th className="p-3 border">Client Name</th>
                <th className="p-3 border">Contact/WhatsApp</th>
                <th className="p-3 border whitespace-nowrap">Current Due</th>
                <th className="p-3 border whitespace-nowrap">Previous Due</th>
                <th className="p-3 border whitespace-nowrap">Deposit Due</th>
                <th className="p-3 border whitespace-nowrap">Action</th>
              </tr>
            </thead>

            <tbody>
              {/** STEP 1 — MERGE ALL NAMES */}
              {Array.from(
                new Set([
                  ...rnrSheetData[0].ClientNameCurrentDue.split("\n").map(n => n.trim()),
                  ...rnrSheetData[0].ClientNamePreviousDue.split("\n").map(n => n.trim()),
                  ...rnrSheetData[0].ClientNameDepositDue.split("\n").map(n => n.trim())
                ])
              ).map((name, index) => {
                console.log("name", name)
                const client = showNumbers ? findClient(name) : null;

                /** GET MATCHED AMOUNTS */
                const currentNames = rnrSheetData[0].ClientNameCurrentDue.split("\n").map(n => n.trim());
                const previousNames = rnrSheetData[0].ClientNamePreviousDue.split("\n").map(n => n.trim());
                const depositNames = rnrSheetData[0].ClientNameDepositDue.split("\n").map(n => n.trim());

                const currentAmounts = rnrSheetData[0].CurrentDue?.toString().split("+").map(a => a.trim());
                const previousAmounts = rnrSheetData[0].PreviousDue?.toString().split("+").map(a => a.trim());
                const depositAmounts = rnrSheetData[0].DepositDue?.toString().split("+").map(a => a.trim());

                const currentDue = currentNames.indexOf(name) >= 0 ? currentAmounts[currentNames.indexOf(name)] : "";
                const previousDue = previousNames.indexOf(name) >= 0 ? previousAmounts[previousNames.indexOf(name)] : "";
                const depositDue = depositNames.indexOf(name) >= 0 ? depositAmounts[depositNames.indexOf(name)] : "";

                const extractNumbersPart = (name) => {
                  if (!name) return "";

                  const match = name.match(/\d.*$/);
                  return match ? match[0] : "";
                };


                return (
                  <tr key={index} className="border hover:bg-orange-50">

                    {/* NAME + NUMBER */}
                    {/* <td className="border p-2 font-semibold">
                      {name.replace(/[0-9|]/g, '').trim()}
                    </td> */}
                    <td className="border p-2 font-semibold">
                      {name.replace(/[0-9|()]/g, '').trim()}
                    </td>

                    {/* <td className="border p-2 font-semibold">
                      {name?.match(/\d+/g)?.join('\n') ? name?.match(/\d+/g)?.join('\n') : <p className="text-sm text-orange-500">please update Whatsapp and Calling No (ClientMasterTable)
                        </p>}
                    </td> */}
                    <td className="border p-2 font-semibold">
                      {extractNumbersPart(name) ? (
                        extractNumbersPart(name)
                      ) : (
                        <p className="text-sm text-orange-500">
                          please update Whatsapp and Calling No (ClientMasterTable)
                        </p>
                      )}
                    </td>


                    {/* CURRENT DUE */}
                    <td className="border p-2 text-center font-semibold text-orange-600">
                      {currentDue ? currentDue.replace("=", "").trim() : "-"}
                    </td>
                    {/* PREVIOUS DUE */}
                    <td className="border p-2 text-center font-semibold text-orange-600">
                      {previousDue ? previousDue.replace("=", " ").trim() : "-"}
                    </td>

                    {/* DEPOSIT DUE */}
                    <td className="border p-2 text-center font-semibold text-orange-600">
                      {depositDue ? depositDue.replace("=", " ").trim() : "-"}
                    </td>

                    {/* SHARE BUTTON */}
                    <td className="border p-2 text-center">
                      <button
                        //                         onClick={() => {
                        //                           const text = `Name: ${name}
                        // Number: ${client?.CallingNo || "NA"}
                        // Current Due: ${currentDue || 0}
                        // Previous Due: ${previousDue || 0}
                        // Deposit Due: ${depositDue || 0}`;

                        //                           navigator.share
                        //                             ? navigator.share({ text })
                        //                             : alert("Web Share not supported!");
                        //                         }}
                        onClick={() =>
                          handleShareOnWhatsApp(
                            name,
                            currentDue ? currentDue.replace("=", "").trim() : "-",
                            previousDue ? previousDue.replace("=", "").trim() : "-",
                            depositDue ? depositDue.replace("=", "").trim() : "-"
                          )
                        }
                        className=" border hover:border-green-700 text-green-500 px-3 py-1 rounded-lg shadow"
                      >
                        <div className="flex justify-center items-center gap-2">
                          <FaWhatsapp className="text-green-500" /> Share
                        </div>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}


    </div>
  );
};

export default Accounts;
