// import { useForm, Controller } from "react-hook-form";
// import Select from "react-select";
// import { useApp } from "./AppProvider";
// import CryptoJS from "crypto-js";
// import { StatusOptions, PriorityOptions, CusmoterImpactedOptions, SelectStyles, SECRET_KEY, Managers, PriorityOptionsForForm } from "../../Config";
// import {
//   useCreateTicket,
//   useDynamicDetails,
//   useEmployeeDetails,
//   usePropertMasteryData,
//   useUpdateTicketSheetData,
// } from "./Services";
// import { useEffect, useRef, useState } from "react";
// import LoaderPage from "../NewBooking/LoaderPage";
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// export const CreateEditTicket = ({ isEdit = false }) => {

//   //  our states and some functions called here ............
//   const { setCurrentView, selectedTicket } = useApp();
//   const { mutate: submitBooking, isPending: isSubmittingBooking } = useCreateTicket();
//   const { mutate: updateTicketData, isPending: isUpdatingTicket } = useUpdateTicketSheetData();
//   const { data: DynamicValuesDetails } = useDynamicDetails()

//   const { data: EmployeeDetails } = useEmployeeDetails();
//   const { data: property } = usePropertMasteryData();
//   const [previousWlogs, setPreviousWlogs] = useState("");
//   const [previews, setPreviews] = useState([]);
//   const [decryptedUser, setDecryptedUser] = useState(null);
//   const [activePreview, setActivePreview] = useState(null);

//   const isImage = (name) => /\.(jpg|jpeg|png|gif|webp)$/i.test(name);
//   const isVideo = (name) => /\.(mp4|webm|avi|mov|mkv)$/i.test(name);

//   const handleModalClose = () => setActivePreview(null);

//   useEffect(() => {
//     setDecryptedUser(decryptUser(localStorage.getItem('user'))); // Just to verify decryption works.........
//   }, []);

//   const decryptUser = (encryptedData) => {
//     try {
//       const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
//       const decrypted = bytes.toString(CryptoJS.enc.Utf8);
//       return JSON.parse(decrypted);
//     } catch (error) {
//       console.error('Failed to decrypt user:', error);
//       return null;
//     }
//   };

//   const selectRef = useRef(null);
//   useEffect(() => {
//     // Focus the Select component on mount or based on some condition.........
//     if (selectRef.current) {
//       selectRef.current.focus();
//     }
//   }, []);


//   // here define useForm for react Hook form .................
//   const {
//     register,
//     handleSubmit,
//     control,
//     setValue,
//     watch,
//     formState: { errors },
//     reset,
//   } = useForm({
//     defaultValues: {
//       Title: "",
//       TicketID: "",
//       Description: "",
//       Priority: null,
//       PropertyCode: null,
//       Department: null,
//       Category: null,
//       Assignee: null,
//       Manager: null,
//       Status: null,
//       Attachment: [],
//       WorkLogs: ""
//     },
//   });

//   const CategoryOptions = DynamicValuesDetails?.data
//     ?.filter((prop) => prop.Categories) // Ensure Categoryies is present
//     .map((prop) => ({
//       value: prop.Categories,
//       label: prop.Categories,
//     })) || [];

//   // const DepartmentOptions = DynamicValuesDetails?.data
//   //   ?.filter((prop) => prop.Departments) // Ensure Departments is present
//   //   .map((prop) => ({
//   //     value: prop.Departments,
//   //     label: prop.Departments,
//   //   })) || [];


//     const allowedClientDepartments = ['Maintenance', 'Sales', 'Accounts', 'Housekeeping'];

// const DepartmentOptions = DynamicValuesDetails?.data
//   ?.filter((prop) => {
//     if (!prop.Departments) return false;

//     if (decryptedUser?.role?.toLowerCase() === "client") {
//       // Only include departments from the allowed list if the user is a client
//       return allowedClientDepartments.includes(prop.Departments);
//     }

//     return true; // For non-client users, include all with Departments
//   })
//   .map((prop) => ({
//     value: prop.Departments,
//     label: prop.Departments,
//   })) || [];


//   // dynamic managersOption define here .........
//   const ManagerOptions = EmployeeDetails?.data
//     ?.filter(
//       (emp) =>
//         emp?.Name &&
//         Managers.includes(emp?.Designation)
//     )
//     .map((emp) => ({
//       value: emp.Name,
//       label: `${emp.Name}`,
//     })) || [];

//   // dynamic assigneeOptions define here .........
//   const assigneeOptions = [
//     ...(EmployeeDetails?.data
//       ?.filter((emp) => emp?.Name)
//       .map((emp) => ({
//         value: emp.Name,
//         label: `${emp.Name}`,
//       })) || [])
//   ];

//   // dynamic ProperyOptions define here .........
//   const ProperyOptions = property?.data?.map((prop) => ({
//     value: prop["Property Code"],
//     label: prop["Property Code"],
//   })) || [];


//   // Set default values in edit mode........
//   useEffect(() => {
//     if (isEdit && selectedTicket) {
//       setValue("Title", selectedTicket.Title);
//       setValue("TicketID", selectedTicket.TicketID);
//       setValue("TargetDate", new Date(selectedTicket.TargetDate).toLocaleDateString('en-CA'));
//       setValue("CreatedByName", selectedTicket.CreatedByName);
//       setValue("Description", selectedTicket.Description);
//       setValue("Priority", PriorityOptions.find((p) => p.value === selectedTicket.Priority));
//       setValue("PropertyCode", ProperyOptions.find((p) => p.value === selectedTicket.PropertyCode));
//       setValue("Status", StatusOptions.find((s) => s.value === selectedTicket.Status));
//       setValue("Department", DepartmentOptions.find((d) => d.value === selectedTicket.Department));
//       setValue("Category", CategoryOptions.find((c) => c.value === selectedTicket.Category));
//       setValue("Assignee", assigneeOptions.find((u) => u.value === selectedTicket.Assignee));
//       setValue("Manager", ManagerOptions.find((u) => u.value === selectedTicket.Manager));
//       setValue("CustomerImpacted", CusmoterImpactedOptions.find((u) => u.value === selectedTicket.CustomerImpacted));
//       setValue("Escalated", CusmoterImpactedOptions.find((u) => u.value === selectedTicket.Escalated));
//       setPreviousWlogs(selectedTicket.WorkLogs || "");
//       // Only set previews once if not already set........
//       if (selectedTicket.Attachment && previews.length === 0) {
//         const attachments = selectedTicket.Attachment.split(',').map((url) => ({
//           url,
//           type: '', // Optional: derive MIME type......
//           name: url.split('/').pop(),
//           file: null, // Existing files shouldn't be re-uploaded.....
//         }));
//         setPreviews(attachments);
//       }
//     }
//   }, [isEdit, selectedTicket, setValue, ProperyOptions, ManagerOptions]);

//   useEffect(() => {
//     if (decryptedUser?.role?.toLowerCase() === "client") {
//       // Find the full option object in ProperyOptions that matches decryptedUser.propertyCode
//       const selectedOption = ProperyOptions.find(
//         (opt) => opt.value === decryptedUser.propertyCode
//       );

//       if (selectedOption) {
//         setValue("PropertyCode", selectedOption);
//       }
//     }
//   }, [decryptedUser, setValue]);


















//   // const generateUniqueFileName = (originalName) => {
//   //   const timestamp = Date.now();
//   //   const random = Math.floor(Math.random() * 100000);
//   //   const extension = originalName.substring(originalName.lastIndexOf('.') + 1);
//   //   const baseName = originalName.substring(0, originalName.lastIndexOf('.')).replace(/\s+/g, '_');
//   //   return `${baseName}_${timestamp}_${random}.${extension}`;
//   // };



//   const CLOUD_NAME = "dppyl6k4j"; // ✅ Your Cloudinary name



//   const generateUniqueFileName = (originalName) => {
//     const timestamp = Date.now();
//     const random = Math.floor(Math.random() * 1000000); // 6-digit random number
//     const extension = originalName.split('.').pop();
//     const baseName = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;

//     return `${timestamp}_${random}_${baseName}.${extension}`;
//   };

//   const uploadFileToCloudinary = async (file) => {
//     try {
//       const uniqueFileName = generateUniqueFileName(file.name);
//       const folder = 'tickets';

//       // Request signature from backend
//       const signResponse = await fetch(
//         `https://gpgs-main-server.vercel.app/api/cloudinary-sign?public_id=${encodeURIComponent(uniqueFileName)}&folder=${encodeURIComponent(folder)}`
//       );


//       if (!signResponse.ok) throw new Error("Failed to get signature");

//       const { signature, timestamp, api_key } = await signResponse.json();

//       // Build form data
//       const formData = new FormData();
//       formData.append("file", file);
//       formData.append("api_key", api_key);
//       formData.append("timestamp", timestamp);
//       formData.append("signature", signature);
//       formData.append("public_id", uniqueFileName);
//       formData.append("folder", folder);

//       const resourceType = file.type.startsWith("video") ? "video" : "image";
//       const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;

//       const uploadResponse = await fetch(cloudinaryUrl, {
//         method: "POST",
//         body: formData,
//       });

//       const uploadResult = await uploadResponse.json();

//       if (uploadResponse.ok) {
//         return {
//           url: uploadResult.secure_url,
//           name: uniqueFileName,
//           type: file.type,
//         };
//       } else {
//         console.error("Upload error:", uploadResult);
//         throw new Error("Cloudinary upload failed");
//       }
//     } catch (err) {
//       console.error("Cloudinary Upload Failed:", err);
//       throw err;
//     }
//   };


//   const [uploadingFiles, setUploadingFiles] = useState(new Set());

//   const handleFileChange = async (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     const maxSize = 100 * 1024 * 1024; // 100MB max
//     const allowedExtensions = /\.(jpg|jpeg|png|gif|webp|pdf|docx|txt|mp4|webm|mov|avi|mkv)$/i;

//     const validFiles = selectedFiles.filter(file =>
//       file.size <= maxSize && allowedExtensions.test(file.name)
//     );

//     if (validFiles.length === 0) {
//       toast.error("No valid files or all are too large.");
//       return;
//     }

//     if (previews.length + validFiles.length > 10) {
//       toast.error("⚠️ You can only upload up to 10 files.");
//       return;
//     }

//     // Add all valid files to uploading set
//     setUploadingFiles(prev => {
//       const copy = new Set(prev);
//       validFiles.forEach(file => copy.add(file.name));
//       return copy;
//     });

//     // Upload all files in parallel
//     const uploadedFiles = await Promise.all(
//       validFiles.map(async (file) => {
//         try {
//           const uploaded = await uploadFileToCloudinary(file);
//           // toast.success(`✅ ${file.name} uploaded`);
//           return uploaded; // return full object with url, name, etc.
//         } catch (err) {
//           toast.error(`❌ ${file.name} failed`);
//           return null;
//         } finally {
//           // Remove from uploading set as soon as upload finishes (success or fail)
//           setUploadingFiles(prev => {
//             const copy = new Set(prev);
//             copy.delete(file.name);
//             return copy;
//           });
//         }
//       })
//     );

//     // Filter failed uploads
//     const successfulUploads = uploadedFiles.filter(Boolean);

//     // Update preview state (for display)
//     setPreviews(prev => [...prev, ...successfulUploads]);

//     // Set attachment URLs for form submission
//     setValue("Attachment", [...(watch("Attachment") || []), ...successfulUploads.map(f => f.url)]);
//   };









  





















//   // const handleFileChange = (e) => {
//   //   const selectedFiles = Array.from(e.target.files);

//   //   // Max size check
//   //   const maxSize = 100 * 1024 * 1024; // 5MB
//   //   const oversizedFiles = selectedFiles.filter(file => file.size > maxSize);
//   //   if (oversizedFiles.length > 0) {
//   //     toast.dismiss();
//   //     toast.error(`⚠️ Some files are larger than 5 MB and were not added.`);
//   //   }

//   //   // Filter valid files (by size)
//   //   const validFiles = selectedFiles.filter(file => file.size <= maxSize);

//   //   // ✅ Add video extensions here
//   //   const allowedExtensions = /\.(jpg|jpeg|png|gif|webp|pdf|docx|txt|mp4|webm|mov|avi|mkv)$/i;

//   //   // Filter previews and files by extension
//   //   const filteredPreviews = previews.filter(file => allowedExtensions.test(file.name));
//   //   const filteredValidFiles = validFiles.filter(file => allowedExtensions.test(file.name));

//   //   // Check max file count
//   //   const totalFiles = filteredPreviews.length + filteredValidFiles.length;
//   //   if (totalFiles > 5) {
//   //     toast.dismiss();
//   //     toast.error("⚠️ You can only upload up to 5 files.");
//   //     return;
//   //   }

//   //   // Generate new previews with unique names
//   //   const newPreviews = filteredValidFiles.map((file) => {
//   //     const uniquePrefix = Math.floor(100000 + Math.random() * 900000); // Random 6-digit number
//   //     const newName = `${uniquePrefix}-${file.name}`;

//   //     const renamedFile = new File([file], newName, { type: file.type });

//   //     return {
//   //       url: URL.createObjectURL(file),
//   //       type: file.type,
//   //       name: newName,
//   //       file: renamedFile,
//   //     };
//   //   });

//   //   // Update preview state
//   //   const updatedPreviews = [...previews, ...newPreviews];
//   //   setPreviews(updatedPreviews);

//   //   // Set final value for form submission
//   //   setValue("Attachment", updatedPreviews.map((item) => item.file));
//   // };




//   const handleRemoveFile = (index) => {
//     const updated = previews.filter((_, i) => i !== index);
 
//     setPreviews(updated);
//     setValue("Attachment", updated.map((item) => item.file));
//   };

//   // for timeStap function  .............

//   function getFormattedTimestamp() {
//     const now = new Date();

//     const day = String(now.getDate()).padStart(2, '0');
//     const month = now.toLocaleString('en-US', { month: 'short' }); // "Sep"
//     const year = now.getFullYear();

//     let hours = now.getHours();
//     const minutes = String(now.getMinutes()).padStart(2, '0');
//     const ampm = hours >= 12 ? 'pm' : 'am';

//     hours = hours % 12;
//     hours = hours ? hours : 12; // 0 → 12

//     return `${day} ${month} ${year} ${hours}:${minutes}${ampm}`;
//   }
//   function getFormattedTimestampForTargetDate(dateStr) {
//     const date = new Date(dateStr); // Convert string to Date object

//     const day = String(date.getDate()).padStart(2, '0');
//     const month = date.toLocaleString('en-US', { month: 'short' }); // "Sep"
//     const year = date.getFullYear();

//     return `${day} ${month} ${year}`;
//   }

//   function Timestamp() {
//     const now = new Date();
//     return `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
//   }
//   const isValidDate = (date) => {
//     const parsedDate = new Date(date);
//     return parsedDate instanceof Date && !isNaN(parsedDate);
//   };





//   // const onSubmit = (data) => {
//   //   const currentTimestamp = getFormattedTimestamp();

//   //   // Format WorkLogs
//   //   const newWorkLogEntry = data.WorkLogs
//   //     ? `[${currentTimestamp} - ${decryptedUser?.name}]  ${data.WorkLogs.trim()}`
//   //     : "";

//   //   const statusValue = isEdit ? data.Status?.value || "" : "Open";
//   //   const isStatusChanged = isEdit && selectedTicket?.Status !== data.Status?.value;

//   //   // Compose WorkLogs
//   //   let updatedWorkLogs = "";
//   //   if (isStatusChanged) {
//   //     const statusChangeLog = `[${currentTimestamp} - ${decryptedUser?.name}] Status changed from ${selectedTicket.Status} to ${data.Status?.value}`;
//   //     updatedWorkLogs += statusChangeLog;
//   //   }
//   //   if (newWorkLogEntry) {
//   //     updatedWorkLogs += `${updatedWorkLogs ? "\n\n" : ""}${newWorkLogEntry}`;
//   //   }
//   //   if (previousWlogs) {
//   //     updatedWorkLogs += `${updatedWorkLogs ? "\n\n" : ""}${previousWlogs}`;
//   //   }

//   //   // Format data before sending
//   //   const formattedData = {
//   //     ...data,
//   //     Priority: data.Priority?.value || "",
//   //     PropertyCode: data.PropertyCode?.value || "",
//   //     Department: data.Department?.value || "",
//   //     Category: data.Category?.value || "",
//   //     Assignee: data.Assignee?.value || "",
//   //     Manager: data.Manager?.value || "",
//   //     TargetDate: isValidDate(data.TargetDate)
//   //       ? getFormattedTimestampForTargetDate(data.TargetDate)
//   //       : "N/A",
//   //     Status: statusValue,
//   //     CustomerImpacted: data.CustomerImpacted?.value || "",
//   //     Escalated: data.Escalated?.value || "",
//   //     WorkLogs: updatedWorkLogs || "",
//   //     // CreatedByName: decryptedUser?.name || "Unknown",
//   //     // CreatedById: selectedTicket?.CreatedById || "Unknown",
//   //     ClosedDate: statusValue === "Closed" ? Timestamp() : "",
//   //     ...(isEdit
//   //       ? {
//   //         UpdatedByName: decryptedUser?.name || "Unknown",
//   //         UpdatedById: decryptedUser?.clientID || decryptedUser?.id || "Unknown",
//   //         UpdatedDateTime: Timestamp(),
//   //         Attachment: previews.map(ele => ele.url),
//   //         CreatedById: selectedTicket?.CreatedById || "Unknown",
//   //         CreatedBy: selectedTicket?.CreatedBy || "Unknown",

//   //       }
//   //       : {
//   //         CreatedByName: decryptedUser?.name || "Unknown",
//   //         CreatedById: decryptedUser?.clientID || decryptedUser?.id || "Unknown",
//   //         CreatedBy: decryptedUser?.role.charAt(0).toUpperCase() + decryptedUser?.role.slice(1).toLowerCase() || "Unknown",
//   //       }),
//   //   };
//   //   const formData = new FormData();
//   //   // 🔁 Append non-file data to FormData
//   //   for (const key in formattedData) {
//   //     const value = formattedData[key];

//   //     // Skip appending 'images' key (handled separately)
//   //     if (key === "images") continue;

//   //     // Stringify objects (selects, nested fields)
//   //     if (
//   //       typeof value === "object" &&
//   //       value !== null &&
//   //       !(value instanceof File)
//   //     ) {
//   //       formData.append(key, JSON.stringify(value));
//   //     } else {
//   //       formData.append(key, value ?? "");
//   //     }
//   //   }

//   //   // 📸 Append each image file
//   //   previews.forEach((file) => {
//   //     formData.append("images", file.file);

//   //   });

//   //   // ✅ Submit
//   //   const submissionFn = isEdit && selectedTicket ? updateTicketData : submitBooking;

//   //   submissionFn(formData, {
//   //     onSuccess: () => {
//   //       toast.success(`Ticket ${isEdit ? "updated" : "created"} successfully!`);
//   //       // toast.error("Error message!");
//   //       reset();
//   //       setCurrentView("tickets");
//   //     },
//   //   });

//   //   // 🔍 If you want to inspect formData manually:
//   //   for (let pair of formData.entries()) {
//   //     console.log(pair[0], pair[1]);
//   //   }
//   // };


//   const onSubmit = (data) => {
//     const currentTimestamp = getFormattedTimestamp();

//     const newWorkLogEntry = data.WorkLogs
//       ? `[${currentTimestamp} - ${decryptedUser?.name}]  ${data.WorkLogs.trim()}`
//       : "";

//     const statusValue = isEdit ? data.Status?.value || "" : "Open";
//     const isStatusChanged = isEdit && selectedTicket?.Status !== data.Status?.value;

//     let updatedWorkLogs = "";
//     if (isStatusChanged) {
//       const statusChangeLog = `[${currentTimestamp} - ${decryptedUser?.name}] Status changed from ${selectedTicket.Status} to ${data.Status?.value}`;
//       updatedWorkLogs += statusChangeLog;
//     }
//     if (newWorkLogEntry) {
//       updatedWorkLogs += `${updatedWorkLogs ? "\n\n" : ""}${newWorkLogEntry}`;
//     }
//     if (previousWlogs) {
//       updatedWorkLogs += `${updatedWorkLogs ? "\n\n" : ""}${previousWlogs}`;
//     }

//     const formattedData = {
//       ...data,
//       Priority: data.Priority?.value || "",
//       PropertyCode: data.PropertyCode?.value || "",
//       Department: data.Department?.value || "",
//       Category: data.Category?.value || "",
//       Assignee: data.Assignee?.value || "",
//       Manager: data.Manager?.value || "",
//       TargetDate: isValidDate(data.TargetDate)
//         ? getFormattedTimestampForTargetDate(data.TargetDate)
//         : "N/A",
//       Status: statusValue,
//       CustomerImpacted: data.CustomerImpacted?.value || "",
//       Escalated: data.Escalated?.value || "",
//       WorkLogs: updatedWorkLogs || "",
//       Attachment: data.Attachment, // ✅ Cloudinary URLs
//       ...(isEdit
//         ? {
//           UpdatedByName: decryptedUser?.name || "Unknown",
//           UpdatedById: decryptedUser?.clientID || decryptedUser?.id || "Unknown",
//           UpdatedDateTime: Timestamp(),
//           CreatedById: selectedTicket?.CreatedById || "Unknown",
//           CreatedBy: selectedTicket?.CreatedBy || "Unknown",
//           Attachment: previews.map(ele => ele.url),


//         }
//         : {
//           CreatedByName: decryptedUser?.name || "Unknown",
//           CreatedById: decryptedUser?.clientID || decryptedUser?.id || "Unknown",
//           CreatedBy: decryptedUser?.role.charAt(0).toUpperCase() + decryptedUser?.role.slice(1).toLowerCase() || "Unknown",
//         }),
//     };

//     const formData = new FormData();
//     for (const key in formattedData) {
//       const value = formattedData[key];
//       formData.append(key, typeof value === "object" ? JSON.stringify(value) : value ?? "");
//     }

//     const submissionFn = isEdit && selectedTicket ? updateTicketData : submitBooking;

//     submissionFn(formData, {
//       onSuccess: () => {
//         toast.success(`Ticket ${isEdit ? "updated" : "created"} successfully!`);
//         reset();
//         setCurrentView("tickets");
//       },
//     });
//   };

//   useEffect(() => {
//     if (!isEdit) {
//       reset()
//       setPreviews([])
//     }
//   }, [isEdit])

//   if (isEdit && decryptedUser?.role.toLowerCase() === "client") {
//     return <>
//       <div className="">
//         <h2 className="text-2xl font-bold text-gray-900 ml-5">
//           {isEdit ? (
//             <h1>View & Edit Ticket : {selectedTicket?.TicketID}</h1>
//           ) : (
//             <div className="lg:flex   items-center gap-5">
//               <h1>Create New Ticket</h1>
//               {decryptedUser?.role.toLowerCase().toLowerCase() === "client" && (
//                 <p className="text-orange-500 text-sm lg:text-lg">Kindly submit a new ticket for any maintenance requests, housekeeping services, notice to vacate, rent receipts, rental agreements, full and final settlements, or electricity bill-related concerns</p>
//               )}
//             </div>
//           )}

//         </h2>
//         <div className="bg-white rounded-lg shadow p-6">
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//             {/* Property Code, Title */}
//             <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
//               {isEdit == "klsdfhl" && (
//                 <div>
//                   <label className="block text-sm font-medium text-black mb-2">Ticket ID</label>
//                   <input
//                     {...register("TicketID", { required: true })}
//                     disabled
//                     className="w-full border border-orange-300 rounded-md px-3 py-2"
//                   />
//                 </div>
//               )}

//               <div>
//                 <label className="block text-sm font-medium text-black mb-2">Property Code <span className="text-red-500">*</span></label>
//                 <Controller
//                   control={control}
//                   name="PropertyCode"
//                   rules={{ required: "Property Code Required" }}
//                   render={({ field, fieldState: { error } }) => (
//                     <>
//                       <Select
//                         ref={selectRef}
//                         {...field}
//                         options={ProperyOptions}
//                         styles={SelectStyles}
//                         isClearable
//                         placeholder="Search & Select Property Code"
//                         isDisabled={decryptedUser?.role.toLowerCase() === "client" || isEdit && decryptedUser?.role.toLowerCase() !== "client"}
//                       // isDisabled={isEdit}
//                       />

//                       {error && <p className="text-red-500 text-sm">{error.message}</p>}
//                     </>
//                   )}
//                 />
//               </div>

//               {[
//                 { name: "Department", options: DepartmentOptions, placeholder: "Search & Select Department" },
//                 { name: "Category", options: CategoryOptions, placeholder: "Search &  Select Category" },
//                 ...(isEdit && decryptedUser?.role.toLowerCase() === "client"
//                   ? []
//                   : [{ name: "Priority", options: PriorityOptions, placeholder: " Select Priority" }]),
//                 ...(decryptedUser?.role.toLowerCase() === "admin"
//                   ? [{ name: "Priority", options: PriorityOptions, placeholder: "Search & Select Priority" }]
//                   : []),
//               ].map(({ name, options, placeholder }) => (
//                 <div key={name}>
//                   <label className="block text-sm font-medium text-black mb-2">{name} <span className="text-red-500">*</span></label>
//                   <Controller
//                     control={control}
//                     name={name}
//                     rules={{
//                       required:
//                         name === "Priority" && decryptedUser?.role.toLowerCase() === "client"
//                           ? false
//                           : `${name} is required`,
//                     }}
//                     render={({ field, fieldState: { error } }) => (
//                       <>
//                         <Select {...field} options={options} styles={SelectStyles} placeholder={placeholder} isClearable isDisabled={isEdit && decryptedUser?.role.toLowerCase() === "client"} />
//                         {error && <p className="text-red-500 text-sm">{error.message}</p>}
//                       </>
//                     )}
//                   />
//                 </div>
//               ))}



//               <div>
//                 <label className="block text-sm font-medium text-black mb-2">
//                   Title <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   {...register("Title", { required: "Title is required" })}
//                   disabled={isEdit && decryptedUser?.role.toLowerCase() === "client"}
//                   className={`w-full border ${isEdit ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
//                     } border-orange-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300`}
//                   placeholder="Enter Title"
//                 />
//                 {errors.Title && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.Title.message}
//                   </p>
//                 )}
//               </div>

//               {isEdit && (
//                 <div>
//                   <label className="block text-sm font-medium text-black mb-2">
//                     Status <span className="text-red-500">*</span>
//                   </label>
//                   <Controller
//                     control={control}
//                     name="Status"
//                     rules={{ required: "Status is required" }}
//                     render={({ field, fieldState: { error } }) => {
//                       const isClient = decryptedUser?.role.toLowerCase() === "client";
//                       const isResolved = selectedTicket.Status === "Resolved";
//                       const showOnlyReopen = isEdit && isClient && isResolved;

//                       const filteredOptions = showOnlyReopen
//                         ? StatusOptions.filter((option) => option.value === "Re-Open")
//                         : StatusOptions;

//                       return (
//                         <>
//                           <Select
//                             {...field}
//                             options={filteredOptions}
//                             styles={SelectStyles}
//                             isClearable
//                             isDisabled={isEdit && decryptedUser?.role.toLowerCase() === "client" && selectedTicket.Status !== "Resolved"}
//                           />
//                           {error && <p className="text-red-500 text-sm">{error.message}</p>}
//                         </>
//                       );
//                     }}
//                   />
//                 </div>
//               )}

//               {!isEdit && decryptedUser?.role.toLowerCase() !== "client" && (<>
//                 <div>
//                   <label className="block text-sm font-medium text-black mb-2">Manager</label>
//                   <Controller
//                     control={control}
//                     name="Manager"
//                     render={({ field }) => (
//                       <Select {...field} placeholder="Search & Select " options={ManagerOptions} isClearable styles={SelectStyles} isDisabled={isEdit && decryptedUser?.role.toLowerCase() === "client"} />
//                     )}

//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-black mb-2">Assignee </label>
//                   <Controller
//                     control={control}
//                     name="Assignee"
//                     render={({ field }) => (
//                       <Select {...field} placeholder="Search & Select " options={assigneeOptions} isClearable styles={SelectStyles} isDisabled={isEdit && decryptedUser?.role.toLowerCase() === "client"}
//                       />
//                     )}
//                   />
//                 </div>
//               </>
//               )

//               }
//               {/* {isEdit && (
//               <div>
//                 <label className="block text-sm font-medium text-black mb-2">Status <span className="text-red-500">*</span></label>
//                 <Controller
//                   control={control}
//                   name="Status"
//                   rules={{ required: "Status is required" }}
//                   render={({ field, fieldState: { error } }) => (
//                     <>
//                       <Select {...field} options={StatusOptions} styles={SelectStyles} isClearable isDisabled={isEdit && decryptedUser?.role.toLowerCase() === "client"} />
//                       {error && <p className="text-red-500 text-sm">{error.message}</p>}
//                     </>
//                   )}

//                 />
//               </div>
//             )} */}
//               {decryptedUser?.role.toLowerCase() !== "client" && (
//                 <div>
//                   <label className="block text-sm font-medium text-black mb-2">
//                     Target Date
//                   </label>
//                   <Controller
//                     control={control}
//                     name="TargetDate"
//                     defaultValue=""
//                     render={({ field }) => (
//                       <div className="relative w-full">
//                         <input
//                           type="date"
//                           {...field}
//                           value={field.value || ""}
//                           disabled={isEdit}
//                           className="w-full border border-orange-500 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
//                         />
//                         {field.value && (
//                           <button
//                             type="button"
//                             onClick={() => field.onChange("")}
//                             className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-600"
//                           >
//                             &#10005;
//                           </button>
//                         )}
//                       </div>
//                     )}
//                   />
//                 </div>
//               )}


//               {/* {isEdit && (
//               <div>
//                 <div>
//                   <label className="block text-sm font-medium text-black mb-2">
//                     Created By <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     {...register("CreatedByName", { required: "Created By Name is required" })}
//                     disabled={isEdit}
//                     className={`w-full border ${isEdit ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
//                       } border-orange-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300`}
//                     placeholder="Enter Created By Name"
//                   />
//                   {errors.Title && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.Title.message}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             )} */}
//             </div>

//             {/* Description */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

//               <div>
//                 <label className="block text-sm font-medium text-black mb-2">Description <span className="text-red-500">*</span></label>
//                 <textarea
//                   {...register("Description", { required: "Description is required" })}
//                   rows={4}
//                   disabled={isEdit}
//                   placeholder="Enter Your Description here"
//                   className="w-full h-[150px] border border-orange-500  focus:outline-none focus:ring-2 focus:ring-orange-300 rounded-md px-3 py-2"
//                 />
//                 {errors.Description && (
//                   <p className="text-red-500 text-sm">{errors.Description.message}</p>
//                 )}

//               </div>
//               {isEdit && (

//                 <div>
//                   <div>
//                     <label className="block text-sm font-medium text-black mb-2">Attachment</label>
//                     <input
//                       type="file"
//                       multiple
//                       accept="image/*,video/*,application/pdf"
//                       onChange={handleFileChange}
//                       className="w-full h-[90%] border border-orange-500  focus:outline-none focus:ring-2 focus:ring-orange-300 rounded-md px-3 py-2"
//                     />
//                   </div>

//                   {(previews.length > 0 || uploadingFiles.size > 0) && (
//                     <div className="flex flex-wrap gap-4 mt-5">
//                       {/* Uploading Loaders */}
//                       {[...uploadingFiles].map((fileName) => (
//                         <div
//                           key={fileName}
//                           className="relative w-40 h-36 flex flex-col items-center justify-center border rounded-md bg-gray-50 shadow-sm"
//                         >
//                           <LoaderPage />
//                           <span className="mt-2 text-xs text-gray-500 text-center break-words">
//                             {fileName}
//                           </span>
//                         </div>
//                       ))}

//                       {/* Uploaded Previews */}
//                       {previews.map((file, index) => {
//                         if (!isImage(file.name) && !isVideo(file.name)) return null;

//                         return (
//                           <div
//                             key={file.url || file.name || index}
//                             className="relative w-40 border rounded-md p-2 bg-gray-100 shadow-sm cursor-pointer"
//                             onClick={() => setActivePreview(file)}
//                           >
//                             <button
//                               type="button"
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleRemoveFile(index);
//                               }}
//                               className="absolute top-1 right-1 text-red-600 text-xs bg-white rounded-full px-2 shadow z-10"
//                             >
//                               ✕
//                             </button>

//                             {isImage(file.name) ? (
//                               <img
//                                 src={file.url}
//                                 alt={file.name}
//                                 className="w-full h-28 object-cover rounded"
//                               />
//                             ) : (
//                               <video
//                                 controls
//                                 className="w-full h-28 object-cover rounded"
//                                 onClick={(e) => e.stopPropagation()}
//                               >
//                                 <source src={file.url} type="video/mp4" />
//                                 Your browser does not support the video tag.
//                               </video>
//                             )}
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}

//                   {/* Modal Popup */}
//                   {activePreview && (
//                     <div
//                       className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
//                       onClick={handleModalClose}
//                     >
//                       <div
//                         className="relative max-w-[80vw] max-h-[80vh] p-4 bg-white rounded shadow-lg overflow-hidden"
//                         onClick={(e) => e.stopPropagation()}
//                       >
//                         <button
//                           className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full px-3 py-1 text-lg z-50"
//                           onClick={handleModalClose}
//                         >
//                           ✕
//                         </button>

//                         {isImage(activePreview.name) ? (
//                           <img
//                             src={activePreview.url}
//                             alt={activePreview.name}
//                             className="max-w-full max-h-[75vh] w-auto h-auto rounded"
//                             style={{ display: 'block', margin: '0 auto' }}
//                           />
//                         ) : (
//                           <video
//                             autoPlay
//                             muted
//                             controls
//                             playsInline
//                             className="max-w-full max-h-[75vh] w-auto h-auto rounded"
//                             style={{ display: 'block', margin: '0 auto' }}
//                           >
//                             <source src={activePreview.url} type="video/mp4" />
//                             Your browser does not support the video tag.
//                           </video>
//                         )}
//                       </div>
//                     </div>
//                   )}

//                 </div>
//               )}


//               {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

//               {isEdit && (
//                 <>
//                   <div>
//                     <label className="block text-sm font-medium text-black mb-2">Manager</label>
//                     <Controller
//                       control={control}
//                       name="Manager"
//                       render={({ field }) => (
//                         <Select {...field} options={ManagerOptions} isClearable styles={SelectStyles} isDisabled={isEdit && decryptedUser?.role.toLowerCase() === "client"} />
//                       )}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-black mb-2">Assignee </label>
//                     <Controller
//                       control={control}
//                       name="Assignee"
//                       render={({ field }) => (
//                         <Select {...field} options={assigneeOptions} isClearable styles={SelectStyles} isDisabled={isEdit && decryptedUser?.role.toLowerCase() === "client"} />
//                       )}
//                     />
//                   </div>
//                 </>
//               )}

//               {isEdit && (
//                 <>

//                   <div>
//                     <label className="block text-sm font-medium text-black mb-2">Customer Impacted </label>
//                     <Controller
//                       control={control}
//                       name="CustomerImpacted"
//                       render={({ field }) => (
//                         <Select {...field} options={CusmoterImpactedOptions} isClearable styles={SelectStyles} isDisabled={isEdit && decryptedUser?.role.toLowerCase() === "client"} />
//                       )}
//                     />
//                   </div>


//                   <div>
//                     <label className="block text-sm font-medium text-black mb-2">Escalated </label>
//                     <Controller
//                       control={control}
//                       name="Escalated"
//                       render={({ field }) => (
//                         <Select {...field} options={CusmoterImpactedOptions} isClearable styles={SelectStyles} isDisabled={isEdit && decryptedUser?.role.toLowerCase() === "client"} />
//                       )}
//                     />
//                   </div>
//                 </>
//               )}

//             </div> */}

//               {/* Dropdowns ////////////////*/}

//             </div>

//             {/* Manager & Assignee */}

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

//               {isEdit && (
//                 <div>
//                   <label className="block text-sm font-medium text-black mb-2">Work Logs <span className="text-red-500">*</span></label>
//                   {previousWlogs && (
//                     <div className="mb-2 p-2 bg-gray-100 border border-gray-300 rounded h-32 overflow-y-auto">
//                       {/* <pre className="text-xl text-black whitespace-pre-wrap">{previousWlogs}</pre> */}
//                     </div>
//                   )}
//                   <textarea
//                     {...register("WorkLogs")}
//                     placeholder="Add work log entries here..."
//                     rows={4}
//                     className="w-full h-20 border border-orange-500  focus:outline-none focus:ring-2 focus:ring-orange-300  rounded-md px-3 py-2"
//                   />
//                 </div>

//               )}
//               <div>


//                 {/* Attachment */}

//               </div>

//             </div>
//             {/* Buttons */}
//             <div className="flex   gap-4 items-center justify-center">

//               <button
//                 type="submit"
//                 className={`bg-orange-300 ${isEdit ? "mt-[-10]" : "mt-[-80px]"}  text-white px-6 py-2 rounded hover:bg-orange-400 flex items-center justify-center gap-2`}
//                 disabled={isSubmittingBooking || isUpdatingTicket}
//               >
//                 {(isSubmittingBooking || isUpdatingTicket) ? (
//                   <>
//                     <LoaderPage size="small" />
//                     {isEdit ? 'Updating...' : 'Creating...'}
//                   </>
//                 ) : (
//                   isEdit ? 'Update Ticket' : 'Create'
//                 )}
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setCurrentView("tickets")}
//                 className={`border border-gray-300 ${isEdit ? "mt-[-10]" : "mt-[-80px]"} text-black px-6 py-2 rounded hover:bg-gray-10`}
//               >
//                 Cancel
//               </button>
//             </div>

//           </form>
//         </div>
//       </div>
//     </>
//   }

//   return (
//     <div className="">
//       <div className="ml-5">
//         {isEdit ? (
//           <h2 className="text-2xl font-bold text-gray-900">
//             View & Edit Ticket: {selectedTicket?.TicketID}
//           </h2>
//         ) : (
//           <div className="flex flex-col justify-start">
//             <h2 className="text-2xl font-bold text-gray-900">Create New Ticket</h2>
//             {decryptedUser?.role?.toLowerCase() === "client" && (
//               <p className="text-orange-500 text-sm lg:text-[14px] mt-1">
//                 Kindly submit a new ticket for any maintenance requests, housekeeping services, notice to vacate, rent receipts, rental agreements, full and final settlements, or electricity bill-related concerns etc.
//               </p>
//             )}
//           </div>
//         )}
//       </div>

//       <div className="bg-white rounded-lg shadow p-6">
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           {/* Property Code, Title */}
//           <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//             {isEdit == "klsdfhl" && (
//               <div>
//                 <label className="block text-sm font-medium text-black mb-2">Ticket ID</label>
//                 <input
//                   {...register("TicketID", { required: true })}
//                   disabled
//                   className="w-full border border-orange-300 rounded-md px-3 py-2"
//                 />
//               </div>
//             )}
//             <div>
//               <label className="block text-sm font-medium text-black mb-2">Property Code <span className="text-red-500">*</span></label>
//               <Controller
//                 control={control}
//                 name="PropertyCode"
//                 rules={{ required: "Property Code Required" }}
//                 render={({ field, fieldState: { error } }) => (
//                   <>
//                     <Select
//                       ref={selectRef}
//                       {...field}
//                       options={ProperyOptions}
//                       styles={SelectStyles}
//                       isClearable
//                       placeholder="Search & Select"
//                       isDisabled={decryptedUser?.role.toLowerCase() === "client" || isEdit && decryptedUser?.role.toLowerCase() !== "client"}
//                     // isDisabled={isEdit}
//                     />
//                     {error && <p className="text-red-500 text-sm">{error.message}</p>}
//                   </>
//                 )}
//               />
//             </div>

//             {[
//               { name: "Department", options: DepartmentOptions, placeholder: "Search & Select" },
//               { name: "Category", options: CategoryOptions, placeholder: "Search &  Select" },
//               ...(isEdit && decryptedUser?.role.toLowerCase() === "client"
//                 ? [{ name: "Priority", options: PriorityOptionsForForm, placeholder: "Search & Select" }]
//                 : []),
//               ...(decryptedUser?.role.toLowerCase() === "admin"
//                 ? [{ name: "Priority", options: PriorityOptionsForForm, placeholder: "Search & Select" }]
//                 : []),
//             ].map(({ name, options, placeholder }) => (
//               <div key={name}>
//                 <label className="block text-sm font-medium text-black mb-2">{name} <span className="text-red-500">*</span></label>
//                 <Controller
//                   control={control}
//                   name={name}
//                   rules={{
//                     required:
//                       name === "Priority" && decryptedUser?.role.toLowerCase() === "client" || name === "Priority" && decryptedUser?.role.toLowerCase() === "admin"
//                         ? false
//                         : `${name} is required`,
//                   }}
//                   render={({ field, fieldState: { error } }) => (
//                     <>
//                       <Select {...field} options={options} styles={SelectStyles} placeholder={placeholder} isClearable isDisabled={isEdit && decryptedUser?.role.toLowerCase() === "client"} />
//                       {error && <p className="text-red-500 text-sm">{error.message}</p>}
//                     </>
//                   )}
//                 />
//               </div>
//             ))}
//             <div>
//               <label className="block text-sm font-medium text-black mb-2">
//                 Title <span className="text-red-500">*</span>
//               </label>
//               <input
//                 {...register("Title", { required: "Title is required" })}
//                 disabled={isEdit}
//                 className={`w-full border ${isEdit ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
//                   } border-orange-300 border-2 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300`}
//                 placeholder="Enter Title"
//               />
//               {errors.Title && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.Title.message}
//                 </p>
//               )}
//             </div>
//             {decryptedUser?.role.toLowerCase() !== "client" && !isEdit && (<>
//               <div>
//                 <label className="block text-sm font-medium text-black mb-2">Manager</label>
//                 <Controller
//                   control={control}
//                   name="Manager"
//                   render={({ field }) => (
//                     <Select {...field} placeholder="Search & Select " options={ManagerOptions} isClearable styles={SelectStyles} isDisabled={isEdit && decryptedUser?.role.toLowerCase() === "client"} />
//                   )}

//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-black mb-2">Assignee </label>
//                 <Controller
//                   control={control}
//                   name="Assignee"
//                   render={({ field }) => (
//                     <Select {...field} placeholder="Search & Select " options={assigneeOptions} isClearable styles={SelectStyles} isDisabled={isEdit && decryptedUser?.role.toLowerCase() === "client"}
//                     />
//                   )}
//                 />
//               </div>
//             </>
//             )

//             }
//             {isEdit && (
//               <div>
//                 <label className="block text-sm font-medium text-black mb-2">Status <span className="text-red-500">*</span></label>
//                 <Controller
//                   control={control}
//                   name="Status"
//                   rules={{ required: "Status is required" }}
//                   render={({ field, fieldState: { error } }) => (
//                     <>
//                       <Select {...field} options={StatusOptions} styles={SelectStyles} isClearable isDisabled={isEdit && decryptedUser?.role.toLowerCase() === "client"} />
//                       {error && <p className="text-red-500 text-sm">{error.message}</p>}
//                     </>
//                   )}

//                 />
//               </div>
//             )}
//             {decryptedUser?.role.toLowerCase() !== "client" && (
//               <div>
//                 <label className="block text-sm font-medium text-black mb-2">
//                   Target Date
//                 </label>
//                 <Controller
//                   control={control}
//                   name="TargetDate"
//                   defaultValue=""
//                   render={({ field }) => (
//                     <div className="relative w-full">
//                       <input
//                         type="date"
//                         {...field}
//                         value={field.value || ""}
//                         disabled={isEdit && decryptedUser?.role.toLowerCase() === "client"}
//                         className="w-full  border-orange-300 border-2 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
//                       />
//                       {field.value && (
//                         <button
//                           type="button"
//                           onClick={() => field.onChange("")}
//                           className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-600"
//                         >
//                           &#10005;
//                         </button>
//                       )}
//                     </div>
//                   )}
//                 />
//               </div>
//             )}


//             {isEdit && (
//               <div>
//                 <div>
//                   <label className="block text-sm font-medium text-black mb-2">
//                     Created By <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     {...register("CreatedByName", { required: "Created By Name is required" })}
//                     disabled={isEdit}
//                     className={`w-full border-2 ${isEdit ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
//                       } border-orange-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300`}
//                     placeholder="Enter Created By Name"
//                   />
//                   {errors.Title && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.Title.message}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Description */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

//             <div>
//               <label className="block text-sm font-medium text-black mb-2">Description <span className="text-red-500">*</span></label>
//               <textarea
//                 {...register("Description", { required: "Description is required" })}
//                 rows={4}
//                 disabled={isEdit}
//                 placeholder="Enter Your Description here"
//                 className="w-full h-[150px] border-2 border-orange-300  focus:outline-none focus:ring-2 focus:ring-orange-300 rounded-md px-3 py-2"
//               />
//               {errors.Description && (
//                 <p className="text-red-500 text-sm">{errors.Description.message}</p>
//               )}

//             </div>





//             {decryptedUser?.role?.toLowerCase() !== "client" && !isEdit && (
//               <div className="grid grid-cols-2 gap-5">
//                 <div>
//                   <label className="block text-sm font-medium text-black mb-2">Customer Impacted </label>
//                   <Controller
//                     control={control}
//                     name="CustomerImpacted"
//                     render={({ field }) => (
//                       <Select {...field} options={CusmoterImpactedOptions} isClearable styles={SelectStyles} isDisabled={isEdit && decryptedUser?.role.toLowerCase() === "client"} />
//                     )}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-black mb-2">Escalated </label>
//                   <Controller
//                     control={control}
//                     name="Escalated"
//                     render={({ field }) => (
//                       <Select {...field} options={CusmoterImpactedOptions} isClearable styles={SelectStyles} isDisabled={isEdit && decryptedUser?.role.toLowerCase() === "client"} />
//                     )}
//                   />
//                 </div>

//                 <div className="col-span-2">
//                   <div>
//                     <label className="block text-sm font-medium text-black mb-2">Attachment</label>
//                     <input
//                       type="file"
//                       multiple
//                       accept="image/*,video/*,application/pdf"
//                       onChange={handleFileChange}
//                       className="w-full h-[90%] border border-orange-500  focus:outline-none focus:ring-2 focus:ring-orange-300 rounded-md px-3 py-2"
//                     />
//                   </div>

                
//                   {(previews.length > 0 || uploadingFiles.size > 0) && (
//                     <div className="flex flex-wrap gap-4 mt-5">
//                       {/* Uploading Loaders */}
//                       {[...uploadingFiles].map((fileName) => (
//                         <div
//                           key={fileName}
//                           className="relative w-40 h-36 flex flex-col items-center justify-center border rounded-md bg-gray-50 shadow-sm"
//                         >
//                           <LoaderPage />
//                           <span className="mt-2 text-xs text-gray-500 text-center break-words">
//                             {fileName}
//                           </span>
//                         </div>
//                       ))}

//                       {/* Uploaded Previews */}
//                       {previews.map((file, index) => {
//                         if (!isImage(file.name) && !isVideo(file.name)) return null;

//                         return (
//                           <div
//                             key={file.url || file.name || index}
//                             className="relative w-40 border rounded-md p-2 bg-gray-100 shadow-sm cursor-pointer"
//                             onClick={() => setActivePreview(file)}
//                           >
//                             <button
//                               type="button"
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleRemoveFile(index);
//                               }}
//                               className="absolute top-1 right-1 text-red-600 text-xs bg-white rounded-full px-2 shadow z-10"
//                             >
//                               ✕
//                             </button>

//                             {isImage(file.name) ? (
//                               <img
//                                 src={file.url}
//                                 alt={file.name}
//                                 className="w-full h-28 object-cover rounded"
//                               />
//                             ) : (
//                               <video
//                                 controls
//                                 className="w-full h-28 object-cover rounded"
//                                 onClick={(e) => e.stopPropagation()}
//                               >
//                                 <source src={file.url} type="video/mp4" />
//                                 Your browser does not support the video tag.
//                               </video>
//                             )}
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}

//                   {/* Modal Popup */}
//                   {activePreview && (
//                     <div
//                       className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
//                       onClick={handleModalClose}
//                     >
//                       <div
//                         className="relative max-w-[80vw] max-h-[80vh] p-4 bg-white rounded shadow-lg overflow-hidden"
//                         onClick={(e) => e.stopPropagation()}
//                       >
//                         <button
//                           className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full px-3 py-1 text-lg z-50"
//                           onClick={handleModalClose}
//                         >
//                           ✕
//                         </button>

//                         {isImage(activePreview.name) ? (
//                           <img
//                             src={activePreview.url}
//                             alt={activePreview.name}
//                             className="max-w-full max-h-[75vh] w-auto h-auto rounded"
//                             style={{ display: 'block', margin: '0 auto' }}
//                           />
//                         ) : (
//                           <video
//                             autoPlay
//                             muted
//                             controls
//                             playsInline
//                             className="max-w-full max-h-[75vh] w-auto h-auto rounded"
//                             style={{ display: 'block', margin: '0 auto' }}
//                           >
//                             <source src={activePreview.url} type="video/mp4" />
//                             Your browser does not support the video tag.
//                           </video>
//                         )}
//                       </div>
//                     </div>
//                   )}


//                 </div>

//               </div>
//             )}

//             {decryptedUser?.role === "client" && !isEdit && (
//               <div>
//                 <div>
//                   <label className="block text-sm font-medium text-black mb-2">Attachment</label>
//                   <input
//                     type="file"
//                     multiple
//                     accept="image/*,video/*,application/pdf"
//                     onChange={handleFileChange}
//                     className="w-full h-[90%] border border-orange-500  focus:outline-none focus:ring-2 focus:ring-orange-300 rounded-md px-3 py-2"
//                   />
//                 </div>
               
//                   {(previews.length > 0 || uploadingFiles.size > 0) && (
//                     <div className="flex flex-wrap gap-4 mt-5">
//                       {/* Uploading Loaders */}
//                       {[...uploadingFiles].map((fileName) => (
//                         <div
//                           key={fileName}
//                           className="relative w-40 h-36 flex flex-col items-center justify-center border rounded-md bg-gray-50 shadow-sm"
//                         >
//                           <LoaderPage />
//                           <span className="mt-2 text-xs text-gray-500 text-center break-words">
//                             {fileName}
//                           </span>
//                         </div>
//                       ))}

//                       {/* Uploaded Previews */}
//                       {previews.map((file, index) => {
//                         if (!isImage(file.name) && !isVideo(file.name)) return null;

//                         return (
//                           <div
//                             key={file.url || file.name || index}
//                             className="relative w-40 border rounded-md p-2 bg-gray-100 shadow-sm cursor-pointer"
//                             onClick={() => setActivePreview(file)}
//                           >
//                             <button
//                               type="button"
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleRemoveFile(index);
//                               }}
//                               className="absolute top-1 right-1 text-red-600 text-xs bg-white rounded-full px-2 shadow z-10"
//                             >
//                               ✕
//                             </button>

//                             {isImage(file.name) ? (
//                               <img
//                                 src={file.url}
//                                 alt={file.name}
//                                 className="w-full h-28 object-cover rounded"
//                               />
//                             ) : (
//                               <video
//                                 controls
//                                 className="w-full h-28 object-cover rounded"
//                                 onClick={(e) => e.stopPropagation()}
//                               >
//                                 <source src={file.url} type="video/mp4" />
//                                 Your browser does not support the video tag.
//                               </video>
//                             )}
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}

//                   {/* Modal Popup */}
//                   {activePreview && (
//                     <div
//                       className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
//                       onClick={handleModalClose}
//                     >
//                       <div
//                         className="relative max-w-[80vw] max-h-[80vh] p-4 bg-white rounded shadow-lg overflow-hidden"
//                         onClick={(e) => e.stopPropagation()}
//                       >
//                         <button
//                           className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full px-3 py-1 text-lg z-50"
//                           onClick={handleModalClose}
//                         >
//                           ✕
//                         </button>

//                         {isImage(activePreview.name) ? (
//                           <img
//                             src={activePreview.url}
//                             alt={activePreview.name}
//                             className="max-w-full max-h-[75vh] w-auto h-auto rounded"
//                             style={{ display: 'block', margin: '0 auto' }}
//                           />
//                         ) : (
//                           <video
//                             autoPlay
//                             muted
//                             controls
//                             playsInline
//                             className="max-w-full max-h-[75vh] w-auto h-auto rounded"
//                             style={{ display: 'block', margin: '0 auto' }}
//                           >
//                             <source src={activePreview.url} type="video/mp4" />
//                             Your browser does not support the video tag.
//                           </video>
//                         )}
//                       </div>
//                     </div>
//                   )}

//               </div>
//             )}


//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

//               {isEdit && (
//                 <>
//                   <div>
//                     <label className="block text-sm font-medium text-black mb-2">Manager</label>
//                     <Controller
//                       control={control}
//                       name="Manager"
//                       render={({ field }) => (
//                         <Select {...field} options={ManagerOptions} isClearable styles={SelectStyles} isDisabled={isEdit && decryptedUser?.role.toLowerCase() === "client"} />
//                       )}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-black mb-2">Assignee </label>
//                     <Controller
//                       control={control}
//                       name="Assignee"
//                       render={({ field }) => (
//                         <Select {...field} options={assigneeOptions} isClearable styles={SelectStyles} isDisabled={isEdit && decryptedUser?.role.toLowerCase() === "client"} />
//                       )}
//                     />
//                   </div>
//                 </>
//               )}

//               {isEdit && (
//                 <>
//                   <div>
//                     <label className="block text-sm font-medium text-black mb-2">Customer Impacted </label>
//                     <Controller
//                       control={control}
//                       name="CustomerImpacted"
//                       render={({ field }) => (
//                         <Select {...field} options={CusmoterImpactedOptions} isClearable styles={SelectStyles} isDisabled={isEdit && decryptedUser?.role.toLowerCase() === "client"} />
//                       )}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-black mb-2">Escalated </label>
//                     <Controller
//                       control={control}
//                       name="Escalated"
//                       render={({ field }) => (
//                         <Select {...field} options={CusmoterImpactedOptions} isClearable styles={SelectStyles} isDisabled={isEdit && decryptedUser?.role.toLowerCase() === "client"} />
//                       )}
//                     />
//                   </div>
//                 </>
//               )}

//             </div>

//             {/* Dropdowns ////////////////*/}

//           </div>

//           {/* Manager & Assignee */}

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

//             {isEdit && (
//               <div>
//                 <label className="block text-sm font-medium text-black mb-2">Work Logs <span className="text-red-500">*</span></label>
//                 {previousWlogs && (
//                   <div className="mb-2 p-2 bg-gray-100 border border-gray-300 rounded h-40 overflow-y-auto">
//                     <p className="text-md text-black whitespace-pre-wrap">{previousWlogs}</p>
//                   </div>
//                 )}
//                 <textarea
//                   {...register("WorkLogs")}
//                   placeholder="Add work log entries here..."
//                   rows={4}
//                   className="w-full h-20 border-2 border-orange-300  focus:outline-none focus:ring-2 focus:ring-orange-300  rounded-md px-3 py-2"
//                 />
//               </div>

//             )}
//             <div>


//               {/* Attachment */}
//               {isEdit && (
//                 <>

//                   <div>
//                     <div>
//                       <label className="block text-sm font-medium text-black mb-2">Attachment</label>
//                       <input
//                         type="file"
//                         multiple
//                         accept="image/*,video/*,application/pdf"
//                         onChange={handleFileChange}
//                         className="w-full h-[90%] border border-orange-500  focus:outline-none focus:ring-2 focus:ring-orange-300 rounded-md px-3 py-2"
//                       />
//                     </div>

                
//                   {(previews.length > 0 || uploadingFiles.size > 0) && (
//                     <div className="flex flex-wrap gap-4 mt-5">
//                       {/* Uploading Loaders */}
//                       {[...uploadingFiles].map((fileName) => (
//                         <div
//                           key={fileName}
//                           className="relative w-40 h-36 flex flex-col items-center justify-center border rounded-md bg-gray-50 shadow-sm"
//                         >
//                           <LoaderPage />
//                           <span className="mt-2 text-xs text-gray-500 text-center break-words">
//                             {fileName}
//                           </span>
//                         </div>
//                       ))}

//                       {/* Uploaded Previews */}
//                       {previews.map((file, index) => {
//                         if (!isImage(file.name) && !isVideo(file.name)) return null;

//                         return (
//                           <div
//                             key={file.url || file.name || index}
//                             className="relative w-40 border rounded-md p-2 bg-gray-100 shadow-sm cursor-pointer"
//                             onClick={() => setActivePreview(file)}
//                           >
//                             <button
//                               type="button"
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleRemoveFile(index);
//                               }}
//                               className="absolute top-1 right-1 text-red-600 text-xs bg-white rounded-full px-2 shadow z-10"
//                             >
//                               ✕
//                             </button>

//                             {isImage(file.name) ? (
//                               <img
//                                 src={file.url}
//                                 alt={file.name}
//                                 className="w-full h-28 object-cover rounded"
//                               />
//                             ) : (
//                               <video
//                                 controls
//                                 className="w-full h-28 object-cover rounded"
//                                 onClick={(e) => e.stopPropagation()}
//                               >
//                                 <source src={file.url} type="video/mp4" />
//                                 Your browser does not support the video tag.
//                               </video>
//                             )}
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}

//                   {/* Modal Popup */}
//                   {activePreview && (
//                     <div
//                       className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
//                       onClick={handleModalClose}
//                     >
//                       <div
//                         className="relative max-w-[80vw] max-h-[80vh] p-4 bg-white rounded shadow-lg overflow-hidden"
//                         onClick={(e) => e.stopPropagation()}
//                       >
//                         <button
//                           className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full px-3 py-1 text-lg z-50"
//                           onClick={handleModalClose}
//                         >
//                           ✕
//                         </button>

//                         {isImage(activePreview.name) ? (
//                           <img
//                             src={activePreview.url}
//                             alt={activePreview.name}
//                             className="max-w-full max-h-[75vh] w-auto h-auto rounded"
//                             style={{ display: 'block', margin: '0 auto' }}
//                           />
//                         ) : (
//                           <video
//                             autoPlay
//                             muted
//                             controls
//                             playsInline
//                             className="max-w-full max-h-[75vh] w-auto h-auto rounded"
//                             style={{ display: 'block', margin: '0 auto' }}
//                           >
//                             <source src={activePreview.url} type="video/mp4" />
//                             Your browser does not support the video tag.
//                           </video>
//                         )}
//                       </div>
//                     </div>
//                   )}


//                   </div>
//                 </>
//               )}
//             </div>

//           </div>
//           {/* Buttons */}
//           <div className="flex   gap-4 items-center justify-center">

//             <button
//               type="submit"
//               className={`bg-orange-300 ${isEdit ? "mt-[-10]" : "mt-[-80px]"}  text-white px-6 py-2 rounded hover:bg-orange-400 flex items-center justify-center gap-2`}
//               disabled={isSubmittingBooking || isUpdatingTicket}
//             >
//               {(isSubmittingBooking || isUpdatingTicket) ? (
//                 <>
//                   <LoaderPage size="small" />
//                   {isEdit ? 'Updating...' : 'Creating...'}
//                 </>
//               ) : (
//                 isEdit ? 'Update Ticket' : 'Create'
//               )}
//             </button>



//             <button
//               type="button"
//               onClick={() => setCurrentView("tickets")}
//               className={`border border-gray-300 ${isEdit ? "mt-[-10]" : "mt-[-80px]"} text-black px-6 py-2 rounded hover:bg-gray-10`}
//             >
//               Cancel
//             </button>
//           </div>

//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateEditTicket;

/////////////////////////////////////////////////////////

import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { useApp } from "./AppProvider";
import CryptoJS from "crypto-js";
import { StatusOptions, PriorityOptions, CusmoterImpactedOptions, SelectStyles, SECRET_KEY, Managers, PriorityOptionsForForm } from "../../Config";
import {
  useCreateTicket,
  useDynamicDetails,
  useEmployeeDetails,
  usePropertMasteryData,
  useUpdateTicketSheetData,
} from "./Services";
import { useEffect, useRef, useState } from "react";
import LoaderPage from "../NewBooking/LoaderPage";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const CreateEditTicket = ({ isEdit = false }) => {
      // console.log("isEdit" ,isEdit )
  //  our states and some functions called here ............
  const { setCurrentView, selectedTicket } = useApp();
  const { mutate: submitBooking, isPending: isSubmittingBooking } = useCreateTicket();
  const { mutate: updateTicketData, isPending: isUpdatingTicket } = useUpdateTicketSheetData();
  const { data: DynamicValuesDetails } = useDynamicDetails()

  const { data: EmployeeDetails } = useEmployeeDetails();
  const { data: property } = usePropertMasteryData();
  const [previousWlogs, setPreviousWlogs] = useState("");
  const [previews, setPreviews] = useState([]);
  const [decryptedUser, setDecryptedUser] = useState(null);
  const [activePreview, setActivePreview] = useState(null);

  const isImage = (name) => /\.(jpg|jpeg|png|gif|webp)$/i.test(name);
  const isVideo = (name) => /\.(mp4|webm|avi|mov|mkv)$/i.test(name);

  const handleModalClose = () => setActivePreview(null);

  useEffect(() => {
    setDecryptedUser(decryptUser(localStorage.getItem('user'))); // Just to verify decryption works.........
  }, []);

  const decryptUser = (encryptedData) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Failed to decrypt user:', error);
      return null;
    }
  };

  const selectRef = useRef(null);
  useEffect(() => {
    // Focus the Select component on mount or based on some condition.........
    if (selectRef.current) {
      selectRef.current.focus();
    }
  }, []);


  // here define useForm for react Hook form .................
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    getValues,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      Title: "",
      TicketID: "",
      Description: "",
      Priority: null,
      PropertyCode: null,
      Department: null,
      Category: null,
      Assignee: null,
      Manager: null,
      Status: null,
      Attachment: [],
      WorkLogs: ""
    },
  });

  const CategoryOptions = DynamicValuesDetails?.data
    ?.filter((prop) => prop.Categories) // Ensure Categoryies is present
    .map((prop) => ({
      value: prop.Categories,
      label: prop.Categories,
    })) || [];

  // const DepartmentOptions = DynamicValuesDetails?.data
  //   ?.filter((prop) => prop.Departments) // Ensure Departments is present
  //   .map((prop) => ({
  //     value: prop.Departments,
  //     label: prop.Departments,
  //   })) || [];


    const allowedClientDepartments = ['Maintenance', 'Sales', 'Accounts', 'Housekeeping'];

const DepartmentOptions = DynamicValuesDetails?.data
  ?.filter((prop) => {
    if (!prop.Departments) return false;

    if (decryptedUser?.role?.toLowerCase() === "client") {
      // Only include departments from the allowed list if the user is a client
      return allowedClientDepartments.includes(prop.Departments);
    }

    return true; // For non-client users, include all with Departments
  })
  .map((prop) => ({
    value: prop.Departments,
    label: prop.Departments,
  })) || [];


  // dynamic managersOption define here .........
  const ManagerOptions = EmployeeDetails?.data
    ?.filter(
      (emp) =>
        emp?.Name &&
        Managers.includes(emp?.Designation)
    )
    .map((emp) => ({
      value: emp.Name,
      label: `${emp.Name}`,
    })) || [];

  // dynamic assigneeOptions define here .........
  const assigneeOptions = [
    ...(EmployeeDetails?.data
      ?.filter((emp) => emp?.Name)
      .map((emp) => ({
        value: emp.Name,
        label: `${emp.Name}`,
      })) || [])
  ];

  // dynamic ProperyOptions define here .........
  const ProperyOptions = property?.data?.map((prop) => ({
    value: prop["Property Code"],
    label: prop["Property Code"],
  })) || [];


  // Set default values in edit mode........
  useEffect(() => {
    if (isEdit && selectedTicket) {
      setValue("Title", selectedTicket.Title);
      setValue("TicketID", selectedTicket.TicketID);
      setValue("TargetDate", new Date(selectedTicket.TargetDate).toLocaleDateString('en-CA'));
      setValue("CreatedByName", selectedTicket.CreatedByName);
      setValue("Description", selectedTicket.Description);
      setValue("Priority", PriorityOptions.find((p) => p.value === selectedTicket.Priority));
      setValue("PropertyCode", ProperyOptions.find((p) => p.value === selectedTicket.PropertyCode));
      setValue("Status", StatusOptions.find((s) => s.value === selectedTicket.Status));
      setValue("Department", DepartmentOptions.find((d) => d.value === selectedTicket.Department));
      setValue("Category", CategoryOptions.find((c) => c.value === selectedTicket.Category));
      setValue("Assignee", assigneeOptions.find((u) => u.value === selectedTicket.Assignee));
      setValue("Manager", ManagerOptions.find((u) => u.value === selectedTicket.Manager));
      setValue("CustomerImpacted", CusmoterImpactedOptions.find((u) => u.value === selectedTicket.CustomerImpacted));
      setValue("Escalated", CusmoterImpactedOptions.find((u) => u.value === selectedTicket.Escalated));
      setPreviousWlogs(selectedTicket.WorkLogs || "");
      // Only set previews once if not already set........
      if (selectedTicket.Attachment && previews.length === 0) {
        const attachments = selectedTicket.Attachment.split(',').map((url) => ({
          url,
          type: '', // Optional: derive MIME type......
          name: url.split('/').pop(),
          file: null, // Existing files shouldn't be re-uploaded.....
        }));
        setPreviews(attachments);
      }
    }
  }, [isEdit, selectedTicket, setValue, ProperyOptions, ManagerOptions]);

  useEffect(() => {
    if (decryptedUser?.role?.toLowerCase() === "client") {
      // Find the full option object in ProperyOptions that matches decryptedUser.propertyCode
      const selectedOption = ProperyOptions.find(
        (opt) => opt.value === decryptedUser.propertyCode
      );

      if (selectedOption) {
        setValue("PropertyCode", selectedOption);
      }
    }
    
  }, [decryptedUser, setValue]);


  // const generateUniqueFileName = (originalName) => {
  //   const timestamp = Date.now();
  //   const random = Math.floor(Math.random() * 100000);
  //   const extension = originalName.substring(originalName.lastIndexOf('.') + 1);
  //   const baseName = originalName.substring(0, originalName.lastIndexOf('.')).replace(/\s+/g, '_');
  //   return `${baseName}_${timestamp}_${random}.${extension}`;
  // };

  // const CLOUD_NAME = "dppyl6k4j"; // ✅ Your Cloudinary name
// const CLOUD_NAME = "dppyl6k4j";
// const GOOGLE_DRIVE_FOLDER_ID = "0ADzSPK9dbjmuUk9PVA";

// const generateUniqueFileName = (originalName) => {  
//   const timestamp = Date.now();
//   const random = Math.floor(Math.random() * 1000000);
//   const extension = originalName.split('.').pop();
//   const baseName = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
//   return `${timestamp}_${random}_${baseName}.${extension}`;
// };

// Cloudinary Upload (your existing function)
// const uploadFileToCloudinary = async (file) => {
//   try {
//     const uniqueFileName = generateUniqueFileName(file.name);
//     const folder = 'test';

//     const signResponse = await fetch(
//       `https://gpgs-main-server.vercel.app/api/cloudinary-sign?public_id=${encodeURIComponent(uniqueFileName)}&folder=${encodeURIComponent(folder)}`
//     );

//     if (!signResponse.ok) throw new Error("Failed to get signature");

//     const { signature, timestamp, api_key } = await signResponse.json();

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("api_key", api_key);
//     formData.append("timestamp", timestamp);
//     formData.append("signature", signature);
//     formData.append("public_id", uniqueFileName);
//     formData.append("folder", folder);

//     const resourceType = file.type.startsWith("video") ? "video" : "image";
//     const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;

//     const uploadResponse = await fetch(cloudinaryUrl, {
//       method: "POST",
//       body: formData,
//     });

//     const uploadResult = await uploadResponse.json();

//     if (uploadResponse.ok) {
//       return {
//         url: uploadResult.secure_url,
//         name: uniqueFileName,
//         type: file.type,
//       };
//     } else {
//       console.error("Upload error:", uploadResult);
//       throw new Error("Cloudinary upload failed");
//     }
//   } catch (err) {
//     console.error("Cloudinary Upload Failed:", err);
//     throw err;
//   }
// };

// Google Drive Upload (frontend call to your backend)
// const uploadFileToGoogleDrive = async (file) => {
//   try {
//     const uniqueFileName = generateUniqueFileName(file.name);

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("fileName", uniqueFileName);
//     formData.append("folderId", GOOGLE_DRIVE_FOLDER_ID);

//     const uploadResponse = await fetch(
//       ` http://localhost:3000/google-drive-upload`,
//       {
//         method: "POST",
//         body: formData,
//       }
//     );

//     const uploadResult = await uploadResponse.json();
//          console.log("akash",uploadResult )
//     if (uploadResponse.ok && uploadResult.success) {
//       return {
//         url:uploadResult?.file?.proxyUrl,
//         name: uniqueFileName,
//         type: file.type,
//         driveId: uploadResult?.file?.id
//       };
//     } else {
//       console.error("Google Drive upload error:", uploadResult);
//       throw new Error("Google Drive upload failed");
//     }
//   } catch (err) {
//     console.error("Google Drive Upload Failed:", err);
//     throw err;
//   }
// };

// Your existing state and handler with both options
const [uploadingFiles, setUploadingFiles] = useState(new Set());
// const [previews, setPreviews] = useState([]);

// const handleFileChange = async (e) => {
//   const selectedFiles = Array.from(e.target.files);
//   const maxSize = 100 * 1024 * 1024;
//   const allowedExtensions = /\.(jpg|jpeg|png|gif|webp|pdf|docx|txt|mp4|webm|mov|avi|mkv)$/i;

//   const validFiles = selectedFiles.filter(file =>
//     file.size <= maxSize && allowedExtensions.test(file.name)
//   );

//   if (validFiles.length === 0) {
//     toast.error("No valid files or all are too large.");
//     return;
//   }

//   if (previews.length + validFiles.length > 10) {
//     toast.error("⚠️ You can only upload up to 10 files.");
//     return;
//   }

//   // Add to uploading set
//   setUploadingFiles(prev => {
//     const copy = new Set(prev);
//     validFiles.forEach(file => copy.add(file.name));
//     return copy;
//   });

//   // Choose service (you can make this dynamic)
//   const UPLOAD_SERVICE = 'google-drive'; // or 'cloudinary'

//   const uploadedFiles = await Promise.all(
//     validFiles.map(async (file) => {
//       try {
//         let uploaded;
        
//         if (UPLOAD_SERVICE === 'google-drive') {
//           uploaded = await uploadFileToGoogleDrive(file);
//         } else {
//           uploaded = await uploadFileToCloudinary(file);
//         }
        
//         toast.success(`✅ ${file.name} uploaded to ${UPLOAD_SERVICE}`);
//         return uploaded;
//       } catch (err) {
//         toast.error(`❌ ${file.name} failed to upload`);
//         return null;
//       } finally {
//         setUploadingFiles(prev => {
//           const copy = new Set(prev);
//           copy.delete(file.name);
//           return copy;
//         });
//       }
//     })
//   );

//   const successfulUploads = uploadedFiles.filter(Boolean);
//   setPreviews(prev => [...prev, ...successfulUploads]);
//    console.log(111111, successfulUploads)
//   // Save URLs to your form state or database
//   setValue("Attachment", [...(watch("Attachment") || []), ...successfulUploads.map(f => f.url)]);
  
//   // Optional: Save to your database immediately
//   // await saveToDatabase(successfulUploads);
// };

// Function to save URLs to your database
// const saveToDatabase = async (uploadedFiles) => {
//   try {
//     const response = await fetch('http://localhost:3000/api/save-attachments', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         files: uploadedFiles,
//         ticketId: 'your-ticket-id', // Pass your ticket ID
//       }),
//     });

//     if (response.ok) {
//       console.log('File URLs saved to database');
//     }
//   } catch (error) {
//     console.error('Failed to save to database:', error);
//   }
// };


  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    // Max size check
    const maxSize = 100 * 1024 * 1024; // 5MB
    const oversizedFiles = selectedFiles.filter(file => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      toast.dismiss();
      toast.error(`⚠️ Some files are larger than 5 MB and were not added.`);
    }

    // Filter valid files (by size)
    const validFiles = selectedFiles.filter(file => file.size <= maxSize);

    // ✅ Add video extensions here
    const allowedExtensions = /\.(jpg|jpeg|png|gif|webp|pdf|docx|txt|mp4|webm|mov|avi|mkv)$/i;

    // Filter previews and files by extension
    const filteredPreviews = previews.filter(file => allowedExtensions.test(file.name));
    const filteredValidFiles = validFiles.filter(file => allowedExtensions.test(file.name));

    // Check max file count
    const totalFiles = filteredPreviews.length + filteredValidFiles.length;
    if (totalFiles > 5) {
      toast.dismiss();
      toast.error("⚠️ You can only upload up to 5 files.");
      return;
    }

    console.log("filteredValidFiles" , filteredValidFiles)
    // Generate new previews with unique names
    const newPreviews = filteredValidFiles.map((file) => {
      const uniquePrefix = Math.floor(100000 + Math.random() * 900000); // Random 6-digit number
      const newName = `${uniquePrefix}-${file.name}`;

      const renamedFile = new File([file], newName, { type: file.type });

      return {
        url: URL.createObjectURL(file),
        type: file.type,
        name: newName,
        file: renamedFile,
      };
    });

    // Update preview state
    const updatedPreviews = [...previews, ...newPreviews];
    setPreviews(updatedPreviews);

    // Set final value for form submission
    setValue("Attachment", updatedPreviews.map((item) => item.file));
  };

  const handleRemoveFile = (index) => {
    const updated = previews.filter((_, i) => i !== index);
    setPreviews(updated);
    setValue("Attachment", updated.map((item) => item.file));
  };
  // for timeStap function  .............
  function getFormattedTimestamp() {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, '0');
    const month = now.toLocaleString('en-US', { month: 'short' }); // "Sep"
    const year = now.getFullYear();

    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';

    hours = hours % 12;
    hours = hours ? hours : 12; // 0 → 12

    return `${day} ${month} ${year} ${hours}:${minutes}${ampm}`;
  }
  function getFormattedTimestampForTargetDate(dateStr) {
    const date = new Date(dateStr); // Convert string to Date object

    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' }); // "Sep"
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  }

  function Timestamp() {
    const now = new Date();
    return `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
  }
  const isValidDate = (date) => {
    const parsedDate = new Date(date);
    return parsedDate instanceof Date && !isNaN(parsedDate);
  };

  const onSubmit = (data) => {
    const currentTimestamp = getFormattedTimestamp();

    // Format WorkLogs
    const newWorkLogEntry = data.WorkLogs
      ? `[${currentTimestamp} - ${decryptedUser?.name}]  ${data.WorkLogs.trim()}`
      : "";

    const statusValue = isEdit ? data.Status?.value || "" : "Open";
    const isStatusChanged = isEdit && selectedTicket?.Status !== data.Status?.value;

    // Compose WorkLogs
    let updatedWorkLogs = "";
    if (isStatusChanged) {
      const statusChangeLog = `[${currentTimestamp} - ${decryptedUser?.name}] Status changed from ${selectedTicket.Status} to ${data.Status?.value}`;
      updatedWorkLogs += statusChangeLog;
    }
    if (newWorkLogEntry) {
      updatedWorkLogs += `${updatedWorkLogs ? "\n\n" : ""}${newWorkLogEntry}`;
    }
    if (previousWlogs) {
      updatedWorkLogs += `${updatedWorkLogs ? "\n\n" : ""}${previousWlogs}`;
    }

    // Format data before sending
    const formattedData = {
      ...data,
      Priority: data.Priority?.value || "",
      PropertyCode: data.PropertyCode?.value || "",
      Department: data.Department?.value || "",
      Category: data.Category?.value || "",
      Assignee: data.Assignee?.value || "",
      Manager: data.Manager?.value || "",
      TargetDate: isValidDate(data.TargetDate)
        ? getFormattedTimestampForTargetDate(data.TargetDate)
        : "N/A",
      Status: statusValue,
      CustomerImpacted: data.CustomerImpacted?.value || "",
      Escalated: data.Escalated?.value || "",
      WorkLogs: updatedWorkLogs || "",
      // CreatedByName: decryptedUser?.name || "Unknown",
      // CreatedById: selectedTicket?.CreatedById || "Unknown",
      ClosedDate: statusValue === "Closed" ? Timestamp() : "",
      ...(isEdit
        ? {
          UpdatedByName: decryptedUser?.name || "Unknown",
          UpdatedById: decryptedUser?.clientID || decryptedUser?.id || "Unknown",
          UpdatedDateTime: Timestamp(),
          Attachment: previews.map(ele => ele.url),
          CreatedById: selectedTicket?.CreatedById || "Unknown",
          CreatedBy: selectedTicket?.CreatedBy || "Unknown",

        }
        : {
          CreatedByName: decryptedUser?.name || "Unknown",
          CreatedById: decryptedUser?.clientID || decryptedUser?.id || "Unknown",
          CreatedBy: decryptedUser?.role.charAt(0).toUpperCase() + decryptedUser?.role.slice(1).toLowerCase() || "Unknown",
        }),
    };


    const formData = new FormData();
    // 🔁 Append non-file data to FormData
    for (const key in formattedData) {
      const value = formattedData[key];

      // Skip appending 'images' key (handled separately)
      if (key === "images") continue;

      // Stringify objects (selects, nested fields)
      if (
        typeof value === "object" &&
        value !== null &&
        !(value instanceof File)
      ) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value ?? "");
      }
    }

    // 📸 Append each image file
    previews.forEach((file) => {
      formData.append("images", file.file);

    });

    // ✅ Submit
    const submissionFn = isEdit && selectedTicket ? updateTicketData : submitBooking;

    submissionFn(formData, {
      onSuccess: () => {
        toast.success(`Ticket ${isEdit ? "updated" : "created"} successfully!`);
        // toast.error("Error message!");
        reset();
        setCurrentView("tickets");
      },
    });

    // 🔍 If you want to inspect formData manually:
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
  };


  // const onSubmit = (data) => {
  //   const currentTimestamp = getFormattedTimestamp();

  //   const newWorkLogEntry = data.WorkLogs
  //     ? `[${currentTimestamp} - ${decryptedUser?.name}]  ${data.WorkLogs.trim()}`
  //     : "";

  //   const statusValue = isEdit ? data.Status?.value || "" : "Open";
  //   const isStatusChanged = isEdit && selectedTicket?.Status !== data.Status?.value;

  //   let updatedWorkLogs = "";
  //   if (isStatusChanged) {
  //     const statusChangeLog = `[${currentTimestamp} - ${decryptedUser?.name}] Status changed from ${selectedTicket.Status} to ${data.Status?.value}`;
  //     updatedWorkLogs += statusChangeLog;
  //   }
  //   if (newWorkLogEntry) {
  //     updatedWorkLogs += `${updatedWorkLogs ? "\n\n" : ""}${newWorkLogEntry}`;
  //   }
  //   if (previousWlogs) {
  //     updatedWorkLogs += `${updatedWorkLogs ? "\n\n" : ""}${previousWlogs}`;
  //   }

  //   const formattedData = {
  //     ...data,
  //     Priority: data.Priority?.value || "",
  //     PropertyCode: data.PropertyCode?.value || "",
  //     Department: data.Department?.value || "",
  //     Category: data.Category?.value || "",
  //     Assignee: data.Assignee?.value || "",
  //     Manager: data.Manager?.value || "",
  //     TargetDate: isValidDate(data.TargetDate)
  //       ? getFormattedTimestampForTargetDate(data.TargetDate)
  //       : "N/A",
  //     Status: statusValue,
  //     CustomerImpacted: data.CustomerImpacted?.value || "",
  //     Escalated: data.Escalated?.value || "",
  //     WorkLogs: updatedWorkLogs || "",
  //     Attachment: data.Attachment, // ✅ Cloudinary URLs
  //     ...(isEdit
  //       ? {
  //         UpdatedByName: decryptedUser?.name || "Unknown",
  //         UpdatedById: decryptedUser?.clientID || decryptedUser?.id || "Unknown",
  //         UpdatedDateTime: Timestamp(),
  //         CreatedById: selectedTicket?.CreatedById || "Unknown",
  //         CreatedBy: selectedTicket?.CreatedBy || "Unknown",
  //         Attachment: previews.map(ele => ele.url),


  //       }
  //       : {
  //         CreatedByName: decryptedUser?.name || "Unknown",
  //         CreatedById: decryptedUser?.clientID || decryptedUser?.id || "Unknown",
  //         CreatedBy: decryptedUser?.role.charAt(0).toUpperCase() + decryptedUser?.role.slice(1).toLowerCase() || "Unknown",
  //       }),
  //   };

  //   const formData = new FormData();
  //   for (const key in formattedData) {
  //     const value = formattedData[key];
  //     formData.append(key, typeof value === "object" ? JSON.stringify(value) : value ?? "");
  //   }

  //   const submissionFn = isEdit && selectedTicket ? updateTicketData : submitBooking;

  //   submissionFn(formData, {
  //     onSuccess: () => {
  //       toast.success(`Ticket ${isEdit ? "updated" : "created"} successfully!`);
  //       reset();
  //       setCurrentView("tickets");
  //     },
  //   });
  // };

useEffect(() => {
  if (!isEdit) {
    const currentPropertyCode = getValues("PropertyCode"); // get current PropertyCode

    reset({
      PropertyCode: currentPropertyCode, // preserve PropertyCode
      // all other fields will be reset to their default values
    });
    if(decryptedUser?.role !== "client"){
      setValue("PropertyCode" , "")
    }
    setValue("Title" , "")
    setValue("Description" , "")
    setValue("Manager" , "")
    setValue("Priority" , "")
    setValue("CustomerImpacted" , "")
    setValue("Escalated" , "")
    setValue("Attachment" , "")
    setValue("Description" , "")
    setValue("Department" , "")
    setValue("Assignee" , "")
    setValue("Category" , "")
    setValue("Description" , "")
    setPreviousWlogs("");
    setPreviews([]);
  }
}, [isEdit, reset, getValues, setPreviousWlogs, setPreviews]);




  if (isEdit && decryptedUser?.role.toLowerCase() === "client") {
    return <>
      <div className="">
        <h2 className="text-2xl font-bold text-gray-900 ml-5">
          {isEdit ? (
            <h1>View & Edit Ticket : {selectedTicket?.TicketID}</h1>
          ) : (
            <div className="lg:flex   items-center gap-5">
              <h1>Create New Ticket</h1>
              {decryptedUser?.role.toLowerCase().toLowerCase() === "client" && (
                <p className="text-orange-500 text-sm lg:text-lg">Kindly submit a new ticket for any maintenance requests, housekeeping services, notice to vacate, rent receipts, rental agreements, full and final settlements, or electricity bill-related concerns</p>
              )}
            </div>
          )}

        </h2>
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Property Code, Title */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {isEdit == "klsdfhl" && (
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Ticket ID</label>
                  <input
                    {...register("TicketID", { required: true })}
                    disabled
                    className="w-full border border-orange-300 rounded-md px-3 py-2"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-black mb-2">Property Code <span className="text-red-500">*</span></label>
                <Controller
                  control={control}
                  name="PropertyCode"
                  rules={{ required: "Property Code Required" }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Select
                        ref={selectRef}
                        {...field}
                        options={ProperyOptions}
                        styles={SelectStyles}
                        isClearable
                        placeholder="Search & Select Property Code"
                        isDisabled={decryptedUser?.role.toLowerCase() === "client" || isEdit && decryptedUser?.role.toLowerCase() !== "client"}
                      // isDisabled={isEdit}
                      />

                      {error && <p className="text-red-500 text-sm">{error.message}</p>}
                    </>
                  )}
                />
              </div>

              {[
                { name: "Department", options: DepartmentOptions, placeholder: "Search & Select Department" },
                { name: "Category", options: CategoryOptions, placeholder: "Search &  Select Category" },
                ...(isEdit && decryptedUser?.role.toLowerCase() === "client"
                  ? []
                  : [{ name: "Priority", options: PriorityOptions, placeholder: " Select Priority" }]),
                ...(decryptedUser?.role.toLowerCase() === "admin"
                  ? [{ name: "Priority", options: PriorityOptions, placeholder: "Search & Select Priority" }]
                  : []),
              ].map(({ name, options, placeholder }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-black mb-2">{name} <span className="text-red-500">*</span></label>
                  <Controller
                    control={control}
                    name={name}
                    rules={{
                      required:
                        name === "Priority" && decryptedUser?.role.toLowerCase() === "client"
                          ? false
                          : `${name} is required`,
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <Select {...field} options={options} styles={SelectStyles} placeholder={placeholder} isClearable isDisabled={isEdit && decryptedUser?.role.toLowerCase() === "client"} />
                        {error && <p className="text-red-500 text-sm">{error.message}</p>}
                      </>
                    )}
                  />
                </div>
              ))}



              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("Title", { required: "Title is required" })}
                  disabled={isEdit && decryptedUser?.role.toLowerCase() === "client"}
                  className={`w-full border ${isEdit ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                    } border-orange-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300`}
                  placeholder="Enter Title"
                />
                {errors.Title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.Title.message}
                  </p>
                )}
              </div>

              {isEdit && (
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    control={control}
                    name="Status"
                    rules={{ required: "Status is required" }}
                    render={({ field, fieldState: { error } }) => {
                      const isClient = decryptedUser?.role.toLowerCase() === "client";
                      const isResolved = selectedTicket.Status === "Resolved";
                      const showOnlyReopen = isEdit && isClient && isResolved;

                      const filteredOptions = showOnlyReopen
                        ? StatusOptions.filter((option) => option.value === "Re-Open")
                        : StatusOptions;

                      return (
                        <>
                          <Select
                            {...field}
                            options={filteredOptions}
                            styles={SelectStyles}
                            isClearable
                            isDisabled={isEdit && decryptedUser?.role.toLowerCase() === "client" && selectedTicket.Status !== "Resolved"}
                          />
                          {error && <p className="text-red-500 text-sm">{error.message}</p>}
                        </>
                      );
                    }}
                  />
                </div>
              )}

              {!isEdit && decryptedUser?.role.toLowerCase() !== "client" && (<>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Manager</label>
                  <Controller
                    control={control}
                    name="Manager"
                    render={({ field }) => (
                      <Select {...field} placeholder="Search & Select " options={ManagerOptions} isClearable styles={SelectStyles} isDisabled={isEdit && decryptedUser?.role.toLowerCase() === "client"} />
                    )}

                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Assignee </label>
                  <Controller
                    control={control}
                    name="Assignee"
                    render={({ field }) => (
                      <Select {...field} placeholder="Search & Select " options={assigneeOptions} isClearable styles={SelectStyles} isDisabled={isEdit && decryptedUser?.role.toLowerCase() === "client"}
                      />
                    )}
                  />
                </div>
              </>
              )

              }
              {/* {isEdit && (
              <div>
                <label className="block text-sm font-medium text-black mb-2">Status <span className="text-red-500">*</span></label>
                <Controller
                  control={control}
                  name="Status"
                  rules={{ required: "Status is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Select {...field} options={StatusOptions} styles={SelectStyles} isClearable isDisabled={isEdit && decryptedUser?.role.toLowerCase() === "client"} />
                      {error && <p className="text-red-500 text-sm">{error.message}</p>}
                    </>
                  )}

                />
              </div>
            )} */}
              {decryptedUser?.role.toLowerCase() !== "client" && (
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Target Date
                  </label>
                  <Controller
                    control={control}
                    name="TargetDate"
                    defaultValue=""
                    render={({ field }) => (
                      <div className="relative w-full">
                        <input
                          type="date"
                          {...field}
                          value={field.value || ""}
                          disabled={isEdit}
                          className="w-full border border-orange-500 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                        />
                        {field.value && (
                          <button
                            type="button"
                            onClick={() => field.onChange("")}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-600"
                          >
                            &#10005;
                          </button>
                        )}
                      </div>
                    )}
                  />
                </div>
              )}


              {/* {isEdit && (
              <div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Created By <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("CreatedByName", { required: "Created By Name is required" })}
                    disabled={isEdit}
                    className={`w-full border ${isEdit ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                      } border-orange-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300`}
                    placeholder="Enter Created By Name"
                  />
                  {errors.Title && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.Title.message}
                    </p>
                  )}
                </div>
              </div>
            )} */}
            </div>

            {/* Description */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              <div>
                <label className="block text-sm font-medium text-black mb-2">Description <span className="text-red-500">*</span></label>
                <textarea
                  {...register("Description", { required: "Description is required" })}
                  rows={4}
                  disabled={isEdit}
                  placeholder="Enter Your Description here"
                  className="w-full h-[150px] border border-orange-500  focus:outline-none focus:ring-2 focus:ring-orange-300 rounded-md px-3 py-2"
                />
                {errors.Description && (
                  <p className="text-red-500 text-sm">{errors.Description.message}</p>
                )}

              </div>
              {isEdit && (

                <div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Attachment</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*,application/pdf"
                      onChange={handleFileChange}
                      className="w-full h-[90%] border border-orange-500  focus:outline-none focus:ring-2 focus:ring-orange-300 rounded-md px-3 py-2"
                    />
                  </div>

                  {(previews.length > 0 || uploadingFiles.size > 0) && (
                    <div className="flex flex-wrap gap-4 mt-5">
                      {/* Uploading Loaders */}
                      {[...uploadingFiles].map((fileName) => (
                        <div
                          key={fileName}
                          className="relative w-40 h-36 flex flex-col items-center justify-center border rounded-md bg-gray-50 shadow-sm"
                        >
                          <LoaderPage />
                          <span className="mt-2 text-xs text-gray-500 text-center break-words">
                            {fileName}
                          </span>
                        </div>
                      ))}

                      {/* Uploaded Previews */}
                      {previews.map((file, index) => {

                        console.log("file", file)
                        if (!isImage(file.name) && !isVideo(file.name)) return null;

                        return (
                          <div
                            key={file.url || file.name || index}
                            className="relative w-40 border rounded-md p-2 bg-gray-100 shadow-sm cursor-pointer"
                            onClick={() => setActivePreview(file)}
                          >
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFile(index);
                              }}
                              className="absolute top-1 right-1 text-red-600 text-xs bg-white rounded-full px-2 shadow z-10"
                            >
                              ✕
                            </button>

                            {isImage(file.name) ? (
                              <img
                                src={file.url}
                                alt={file.name}
                                className="w-full h-28 object-cover rounded"
                              />
                            ) : (
                              <video
                                controls
                                className="w-full h-28 object-cover rounded"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <source src={file.url} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Modal Popup */}
                  {activePreview && (
                    <div
                      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
                      onClick={handleModalClose}
                    >
                      <div
                        className="relative max-w-[80vw] max-h-[80vh] p-4 bg-white rounded shadow-lg overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full px-3 py-1 text-lg z-50"
                          onClick={handleModalClose}
                        >
                          ✕
                        </button>

                        {isImage(activePreview.name) ? (
                          <img
                            src={activePreview.url}
                            alt={activePreview.name}
                            className="max-w-full max-h-[75vh] w-auto h-auto rounded"
                            style={{ display: 'block', margin: '0 auto' }}
                          />
                        ) : (
                          <video
                            autoPlay
                            muted
                            controls
                            playsInline
                            className="max-w-full max-h-[75vh] w-auto h-auto rounded"
                            style={{ display: 'block', margin: '0 auto' }}
                          >
                            <source src={activePreview.url} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              )}


              {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {isEdit && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Manager</label>
                    <Controller
                      control={control}
                      name="Manager"
                      render={({ field }) => (
                        <Select {...field} options={ManagerOptions} isClearable styles={SelectStyles} isDisabled={isEdit && decryptedUser?.role.toLowerCase() === "client"} />
                      )}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Assignee </label>
                    <Controller
                      control={control}
                      name="Assignee"
                      render={({ field }) => (
                        <Select {...field} options={assigneeOptions} isClearable styles={SelectStyles} isDisabled={isEdit && decryptedUser?.role.toLowerCase() === "client"} />
                      )}
                    />
                  </div>
                </>
              )}

              {isEdit && (
                <>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Customer Impacted </label>
                    <Controller
                      control={control}
                      name="CustomerImpacted"
                      render={({ field }) => (
                        <Select {...field} options={CusmoterImpactedOptions} isClearable styles={SelectStyles} isDisabled={isEdit && decryptedUser?.role.toLowerCase() === "client"} />
                      )}
                    />
                  </div>


                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Escalated </label>
                    <Controller
                      control={control}
                      name="Escalated"
                      render={({ field }) => (
                        <Select {...field} options={CusmoterImpactedOptions} isClearable styles={SelectStyles} isDisabled={isEdit && decryptedUser?.role.toLowerCase() === "client"} />
                      )}
                    />
                  </div>
                </>
              )}

            </div> */}

              {/* Dropdowns ////////////////*/}

            </div>

            {/* Manager & Assignee */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {isEdit && (
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Work Logs <span className="text-red-500">*</span></label>
                  {previousWlogs && (
                    <div className="mb-2 p-2 bg-gray-100 border border-gray-300 rounded h-32 overflow-y-auto">
                       <p className="text-sm text-black whitespace-pre-wrap">{previousWlogs}</p>
                    </div>
                  )}
                  <textarea
                    {...register("WorkLogs")}
                    placeholder="Add work log entries here..."
                    rows={4}
                    className="w-full h-20 border border-orange-500  focus:outline-none focus:ring-2 focus:ring-orange-300  rounded-md px-3 py-2"
                  />
                </div>

              )}
              <div>


                {/* Attachment */}

              </div>

            </div>
            {/* Buttons */}
            <div className="flex   gap-4 items-center justify-center">

              <button
                type="submit"
                className={`bg-orange-300 ${isEdit ? "mt-[-10]" : "mt-[-80px]"}  text-white px-6 py-2 rounded hover:bg-orange-400 flex items-center justify-center gap-2`}
                disabled={isSubmittingBooking || isUpdatingTicket}
              >
                {(isSubmittingBooking || isUpdatingTicket) ? (
                  <>
                    <LoaderPage size="small" />
                    {isEdit ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  isEdit ? 'Update Ticket' : 'Create'
                )}
              </button>
              <button
                type="button"
                onClick={() => setCurrentView("tickets")}
                className={`border border-gray-300 ${isEdit ? "mt-[-10]" : "mt-[-80px]"} text-black px-6 py-2 rounded hover:bg-gray-10`}
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  }

  return (
    <div className="">
      <div className="ml-5">
        {isEdit ? (
          <h2 className="text-2xl font-bold text-gray-900">
            View & Edit Ticket: {selectedTicket?.TicketID}
          </h2>
        ) : (
          <div className="flex flex-col justify-start">
            <h2 className="text-2xl font-bold text-gray-900">Create New Ticket</h2>
            {decryptedUser?.role?.toLowerCase() === "client" && (
              <p className="text-orange-500 text-sm lg:text-[14px] mt-1">
                Kindly submit a new ticket for any maintenance requests, housekeeping services, notice to vacate, rent receipts, rental agreements, full and final settlements, or electricity bill-related concerns etc.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Property Code, Title */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {isEdit == "klsdfhl" && (
              <div>
                <label className="block text-sm font-medium text-black mb-2">Ticket ID</label>
                <input
                  {...register("TicketID", { required: true })}
                  disabled
                  className="w-full border border-orange-300 rounded-md px-3 py-2"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-black mb-2">Property Code <span className="text-red-500">*</span></label>
              <Controller
                control={control}
                name="PropertyCode"
                rules={{ required: "Property Code Required" }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Select
                      ref={selectRef}
                      {...field}
                      options={ProperyOptions}
                      styles={SelectStyles}
                      isClearable
                      placeholder="Search & Select"
                      isDisabled={decryptedUser?.role.toLowerCase() === "client" || isEdit && decryptedUser?.role.toLowerCase() !== "client"}
                    // isDisabled={isEdit}
                    />
                    {error && <p className="text-red-500 text-sm">{error.message}</p>}
                  </>
                )}
              />
            </div>

            {[
              { name: "Department", options: DepartmentOptions, placeholder: "Search & Select" },
              { name: "Category", options: CategoryOptions, placeholder: "Search &  Select" },
              ...(isEdit && decryptedUser?.role.toLowerCase() === "client"
                ? [{ name: "Priority", options: PriorityOptionsForForm, placeholder: "Search & Select" }]
                : []),
              ...(decryptedUser?.role.toLowerCase() === "admin"
                ? [{ name: "Priority", options: PriorityOptionsForForm, placeholder: "Search & Select" }]
                : []),
            ].map(({ name, options, placeholder }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-black mb-2">{name} <span className="text-red-500">*</span></label>
                <Controller
                  control={control}
                  name={name}
                  rules={{
                    required:
                      name === "Priority" && decryptedUser?.role.toLowerCase() === "client" || name === "Priority" && decryptedUser?.role.toLowerCase() === "admin"
                        ? false
                        : `${name} is required`,
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Select {...field} options={options} styles={SelectStyles} placeholder={placeholder} isClearable isDisabled={isEdit && decryptedUser?.role.toLowerCase() === "client"} />
                      {error && <p className="text-red-500 text-sm">{error.message}</p>}
                    </>
                  )}
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                {...register("Title", { required: "Title is required" })}
                disabled={isEdit}
                className={`w-full border ${isEdit ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                  } border-orange-300 border-2 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300`}
                placeholder="Enter Title"
              />
              {errors.Title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.Title.message}
                </p>
              )}
            </div>
            {decryptedUser?.role.toLowerCase() !== "client" && !isEdit && (<>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Manager</label>
                <Controller
                  control={control}
                  name="Manager"
                  render={({ field }) => (
                    <Select {...field} placeholder="Search & Select " options={ManagerOptions} isClearable styles={SelectStyles} isDisabled={isEdit && decryptedUser?.role.toLowerCase() === "client"} />
                  )}

                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Assignee </label>
                <Controller
                  control={control}
                  name="Assignee"
                  render={({ field }) => (
                    <Select {...field} placeholder="Search & Select " options={assigneeOptions} isClearable styles={SelectStyles} isDisabled={isEdit && decryptedUser?.role.toLowerCase() === "client"}
                    />
                  )}
                />
              </div>
            </>
            )

            }
            {isEdit && (
              <div>
                <label className="block text-sm font-medium text-black mb-2">Status <span className="text-red-500">*</span></label>
                <Controller
                  control={control}
                  name="Status"
                  rules={{ required: "Status is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Select {...field} options={StatusOptions} styles={SelectStyles} isClearable isDisabled={isEdit && decryptedUser?.role.toLowerCase() === "client"} />
                      {error && <p className="text-red-500 text-sm">{error.message}</p>}
                    </>
                  )}

                />
              </div>
            )}
            {decryptedUser?.role.toLowerCase() !== "client" && (
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Target Date
                </label>
                <Controller
                  control={control}
                  name="TargetDate"
                  defaultValue=""
                  render={({ field }) => (
                    <div className="relative w-full">
                      <input
                        type="date"
                        {...field}
                        value={field.value || ""}
                        disabled={isEdit && decryptedUser?.role.toLowerCase() === "client"}
                        className="w-full  border-orange-300 border-2 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                      />
                      {field.value && (
                        <button
                          type="button"
                          onClick={() => field.onChange("")}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-600"
                        >
                          &#10005;
                        </button>
                      )}
                    </div>
                  )}
                />
              </div>
            )}


            {isEdit && (
              <div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Created By <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("CreatedByName", { required: "Created By Name is required" })}
                    disabled={isEdit}
                    className={`w-full border-2 ${isEdit ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                      } border-orange-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300`}
                    placeholder="Enter Created By Name"
                  />
                  {errors.Title && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.Title.message}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <div>
              <label className="block text-sm font-medium text-black mb-2">Description <span className="text-red-500">*</span></label>
              <textarea
                {...register("Description", { required: "Description is required" })}
                rows={4}
                disabled={isEdit}
                placeholder="Enter Your Description here"
                className="w-full h-[150px] border-2 border-orange-300  focus:outline-none focus:ring-2 focus:ring-orange-300 rounded-md px-3 py-2"
              />
              {errors.Description && (
                <p className="text-red-500 text-sm">{errors.Description.message}</p>
              )}

            </div>





            {decryptedUser?.role?.toLowerCase() !== "client" && !isEdit && (
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Customer Impacted </label>
                  <Controller
                    control={control}
                    name="CustomerImpacted"
                    render={({ field }) => (
                      <Select {...field} options={CusmoterImpactedOptions} isClearable styles={SelectStyles} isDisabled={isEdit && decryptedUser?.role.toLowerCase() === "client"} />
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Escalated </label>
                  <Controller
                    control={control}
                    name="Escalated"
                    render={({ field }) => (
                      <Select {...field} options={CusmoterImpactedOptions} isClearable styles={SelectStyles} isDisabled={isEdit && decryptedUser?.role.toLowerCase() === "client"} />
                    )}
                  />
                </div>

                <div className="col-span-2">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Attachment</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*,application/pdf"
                      onChange={handleFileChange}
                      className="w-full h-[90%] border border-orange-500  focus:outline-none focus:ring-2 focus:ring-orange-300 rounded-md px-3 py-2"
                    />
                  </div>

                
                  {(previews.length > 0 || uploadingFiles.size > 0) && (
                    <div className="flex flex-wrap gap-4 mt-5">
                      {/* Uploading Loaders */}
                      {[...uploadingFiles].map((fileName) => (
                        <div
                          key={fileName}
                          className="relative w-40 h-36 flex flex-col items-center justify-center border rounded-md bg-gray-50 shadow-sm"
                        >
                          <LoaderPage />
                          <span className="mt-2 text-xs text-gray-500 text-center break-words">
                            {fileName}
                          </span>
                        </div>
                      ))}

                      {/* Uploaded Previews */}
                      {previews.map((file, index) => {

                        console.log("file" , file)
                        if (!isImage(file.name) && !isVideo(file.name)) return null;

                        return (
                          <div
                            key={file.url || file.name || index}
                            className="relative w-40 border rounded-md p-2 bg-gray-100 shadow-sm cursor-pointer"
                            onClick={() => setActivePreview(file)}
                          >
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFile(index);
                              }}
                              className="absolute top-1 right-1 text-red-600 text-xs bg-white rounded-full px-2 shadow z-10"
                            >
                              ✕
                            </button>

                            {isImage(file.name) ? (
                              <img
                                src={file?.url}
                                alt={file.name}
                                className="w-full h-28 object-cover rounded"
                              />
                            ) : (
                              <video
                                controls
                                className="w-full h-28 object-cover rounded"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <source src={file.url} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Modal Popup */}
                  {activePreview && (
                    <div
                      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
                      onClick={handleModalClose}
                    >
                      <div
                        className="relative max-w-[80vw] max-h-[80vh] p-4 bg-white rounded shadow-lg overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full px-3 py-1 text-lg z-50"
                          onClick={handleModalClose}
                        >
                          ✕
                        </button>

                        {isImage(activePreview.name) ? (
                          <img
                            src={activePreview.url}
                            alt={activePreview.name}
                            className="max-w-full max-h-[75vh] w-auto h-auto rounded"
                            style={{ display: 'block', margin: '0 auto' }}
                          />
                        ) : (
                          <video
                            autoPlay
                            muted
                            controls
                            playsInline
                            className="max-w-full max-h-[75vh] w-auto h-auto rounded"
                            style={{ display: 'block', margin: '0 auto' }}
                          >
                            <source src={activePreview.url} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        )}
                      </div>
                    </div>
                  )}


                </div>

              </div>
            )}

            {decryptedUser?.role === "client" && !isEdit && (
              <div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Attachment</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*,application/pdf"
                    onChange={handleFileChange}
                    className="w-full h-[90%] border border-orange-500  focus:outline-none focus:ring-2 focus:ring-orange-300 rounded-md px-3 py-2"
                  />
                </div>
               
                  {(previews.length > 0 || uploadingFiles.size > 0) && (
                    <div className="flex flex-wrap gap-4 mt-5">
                      {/* Uploading Loaders */}
                      {[...uploadingFiles].map((fileName) => (
                        <div
                          key={fileName}
                          className="relative w-40 h-36 flex flex-col items-center justify-center border rounded-md bg-gray-50 shadow-sm"
                        >
                          <LoaderPage />
                          <span className="mt-2 text-xs text-gray-500 text-center break-words">
                            {fileName}
                          </span>
                        </div>
                      ))}

                      {/* Uploaded Previews */}
                      {previews.map((file, index) => {
                        if (!isImage(file.name) && !isVideo(file.name)) return null;

                        return (
                          <div
                            key={file.url || file.name || index}
                            className="relative w-40 border rounded-md p-2 bg-gray-100 shadow-sm cursor-pointer"
                            onClick={() => setActivePreview(file)}
                          >
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFile(index);
                              }}
                              className="absolute top-1 right-1 text-red-600 text-xs bg-white rounded-full px-2 shadow z-10"
                            >
                              ✕
                            </button>

                            {isImage(file.name) ? (
                              <img
                                src={file.url}
                                alt={file.name}
                                className="w-full h-28 object-cover rounded"
                              />
                            ) : (
                              <video
                                controls
                                className="w-full h-28 object-cover rounded"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <source src={file.url} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Modal Popup */}
                  {activePreview && (
                    <div
                      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
                      onClick={handleModalClose}
                    >
                      <div
                        className="relative max-w-[80vw] max-h-[80vh] p-4 bg-white rounded shadow-lg overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full px-3 py-1 text-lg z-50"
                          onClick={handleModalClose}
                        >
                          ✕
                        </button>

                        {isImage(activePreview.name) ? (
                          <img
                            src={activePreview.url}
                            alt={activePreview.name}
                            className="max-w-full max-h-[75vh] w-auto h-auto rounded"
                            style={{ display: 'block', margin: '0 auto' }}
                          />
                        ) : (
                          <video
                            autoPlay
                            muted
                            controls
                            playsInline
                            className="max-w-full max-h-[75vh] w-auto h-auto rounded"
                            style={{ display: 'block', margin: '0 auto' }}
                          >
                            <source src={activePreview.url} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        )}
                      </div>
                    </div>
                  )}

              </div>
            )}


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {isEdit && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Manager</label>
                    <Controller
                      control={control}
                      name="Manager"
                      render={({ field }) => (
                        <Select {...field} options={ManagerOptions} isClearable styles={SelectStyles} isDisabled={isEdit && decryptedUser?.role.toLowerCase() === "client"} />
                      )}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Assignee </label>
                    <Controller
                      control={control}
                      name="Assignee"
                      render={({ field }) => (
                        <Select {...field} options={assigneeOptions} isClearable styles={SelectStyles} isDisabled={isEdit && decryptedUser?.role.toLowerCase() === "client"} />
                      )}
                    />
                  </div>
                </>
              )}

              {isEdit && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Customer Impacted </label>
                    <Controller
                      control={control}
                      name="CustomerImpacted"
                      render={({ field }) => (
                        <Select {...field} options={CusmoterImpactedOptions} isClearable styles={SelectStyles} isDisabled={isEdit && decryptedUser?.role.toLowerCase() === "client"} />
                      )}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Escalated </label>
                    <Controller
                      control={control}
                      name="Escalated"
                      render={({ field }) => (
                        <Select {...field} options={CusmoterImpactedOptions} isClearable styles={SelectStyles} isDisabled={isEdit && decryptedUser?.role.toLowerCase() === "client"} />
                      )}
                    />
                  </div>
                </>
              )}

            </div>

            {/* Dropdowns ////////////////*/}

          </div>

          {/* Manager & Assignee */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {isEdit && (
              <div>
                <label className="block text-sm font-medium text-black mb-2">Work Logs <span className="text-red-500">*</span></label>
                {previousWlogs && (
                  <div className="mb-2 p-2 bg-gray-100 border border-gray-300 rounded h-40 overflow-y-auto">
                    <p className="text-md text-black whitespace-pre-wrap">{previousWlogs}</p>
                  </div>
                )}
                <textarea
                  {...register("WorkLogs")}
                  placeholder="Add work log entries here..."
                  rows={4}
                  className="w-full h-20 border-2 border-orange-300  focus:outline-none focus:ring-2 focus:ring-orange-300  rounded-md px-3 py-2"
                />
              </div>

            )}
            <div>


              {/* Attachment */}
              {isEdit && (
                <>

                  <div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Attachment</label>
                      <input
                        type="file"
                        multiple
                        accept="image/*,video/*,application/pdf"
                        onChange={handleFileChange}
                        className="w-full h-[90%] border border-orange-500  focus:outline-none focus:ring-2 focus:ring-orange-300 rounded-md px-3 py-2"
                      />
                    </div>

                
                  {(previews.length > 0 || uploadingFiles.size > 0) && (
                    <div className="flex flex-wrap gap-4 mt-5">
                      {/* Uploading Loaders */}
                      {[...uploadingFiles].map((fileName) => (
                        <div
                          key={fileName}
                          className="relative w-40 h-36 flex flex-col items-center justify-center border rounded-md bg-gray-50 shadow-sm"
                        >
                          <LoaderPage />
                          <span className="mt-2 text-xs text-gray-500 text-center break-words">
                            {fileName}
                          </span>
                        </div>
                      ))}

                      {/* Uploaded Previews */}
                      {previews.map((file, index) => {
                        if (!isImage(file.name) && !isVideo(file.name)) return null;

                        return (
                          <div
                            key={file.url || file.name || index}
                            className="relative w-40 border rounded-md p-2 bg-gray-100 shadow-sm cursor-pointer"
                            onClick={() => setActivePreview(file)}
                          >
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFile(index);
                              }}
                              className="absolute top-1 right-1 text-red-600 text-xs bg-white rounded-full px-2 shadow z-10"
                            >
                              ✕
                            </button>

                            {isImage(file.name) ? (
                              <img
                                src={file.url}
                                alt={file.name}
                                className="w-full h-28 object-cover rounded"
                              />
                            ) : (
                              <video
                                controls
                                className="w-full h-28 object-cover rounded"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <source src={file.url} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Modal Popup */}
                  {activePreview && (
                    <div
                      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
                      onClick={handleModalClose}
                    >
                      <div
                        className="relative max-w-[80vw] max-h-[80vh] p-4 bg-white rounded shadow-lg overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full px-3 py-1 text-lg z-50"
                          onClick={handleModalClose}
                        >
                          ✕
                        </button>

                        {isImage(activePreview.name) ? (
                          <img
                            src={activePreview.url}
                            alt={activePreview.name}
                            className="max-w-full max-h-[75vh] w-auto h-auto rounded"
                            style={{ display: 'block', margin: '0 auto' }}
                          />
                        ) : (
                          <video
                            autoPlay
                            muted
                            controls
                            playsInline
                            className="max-w-full max-h-[75vh] w-auto h-auto rounded"
                            style={{ display: 'block', margin: '0 auto' }}
                          >
                            <source src={activePreview.url} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        )}
                      </div>
                    </div>
                  )}


                  </div>
                </>
              )}
            </div>

          </div>
          {/* Buttons */}
          <div className="flex   gap-4 items-center justify-center">

            <button
              type="submit"
              className={`bg-orange-300 ${isEdit ? "mt-[-10]" : "mt-[-80px]"}  text-white px-6 py-2 rounded hover:bg-orange-400 flex items-center justify-center gap-2`}
              disabled={isSubmittingBooking || isUpdatingTicket}
            >
              {(isSubmittingBooking || isUpdatingTicket) ? (
                <>
                  <LoaderPage size="small" />
                  {isEdit ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEdit ? 'Update Ticket' : 'Create'
              )}
            </button>



            <button
              type="button"
              onClick={() => setCurrentView("tickets")}
              className={`border border-gray-300 ${isEdit ? "mt-[-10]" : "mt-[-80px]"} text-black px-6 py-2 rounded hover:bg-gray-10`}
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateEditTicket;
