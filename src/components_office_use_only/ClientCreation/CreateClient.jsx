// import { yupResolver } from '@hookform/resolvers/yup';
// import React, { memo, useEffect, useState } from 'react';
// import { Controller, useForm } from 'react-hook-form';
// import Select from "react-select";
// import { useClientDetails, usePropertyData, useUpdateClientCreation } from './services';
// import * as yup from "yup";
// import { toast } from 'react-toastify';
// import LoaderPage from '../NewBooking/LoaderPage';
// import { useApp } from '../TicketSystem/AppProvider';

// // ✅ Yup validation schema (example, modify based on real rules)
// const schema = yup.object().shape({
//     PropertyCode: yup.string().required("Property Code is required"),
//     ClientID: yup.string().required("Client ID is required"),
//     // TemporaryPropertyCode: yup.string().required("Temporary Property Code is required"),
//     Name: yup.string().required("Full name is required"),
//     RentDate: yup.string().required("Rent Date is required"),
//     WhatsAppNo: yup.string().required("WhatsApp No is required"),
//     CallingNo: yup.string().required("Calling No is required"),
//     EmailID: yup.string().required("Email ID is required"),
//     DOJ: yup.string().required("DOJ is required"),
//     EmgyCont1FullName: yup.string().required("Emgy Cont1 FullName is required"),
//     EmgyCont1No: yup.string().required("Emgy Cont1 No is required"),
//     // Occupation: yup.string().required("Occupation is required"),
//     // Organization: yup.string().required("Organization is required"),
//     ParkingCharges: yup.string().required("Parking Charges is required"),
// });

// const CreateClient = () => {
//     const { data: clientDetails } = useClientDetails();
//     const { data: propertyDetails } = usePropertyData();
//     const [mode, setMode] = useState("Create New Client")
//     const { decryptedUser } = useApp()

//     // console.log(1111111111, decryptedUser)


//     const {
//         register,
//         handleSubmit,
//         control,
//         watch,
//         setValue,
//         reset,
//         formState: { errors },
//     } = useForm({
//         resolver: yupResolver(schema),
//     });

//     const filterClientData = clientDetails && clientDetails?.data?.find((ele) => ele.ClientID === watch("ClientID"))

//     useEffect(() => {

//         if (mode !== "Create New Client") {
//             setValue("Name", filterClientData?.Name)
//             setValue("IsActive", filterClientData?.IsActive)
//             setValue("RentDate", filterClientData?.RentDate)
//             setValue("RentDateComments", filterClientData?.RentDateComments)
//             setValue("WhatsAppNo", filterClientData?.WhatsAppNo)
//             setValue("CallingNo", filterClientData?.CallingNo)
//             setValue("EmailID", filterClientData?.EmailID)
//             setValue("DOJ", filterClientData?.DOJ ? new Date(filterClientData.DOJ).toLocaleDateString('en-CA')
//                 : "")
//             setValue("TemporaryPropCode", filterClientData?.TemporaryPropCode)
//             setValue("ActualDOJ", filterClientData?.ActualDOJ ? new Date(filterClientData.DOJ).toLocaleDateString('en-CA') : "")
//             setValue("EmgyCont1FullName", filterClientData?.EmgyCont1FullName)
//             setValue("EmgyCont1No", filterClientData?.EmgyCont1No)
//             setValue("EmgyCont2FullName", filterClientData?.EmgyCont2FullName)
//             setValue("EmgyCont2No", filterClientData?.EmgyCont2No)
//             setValue("BloodGroup", filterClientData?.BloodGroup)
//             setValue("Occupation", filterClientData?.Occupation)
//             setValue("Organization", filterClientData?.Organization)
//             setValue("NoticeSD", filterClientData?.NoticeSD ? new Date(filterClientData?.NoticeSD).toLocaleDateString('en-CA') : "")
//             setValue("NoticeLD", filterClientData?.NoticeLD ? new Date(filterClientData?.NoticeLD).toLocaleDateString('en-CA') : "")
//             setValue("ActualVD", filterClientData?.ActualVD ? new Date(filterClientData.ActualVD).toLocaleDateString('en-CA') : "")
//             setValue("ParkingCharges", filterClientData?.ParkingCharges)
//             setValue("Comments", filterClientData?.Comments)
//         }
//     }, [filterClientData])

//     useEffect(() => {
//         reset()
//     }, [mode])

//     const MemoizedSelect = memo(({ field, options, placeholder, isDisabled, onChange, styles }) => (
//         <Select
//             {...field}
//             value={options?.find((opt) => opt.value === field.value)}
//             isDisabled={isDisabled}
//             options={options}
//             placeholder={placeholder}
//             styles={styles}
//             onChange={(selectedOption) => onChange(selectedOption ? selectedOption.value : "")}
//             isClearable
//             isSearchable
//             menuShouldScrollIntoView={false}
//         />
//     ));

//     const employeeSelectStyles = {
//         control: (base, state) => ({
//             ...base,
//             padding: "0.25rem 0.5rem",
//             marginTop: "0.30rem",
//             borderWidth: "1px",
//             borderColor: state.isFocused ? "#fb923c" : "#f97316",
//             borderRadius: "0.375rem",
//             boxShadow: state.isFocused ? "0 0 0 2px rgba(251,146,60,0.5)" : "0 1px 2px rgba(0,0,0,0.05)",
//             backgroundColor: "white",
//             minHeight: "40px",
//             "&:hover": { borderColor: "#fb923c" },
//         }),
//         option: (provided, state) => ({
//             ...provided,
//             color: state.isSelected ? "white" : "#fb923c",
//             backgroundColor: state.isSelected ? "#fb923c" : "white",
//             "&:hover": { backgroundColor: "#fed7aa" },
//         }),
//         menu: (provided) => ({
//             ...provided,
//             zIndex: 9999,
//         }),
//     };

//     const propertyOptions = propertyDetails?.data?.map((ele) => ({
//         value: ele["Property Code"],
//         label: ele["Property Code"],
//     })) || [];

//     const isActiveOptions = [
//         { value: 'Yes', label: 'Yes' },
//         { value: 'No', label: 'No' },
//     ];

//     // const isActiveOptions = [
//     //     { value: 'Yes', label: 'Yes' },
//     //     { value: 'No', label: 'No' },
//     // ];

//     const { mutate: updateClientCreation, isPending: isUpdatingClientCreation } = useUpdateClientCreation();

//     const onSubmit = (data) => {
//         // console.log("Submitted Data:", data);
//         const updatedData = {
//             ...data,
//             Role: "client",
//             Password: filterClientData?.Password ? filterClientData?.Password : "",
//             // mode: mode,
//             DOJ: data.DOJ ? new Date(data.DOJ).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "",
//             ActualDOJ: data.ActualDOJ ? new Date(data.ActualDOJ).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "",
//             RentDate: data.RentDate,
//             NoticeSD: data.NoticeSD ? new Date(data.NoticeSD).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "",
//             NoticeLD: data.NoticeLD ? new Date(data.NoticeLD).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "",
//             ActualVD: data.ActualVD ? new Date(data.ActualVD).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "",
//             IsActive: data.IsActive || "Yes",
//             CreatedByID: filterClientData?.CreatedByID ? filterClientData?.CreatedByID : decryptedUser?.employee?.EmployeeID,
//             CreatedDate: filterClientData?.CreatedDate ? filterClientData?.CreatedDate : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
//             // CreatedByName: decryptedUser?.name,
//             ...(mode !== "Create New Client"
//                 ? {
//                     UpdatedByID: decryptedUser?.employee?.EmployeeID,
//                     UpdatedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
//                 }
//                 : {}),
//             LoginID: data.EmailID,
//             // Current date in YYYY-MM-DD format
//         }

//         updateClientCreation(updatedData, {
//             onSuccess: () => {
//                 if (mode !== "Update Client") {
//                     toast.dismiss()
//                     toast.success("New Client Created successfully")
//                 } else {
//                     toast.dismiss()
//                     toast.success("Client Updated successfully")
//                 }
//             }
//         });

//     };

//     const inputClass = 'w-full px-3 py-2 mt-1 border border-orange-500 rounded-md shadow focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400';

//     return (

//         <div className='min-h-screen w-screen bg-[#E5E7EB] px-10 flex flex-col py-36'>
//             {/* <h3 className="text-xl font-semibold mb-4 pb-2 bg-orange-300 text-black p-2 rounded-sm">Client Details</h3> */}

//             <div className=" flex gap-4 rounded-t-xl  border-b-2 bg-white pt-5 pl-5">
//                 {["Create New Client", "Update Client"].map((ele, index) => (
//                     <button
//                         key={index}
//                         onClick={() => setMode(ele)}

//                         className={`px-4 text-[20px] md:text-[20px] py-2 ${mode === ele ? 'bg-orange-300 text-black rounded-t-lg' : ''
//                             }`}
//                     >
//                         {ele}
//                     </button>
//                 ))}
//             </div>
//             <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-sm  py-5 rounded-b-lg px-10 max-w-8xl w-full">
//                 {/* <h3 className="text-xl font-semibold mb-4 pb-2 bg-orange-300 text-black p-2 rounded-sm">Client Details</h3> */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-5">
//                     {/* Property Code */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">Property Code <span className="text-red-500">*</span></label>
//                         <Controller
//                             name="PropertyCode"
//                             control={control}
//                             defaultValue=""
//                             render={({ field }) => (
//                                 <MemoizedSelect
//                                     field={field}
//                                     options={propertyOptions}
//                                     placeholder="Search & Select"
//                                     styles={employeeSelectStyles}
//                                     onChange={field.onChange}
//                                 />
//                             )}
//                         />
//                         {errors.PropertyCode && <p className="text-red-500 text-sm">{errors.PropertyCode.message}</p>}
//                     </div>

//                     {/* Client ID */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">Client ID <span className="text-red-500">*</span></label>
//                         <Controller
//                             name="ClientID"
//                             control={control}
//                             defaultValue=""
//                             render={({ field }) => {
//                                 const selectedPropertyCode = watch("PropertyCode");

//                                 const clientOptions = clientDetails?.data
//                                     ?.filter(ele => ele?.PropertyCode === selectedPropertyCode)
//                                     ?.map(ele => ({ value: ele.ClientID, label: ele.ClientID })) || []
//                                 return (
//                                     <MemoizedSelect
//                                         field={field}
//                                         options={clientOptions[0]?.value ? clientOptions : []}
//                                         placeholder="Search & Select"
//                                         styles={employeeSelectStyles}
//                                         onChange={field.onChange}
//                                     />
//                                 );
//                             }}
//                         />
//                         {errors.ClientID && <p className="text-red-500 text-sm">{errors.ClientID.message}</p>}
//                     </div>

//                     {/* Active */}
//                     {mode === "Update Client" && (
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700">Active <span className="text-red-500">*</span></label>
//                             <Controller
//                                 name="IsActive"
//                                 control={control}
//                                 defaultValue=""
//                                 render={({ field }) => (
//                                     <MemoizedSelect
//                                         field={field}
//                                         options={isActiveOptions}
//                                         placeholder="Select Status"
//                                         styles={employeeSelectStyles}
//                                         onChange={field.onChange}
//                                     />
//                                 )}
//                             />
//                             {errors.IsActive && <p className="text-red-500 text-sm">{errors.IsActive.message}</p>}
//                         </div>
//                     )}


//                     {/* Temporary Property Code */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">Temporary Property Code</label>
//                         <Controller
//                             name="TemporaryPropCode"
//                             control={control}
//                             defaultValue=""
//                             render={({ field }) => (
//                                 <MemoizedSelect
//                                     field={field}
//                                     options={propertyOptions}
//                                     placeholder="Search & Select"
//                                     styles={employeeSelectStyles}
//                                     onChange={field.onChange}
//                                 />
//                             )}
//                         />
//                         {/* {errors.TemporaryPropertyCode && <p className="text-red-500 text-sm">{errors.TemporaryPropertyCode.message}</p>} */}
//                     </div>

//                     {/* Text Inputs */}
//                     {[
//                         { name: 'RentDate', label: 'Rent Date', type: "Number" },
//                         { name: 'RentDateComments', label: 'Rent Date Comments' },
//                         { name: 'Name', label: 'Full Name' },
//                         { name: 'WhatsAppNo', label: 'WhatsApp No', type: "number" },
//                         { name: 'CallingNo', label: 'Calling No', type: "number" },
//                         { name: 'EmailID', label: 'Email ID', type: "email" },
//                         { name: 'DOJ', label: 'DOJ', type: "date" },
//                         { name: 'ActualDOJ', label: 'Actual DOJ', type: "date" },
//                         { name: 'EmgyCont1FullName', label: 'Emergency Cont1 Full Name' },
//                         { name: 'EmgyCont1No', label: 'Emergency Cont1 No' },
//                         { name: 'EmgyCont2FullName', label: 'Emergency Cont2 Full Name' },
//                         { name: 'EmgyCont2No', label: 'Emergency Cont2 No' },
//                         { name: 'BloodGroup', label: 'Blood Group' },
//                         { name: 'Occupation', label: 'Occupation' },
//                         { name: 'Organization', label: 'Organization' },
//                         { name: 'NoticeSD', label: 'Notice Start Date', type: "date" },
//                         { name: 'NoticeLD', label: 'Notice Last Date', type: "date" },
//                         { name: 'ActualVD', label: 'Actual Vacate Date', type: "date" },
//                         { name: 'ParkingCharges', label: 'Parking Charges' },
//                     ].map((field) => (
//                         <div key={field.name}>
//                             <label className="block text-sm font-medium text-gray-700">
//                                 {field.label} {["RentDateComments", "ActualDOJ", "EmgyCont2FullName", "EmgyCont2No", "BloodGroup", "NoticeSD", 'NoticeLD', 'ActualVD', "Occupation", "Organization"].includes(field.name) ? "" : <span className="text-red-500">*</span>}
//                             </label>
//                             <input
//                                 type={field.type || 'text'}
//                                 {...register(field.name)}
//                                 placeholder={`Enter ${field.label}`}
//                                 className={inputClass}
//                             />
//                             {errors[field.name] && <p className="text-red-500 text-sm mt-1">{errors[field.name]?.message}</p>}
//                         </div>
//                     ))}

//                     {/* <div>
//                         <label className="block text-sm font-medium text-gray-700">2 Wheeler</label>
//                         <Controller
//                             name="2Wheeler"
//                             control={control}
//                             defaultValue=""
//                             render={({ field }) => (
//                                 <MemoizedSelect
//                                     field={field}
//                                     options={VehicleOptions}
//                                     placeholder="Select Status"
//                                     styles={employeeSelectStyles}
//                                     onChange={field.onChange}
//                                 />
//                             )}
//                         />
//                         {errors.IsActive && <p className="text-red-500 text-sm">{errors.IsActive.message}</p>}
//                     </div>  */}

//                     {/* <div>
//                         <label className="block text-sm font-medium text-gray-700">4 Wheeler</label>
//                         <Controller
//                             name="3Wheeler"
//                             control={control}
//                             defaultValue=""
//                             render={({ field }) => (
//                                 <MemoizedSelect
//                                     field={field}
//                                     options={VehicleOptions}
//                                     placeholder="Select & Status"
//                                     styles={employeeSelectStyles}
//                                     onChange={field.onChange}
//                                 />
//                             )}
//                         />
//                         {errors.IsActive && <p className="text-red-500 text-sm">{errors.IsActive.message}</p>}
//                     </div> */}
//                     {/* Description */}
//                     <div className="col-span-1 ">
//                         <label className="block text-sm font-medium text-gray-700">Comments </label>
//                         <textarea
//                             {...register("Comments")}
//                             rows={4}
//                             placeholder="Enter Your Comments here"
//                             className="w-full h-[50px] border border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300 rounded-md px-3 py-2"
//                         />
//                         {/* {errors.Comments && (
//                             <p className="text-red-500 text-sm">{errors.Comments.message}</p>
//                         )} */}
//                     </div>
//                 </div>

//                 {/* Submit Button */}
//                 <div className="mt-6 text-center ">
//                     <button
//                         type="submit"
//                         className="px-6 py-2 bg-orange-300 hover:bg-orange-400 text-black font-semibold rounded"
//                     >
//                         {isUpdatingClientCreation ? <span><LoaderPage /> Submit...</span> : "Submit"}
//                     </button>
//                 </div>
//             </form>

//         </div>





//     );
// };

// export default CreateClient;

























































import { yupResolver } from '@hookform/resolvers/yup';
import React, { memo, useEffect, useState, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Select from "react-select";
import { useClientDetails, usePropertyData, useUpdateClientCreation, useUploadClientDocs } from './services';
import * as yup from "yup";
import { toast } from 'react-toastify';
import LoaderPage from '../NewBooking/LoaderPage';
import { useApp } from '../TicketSystem/AppProvider';



// import React, { useState, useRef, useEffect } from 'react';
// import { useClientDetails, useUploadClientDocs } from '../ClientCreation/services';
// import { useApp } from '../../components_office_use_only/TicketSystem/AppProvider';
// import { toast } from 'react-toastify';
// import LoaderPage from '../../NewBooking/LoaderPage';

const MAX_FILES = 1;


// ✅ Yup validation schema (example, modify based on real rules)


const CreateClient = ({ selectUpdateClient, setSelectUpdateClient, setActiveTab }) => {


    const [filePreview, setFilePreview] = useState(null);
    const [imageBlob, setImageBlob] = useState(null);
    const { data: clientDetails } = useClientDetails();
    const { data: propertyDetails } = usePropertyData();


    // console.log(1111111111, decryptedUser)

    const schema = yup.object().shape({
        PropertyCode: yup.string().required("Property Code is required"),
        ClientID: yup.string().required("Client ID is required"),
        // TemporaryPropertyCode: yup.string().required("Temporary Property Code is required"),
        Name: yup.string().required("Full name is required"),
        RentDate: yup.string().required("Rent Date is required"),
        WhatsAppNo: yup.string().required("WhatsApp No is required"),
        CallingNo: yup.string().required("Calling No is required"),
        EmailID: yup.string().required("Email ID is required"),
        DOJ: yup.string().required("DOJ is required"),
        EmgyCont1FullName: yup.string().required("Emgy Cont1 FullName is required"),
        EmgyCont1No: yup.string().required("Emgy Cont1 No is required"),
        // Occupation: yup.string().required("Occupation is required"),
        // Organization: yup.string().required("Organization is required"),
        ParkingCharges: yup.string().required("Parking Charges is required"),
        Attachment: yup
            .mixed()
            .when("PossessionChecklist", {
                is: (val) => val === "Yes",
                then: (schema) =>
                    schema.test(
                        "fileRequired",
                        "Attachment is required when Possession Checklist is Yes",
                        function () {
                            return imageBlob ? true : false;   // 👈 your state variable
                        }
                    ),
                otherwise: (schema) => schema.notRequired(),
            }),
    });
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const filterClientData = clientDetails && clientDetails?.data?.find((ele) => ele.ClientID === watch("ClientID"))
    console.log("filterClientData", filterClientData)
    // useEffect(() => {

    //     if (mode !== "Create New Client") {
    //         setValue("Name", filterClientData?.Name)
    //         setValue("IsActive", filterClientData?.IsActive)
    //         setValue("RentDate", filterClientData?.RentDate)
    //         setValue("RentDateComments", filterClientData?.RentDateComments)
    //         setValue("WhatsAppNo", filterClientData?.WhatsAppNo)
    //         setValue("CallingNo", filterClientData?.CallingNo)
    //         setValue("EmailID", filterClientData?.EmailID)
    //         setValue("DOJ", filterClientData?.DOJ ? new Date(filterClientData.DOJ).toLocaleDateString('en-CA')
    //             : "")
    //         setValue("TemporaryPropCode", filterClientData?.TemporaryPropCode)
    //         setValue("ActualDOJ", filterClientData?.ActualDOJ ? new Date(filterClientData.DOJ).toLocaleDateString('en-CA') : "")
    //         setValue("EmgyCont1FullName", filterClientData?.EmgyCont1FullName)
    //         setValue("EmgyCont1No", filterClientData?.EmgyCont1No)
    //         setValue("EmgyCont2FullName", filterClientData?.EmgyCont2FullName)
    //         setValue("EmgyCont2No", filterClientData?.EmgyCont2No)
    //         setValue("BloodGroup", filterClientData?.BloodGroup)
    //         setValue("Occupation", filterClientData?.Occupation)
    //         setValue("Organization", filterClientData?.Organization)
    //         setValue("NoticeSD", filterClientData?.NoticeSD ? new Date(filterClientData?.NoticeSD).toLocaleDateString('en-CA') : "")
    //         setValue("NoticeLD", filterClientData?.NoticeLD ? new Date(filterClientData?.NoticeLD).toLocaleDateString('en-CA') : "")
    //         setValue("ActualVD", filterClientData?.ActualVD ? new Date(filterClientData.ActualVD).toLocaleDateString('en-CA') : "")
    //         setValue("ParkingCharges", filterClientData?.ParkingCharges)
    //         setValue("Comments", filterClientData?.Comments)
    //     }
    // }, [filterClientData])

    // useEffect(() => {
    //     reset()
    // }, [mode])


    useEffect(() => {
        if (selectUpdateClient) {

            setValue("PropertyCode", selectUpdateClient?.PropertyCode || "");
            setValue("ClientID", selectUpdateClient?.ClientID || "");
            setValue("Name", selectUpdateClient?.Name || "");
            setValue("IsActive", selectUpdateClient?.IsActive || "");
            setValue("RentDate", selectUpdateClient?.RentDate || "");
            setValue("RentDateComments", selectUpdateClient?.RentDateComments || "");
            setValue("WhatsAppNo", selectUpdateClient?.WhatsAppNo || "");
            setValue("CallingNo", selectUpdateClient?.CallingNo || "");
            setValue("EmailID", selectUpdateClient?.EmailID || "");

            setValue("DOJ",
                selectUpdateClient?.DOJ
                    ? new Date(selectUpdateClient.DOJ).toLocaleDateString('en-CA')
                    : ""
            );

            setValue("ActualDOJ",
                selectUpdateClient?.ActualDOJ
                    ? new Date(selectUpdateClient.ActualDOJ).toLocaleDateString('en-CA')
                    : ""
            );

            setValue("TemporaryPropCode", selectUpdateClient?.TemporaryPropCode || "");
            setValue("EmgyCont1FullName", selectUpdateClient?.EmgyCont1FullName || "");
            setValue("EmgyCont1No", selectUpdateClient?.EmgyCont1No || "");
            setValue("EmgyCont2FullName", selectUpdateClient?.EmgyCont2FullName || "");
            setValue("EmgyCont2No", selectUpdateClient?.EmgyCont2No || "");
            setValue("BloodGroup", selectUpdateClient?.BloodGroup || "");
            setValue("Occupation", selectUpdateClient?.Occupation || "");
            setValue("Organization", selectUpdateClient?.Organization || "");

            setValue("NoticeSD",
                selectUpdateClient?.NoticeSD
                    ? new Date(selectUpdateClient.NoticeSD).toLocaleDateString('en-CA')
                    : ""
            );

            setValue("NoticeLD",
                selectUpdateClient?.NoticeLD
                    ? new Date(selectUpdateClient.NoticeLD).toLocaleDateString('en-CA')
                    : ""
            );

            setValue("ActualVD",
                selectUpdateClient?.ActualVD
                    ? new Date(selectUpdateClient.ActualVD).toLocaleDateString('en-CA')
                    : ""
            );

            setValue("ParkingCharges", selectUpdateClient?.ParkingCharges || "");
            setValue("Comments", selectUpdateClient?.Comments || "");
            setValue("WorkLogs", selectUpdateClient?.WorkLogs || "");
        }
    }, [selectUpdateClient]);


    useEffect(() => {
        if (selectUpdateClient) {

            // existing code...

            if (selectUpdateClient?.Attachment) {
                setFilePreview(selectUpdateClient.Attachment);  // 👈 show preview
                setImageBlob(null); // because this is not a new file
            }

        }
    }, [selectUpdateClient]);

    const MemoizedSelect = memo(({ field, options, placeholder, isDisabled, onChange, styles }) => (
        <Select
            {...field}
            value={options?.find((opt) => opt.value === field.value)}
            isDisabled={isDisabled}
            options={options}
            placeholder={placeholder}
            styles={styles}
            onChange={(selectedOption) => onChange(selectedOption ? selectedOption.value : "")}
            isClearable
            isSearchable
            menuShouldScrollIntoView={false}
        />
    ));

    const employeeSelectStyles = {
        control: (base, state) => ({
            ...base,
            padding: "0.25rem 0.5rem",
            marginTop: "0.30rem",
            borderWidth: "1px",
            borderColor: state.isFocused ? "#fb923c" : "#f97316",
            borderRadius: "0.375rem",
            boxShadow: state.isFocused ? "0 0 0 2px rgba(251,146,60,0.5)" : "0 1px 2px rgba(0,0,0,0.05)",
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

    const propertyOptions = propertyDetails?.data?.map((ele) => ({
        value: ele["Property Code"],
        label: ele["Property Code"],
    })) || [];

    const isActiveOptions = [
        { value: 'Yes', label: 'Yes' },
        { value: 'No', label: 'No' },
    ];
    const ClientType = [
        { value: 'Student', label: 'Student' },
        { value: 'Employee', label: 'Employee' },
    ];

    // const isActiveOptions = [
    //     { value: 'Yes', label: 'Yes' },
    //     { value: 'No', label: 'No' },
    // ];

    const { mutate: updateClientCreation, isPending: isUpdatingClientCreation } = useUpdateClientCreation();

    // const onSubmit = (data) => {
    //     // console.log("Submitted Data:", data);
    //     const updatedData = {
    //         ...data,
    //         Role: "client",
    //         Password: filterClientData?.Password ? filterClientData?.Password : "",
    //         // mode: mode,
    //         KYCDocuments: filterClientData?.KYCDocuments,
    //         PGLegalDocuments: filterClientData?.PGLegalDocuments,
    //         DigitalSelfDeclearationAccepted: filterClientData?.DigitalSelfDeclearationAccepted,
    //         DigitalSignedDetails: filterClientData?.DigitalSignedDetails,
    //         DOJ: data.DOJ ? new Date(data.DOJ).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "",
    //         ActualDOJ: data.ActualDOJ ? new Date(data.ActualDOJ).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "",
    //         RentDate: data.RentDate,
    //         NoticeSD: data.NoticeSD ? new Date(data.NoticeSD).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "",
    //         NoticeLD: data.NoticeLD ? new Date(data.NoticeLD).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "",
    //         ActualVD: data.ActualVD ? new Date(data.ActualVD).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "",
    //         IsActive: data.IsActive || "Yes",
    //         CreatedByID: filterClientData?.CreatedByID ? filterClientData?.CreatedByID : decryptedUser?.employee?.EmployeeID,
    //         CreatedDate: filterClientData?.CreatedDate ? filterClientData?.CreatedDate : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    //         // CreatedByName: decryptedUser?.name,
    //         ...(mode !== "Create New Client"
    //             ? {
    //                 UpdatedByID: decryptedUser?.employee?.EmployeeID,
    //                 UpdatedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    //             }
    //             : {}),
    //         LoginID: data.EmailID,
    //         // Current date in YYYY-MM-DD format
    //     }

    //     updateClientCreation(updatedData, {
    //         onSuccess: () => {
    //             if (mode !== "Update Client") {
    //                 toast.dismiss()
    //                 toast.success("New Client Created successfully")
    //             } else {
    //                 toast.dismiss()
    //                 toast.success("Client Updated successfully")
    //             }
    //         }
    //     });

    // };

    const formatDateTime = () => {
        const now = new Date();
        return now.toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    const normalize = (val) =>
        (val ?? "N/A").toString().trim() || "N/A";


    const generateWorklog = (oldData, newData, userName, empId) => {
        let changes = [];

        Object.keys(newData).forEach((key) => {
            const oldValue = normalize(oldData?.[key]);
            const newValue = normalize(newData?.[key]);

            if (oldValue !== newValue) {
                changes.push(
                    `${key} changed from ${oldValue} to ${newValue}`
                );
            }
        });

        if (changes.length === 0) return oldData?.WorkLog || "";

        const logHeader = `[${formatDateTime()} - (${empId}) ${userName}]`;

        return `${logHeader}\n${changes.join("\n")}\n\n${oldData?.WorkLog || ""
            }`;
    };



    const onSubmit = (data) => {

        const updatedData = {
            ...data,
            Role: "client",

            DOJ: data.DOJ
                ? new Date(data.DOJ).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                : "",

            ActualDOJ: data.ActualDOJ
                ? new Date(data.ActualDOJ).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                : "",

            NoticeSD: data.NoticeSD
                ? new Date(data.NoticeSD).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                : "",

            NoticeLD: data.NoticeLD
                ? new Date(data.NoticeLD).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                : "",

            ActualVD: data.ActualVD
                ? new Date(data.ActualVD).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                : "",

            UpdatedByID: decryptedUser?.employee?.EmployeeID,
            UpdatedDate: new Date().toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            }),

            LoginID: data.EmailID,
        };

        updatedData.WorkLogs = generateWorklog(
            selectUpdateClient || {},
            updatedData,
            decryptedUser?.employee?.Name,
            decryptedUser?.employee?.EmployeeID
        );

        const formData = new FormData();
        // Add all fields
        Object.keys(updatedData).forEach((key) => {
            formData.append(key, updatedData[key]);
        });
        formData.append("Attachment", imageBlob)

        updateClientCreation(formData, {
            onSuccess: () => {
                toast.dismiss();
                toast.success("Client Updated successfully");
            }
        });
    };
    const inputClass = 'w-full px-3 py-2 mt-1 border border-orange-500 rounded-md shadow focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400';





    ////////// documents related code 

















    const { decryptedUser } = useApp();
    const [pendingDocType, setPendingDocType] = useState(null);
    const [uploadedDocs, setUploadedDocs] = useState({
        AddharCard: [],
        PanCard: [],
        Photo: [],
        CollageID: [],
        CompanyID: [],
        ClientAgreement: [],
        ClientPoliceNoc: []
    });

    const [existingDocs, setExistingDocs] = useState({
        AddharCard: [],
        PanCard: [],
        Photo: [],
        CollageID: [],
        CompanyID: [],
        ClientAgreement: [],
        ClientPoliceNoc: []
    });



    //   const [savedDocs, setSavedDocs] = useState({
    //     AddharCard: false,
    //     PanCard: false,
    //     Photo: false,
    //     CollageID: false,
    //     CompanyID: false,
    //     agreement: false,
    //     ClientPoliceNoc: false,
    // });
    // const fileInputRefs = {
    //     kyc: useRef(),
    //     agreement: useRef(),
    // };
    const fileInputRefs = useRef({});

    const { mutate: uploadClientDocs, isPending } = useUploadClientDocs();
    const { data: clientDetailsForDocuments, isLoading: isDocument } = useClientDetails();
    // 🔁 Load existing documents on component mount
    // useEffect(() => {
    //     if (clientDetailsForDocuments?.data) {
    //         const filtered = clientDetailsForDocuments.data.find(
    //             (ele) => ele.ClientID === decryptedUser?.employee?.Name
    //         );

    //         if (filterClientData) {
    //             setExistingDocs({
    //                 kyc: filterClientData.KYCDocuments?.split(',')?.filter(Boolean) || [],
    //                 agreement: filterClientData.PGLegalDocuments?.split(',')?.filter(Boolean) || [],
    //             });
    //         }
    //     }
    // }, [filterClientData, decryptedUser?.employee?.Name]);

    useEffect(() => {
        if (!clientDetailsForDocuments?.data) return;

        const clientData = selectUpdateClient || filterClientData;
        if (!clientData?.ClientID) return;

        const filtered = clientDetailsForDocuments.data.find(
            (ele) => ele.ClientID === clientData.ClientID
        );

        if (!filtered) return;

        setExistingDocs({
            AddharCard: filtered?.AddharCard?.split(',').filter(Boolean) || [],
            Photo: filtered?.Photo?.split(',').filter(Boolean) || [],
            CompanyID: filtered?.CompanyID?.split(',').filter(Boolean) || [],
            CollageID: filtered?.CollageID?.split(',').filter(Boolean) || [],
            ClientAgreement: filtered?.ClientAgreement?.split(',').filter(Boolean) || [],
            ClientPoliceNoc: filtered?.ClientPoliceNoc?.split(',').filter(Boolean) || [],
            PanCard: filtered?.PanCard?.split(',').filter(Boolean) || [],
        });

    }, [clientDetailsForDocuments, selectUpdateClient, filterClientData]);

    const handleCancel = () => {
        setActiveTab("MasterTable")
        setSelectUpdateClient(null)
        reset();
    }


    // const handleFileChange = (type, event) => {

    //     const newFiles = Array.from(event.target.files);
    //     if (!newFiles.length) return;

    //     setUploadedDocs((prev) => {
    //         const currentFiles = prev[type] || [];
    //         const existingCount = existingDocs[type]?.length || 0;

    //         const totalFiles = currentFiles.length + newFiles.length + existingCount;
    //         if (totalFiles > MAX_FILES) {
    //             toast.dismiss();
    //             toast.error(`You can upload a maximum of ${MAX_FILES} files for ${type.toUpperCase()}.`);
    //             return prev;
    //         }

    //         // Rename files to ensure uniqueness
    //         const uniqueNewFiles = newFiles.map(file => {
    //             const timestamp = Date.now();
    //             const uniqueSuffix = `${timestamp}-${Math.floor(Math.random() * 10000)}`;
    //             const fileExtension = file.name.split('.').pop();
    //             const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    //             const newFileName = `${uniqueSuffix}_${baseName}.${fileExtension}`;
    //             return new File([file], newFileName, { type: file.type });
    //         });
    //         return {
    //             ...prev,
    //             [type]: [...currentFiles, ...uniqueNewFiles],
    //         };
    //     });

    //     // Reset the input so selecting the same file again will trigger onChange
    //     event.target.value = '';
    // };
    const handleFileChange = (type, event) => {

        const newFiles = Array.from(event.target.files);
        if (!newFiles.length) return;

        setUploadedDocs((prev) => {

            const currentFiles = prev[type] || [];
            const existingCount = existingDocs[type]?.length || 0;

            // 🔥 Dynamic limit
            const limit = type === "ClientAgreement" ? 5 : 2;

            const totalFiles =
                currentFiles.length +
                newFiles.length +
                existingCount;

            if (totalFiles > limit) {
                toast.dismiss();
                toast.error(
                    `You can upload a maximum of ${limit} file(s) for ${type.toUpperCase()}.`
                );
                return prev;
            }

            // 🔥 For single file types → replace old file
            if (limit === 1) {

                const file = newFiles[0];
                const timestamp = Date.now();
                const uniqueSuffix = `${timestamp}-${Math.floor(Math.random() * 10000)}`;
                const extension = file.name.split('.').pop();
                const baseName =
                    file.name.substring(0, file.name.lastIndexOf('.')) || file.name;

                const newFileName = `${uniqueSuffix}_${baseName}.${extension}`;
                const renamedFile = new File([file], newFileName, { type: file.type });

                return {
                    ...prev,
                    [type]: [renamedFile], // 👈 replace
                };
            }

            // 🔥 Agreement (multiple files allowed)
            const uniqueNewFiles = newFiles.map((file) => {
                const timestamp = Date.now();
                const uniqueSuffix = `${timestamp}-${Math.floor(Math.random() * 10000)}`;
                const extension = file.name.split('.').pop();
                const baseName =
                    file.name.substring(0, file.name.lastIndexOf('.')) || file.name;

                const newFileName = `${uniqueSuffix}_${baseName}.${extension}`;
                return new File([file], newFileName, { type: file.type });
            });

            return {
                ...prev,
                [type]: [...currentFiles, ...uniqueNewFiles],
            };
        });

        // Reset input
        event.target.value = '';
    };

    // const handleUploadClick = (type) => {
    //     fileInputRefs[type].current.click();
    // };

    const handleUploadClick = (type) => {
        if (fileInputRefs.current[type]) {
            fileInputRefs.current[type].click();
        }
    };

    // const handleSave = (type) => {

    //     if (!watch("ClientID")) {
    //         return toast.error("please Select Client Id First ")
    //     }


    //     if (!uploadedDocs[type] || uploadedDocs[type].length === 0) {
    //         toast.warning("Please upload at least one document before saving.");
    //         return;
    //     }

    //     setPendingDocType(type); // Mark this doc type as pending

    //     const formData = new FormData();

    //     uploadedDocs[type].forEach((file) => {
    //         formData.append('files', file);
    //     });

    //     formData.append('ID', filterClientData.ClientID);
    //     formData.append('propertyCode', filterClientData.PropertyCode);
    //     formData.append('name', filterClientData.Name);
    //     formData.append(
    //         'updateField',
    //         type === 'kyc' ? 'KYCDocuments' : 'PGLegalDocuments'
    //     );

    //     formData.append(
    //         'DocumentUploadedStatus',
    //         JSON.stringify({
    //             kyc: type === 'kyc',
    //             agreement: type === 'agreement',
    //         })
    //     );

    //     // ✅ Trigger mutation with success and error handlers
    //     uploadClientDocs(formData, {
    //         onSuccess: () => {
    //             toast.success(`${type.toUpperCase()} documents uploaded successfully.`);

    //             setUploadedDocs((prev) => ({
    //                 ...prev,
    //                 [type]: [],
    //             }));

    //             setSavedDocs((prev) => ({
    //                 ...prev,
    //                 [type]: true,
    //             }));
    //             setPendingDocType(null); // Clear pending status
    //         },
    //         onError: (error) => {
    //             console.error('Upload failed:', error);
    //             const errorMessage = error?.response?.data?.message || error.message || 'Upload failed.';
    //             toast.error(`Failed to upload ${type.toUpperCase()} documents: ${errorMessage}`);
    //         },
    //     });
    // };


    // const handleSave = (type) => {

    //     const clientData = selectUpdateClient || filterClientData;

    //     if (!clientData?.ClientID) {
    //         return toast.error("Please Select Client Id First");
    //     }

    //     if (!uploadedDocs[type] || uploadedDocs[type].length === 0) {
    //         toast.warning("Please upload at least one document before saving.");
    //         return;
    //     }

    //     setPendingDocType(type);

    //     const formData = new FormData();

    //     uploadedDocs[type].forEach((file) => {
    //         formData.append("files", file);
    //     });

    //     formData.append("ID", clientData.ClientID);
    //     formData.append("propertyCode", clientData.PropertyCode);
    //     formData.append("name", clientData.Name);
    //     formData.append("updateField", type);

    //     uploadClientDocs(formData, {
    //         onSuccess: () => {

    //             toast.success(`${type.toUpperCase()} uploaded successfully`);

    //             setUploadedDocs((prev) => ({
    //                 ...prev,
    //                 [type]: [],
    //             }));

    //             setPendingDocType(null);
    //         },
    //         onError: (error) => {
    //             toast.error("Upload failed");
    //             setPendingDocType(null);
    //         }
    //     });
    // };



    const handleSaveAllDocuments = () => {

        const clientData = selectUpdateClient || filterClientData;

        const formData = new FormData();
        let hasFiles = false;

        Object.keys(uploadedDocs).forEach((type) => {

            const files = uploadedDocs[type]; 

            if (files.length > 0) {
                hasFiles = true;

                files.forEach((file) => {
                    formData.append("files", file);   // 👈 multer expects this
                    formData.append("updateField", type);    // 👈 send document type
                });
            }

        });

        if (!hasFiles) {
            toast.warning("Please upload at least one document");
            return;
        }

        formData.append("ID", clientData.ClientID);
        formData.append("propertyCode", clientData.PropertyCode);
        formData.append("name", clientData.Name);

        uploadClientDocs(formData, {
            onSuccess: () => {
                toast.success("All documents uploaded successfully");

                setUploadedDocs({
                    AddharCard: [],
                    PanCard: [],
                    Photo: [],
                    CollageID: [],
                    CompanyID: [],
                    ClientAgreement: [],
                    ClientPoliceNoc: [],
                });
            },
            onError: () => {
                toast.error("Upload failed");
            }
        });

    };

    const handleRemoveFile = (type, index) => {
        setUploadedDocs((prev) => ({
            ...prev,
            [type]: prev[type].filter((_, i) => i !== index),
        }));
    };

    // const documentsList = [
    //     {
    //         type: 'kyc',
    //         label: 'KYC Documents',
    //         desc: 'Upload Aadhaar, PAN, Photo (max 5)',
    //         icon: 'fa-id-card',
    //     },
    //     {
    //         type: 'agreement',
    //         label: 'Rental Agreement',
    //         desc: 'Digitally signed document (max 5)',
    //         icon: 'fa-file-signature',
    //     },
    // ];

    const documentsList = [
        {
            type: 'AddharCard',
            label: 'Aadhaar Card',
            // desc: 'Upload Aadhaar Card (1 file)',
            icon: 'fa-id-card',
        },
        {
            type: 'Photo',
            label: 'Photo',
            // desc: 'Upload Client Photo (1 file)',
            icon: 'fa-image',
        },
        {
            type: 'CompanyID',
            label: 'Company ID',
            desc: 'Professionals PG Client',
            icon: 'fa-building',
        },
        {
            type: 'CollageID',
            label: 'College ID',
            desc: 'Student PG Client',
            icon: 'fa-id-badge',
        },
        {
            type: 'ClientAgreement',
            label: 'Rental Agreement',
            // desc: 'Digitally signed document (max 5)',
            icon: 'fa-file-signature',
        },
        {
            type: 'ClientPoliceNoc',
            label: 'Police NOC',
            // desc: 'Digitally signed document (max 5)',
            icon: 'fa-file-signature',
        },
        {
            type: 'PanCard',
            label: 'PAN Card',
            // desc: 'Upload PAN Card (1 file)',
            icon: 'fa-id-card',
        },
    ];






























    return (

        <div className='min-h-screen w-screen bg-[#E5E7EB] px-10 flex flex-col '>
            {/* <h3 className="text-xl font-semibold mb-4 pb-2 bg-orange-300 text-black p-2 rounded-sm">Client Details</h3> */}

            {/* <div className=" flex gap-4 rounded-t-xl  border-b-2 bg-white pt-5 pl-5">
                {["Create New Client", "Update Client"].map((ele, index) => (
                    <button
                        key={index}
                        onClick={() => setMode(ele)}

                        className={`px-4 text-[20px] md:text-[20px] py-2 ${mode === ele ? 'bg-orange-300 text-black rounded-t-lg' : ''
                            }`}
                    >
                        {ele}
                    </button>
                ))}
            </div> */}
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-sm  py-5 rounded-b-lg px-10 max-w-8xl w-full">
                {/* <h3 className="text-xl font-semibold mb-4 pb-2 bg-orange-300 text-black p-2 rounded-sm">Client Details</h3> */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-5">
                    {/* Property Code */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Property Code <span className="text-red-500">*</span></label>
                        <Controller
                            name="PropertyCode"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <MemoizedSelect
                                    field={field}
                                    options={propertyOptions}
                                    placeholder="Search & Select"
                                    styles={employeeSelectStyles}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        {errors.PropertyCode && <p className="text-red-500 text-sm">{errors.PropertyCode.message}</p>}
                    </div>

                    {/* Client ID */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Client ID <span className="text-red-500">*</span></label>
                        <Controller
                            name="ClientID"
                            control={control}
                            defaultValue=""
                            render={({ field }) => {
                                const selectedPropertyCode = watch("PropertyCode");

                                const clientOptions = clientDetails?.data
                                    ?.filter(ele => ele?.PropertyCode === selectedPropertyCode)
                                    ?.map(ele => ({ value: ele.ClientID, label: ele.ClientID })) || []
                                return (
                                    <MemoizedSelect
                                        field={field}
                                        options={clientOptions[0]?.value ? clientOptions : []}
                                        placeholder="Search & Select"
                                        styles={employeeSelectStyles}
                                        onChange={field.onChange}
                                    />
                                );
                            }}
                        />
                        {errors.ClientID && <p className="text-red-500 text-sm">{errors.ClientID.message}</p>}
                    </div>

                    {/* Active */}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Active <span className="text-red-500">*</span></label>
                        <Controller
                            name="IsActive"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <MemoizedSelect
                                    field={field}
                                    options={isActiveOptions}
                                    placeholder="Select Status"
                                    styles={employeeSelectStyles}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        {errors.IsActive && <p className="text-red-500 text-sm">{errors.IsActive.message}</p>}
                    </div>



                    {/* Temporary Property Code */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Temporary Property Code</label>
                        <Controller
                            name="TemporaryPropCode"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <MemoizedSelect
                                    field={field}
                                    options={propertyOptions}
                                    placeholder="Search & Select"
                                    styles={employeeSelectStyles}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        {/* {errors.TemporaryPropertyCode && <p className="text-red-500 text-sm">{errors.TemporaryPropertyCode.message}</p>} */}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Client Type <span className="text-red-500">*</span></label>
                        <Controller
                            name="ClientType"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <MemoizedSelect
                                    field={field}
                                    options={ClientType}
                                    placeholder="Search & Select"
                                    styles={employeeSelectStyles}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        {/* {errors.TemporaryPropertyCode && <p className="text-red-500 text-sm">{errors.TemporaryPropertyCode.message}</p>} */}
                    </div>

                    {/* Text Inputs */}
                    {[
                        { name: 'RentDate', label: 'Rent Date', type: "Number" },
                        { name: 'RentDateComments', label: 'Rent Date Comments' },
                        { name: 'Name', label: 'Full Name' },
                        { name: 'WhatsAppNo', label: 'WhatsApp No', type: "number" },
                        { name: 'CallingNo', label: 'Calling No', type: "number" },
                        { name: 'EmailID', label: 'Email ID', type: "email" },
                        { name: 'DOJ', label: 'DOJ', type: "date" },
                        { name: 'ActualDOJ', label: 'Actual DOJ', type: "date" },
                        { name: 'EmgyCont1FullName', label: 'Emergency Cont1 Full Name' },
                        { name: 'EmgyCont1No', label: 'Emergency Cont1 No' },
                        { name: 'EmgyCont2FullName', label: 'Emergency Cont2 Full Name' },
                        { name: 'EmgyCont2No', label: 'Emergency Cont2 No' },
                        { name: 'BloodGroup', label: 'Blood Group' },
                        { name: 'Occupation', label: 'Occupation' },
                        { name: 'Organization', label: 'Organization' },
                        { name: 'NoticeSD', label: 'Notice Start Date', type: "date" },
                        { name: 'NoticeLD', label: 'Notice Last Date', type: "date" },
                        { name: 'ActualVD', label: 'Actual Vacate Date', type: "date" },
                        { name: 'ParkingCharges', label: 'Parking Charges' },
                    ].map((field) => (
                        <div key={field.name}>
                            <label className="block text-sm font-medium text-gray-700">
                                {field.label} {["RentDateComments", "ActualDOJ", "EmgyCont2FullName", "EmgyCont2No", "BloodGroup", "NoticeSD", 'NoticeLD', 'ActualVD', "Occupation", "Organization"].includes(field.name) ? "" : <span className="text-red-500">*</span>}
                            </label>
                            <input
                                type={field.type || 'text'}
                                {...register(field.name)}
                                placeholder={`Enter ${field.label}`}
                                className={inputClass}
                            />
                            {errors[field.name] && <p className="text-red-500 text-sm mt-1">{errors[field.name]?.message}</p>}
                        </div>
                    ))}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Possession Checklist</label>
                        <Controller
                            name="PossessionChecklist"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <MemoizedSelect
                                    field={field}
                                    options={isActiveOptions}
                                    placeholder="Select Status"
                                    styles={employeeSelectStyles}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        {errors.IsActive && <p className="text-red-500 text-sm">{errors.IsActive.message}</p>}
                    </div>

                    {watch("PossessionChecklist")?.toLowerCase().trim() !== "no" &&
                        watch("PossessionChecklist")?.trim() !== "" && (
                            <div>
                                <label className="text-sm font-medium text-gray-700 relative after:ml-1 after:text-red-500">
                                    Attachment
                                </label>

                                <input
                                    type="file"
                                    accept="image/*"
                                    className="w-full h-11 px-3 py-[8px] border border-orange-400 rounded-md focus:ring-2 focus:ring-orange-300 focus:outline-none"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setImageBlob(file);
                                            setFilePreview(URL.createObjectURL(file));
                                        }
                                    }}
                                />

                                {errors.Attachment && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.Attachment.message}
                                    </p>
                                )}

                                {filePreview && (
                                    <div className="relative inline-block mt-2">
                                        <img
                                            src={filePreview}
                                            alt="Preview"
                                            className="h-20 w-20 object-cover rounded border"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFilePreview(null);
                                                setImageBlob(null);
                                            }}
                                            className="absolute top-1 right-1 text-red-600 text-xs bg-white rounded-full px-2 shadow z-10"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                    {/* <div>
                        <label className="block text-sm font-medium text-gray-700">2 Wheeler</label>
                        <Controller
                            name="2Wheeler"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <MemoizedSelect
                                    field={field}
                                    options={VehicleOptions}
                                    placeholder="Select Status"
                                    styles={employeeSelectStyles}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        {errors.IsActive && <p className="text-red-500 text-sm">{errors.IsActive.message}</p>}
                    </div>  */}

                    {/* <div>
                        <label className="block text-sm font-medium text-gray-700">4 Wheeler</label>
                        <Controller
                            name="3Wheeler"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <MemoizedSelect
                                    field={field}
                                    options={VehicleOptions}
                                    placeholder="Select & Status"
                                    styles={employeeSelectStyles}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        {errors.IsActive && <p className="text-red-500 text-sm">{errors.IsActive.message}</p>}
                    </div> */}
                    {/* Description */}
                    <div className="col-span-1 ">
                        <label className="block text-sm font-medium text-gray-700">Comments </label>
                        <textarea
                            {...register("Comments")}
                            rows={4}
                            placeholder="Enter Your Comments here"
                            className="w-full h-[50px] border border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300 rounded-md px-3 py-2"
                        />
                        {/* {errors.Comments && (
                            <p className="text-red-500 text-sm">{errors.Comments.message}</p>
                        )} */}
                    </div>
                    <div className='col-span-1 md:col-span-3 lg:col-span-3'>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Worklogs
                        </label>
                        <Controller
                            name="WorkLogs"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <div className="w-full h-[180px] border border-orange-500 rounded-md px-3 py-2 overflow-auto bg-gray-50 cursor-not-allowed">
                                    {field.value ? (
                                        field.value.split("\n").map((line, i) => {
                                            const isHeader = line.startsWith("[");
                                            const isEmpty = line.trim() === "";

                                            if (isEmpty) {
                                                return <div key={i} style={{ height: "12px" }} />;
                                            }

                                            return (
                                                <div
                                                    key={i}
                                                    style={{
                                                        fontWeight: isHeader ? "normal" : "600",
                                                        color: isHeader ? "#374151" : "#000",
                                                        fontSize: "16px",
                                                    }}
                                                >
                                                    {line}
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <span className="text-gray-400">No Worklogs</span>
                                    )}
                                </div>
                            )}
                        />
                    </div>
                </div>


                {/* Submit Button */}
                <div className='flex gap-4 justify-center '>
                    <div className="mt-6">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-orange-300 hover:bg-orange-400 text-black font-semibold rounded"
                        >
                            {isUpdatingClientCreation ? <span><LoaderPage /> Submit...</span> : "Submit"}
                        </button>
                    </div>
                    <div>
                        <button onClick={handleCancel} className="mt-5 border px-6 py-2 rounded-md text-[16px] cursor-pointer text-black">Cancel</button>
                    </div>
                </div>
            </form>



            <div className="max-w-full md:px-4 py-6">
                <div className="bg-white border border-orange-300 rounded-lg shadow-sm p-6">
                    <div className=' flex justify-between items-center'>
                        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                            <i className="fas fa-folder-open mr-2 text-orange-500"></i>
                            Document Upload & Preview
                        </h2>

                        <div className="flex justify-end mb-4  border  w-fit">
                            <button
                                onClick={handleSaveAllDocuments}
                                disabled={isPending}
                                className={`px-4 py-2 rounded flex items-center justify-center min-w-[180px] 
                                 ${isPending
                                        ? "bg-orange-500 cursor-not-allowed"
                                        : "bg-orange-500 hover:bg-orange-600"}
                                         text-white transition`}
                            >
                                {isPending ? (
                                    <>
                                        {/* Loader */}
                                        <LoaderPage className="mr-2" />
                                        Save All Documents
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-save mr-2"></i>
                                        Save All Documents
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* <button
                        onClick={() => handleSave(doc.type)}
                        disabled={uploaded.length === 0 || pendingDocType === doc.type}
                        className={`text-white px-2 py-1 text-sm rounded flex items-center ${uploaded.length > 0
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-gray-300 cursor-not-allowed'
                            }`}
                    >
                        {pendingDocType === doc.type ? (
                            <>
                                <LoaderPage className="mr-2" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-save mr-2"></i>
                                Save
                            </>
                        )}
                    </button> */}

                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                        {documentsList.map((doc) => {
                            const uploaded = uploadedDocs[doc.type] || [];
                            const existing = existingDocs[doc.type] || [];
                            // const isSaved = savedDocs[doc.type];
                            // const hasFiles = uploaded.length + existing.length > 0;

                            return (
                                <div
                                    key={doc.type}
                                    className="border-2 border-orange-200  rounded-lg p-4 "
                                >
                                    <div className="flex justify-between items-center ">

                                        <div className="flex items-center">

                                            <i className={`fas text-2xl mr-3 ${doc.icon} text-orange-500`} />
                                            <div>
                                                <h3 className="font-semibold text-sm md:text-lg">{doc.label}</h3>
                                                <p className="text-sm text-gray-500">{doc.desc}</p>
                                            </div>
                                        </div>

                                        <div className=" flex flex-col gap-2">
                                            <button
                                                onClick={() => handleUploadClick(doc.type)}
                                                className="bg-orange-600 text-white px-2 py-1 text-sm rounded hover:bg-orange-700"
                                            >
                                                <i className="fas fa-upload mr-1"></i> Upload
                                            </button>


                                        </div>
                                    </div>

                                    <div className="  grid gap-6 grid-cols-2 md:grid-cols-2" >

                                        {/*  Existing Files (from server) */}
                                        {isDocument ? (
                                            <LoaderPage />
                                        ) : (
                                            existing.map((url, index) => (
                                                <div
                                                    key={`existing-${index}`}
                                                    className="bg-white w-fit border border-gray-200 rounded px-3 py-2 flex flex-col items-center space-y-2"
                                                >
                                                    <a href={url} target="_blank" rel="noopener noreferrer">
                                                        {url.match(/\.(jpg|jpeg|png)$/i) ? (
                                                            <img
                                                                src={url}
                                                                alt={`Existing ${index}`}
                                                                className="w-20 h-20 object-cover rounded"
                                                            />
                                                        ) : url.match(/\.pdf$/i) ? (
                                                            <div className="flex flex-col items-center justify-center">
                                                                <i
                                                                    className="fas fa-file-pdf text-red-600 text-4xl cursor-pointer"
                                                                    title={url}   // 👈 Hover ला नाव दिसेल
                                                                ></i>
                                                            </div>
                                                        ) : (
                                                            <i className="fas fa-file-alt text-gray-500 text-2xl"></i>
                                                        )}
                                                    </a>

                                                </div>
                                            ))

                                            //     existing?.map((file, index) => (
                                            //     <div
                                            //         key={`uploaded-${index}`}
                                            //         className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-md w-full"
                                            //     >
                                            //         <div className="flex items-center gap-2 w-full overflow-hidden">
                                            //             <i className="fas fa-file text-orange-500 shrink-0"></i>

                                            //             <span className="text-sm truncate">
                                            //                 {file.name}
                                            //             </span>
                                            //         </div>

                                            //         <button
                                            //             onClick={() => handleRemoveFile(doc.type, index)}
                                            //             className="text-red-500 text-xs hover:underline ml-3 shrink-0"
                                            //         >
                                            //             Remove
                                            //         </button>
                                            //     </div>
                                            // ))














                                        )}
                                        {/* 🟢 Uploaded New Files (preview) */}

                                        {uploaded.map((file, index) => (
                                            <div
                                                key={`uploaded-${index}`}
                                                className="bg-white w-fit border border-green-200 rounded px-3 py-2 flex flex-col items-center space-y-2"
                                            >
                                                <a
                                                    href={URL.createObjectURL(file)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {file.type.startsWith('image/') ? (
                                                        <img
                                                            src={URL.createObjectURL(file)}
                                                            alt={`Preview ${index}`}
                                                            className="w-20 h-20 object-cover rounded"
                                                        />
                                                    ) : (
                                                        <i className="fas fa-file-alt text-gray-500 text-2xl"></i>
                                                    )}
                                                </a>
                                                <button
                                                    onClick={() => handleRemoveFile(doc.type, index)}
                                                    className="text-xs text-red-500 hover:underline"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}

                                        {/* {uploaded.map((file, index) => {
                                            const previewUrl = URL.createObjectURL(file);

                                            return (
                                                <div
                                                    key={`uploaded-${index}`}
                                                    className="bg-white  rounded-xl p-3 shadow-sm flex flex-col items-center"
                                                >
                                                    <a
                                                        href={previewUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-full"
                                                    >
                                                        {file.type.startsWith("image/") ? (
                                                            <div className="w-64 h-64 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
                                                                <img
                                                                    src={previewUrl}
                                                                    alt={`Preview ${index}`}
                                                                    className="max-w-full max-h-full object-contain"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="w-64 h-64 flex items-center justify-center bg-gray-100 rounded-lg">
                                                                <i className="fas fa-file-alt text-gray-500 text-4xl"></i>
                                                            </div>
                                                        )}
                                                    </a>

                                                    <button
                                                        onClick={() => handleRemoveFile(doc.type, index)}
                                                        className="mt-2 text-sm text-red-500 hover:underline"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            );
                                        })} */}


                                    </div>

                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        className="hidden"
                                        // ref={fileInputRefs[doc.type]}
                                        ref={(el) => (fileInputRefs.current[doc.type] = el)}
                                        onChange={(e) => handleFileChange(doc.type, e)}
                                        multiple
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>



        </div>



    );
};

export default CreateClient;
