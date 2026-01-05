import * as yup from "yup";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";

import { toast } from "react-toastify";
import { usePostClientDeatails, useUpdateClientDetails } from "./services";
import LoaderPage from "../NewBooking/LoaderPage";
import LeadsTable from "./LeadsTable";
import { useDynamicDetails } from "../TicketSystem/Services";
import { useApp } from "../TicketSystem/AppProvider";
import { useNavigate } from "react-router-dom";


// ✅ Validation schema
const schema = yup.object().shape({
  // ClientName: yup.string().required("Client name is required").min(3),
  CallingNo: yup
    .string()
    .required("Calling No is Required")
    .matches(/^[0-9]{10}$/, "Enter 10 Digit Number"),
  WhatsAppNo: yup
    .string()
    .required("WhatsApp No is Required")
    .matches(/^[0-9]{10}$/, "Enter 10 Digit Number"),
});

function ClientLeads() {
  
  const {
    control,
    handleSubmit,
    setValue,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      ClientName: "",
      MaleFemale: null,
      CallingNo: "",
      WhatsAppNo: "",
      LeadSource: null,
      WhatsAppCommunication: null,
      PhoneCallCommunication: null,
      interestedLocation: null,
      visited: null,
      Comments: "",
    },
  });

  const { data: dynamicData } = useDynamicDetails();
  const { mutateAsync: createClient } = usePostClientDeatails();
  const { mutateAsync: updateClient } = useUpdateClientDetails();
  const { selectedClient, setSelectedClient } = useApp()
  const navigate = useNavigate()
  // const [selectedClient, setSelectedClient] = useState(null);
  // ✅ Dropdown Options
  const selectOptionGender = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];

  const selectOptionLeadSource =
    (Array.from(
      new Set(dynamicData?.data?.map((item) => item.LeadSourcee).filter(Boolean))
    ).map((value) => ({ value, label: value }))) || [];

  const selectOptioninterestedLocation =
    (Array.from(
      new Set(dynamicData?.data?.map((item) => item.Locations).filter(Boolean))
    ).map((value) => ({ value, label: value }))) || [];

  const selectOptionWhatsAppCommunication =
    (Array.from(
      new Set(dynamicData?.data?.map((item) => item.WhatsAppStatus).filter(Boolean))
    ).map((value) => ({ value, label: value }))) || [];

  const selectOptionPhoneCallCommunication =
    (Array.from(
      new Set(dynamicData?.data?.map((item) => item.CallStatus).filter(Boolean))
    ).map((value) => ({ value, label: value }))) || [];

  const selectOptionYesNo = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];

  const employeeSelectStyles = {
    control: (base, state) => ({
      ...base,
      padding: "0.14rem 0.5rem",
      marginTop: "0.09rem",
      borderWidth: "1px",
      borderColor: state.isFocused ? "#fb923c" : "#f97316",
      borderRadius: "0.375rem",
      boxShadow: state.isFocused
        ? "0 0 0 2px rgba(251,146,60,0.5)"
        : "0 1px 2px rgba(0,0,0,0.05)",
      backgroundColor: "white",
      minHeight: "40px",
      "&:hover": { borderColor: "#fb923c" },
    }),
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? "white" : "#fb923c",
      backgroundColor: state.isSelected ? "#fb923c" : "white",
      "&:hover": { backgroundColor: "#fed7aa" },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
  };


  ///////////////// Akash Code //////////////////////


  const copyToClipboard = async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      return true;
    } catch (err) {
      console.error('Failed to copy: ', err);
      return false;
    }
  };

  ///////////////// Akash Code //////////////////////






  // ✅ Submit Handler
  const onSubmit = async (data) => {
    const updatedData = {
      ClientName: data.ClientName,
      CallingNo: data.CallingNo,
      WhatsAppNo: data.WhatsAppNo,
      MaleFemale: data?.MaleFemale?.value || "",
      Location: data?.Location?.value || "",
      LeadSource: data?.LeadSource?.value || "",
      PhoneCallCommunication: data?.PhoneCallCommunication?.value || "",
      WhatsAppCommunication: data?.WhatsAppCommunication?.value || "",
      Visited: data?.visited?.value || "",
      Comments: data?.Comments || "",
    };

    const createdData = {
      ClientName: data.ClientName,
      CallingNo: data.CallingNo,
      WhatsAppNo: data.WhatsAppNo,
      MaleFemale: data?.MaleFemale?.value || "",
      Location: data?.Location?.value || "",
      LeadSource: data?.LeadSource?.value || "",
      PhoneCallCommunication: data?.PhoneCallCommunication?.value || "",
      WhatsAppCommunication: data?.WhatsAppCommunication?.value || "",
      Visited: data?.visited?.value || "",
      Comments: data?.Comments || "",
      // LeadNo: selectedClient.LeadNo || selectedClient.LeadNo,
    };

    try {
      if (selectedClient) {
        // 🔹 Update existing client
        await updateClient({
          data: { ...updatedData, LeadNo: selectedClient.LeadNo || selectedClient.LeadNo, }
        });
        toast.success("Lead updated successfully!");
        reset({
          ClientName: "",
          CallingNo: "",
          WhatsAppNo: "",
          Comments: "",
          MaleFemale: null,
          LeadSource: null,
          interestedLocation: null,
          PhoneCallCommunication: null,
          WhatsAppCommunication: null,
          visited: null,
        }); // <-- this clears the form fields and select values

        // Also clear selection in parent so edit mode exits
        reset()
        setSelectedClient("")
        navigate("/gpgs-actions/leads-list")

      } else {
        await createClient(createdData);
        toast.success("Lead added successfully!");
        navigate("/gpgs-actions/leads-list")
        const phone = data.WhatsAppNo;
        const clientName = data.ClientName;
        // const message = encodeURIComponent(
        //   `Hello ${clientName}, 👋\n*Welcome to Gopal's Paying Guest Services!*\n\n*Property Details:*\n• Fully furnished rooms\n• AC/Non-AC options available\n• Food services optional\n• Security & maintenance included\n\n📞 *Contact Our Sales Team:*\n• +919326262292\n• +917021368623\n\n🌐 *Official Website:*\nhttps://gpgs24.in\n\n🕒 *Service Hours:* 10 AM to 8 PM`
        // );
        // const whatsappURL = `https://api.whatsapp.com/send?phone=91${phone}&text=${message}`;

        const message = dynamicData?.data[0]?.NewLeadMessage || "";
        const encodedMessage = encodeURIComponent(message)
        const whatsappURL = `https://api.whatsapp.com/send?phone=91${phone}&text=${encodedMessage}`;
        await copyToClipboard(message)
        reset();
        setTimeout(() => {
          const newWindow = window.open(whatsappURL, "_blank");
          if (!newWindow) window.location.href = whatsappURL;
        }, 3000);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  // ✅ Auto-fill when editing
  useEffect(() => {
    if (!selectedClient) {
      reset();
      return;
    }

    reset({
      ClientName: selectedClient.ClientName || "",
      CallingNo: selectedClient.CallingNo || "",
      WhatsAppNo: selectedClient.WhatsAppNo || "",
      Comments: selectedClient.Comments || "",
    });

    const findOption = (options, val) => {
      if (!options || !val) return null;
      if (typeof val === "object" && val.value) return val;
      return (
        options.find(
          (o) =>
            String(o.value).toLowerCase() === String(val).toLowerCase() ||
            String(o.label).toLowerCase() === String(val).toLowerCase()
        ) || { value: val, label: val }
      );
    };

    setValue("MaleFemale", findOption(selectOptionGender, selectedClient.MaleFemale));
    setValue("LeadSource", findOption(selectOptionLeadSource, selectedClient.LeadSource || selectedClient.LeadSourcee));
    setValue("Location", findOption(selectOptioninterestedLocation, selectedClient.Location || selectedClient.Location));
    setValue("visited", findOption(selectOptionYesNo, selectedClient.Visited || selectedClient.visited));
    setValue("WhatsAppCommunication", findOption(selectOptionWhatsAppCommunication, selectedClient.WhatsAppCommunication));
    setValue("PhoneCallCommunication", findOption(selectOptionPhoneCallCommunication, selectedClient.PhoneCallCommunication));
  }, [selectedClient, reset, setValue]);


  const handleCancel = () => {
    setSelectedClient("")
    navigate("/gpgs-actions/leads-list")
  }

  return (
    <div className="max-w-7xl mx-auto my-28">
      <div className="rounded-xl p-2 border-2">
        <h3 className="text-xl font-semibold bg-orange-400 px-3 py-2 rounded-md text-white mb-4">
          {selectedClient ? "Update Lead" : "Add New Lead"}
        </h3>


        <form className="mt-4 sm:p-1 p-3" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
            {/* Client Name */}
            <div>
              <label className="text-sm text-gray-700">Client Full Name</label>
              <input
                type="text"
                placeholder="Enter full Client Name"
                className="w-full px-3 py-[8px]  border border-orange-400 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500 shadow-sm hover:border-orange-400"
                {...register("ClientName")}
              />
              {/* {errors.ClientName && (
                <p className="text-red-500 text-sm mt-1">{errors.ClientName.message}</p>
              )} */}
            </div>

            {/* Gender */}
            <div>
              <label className="text-sm text-gray-700">Gender</label>
              <Controller
                name="MaleFemale"
                control={control}
                render={({ field }) => (
                  <Select {...field} placeholder="Select Gender"
                    isClearable
                    styles={employeeSelectStyles}
                    options={selectOptionGender} />
                )}
              />
            </div>

            {/* Calling No */}
            <div>
              <label className="text-sm text-gray-700">
                <span className="relative after:content-['*'] after:ml-1 after:text-red-500" >Calling No</span>
              </label>
              <input
                type="text"
                placeholder="Enter Phone No"
                className="w-full px-3 py-[8px] border outline-none border-orange-400 rounded-md focus:ring-2 focus:ring-orange-300"
                {...register("CallingNo")}
              />
              {errors.CallingNo && (
                <p className="text-red-500 text-sm mt-1">{errors.CallingNo.message}</p>
              )}
            </div>

            {/* WhatsApp No */}
            <div>
              <label className="text-sm text-gray-700">
                <span className="relative after:content-['*'] after:ml-1 after:text-red-500" > WhatsApp No</span>
              </label>
              <input
                type="text"
                placeholder="Enter WhatsApp No"
                className="w-full px-3 py-[8px] border outline-none border-orange-400 rounded-md focus:ring-2 focus:ring-orange-300"
                {...register("WhatsAppNo")}
              />
              {errors.WhatsAppNo && (
                <p className="text-red-500 text-sm mt-1">{errors.WhatsAppNo.message}</p>
              )}
            </div>
            {/* Lead Source */}
            <div>
              <label className="text-sm text-gray-700">Lead Source</label>
              <Controller
                name="LeadSource"
                control={control}
                render={({ field }) => (
                  <Select {...field} placeholder="Select Lead Source"
                    isClearable
                    styles={employeeSelectStyles}
                    options={selectOptionLeadSource} />
                )}
              />
            </div>

            {/* Interested Location */}
            <div>
              <label className="text-sm text-gray-700">Interested Location</label>
              <Controller
                name="Location"
                control={control}
                render={({ field }) => (
                  <Select {...field} placeholder="Select Location"
                    isClearable
                    styles={employeeSelectStyles}
                    options={selectOptioninterestedLocation} />
                )}
              />
            </div>

            {/* WhatsApp Communication */}
            <div>
              <label className="text-sm text-gray-700">WhatsApp Communication</label>
              <Controller
                name="WhatsAppCommunication"
                control={control}
                render={({ field }) => (
                  <Select {...field} placeholder="Select Option"
                    isClearable
                    styles={employeeSelectStyles}
                    options={selectOptionWhatsAppCommunication} />
                )}
              />
            </div>

            {/* Phone Call Communication */}
            <div>
              <label className="text-sm text-gray-700">Phone Call Communication</label>
              <Controller
                name="PhoneCallCommunication"
                control={control}
                render={({ field }) => (
                  <Select {...field} placeholder="Select Option"
                    isClearable
                    styles={employeeSelectStyles}
                    options={selectOptionPhoneCallCommunication} />
                )}
              />
            </div>

            {/* Visited */}
            <div>
              <label className="text-sm text-gray-700">Visited</label>
              <Controller
                name="visited"
                control={control}
                render={({ field }) => (
                  <Select {...field} placeholder="Visited?"
                    isClearable
                    styles={employeeSelectStyles}
                    options={selectOptionYesNo} />
                )}
              />
            </div>

            {/* Comments */}
            <div>
              <label className="text-sm text-gray-700">Comments</label>
              <textarea
                className="w-full px-3 py-[8px] border outline-none border-orange-400 rounded-md focus:ring-2 focus:ring-orange-300"
                {...register("Comments")}
              />
            </div>
          </div>

          <div className="flex justify-center items-center">

            <button
              type="submit"
              disabled={isSubmitting}
              className={`mt-5 px-4 py-2 rounded-md text-[16px] text-white ${isSubmitting ? "bg-orange-300 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"
                }`}
            >
              {isSubmitting ? (
                <div className="flex justify-center items-center gap-2">
                  <LoaderPage />
                  {selectedClient ? "Updating..." : "Submitting..."}

                </div>
              ) : selectedClient ? (
                "Update"
              ) : (
                "Submit"
              )}
            </button>

            <p
              // type="submit"
              onClick={handleCancel}
              className={`mt-5 px-4 py-2 rounded-md text-[16px] cursor-pointer text-black `}
            >
              Cancel
            </p>
          </div>

        </form>

      </div>
      {/* <LeadsTable setSelectedClient={setSelectedClient} /> */}

    </div>
  );
}

export default ClientLeads;