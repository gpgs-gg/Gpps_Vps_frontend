import React, { useMemo, useState, useEffect, useRef } from "react";
import Select from "react-select"
import { useEmployeeDetailsData, useUpdateEmployee, useCreateEmployee, useUploadEmployeeDocs, useDropDowlList } from "./Services/index";
import { EmployeesTableSkeleton, SearchSkeleton, DashboardSkeleton } from "./EmployeesTableSkeleton";
import { useForm } from "react-hook-form";
import EmployeesCreate from "./EmployeesCreate";
import { toast } from "react-toastify";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Dashboard from "./Dashboard";
import { useAuth } from '../../context/AuthContext';
import EmployeeTabs from "./EmployeeTabs";

const MAX_FILES = { aadhaar: 2, photo: 1, bank: 1 };

const schema = yup.object().shape({
  EmployeeID: yup.string().required("Employee ID is required"),
  Name: yup.string().required("Full Name is required"),
  Department: yup.string().required("Department is required"),
  Designation: yup.string().required("Designation is required"),
  DOJ: yup.string().required("Date of Joining is required"),
  DOB: yup.string().required("Date of Birth is required"),
  ParentCompany: yup.string().required("Parent Company is required"),
  Role: yup.string().required("Role is required"),
  Subsidiary: yup.string().required("Subsidiary is required"),
  WhatsAppNo: yup.string().required("WhatsApp No is required"),
  CallingNo: yup.string().required("Calling No is required"),
  Email: yup.string().required("Email is required"),
  PermanentAddress: yup.string().required("Permanent Address is required"),
  TemporaryAddress: yup.string().required("Temporary Address is required"),
  EmgyCont1FullName: yup.string().required("Emergency Contact 1 Name is required"),
  EmgyCont1No: yup.string().required("Emergency Contact 1 No is required"),
  EmgyCont2FullName: yup.string().required("Emergency Contact 2 Name is required"),
  EmgyCont2No: yup.string().required("Emergency Contact 2 No is required"),
  LoginID: yup.string().required("Login ID is required"),
});

const SR_WIDTH = 70;
const EMPID_COL_WIDTH = 120;
const DEFAULT_WIDTH = 180;
const ACTION_COL_WIDTH = 70;

const getColumnWidth = (key) => {
  if (key === "SrNo") return SR_WIDTH;
  if (key === "EmployeeID") return EMPID_COL_WIDTH;
  return DEFAULT_WIDTH;
};

const TOOLTIP_FIELDS = [
  "Designation",
  "Subsidiary",
  "Email",
  "LoginID",
  "Password",
  "Worklogs"
];

const CellWithTooltip = ({ value, columnKey }) => {
  const [show, setShow] = useState(false);

  const shouldShowTooltip = TOOLTIP_FIELDS.includes(columnKey);

  if (!shouldShowTooltip) {
    return (
      <div className="truncate overflow-hidden text-ellipsis">
        {value ?? ""}
      </div>
    );
  }

  const isWorklog =
    typeof value === "string" && value.includes("[");

  const previewLine =
    isWorklog
      ? value.split("\n").filter(Boolean)[0]
      : value;

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {/* ===== TABLE PREVIEW (NO STYLE CHANGE) ===== */}
      <div className="truncate overflow-hidden text-ellipsis">
        {previewLine ?? ""}
      </div>

      {/* ===== WORKLOG TOOLTIP ===== */}
      {show && isWorklog && (
        <div
          className="absolute left-10 ml-3 z-[9999]
          bg-white border border-gray-300 rounded-lg shadow-xl
          p-3 max-w-[450px] max-h-[350px] overflow-auto"
          style={{
            width: "max-content",
            minWidth: "280px",
            top: "95%",
            transform: "translateY(0%)"
          }}
        >
          {value.split("\n").map((line, i) => {
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
                  fontSize: "13px",
                }}
              >
                {line}
              </div>
            );
          })}
        </div>
      )}

      {/* ===== NORMAL TOOLTIP FOR OTHER COLUMNS ===== */}
      {show && !isWorklog && (
        <div
          className="absolute left-10 ml-3 top-5 z-[9999] bg-white border border-gray-300 rounded-lg shadow-xl p-3 text-xs break-words max-w-[400px] max-h-[400px] overflow-auto"
          style={{ width: 'max-content', minWidth: '150px' }}
        >
          <pre className="whitespace-pre-wrap">{value ?? ""}</pre>
        </div>
      )}
    </div>
  );
};

const FileCell = ({ url }) => {
  const [previewImage, setPreviewImage] = useState(null);

  if (!url) return null;

  // ✅ Handle multiple URLs (newline OR comma)
  const urls = url.split(/\n|,/).map((u) => u.trim()).filter(Boolean);

  return (
    <>
      <div className="flex gap-2">
        {urls.map((fileUrl, index) => {

          const ext = fileUrl.split(".").pop().toLowerCase();

          const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);
          const isPDF = ext === "pdf";

          const handleClick = () => {
            if (isImage) {
              setPreviewImage(fileUrl);
            } else {
              window.open(fileUrl, "_blank", "noopener,noreferrer");
            }
          };

          return (
            <div
              key={index}
              onClick={handleClick}
              className="w-10 h-10 rounded-md overflow-hidden hover:ring-2 hover:ring-blue-400 relative cursor-pointer flex items-center justify-center"
            >
              {isImage ? (
                <img
                  src={fileUrl}
                  alt="file"
                  className="w-full h-full object-cover"
                />
              ) : isPDF ? (
                <i className="fa-solid fa-file-pdf text-red-600 text-2xl"></i>
              ) : (
                <i className="fa-solid fa-file-pdf text-red-600 text-2xl"></i>
              )}
            </div>
          );
        })}
      </div>

      {/* IMAGE MODAL */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999]">
          <div className="relative">
            <img
              src={previewImage}
              alt="preview"
              className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-xl"
            />

            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-2 bg-white text-red-500 rounded-full w-7 h-7 flex items-center justify-center font-bold text-lg shadow-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const EmployeesTable = () => {

  const { data: employeesDetail, isPending } = useEmployeeDetailsData();
  //const employeesData = useMemo(() => employeesDetail?.data || [], [employeesDetail]);

  const employeesData = useMemo(() => {
    if (!employeesDetail?.data) return [];
    return [...employeesDetail.data].reverse(); // reverse order
  }, [employeesDetail]);

  const { mutate: updateEmployee, isPending: isUpdating } = useUpdateEmployee();
  const { mutate: createEmployee, isPending: isCreating } = useCreateEmployee();
  const { user } = useAuth();
  const { data: dropdownlist } = useDropDowlList();
  const [activeTab, setActiveTab] = useState("DASHBOARD");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingRow, setEditingRow] = useState(null);
  const [filters, setFilters] = useState({
    department: "",
    active: "Yes",
  });
  const [globalSearch, setGlobalSearch] = useState("");
  const rowsPerPage = 10;
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    // setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const SelectStylesfilter = {
    control: (base, state) => ({
      ...base,
      width: "250px",
      paddingTop: "0.20rem",
      paddingBottom: "0.0 rem",
      paddingLeft: "0.20rem",
      paddingRight: "0.50rem",
      marginTop: "0.30rem",
      borderWidth: "2px",
      borderStyle: "solid",
      borderColor: state.isFocused ? "#fb923c" : "#fdba74",
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
      maxHeight: "200px",
      // overflowY: "auto",
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  //=========================DROPDOWN OPTIONS=====================
  const DepartmentOptions = Array.isArray(dropdownlist)
    ? [...new Set(dropdownlist?.map(item => item.Departments?.trim())
      .filter(Boolean))].map(value => ({
        value,
        label: value,
      }))
    : [];
  const DesignationOptions = Array.isArray(dropdownlist)
    ? [...new Set(dropdownlist?.map(item => item.Designation?.trim())
      .filter(Boolean))].map(value => ({
        value,
        label: value,
      }))
    : [];
  const SubsidiaryOptions = Array.isArray(dropdownlist)
    ? [...new Set(dropdownlist?.map(item => item.Subsidiary?.trim())
      .filter(Boolean))].map(value => ({
        value,
        label: value,
      }))
    : [];
  const RoleOptions = Array.isArray(dropdownlist)
    ? [...new Set(dropdownlist?.map(item => item.Role?.trim())
      .filter(Boolean))].map(value => ({
        value,
        label: value,
      }))
    : [];
  const ParentCompanyOptions = Array.isArray(dropdownlist)
    ? [...new Set(dropdownlist?.map(item => item.ParentCompany?.trim())
      .filter(Boolean))].map(value => ({
        value,
        label: value,
      }))
    : [];
  const DepartmentCompanyOptions = Array.isArray(dropdownlist)
    ? [...new Set(dropdownlist?.map(item => item["Department - (CompanyName)"]?.trim())
      .filter(Boolean))].map(value => ({
        value,
        label: value,
      }))
    : [];

  const DropdownOptions = { DepartmentCompanyOptions, DepartmentOptions, DesignationOptions, SubsidiaryOptions, RoleOptions, ParentCompanyOptions, };

  //========================FILTER========================
  const filteredData = useMemo(() => {
    if (!employeesData?.length) return [];
    const filtered = employeesData.filter((row) => {
      // Department Filter
      const matchesDepartment = !filters.department || row.Department === filters.department;

      // IsActive Filter
      const matchesIsActive = !filters.active || row.IsActive === filters.active;

      // Global Search
      const search = globalSearch.toLowerCase();
      const matchesSearch =
        search === "" ||
        Object.values(row).some((val) =>
          String(val).toLowerCase().includes(search)
        );
      return matchesDepartment && matchesIsActive && matchesSearch;
    });
    return [...filtered];
  }, [employeesData, filters, globalSearch]);

  //============== Pagination===================
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;

    let data = filteredData;
    if (filters?.active === "yes") {
      data = filteredData?.filter(
        (ele) => ele?.IsActive?.toLowerCase()?.trim() !== "no"
      );
    }

    return data?.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage, filters, rowsPerPage]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  //====================On Submit===================
  const onSubmit = (formData) => {
    try {
      let previousRow = null;
      let existingWorklogs = "";

      if (editingRow && employeesData?.length) {
        previousRow = employeesData.find(
          emp => emp.EmployeeID === editingRow.EmployeeID
        );
        existingWorklogs = previousRow?.Worklogs || "";
      }

      const payload = {
        EmployeeID: formData.EmployeeID,
        IsActive: formData.IsActive || "Yes",
        Name: formData.Name || "",
        Department: formData.Department || "",
        Designation: formData.Designation || "",
        DOJ: formData.DOJ ? new Date(formData.DOJ).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "",
        DOB: formData.DOB ? new Date(formData.DOB).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "",
        ParentCompany: formData.ParentCompany || "",
        Role: formData.Role || "",
        Subsidiary: formData.Subsidiary || "",
        WhatsAppNo: formData.WhatsAppNo || "",
        CallingNo: formData.CallingNo || "",
        Email: formData.Email || "",
        PermanentAddress: formData.PermanentAddress || "",
        TemporaryAddress: formData.TemporaryAddress || "",
        EmgyCont1FullName: formData.EmgyCont1FullName || "",
        EmgyCont1No: formData.EmgyCont1No || "",
        EmgyCont2FullName: formData.EmgyCont2FullName || "",
        EmgyCont2No: formData.EmgyCont2No || "",
        // ITLoginAllowedOrNotAllowed: formData.ITLoginAllowedOrNotAllowed || "",
        LoginID: formData.LoginID || "",
        // Password: formData.Password || "",
        // PasswordLogs: formData.PasswordLogs || "",
        Worklogs: formData.Worklogs || existingWorklogs,
      };

      const fieldNameMap = {
        IsActive: "Active Status",
        Name: "Emp Name",
        WhatsAppNo: "WhatsApp No.",
        CallingNo: "Calling No.",
        PermanentAddress: "Permanent Address",
        TemporaryAddress: "Temporary Address",
        EmgyCont1FullName: "Emergency Contact 1 Name",
        EmgyCont1No: "Emergency Contact 1 No.",
        EmgyCont2FullName: "Emergency Contact 2 Name",
        EmgyCont2No: "Emergency Contact 2 No.",
        ITLoginAllowedOrNotAllowed: "IT Login Status",
        LoginID: "Login ID",
      };

      /* ================== WORKLOG LOGIC START ================== */

      if (editingRow && previousRow) {

        const now = new Date();

        const formattedDate = now.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });

        const formattedTime = now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        const header = `[${formattedDate}, ${formattedTime} - (${user?.employee?.EmployeeID})  ${user?.employee?.Name || ""}]`;

        const changedFields = [];
        const ignoreFields = ["Worklogs"];

        Object.keys(payload).forEach((key) => {
          if (ignoreFields.includes(key)) return;

          let oldValue = previousRow?.[key] ?? "";
          let newValue = payload[key] ?? "";

          oldValue = oldValue.toString().trim();
          newValue = newValue.toString().trim();

          const displayName = fieldNameMap[key] || key;

          if (oldValue !== newValue) {
            changedFields.push(
              `${displayName} changed from ${oldValue || "N/A"} to ${newValue || "N/A"}`
            );
          }
        });

        let newBlock = "";
        const comment = formData.Comment?.trim();

        if (changedFields.length > 0) {
          newBlock = `${header}\n${changedFields.join("\n")}`;
          if (comment) {
            newBlock += `\n${comment}`;
          }
        } else if (comment) {
          newBlock = `${header}\n${comment}`;
        }

        if (newBlock) {
          payload["Worklogs"] = existingWorklogs
            ? newBlock + "\n\n" + existingWorklogs
            : newBlock;
        }
      }
      /* ================== WORKLOG LOGIC END ================== */

      if (editingRow) {
        updateEmployee({ ...payload, EmployeeID: editingRow.EmployeeID },
          {
            onSuccess: () => {
              toast.success("Employee Updated Successfully");
            },
            onError: () => toast.error("Update Failed"),
          });
      } else {

        // ================= CREATE WORKLOG LOGIC =================
        const now = new Date();

        const formattedDate = now.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });

        const formattedTime = now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        const header = `[${formattedDate}, ${formattedTime} - (${user?.employee?.EmployeeID}) ${user?.employee?.Name || ""}]`;

        const comment = formData.Comment?.trim();

        let newBlock = `${header}\nEmployee Created (EmployeeID: ${payload.EmployeeID})`;

        if (comment) {
          newBlock += `\n${comment}`;
        }

        payload["Worklogs"] = newBlock;
        // 🔹 Create new employee
        createEmployee(payload, {
          onSuccess: () => {
            toast.success("Employee Created Successfully");
            reset();
            setEditingRow(null);
            // setActiveTab("LIST");
          },
          onError: () => toast.error("Creation Failed"),
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };


  //================ Handle Edit===================

  const handleEdit = (row) => {
    if (!row?.EmployeeID) return;

    const selectedEmployee = employeesData.find(
      (emp) => emp.EmployeeID === row.EmployeeID
    );

    if (!selectedEmployee) return;

    setEditingRow(selectedEmployee);
    setActiveTab("CREATE");

    const parseDate = (dateStr) =>
      dateStr ? new Date(dateStr) : null;

    reset({
      ...selectedEmployee,
      DOJ: parseDate(selectedEmployee.DOJ),
      DOB: parseDate(selectedEmployee.DOB),
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  //====================TABLE_COLUMNS====================
  const TABLE_COLUMNS = [
    { key: "SrNo", label: "Sr No" },
    { key: "EmployeeID", label: "Employee ID" },
    { key: "IsActive", label: "Is Active" },
    { key: "Name", label: "Employee Name" },
    { key: "Department-(CompanyName)", label: "Department-(CompanyName)" },
    { key: "Department", label: "Department" },
    { key: "Designation", label: "Designation" },
    { key: "DOJ", label: "Date of Joining" },
    { key: "DOB", label: "Date of Birth" },
    { key: "ParentCompany", label: "Parent Company" },
    { key: "Role", label: "Role" },
    { key: "Subsidiary", label: "Subsidiary" },
    { key: "WhatsAppNo", label: "WhatsApp No." },
    { key: "CallingNo", label: "Calling No." },
    { key: "Email", label: "Email" },
    { key: "AadharCard", label: "Aadhar Card" },
    { key: "Photo", label: "Photo" },
    { key: "BankDetails", label: "Bank Details" },
    { key: "PermanentAddress", label: "Permanent Address" },
    { key: "TemporaryAddress", label: "Temporary Address" },
    { key: "EmgyCont1FullName", label: "Emergency Contact 1 Name" },
    { key: "EmgyCont1No", label: "Emergency Contact 1 No." },
    { key: "EmgyCont2FullName", label: "Emergency Contact 2 Name" },
    { key: "EmgyCont2No", label: "Emergency Contact 2 No." },
    // { key: "ITLoginAllowedOrNotAllowed", label: "IT Login Status" },
    { key: "Worklogs", label: "Worklogs" },
    { key: "LoginID", label: "Login ID" },
    { key: "Password", label: "Password" },
    // { key: "PasswordLogs", label: "Password Logs" },
  ];

  // 🔹 Get current index of editing row
  const currentIndex = editingRow
    ? employeesData.findIndex(emp => emp.EmployeeID === editingRow.EmployeeID)
    : -1;

  const goToNext = () => {
    if (currentIndex >= 0 && currentIndex < employeesData.length - 1) {
      handleEdit(employeesData[currentIndex + 1]);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      handleEdit(employeesData[currentIndex - 1]);
    }
  };

  // Generate Next EmployeeID
  const getNextEmployeeID = () => {
    if (!employeesData?.length) return 240001;

    const lastEmployee = employeesData[0];
    return Number(lastEmployee.EmployeeID) + 1;
  };

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  //=======================Document Upload===============================

  const [pendingDocType, setPendingDocType] = useState(null);
  const [uploadedDocs, setUploadedDocs] = useState({
    aadhaar: [],
    photo: [],
    bank: [],
  });
  const [existingDocs, setExistingDocs] = useState({
    aadhaar: [],
    photo: [],
    bank: [],
  });

  // ✅ ADD HERE (RIGHT AFTER STATES)
  const isDocAvailable = (type) => {
    return (
      uploadedDocs[type]?.length > 0 ||
      existingDocs[type]?.length > 0
    );
  };

  const allDocsUploaded =
    isDocAvailable("aadhaar") &&
    isDocAvailable("photo") &&
    isDocAvailable("bank");

  //console.log("existingDocs: ", existingDocs);
  //     const [savedDocs, setSavedDocs] = useState({
  //     aadhaar: false,
  //     photo: false,
  //     bank: false,
  // });

  const fileInputRefs = {
    aadhaar: useRef(),
    photo: useRef(),
    bank: useRef(),
  };

  const { mutate: uploadEmployeeDocs } = useUploadEmployeeDocs();
  const { data: employeeDetailsForDocuments, isLoading: isDocument, refetch } = useEmployeeDetailsData();
  // 🔁 Load existing documents on component mount
  useEffect(() => {
    if (!employeeDetailsForDocuments?.data || !editingRow) {
      setExistingDocs({
        aadhaar: [],
        photo: [],
        bank: [],
      });
      return;
    }

    const selectedEmployee =
      employeeDetailsForDocuments.data.find(
        ele => ele.EmployeeID === editingRow.EmployeeID
      );

    if (selectedEmployee) {
      setExistingDocs({
        //aadhaar: selectedEmployee.AadharCard ? [selectedEmployee.AadharCard] : [],
        aadhaar: selectedEmployee.AadharCard
          ? selectedEmployee.AadharCard.split(",")
          : [],
        photo: selectedEmployee.Photo ? [selectedEmployee.Photo] : [],
        bank: selectedEmployee.BankDetails ? [selectedEmployee.BankDetails] : [],
      });
    }
  }, [employeeDetailsForDocuments, editingRow]);

  useEffect(() => {
    // Employee change → clear unsaved uploads
    setUploadedDocs({
      aadhaar: [],
      photo: [],
      bank: [],
    });

    setPendingDocType(null);

  }, [editingRow?.EmployeeID]);

  useEffect(() => {
    if (activeTab !== "CREATE") {
      setUploadedDocs({
        aadhaar: [],
        photo: [],
        bank: [],
      });

      setPendingDocType(null);
    }
  }, [activeTab]);


  const handleFileChange = (type, event) => {

    const newFiles = Array.from(event.target.files);
    if (!newFiles.length) return;

    setUploadedDocs((prev) => {
      const currentFiles = prev[type] || [];
      const existingCount = existingDocs[type]?.length || 0;

      const totalFiles = currentFiles.length + newFiles.length + existingCount;
      if (totalFiles > MAX_FILES[type]) {
        toast.dismiss();
        toast.error(`You can upload a maximum of ${MAX_FILES[type]} files for ${type.toUpperCase()}.`);
        return prev;
      }

      // Rename files to ensure uniqueness
      const uniqueNewFiles = newFiles.map(file => {
        const timestamp = Date.now();
        const uniqueSuffix = `${timestamp}-${Math.floor(Math.random() * 10000)}`;
        const fileExtension = file.name.split('.').pop();
        const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        const newFileName = `${uniqueSuffix}_${baseName}.${fileExtension}`;
        return new File([file], newFileName, { type: file.type });
      });
      return {
        ...prev,
        [type]: [...currentFiles, ...uniqueNewFiles],
      };
    });

    // Reset the input so selecting the same file again will trigger onChange
    event.target.value = '';
  };


  const handleUploadClick = (type) => {
    fileInputRefs[type].current.click();
  };

  const generateDocumentWorklog = () => {
    const now = new Date();

    const formattedDate = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const formattedTime = now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const header = `[${formattedDate}, ${formattedTime} - (${user?.employee?.EmployeeID}) ${user?.employee?.Name || ""}]`;

    const newBlock = `${header}
  Documents Uploaded`;

    return newBlock;
  };

  const handleSave = () => {

    if (!watch("EmployeeID") || !watch("Name")) {
      return toast.error("Create employee first");
    }

    if (!allDocsUploaded) {
      return toast.error("All documents are mandatory");
    }

    const formData = new FormData();

    if (uploadedDocs.aadhaar.length)
      //formData.append("aadharCard", uploadedDocs.aadhaar[0]);
      uploadedDocs.aadhaar.forEach(file => {
        formData.append("aadharCard", file);
      });

    if (uploadedDocs.photo.length)
      formData.append("photo", uploadedDocs.photo[0]);

    if (uploadedDocs.bank.length)
      formData.append("bankPassbook", uploadedDocs.bank[0]);

    if ([...formData.keys()].length === 0) {
      return toast.warning("Upload at least one document");
    }

    formData.append("EmployeeID", watch("EmployeeID"));
    formData.append("Name", watch("Name"));

    // ✅ WORKLOG ADD HERE
    const worklog = generateDocumentWorklog();
    formData.append("Worklogs", worklog);

    setPendingDocType("all");

    uploadEmployeeDocs(formData, {
      onSuccess: async () => {
        toast.success("Documents uploaded successfully");
        await refetch();
        setUploadedDocs({
          aadhaar: [],
          photo: [],
          bank: [],
        });

        setPendingDocType(null);
      },
      onError: () => {
        toast.error("Upload failed");
        setPendingDocType(null);
      }
    });
  };

  const handleRemoveFile = (type, index) => {
    setUploadedDocs((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const documentsList = [
    {
      type: "aadhaar",
      label: "Aadhaar Card",
      desc: "Upload Aadhaar Card",
      icon: "fa-id-card",
      required: true,
    },
    {
      type: "photo",
      label: "Employee Photo",
      desc: "Upload Passport Size Photo",
      icon: "fa-user",
      required: true,
    },
    {
      type: "bank",
      label: "Bank Details",
      desc: "Upload Bank Passbook",
      icon: "fa-university",
      required: true,
    },
  ];

  return (
    <div className='min-h-screen w-auto bg-gray-50 pt-24'>

      {/* ================= TABS ================= */}
      <EmployeeTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        editingRow={editingRow}
        reset={reset}
        getNextEmployeeID={getNextEmployeeID}
        setEditingRow={setEditingRow}
      />

      {/* ================= DASHBOARD ================= */}
      {activeTab === "DASHBOARD" && (
        (isPending) ? (
          <div className="pt-6 px-4">
            <DashboardSkeleton />
          </div>
        ) : (
          <div className="pt-6 px-4">
            <Dashboard data={employeesDetail?.data || []} />
          </div>
        )
      )}

      {/* ================= Form ================= */}

      {activeTab === "CREATE" && (
        <EmployeesCreate
          control={control}
          register={register}
          handleSubmit={handleSubmit}
          errors={errors}
          onSubmit={onSubmit}
          reset={reset}
          setActiveTab={setActiveTab}
          isUpdating={isUpdating || isCreating}
          editingRow={editingRow}
          setEditingRow={setEditingRow}
          currentIndex={currentIndex}
          totalLength={employeesData.length}
          goToNext={goToNext}
          goToPrevious={goToPrevious}
          DropdownOptions={DropdownOptions}
          setCurrentPage={setCurrentPage}

          /* DOCUMENT PROPS */
          documentsList={documentsList}
          uploadedDocs={uploadedDocs}
          existingDocs={existingDocs}
          handleFileChange={handleFileChange}
          handleUploadClick={handleUploadClick}
          handleSave={handleSave}
          handleRemoveFile={handleRemoveFile}
          fileInputRefs={fileInputRefs}
          pendingDocType={pendingDocType}
          isDocument={isDocument}
          allDocsUploaded={allDocsUploaded}
        />
      )}

      {/* ================= FILTER ================= */}
      {activeTab === "LIST" && (
        (isPending) ? (
          <SearchSkeleton />
        ) : (
          <div className="px-2 py-3 bg-gray-50">
            <div className="bg-white rounded-lg shadow mb-0 p-2 overflow-x-auto">

              {/* FILTER ROW */}
              <div className="flex justify-between items-end px-2 pt-1 pb-1">

                {/* LEFT SIDE FILTERS */}
                <div className="flex gap-4 mr-4">
                  {/* GLOBAL SEARCH */}
                  <div>
                    <label className="block text-md font-medium text-gray-800">
                      Search
                    </label>
                    <input
                      type="text"
                      value={globalSearch}
                      onChange={(e) => {
                        setGlobalSearch(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Search"
                      className="w-[200px] px-3 py-2 border-2 border-orange-300 rounded-md
                      focus:outline-none focus:ring-1 focus:ring-orange-300 focus:border-orange-300  mt-1"
                    />
                  </div>

                  {/* Department */}
                  <div className="flex flex-col w-250px">
                    <label className="block text-md font-medium text-gray-800">
                      Department
                    </label>
                    <Select
                      value={
                        filters.department
                          ? DepartmentOptions.find(opt => opt.value === filters.department)
                          : null
                      }
                      options={DepartmentOptions}
                      placeholder="Select Department"
                      onChange={(selected) => {
                        setFilters(prev => ({
                          ...prev,
                          department: selected?.value || ""
                        }));
                        setCurrentPage(1);
                      }}
                      styles={SelectStylesfilter}
                      isClearable
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                    />
                  </div>
                </div>

                {/* HEADER */}
                <div className="flex justify-end md:px-0 gap-6 mr-4 items-center">
                  {/* RIGHT SIDE RADIO BUTTONS */}
                  <div className="flex items-center gap-3 px-2 ">
                    <input
                      type="radio"
                      className="w-4 h-4 accent-green-500"
                      checked={filters.active === "Yes"}
                      onChange={() =>
                        setFilters(prev => ({ ...prev, active: "Yes" }))
                      }
                    />
                    <label className="text-lg font-semibold">Active</label>

                    <input
                      type="radio"
                      className="w-4 h-4 accent-orange-500"
                      checked={filters.active === "No"}
                      onChange={() =>
                        setFilters(prev => ({ ...prev, active: "No" }))
                      }
                    />
                    <label className="text-lg font-semibold">Not Active</label>
                  </div>
                  {Object.values(filters).some(val => val) && (
                    <button
                      onClick={() => {
                        setFilters({
                          department: "",
                          active: "",
                        });
                        // setCurrentPage(1);
                      }}
                      className="text-orange-600 hover:text-orange-800 font-bold text-xl underline"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      )}

      {/* ================= Table ================= */}

      <div className="bg-gray-50 shadow-sm px-2 pt-1 rounded-b-lg">
        <div className='overflow-x-auto'>
          {activeTab === "LIST" && (
            isPending ? (
              <EmployeesTableSkeleton />
            ) : paginatedData.length > 0 ?
              (
                <>
                  <div className="max-h-[55vh] overflow-auto border border-gray-200 bg-white">

                    <table className="min-w-full border-collapse text-sm text-left table-fixed">

                      <thead className="sticky top-0 text-white bg-black z-[30] shadow-md">
                        <tr>
                          {TABLE_COLUMNS.map((col) => (
                            <th
                              key={col.key}
                              className={`px-3 py-3 text-left  border text-lg whitespace-nowrap
                            ${col.key === "SrNo" ? "sticky z-20 text-white bg-black" : ""}
                            ${col.key === "EmployeeID" ? "sticky z-20 text-white border bg-black" : ""}
                          `}
                              style={{
                                width: getColumnWidth(col.key),
                                left: col.key === "SrNo" ? 0 : col.key === "EmployeeID" ? SR_WIDTH : undefined,
                              }}
                            >
                              {col.label}
                            </th>
                          ))}
                          <th className="px-1 py-1 sticky right-0 z-[30] text-left text-lg text-white bg-black"
                            style={{ width: ACTION_COL_WIDTH }}>Actions</th>

                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-200 text-[15px]">
                        {paginatedData?.map((row, idx) => (
                          <tr key={idx} className="hover:bg-[#F8F9FB] border">
                            {TABLE_COLUMNS.map((col) => (
                              <td
                                key={col.key}
                                className={`px-3 whitespace-nowrap
                              ${["Photo", "AadharCard", "BankDetails"].includes(col.key) ? "py-0" : "py-4"}
                              ${col.key === "SrNo" ? "sticky bg-gray-100 z-20 font-bold" : ""}
                              ${col.key === "EmployeeID" ? "sticky bg-gray-100 z-20 font-bold" : ""}
                            `}
                                style={{
                                  width: getColumnWidth(col.key),
                                  maxWidth: getColumnWidth(col.key),
                                  left: col.key === "SrNo" ? 0 : col.key === "EmployeeID" ? SR_WIDTH : undefined,
                                }}
                              >
                                {/* <CellWithTooltip
                                value={
                                  ["Photo", "AadharCard", "BankDetails"].includes(col.key)
                                    ? <FileCell url={row[col.key]} />
                                    // : row.IsActive === "No" &&
                                    //   col.key !== "EmployeeID" &&
                                    //   col.key !== "SrNo" &&
                                    //   col.key !== "IsActive" 
                                    //   ? ""   
                                      : row[col.key] ?? ""
                                }
                                columnKey={col.key}
                              /> */}

                                <CellWithTooltip
                                  value={
                                    col.key === "SrNo"
                                      ? (currentPage - 1) * rowsPerPage + idx + 1
                                      : ["Photo", "AadharCard", "BankDetails"].includes(col.key)
                                        ? <FileCell url={row[col.key]} />
                                        : row[col.key] ?? ""
                                  }
                                  columnKey={col.key}
                                />
                              </td>
                            ))}
                            <td className="px-1 py-1 sticky right-0 bg-gray-100 z-[20]" style={{ width: ACTION_COL_WIDTH }}>
                              <div className="flex justify-center gap-3 text-lg">
                                {/* <button
                                onClick={() => handleEdit(row)}
                                className="text-orange-500 hover:text-orange-700" title="Edit">
                                  <i className="fa fa-eye"></i>
                              </button> */}
                                <button
                                  onClick={() => handleEdit(row)}
                                  className="text-orange-500 hover:text-orange-700" title="Edit">
                                  <i className="fas fa-edit"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}

                  <div className="flex justify-center items-center gap-5 p-2 bg-white">
                    {/* Page Info */}
                    <span className="text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      className="px-3 py-1 bg-black text-white rounded disabled:opacity-50 transition-colors"
                    ><i className="fa-solid fa-arrow-left"></i> {" "}
                      Previous
                    </button>

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      className="px-3 py-1 bg-black text-white rounded disabled:opacity-50 transition-colors"
                    >
                      Next <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                </>
              ) : (
                <div className="px-6 pb-8 text-center text-gray-500 lg:mt-20 font-bold flex items-center justify-center text-xl">
                  No records found
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeesTable;