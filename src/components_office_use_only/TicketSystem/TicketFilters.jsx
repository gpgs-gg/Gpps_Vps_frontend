import { useApp } from "./AppProvider";
import { useForm, Controller, set } from "react-hook-form";
import Select from "react-select";
import React, { useState } from "react";
import { useDynamicDetails, useEmployeeDetails } from "./Services";
import { Managers, PriorityOptions, SelectStylesfilter } from "../../Config";

// Styled select theme


// Options
const statusOptions = [
    { label: "All Status", value: "" },
    { value: "Open", label: "Open" },
    { value: "Acknowledged", label: "Acknowledged" },
    { value: "In Progress", label: "In Progress" },
    { value: "On Hold", label: "On Hold" },
    { value: "Resolved", label: "Resolved" },
    { value: "Closed", label: "Closed" },
    { value: "Cancelled", label: "Cancelled" },
    { value: "Re-Open", label: "Re-Open" },
];



// const priorityOptions = [
//     { label: "All Priorities", value: "" },
//     { label: "Low", value: "Low" },
//     { label: "Medium", value: "Medium" },
//     { label: "High", value: "High" },
//     { label: "Critical", value: "Critical" },
// ];

// const DepartmentOptions = [
//     { value: "", label: "All Departments" },
//     { value: "Maintenance", label: "Maintenance" },
//     { value: "Housekeeping", label: "Housekeeping" },
//     { value: "Accounts", label: "Accounts" },
//     { value: "Sales", label: "Sales" },
//     { value: "Marketing", label: "Marketing" },
//     { value: "Admin", label: "Admin" },
//     { value: "Human Resource", label: "Human Resource" },
//     { value: "Management", label: "Management" },
//     { value: "IT", label: "IT" },

// ];

export const TicketFilters = () => {
    const { filters, setFilters, users, filteredTickets, decryptedUser, currentView, myPgTicketsTotal ,input , setInput , setSearchTerm } = useApp();
    const { data: EmployeeDetails } = useEmployeeDetails(decryptedUser?.employee?.Role);
    const { data: DynamicValuesDetails } = useDynamicDetails()

    const handleSearch = (e)=>{
        setInput(e.target.value);
   const handler = setTimeout(() => {
    setSearchTerm(e.target.value.trim());
  }, 300); // 300ms debounce delay

  return () => clearTimeout(handler);
    }

    const assigneeOptions = [
        { label: "All Assignees", value: "" },
        ...(EmployeeDetails?.data
            ?.filter((emp) => emp?.Name)
            .map((emp) => ({
                value: emp.Name,
                label: `${emp.Name}`,
            })) || [])
    ];
    




    const allowedClientDepartments = ['Maintenance', 'Sales', 'Accounts', 'Housekeeping'];
const DepartmentOptions = [
  { label: "All Departments", value: "" },
  ...(
    DynamicValuesDetails?.data
      ?.filter((prop) => {
        if (!prop.Departments) return false;

        if (decryptedUser?.employee?.Role?.toLowerCase() === "client") {
          // Only include departments from the allowed list if the user is a client
          return allowedClientDepartments.includes(prop.Departments);
        }

        return true; // For non-client users, include all with Departments
      })
      ?.map((prop) => ({
        value: prop.Departments,
        label: prop.Departments,
      })) || []
  )
];






    const assigneeOptionsForCreatedBy = [
        { label: "All CreatedBy", value: "" },
        ...(EmployeeDetails?.data
            ?.filter((emp) => emp?.Name)
            .map((emp) => ({
                value: emp.Name,
                label: `${emp.Name}`,
            })) || [])
    ];

    const ManagerOptions = [
        { label: "All managers", value: "" },
        ...(EmployeeDetails?.data
            ?.filter((emp) => emp?.Name && Managers.includes(emp?.Designation))
            .map((emp) => ({
                value: emp.Name,
                label: `${emp.Name}`,
            })) || [])
    ];


    const defaultValues = {
        Status: statusOptions[0],
        // Priority: priorityOptions[0],
        Department: DepartmentOptions[0],
        Assignee: assigneeOptions[0],
        Manager: ManagerOptions[0],
        Priority: PriorityOptions[0],
        CreatedByName: assigneeOptionsForCreatedBy[0],
    };


    function formatDateToDDMMMYYYY(dateString) {
        const date = new Date(dateString);
        if (isNaN(date)) return "";

        const day = String(date.getDate()).padStart(2, '0');
        const month = date.toLocaleString('en-US', { month: 'short' });
        const year = date.getFullYear();

        return `${day} ${month} ${year}`;
    }




    const { control, watch, reset } = useForm({
        defaultValues: {
            Status: statusOptions.filter(opt => filters.Status?.includes(opt.value)) || defaultValues.Status,
            // Priority: priorityOptions.find((opt) => opt.value === filters.Priority) || defaultValues.Priority,
            Department: DepartmentOptions.find((opt) => opt.value === filters.Department) || defaultValues.Department,
            Assignee: assigneeOptions.find((opt) => opt.value === filters.Assignee) || defaultValues.Assignee,
            Manager: ManagerOptions.find((opt) => opt.value === filters.Manager) || defaultValues.Manager,
            Priority: PriorityOptions.find((opt) => opt.value === filters.Priority) || defaultValues.Priority,
            CreatedByName: assigneeOptionsForCreatedBy.find((opt) => opt.value === filters.CreatedByName) || defaultValues.CreatedByName,
            TargetDate: filters.TargetDate || "",

        },
    });

    const watchedStatus = watch("Status");
    const watchedDepartment = watch("Department");
    const watchedAssignee = watch("Assignee");
    const watchedManager = watch("Manager");
    const watchedTargetDate = watch("TargetDate");
    const watchedPriority = watch("Priority");
    const watchedCreatedByName = watch("CreatedByName");
    // const watchedPriority = watch("Priority"); // Uncomment if Priority is used
    React.useEffect(() => {
        setFilters({
            Status: Array.isArray(watchedStatus)
                ? watchedStatus.map(option => option.value)
                : watchedStatus && watchedStatus.value
                    ? [watchedStatus.value]
                    : [],
            Priority: watchedPriority?.value || "", // or watchedPriority?.value || "" if you're using it
            Department: watchedDepartment?.value || "",
            Assignee: watchedAssignee?.value || "",
            Manager: watchedManager?.value || "",
            CreatedByName: watchedCreatedByName?.value || "",
            TargetDate: formatDateToDDMMMYYYY(watchedTargetDate) || "",
        });
    }, [watchedStatus, watchedDepartment, watchedAssignee, watchedManager, setFilters, watchedTargetDate, watchedCreatedByName, watchedPriority]);

    const handleClearFilters = () => {
        reset(defaultValues);
        setSearchTerm("")
        setInput("")
        setFilters({
            Status: "",
            Priority: "",
            Department: "",
            Assignee: "",
            Manager: "",
            TargetDate: "",
            CreatedByName: ""

        });
    };
    const inputClass = 'w-[200px] px-3 py-2 mt-1 border-2 border-orange-200 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400';

    return (
        <div className={`bg-white p-4 rounded-lg shadow ${decryptedUser?.employee?.Role.toLowerCase() === "client" ? "lg:w-fit" : ""}  mb-6`}>

            <div className=" mt-[-10px] flex justify-between font-bold">

                {currentView === "mypgtickets" ?
                    <span className="text-orange-600 underline text-lg ml-5 ">{`${myPgTicketsTotal} Ticket${filteredTickets.length > 1 ? "s" : ""} Found`} </span>
                    : <span className="text-orange-600 underline text-lg ml-5 ">{`${filteredTickets.length} Ticket${filteredTickets.length > 1 ? "s" : ""} Found`} </span>
                }
                <button
                    type="button"
                    onClick={handleClearFilters}
                    className="text-orange-600 hover:text-orange-800 font-bold text-lg mr-5 underline"
                >
                    Clear Filters
                </button>
            </div>
            <div className="w-full overflow-x-auto">
                <div className="flex gap-2">

                    <div className="ml-2">
                        <label className="block text-lg font-medium text-gray-800 after:content-[] after:ml-1 after:text-red-500">Search</label>
                        <input
                            type='text'
                            // {...register(`Search`)}
                            // disabled 
                            value={input}
                            onChange={handleSearch}
                            placeholder="Search Tickets"
                           className={`${inputClass} text-gray-800 placeholder-gray-800`}
                        />
                        {/* {renderError(`${titlePrefix}RoomNo`)}  */}
                    </div>

                    {/* Status */}
                    <div >
                        <label className="block text-lg font-medium text-gray-700 mb-1">Status</label>
                        <Controller
                            name="Status"
                            control={control}
                            render={({ field }) => (
                                <Select {...field} options={statusOptions} styles={SelectStylesfilter} isClearable={false} isMulti menuPortalTarget={document.body}
                                            menuPosition="absolute" />
                            )}
                        />
                    </div>
                    {/* Department */}
                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-1">Department</label>
                        <Controller
                            name="Department"
                            control={control}
                            render={({ field }) => (
                                <Select {...field} options={DepartmentOptions} styles={SelectStylesfilter} isClearable={false} menuPortalTarget={document.body}
                                            menuPosition="absolute" />
                            )}
                        />
                    </div>
                    {decryptedUser?.employee?.Role !== "client" && (
                        <>

                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-1">Manager</label>
                                <Controller
                                    name="Manager"
                                    control={control}
                                    render={({ field }) => (
                                        <Select {...field} options={ManagerOptions} styles={SelectStylesfilter} isClearable={false} menuPortalTarget={document.body}
                                            menuPosition="absolute" />
                                    )}
                                />
                            </div>

                            {/* Assignee */}
                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-1">Assigned To</label>
                                <Controller
                                    name="Assignee"
                                    control={control}
                                    render={({ field }) => (
                                        <Select {...field} options={assigneeOptions} styles={SelectStylesfilter} isClearable={false} menuPortalTarget={document.body}
                                            menuPosition="absolute" />
                                    )}
                                />
                            </div>
                            <div>
                                <label className="block text-lg font-medium text-black mb-2">
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
                                                className="w-full border mt-[-3px] border-orange-500 rounded px-3 py-[8px] pr-10 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
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

                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-1">Created By</label>
                                <Controller
                                    name="CreatedByName"
                                    control={control}
                                    render={({ field }) => (
                                        <Select {...field} options={assigneeOptionsForCreatedBy} styles={SelectStylesfilter} isClearable={false}  menuPortalTarget={document.body}
                                            menuPosition="absolute"/>
                                    )}
                                />
                            </div>
                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-1">Priority</label>
                                <Controller
                                    name="Priority"
                                    control={control}
                                    render={({ field }) => (
                                        <Select {...field} options={PriorityOptions} styles={SelectStylesfilter} isClearable={false} menuPortalTarget={document.body}
                                            menuPosition="absolute" />
                                    )}
                                />
                            </div>
                        </>
                    )}

                </div>
            </div>
            {/* Clear Filters Button */}

        </div>
    );
};
