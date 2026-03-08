import React, { memo } from "react";
import Select from "react-select";
import { Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import LoaderPage from "../NewBooking/LoaderPage";

const EmployeesCreate = ({
  
    DropdownOptions,
    control,
    register,
    handleSubmit,
    errors,
    onSubmit,
    reset,
    setActiveTab,
    isUpdating,
    editingRow,
    setEditingRow,
    goToNext,
    goToPrevious,
    currentIndex,
    totalLength,
    setCurrentPage,

    /* Documents Related */
    documentsList,
    uploadedDocs,
    existingDocs,
    handleFileChange,
    handleUploadClick,
    handleSave,
    handleRemoveFile,
    fileInputRefs,
    pendingDocType,
    isDocument,
    allDocsUploaded,
  }) => {

    const {DepartmentCompanyOptions , DepartmentOptions, DesignationOptions, SubsidiaryOptions, RoleOptions, ParentCompanyOptions } = DropdownOptions;
    
    const MemoizedSelect = memo(({ field, options, placeholder, isDisabled, onChange, styles }) => (
        <div className={isDisabled ? "cursor-not-allowed" : "cursor-pointer"}>
          <Select
            {...field}
            value={
              field.value
                ? options?.find((opt) => opt.value === field.value)
                : null
            }
            isDisabled={isDisabled}
            options={options}
            placeholder={placeholder}
            styles={styles}
            onChange={(selectedOption) => onChange(selectedOption ? selectedOption.value : "")}
            isClearable
            isSearchable
            menuShouldScrollIntoView={false}
          />
        </div>
      ));
    
      const employeeSelectStyles = {
        control: (base, state) => ({
          ...base,
          padding: "0.20rem 0.5rem",
          marginTop: "0.50rem",
          borderWidth: "1px",
          borderColor: state.isFocused ? "#fb923c" : "#f97316",
          borderRadius: "0.375rem",
          boxShadow: state.isFocused ? "0 0 0 2px rgba(251,146,60,0.5)" : "0 1px 2px rgba(0,0,0,0.05)",
          backgroundColor: state.isDisabled ? "#f5f5f5" : "white",
          minHeight: "40px",
          "&:hover": { borderColor: "#fb923c" },
        }),
        option: (provided, state) => ({
          ...provided,
          color: state.isSelected ? "white" : "#fb923c",
          backgroundColor: state.isSelected ? "#fb923c" : "white",
          "&:hover": { backgroundColor: "#fed7aa" },
        }),
        menu: (provided) => ({ ...provided, zIndex: 9999 }),
      };

    const inputClass = 'w-full px-3  py-2 mt-1 border border-orange-500 rounded-md shadow focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400 disabled:cursor-not-allowed';

    const isActiveOptions = [
        { value: 'Yes', label: 'Yes' },
        { value: 'No', label: 'No' },
    ];


    return (
        <div className="overflow-auto border border-gray-200 rounded-lg p-2">
            {editingRow && (
            <div className="flex justify-end items-center pb-2 gap-5 pr-5">
                <span className="text-sm text-gray-700">
                Sr. No.{currentIndex + 1}
                </span>
                <button
                onClick={goToPrevious}
                disabled={currentIndex === 0}
                className="px-3 py-1 bg-orange-400 text-white rounded disabled:opacity-50 hover:bg-orange-500 transition-colors"
                >
                <i className="fa-solid fa-arrow-left"></i> Previous
                </button>

                <button
                onClick={goToNext}
                disabled={currentIndex === totalLength - 1}
                className="px-3 py-1 bg-orange-400 text-white rounded disabled:opacity-50 hover:bg-orange-500 transition-colors"
                >
                Next <i className="fa-solid fa-arrow-right"></i>
                </button>
            </div>
            )}
            
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white shadow-sm py-5 rounded-b-lg px-10 max-w-8xl w-full"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">

                  {/* ================= Employee ID ================= */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Employee ID
                    </label>
                    <input
                      type="text"
                      {...register("EmployeeID")}
                      className={inputClass}
                      disabled
                    />
                    {errors.EmployeeID && (<p className="text-red-500 text-sm">{errors.EmployeeID.message}</p>)}
                  </div>

                  {/* ================= Active ================= */}
                  {editingRow && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Active <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name="IsActive"
                      control={control}
                      render={({ field }) => (
                        <MemoizedSelect
                          field={field}
                          options={isActiveOptions}
                          placeholder="Select Status"
                          styles={employeeSelectStyles}
                          onChange={field.onChange}
                          menuPortalTarget={document.body}
                          menuPosition="fixed"
                        />
                      )}
                    />
                    {errors.IsActive && (<p className="text-red-500 text-sm">{errors.IsActive.message}</p>)}
                  </div>
                  )}

                  {/* ================= Name ================= */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input {...register("Name")} className={inputClass} placeholder='Full Name'/>
                    {errors.Name && (<p className="text-red-500 text-sm">{errors.Name.message}</p>)}
                  </div>

                  {/* ================= Department ================= */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name="Department"
                      control={control}
                      render={({ field }) => (
                        <MemoizedSelect
                          field={field}
                          options={DepartmentOptions}
                          placeholder="Search & Select"
                          styles={employeeSelectStyles}
                          menuPortalTarget={document.body}
                          menuPosition="fixed"
                          onChange={field.onChange}
                        />
                      )}
                    />
                    {errors.Department && (<p className="text-red-500 text-sm">{errors.Department.message}</p>)}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department -(Company Name) <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name="Department - (CompanyName)"
                      control={control}
                      render={({ field }) => (
                        <MemoizedSelect
                          field={field}
                          options={DepartmentCompanyOptions}
                          placeholder="Search & Select"
                          styles={employeeSelectStyles}
                          menuPortalTarget={document.body}
                          menuPosition="fixed"
                          onChange={field.onChange}
                        />
                      )}
                    />
                    {errors.Department && (<p className="text-red-500 text-sm">{errors.Department.message}</p>)}
                  </div>

                    {/* ================= Designation ================= */}                 
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Designation <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name="Designation"
                      control={control}
                      render={({ field }) => (
                        <MemoizedSelect
                          field={field}
                          options={DesignationOptions}
                          placeholder="Search & Select"
                          styles={employeeSelectStyles}
                          menuPortalTarget={document.body}
                          menuPosition="fixed"
                          onChange={field.onChange}
                        />
                      )}
                    />
                    {errors.Designation && (<p className="text-red-500 text-sm">{errors.Designation.message}</p>)}
                  </div>

                    {/* ================= DOJ ================= */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Joining <span className="text-red-500">*</span>
                      </label>
                      <Controller
                        name="DOJ"
                        control={control}
                        render={({ field }) => (
                          <DatePicker
                            selected={field.value}
                            onChange={(date) => field.onChange(date)}
                            dateFormat="d MMM yyyy"
                            placeholderText="dd mm yyyy"
                            className={inputClass}
                            wrapperClassName="w-full"
                          />
                        )}
                      />
                      {errors.DOJ && (<p className="text-red-500 text-sm">{errors.DOJ.message}</p>)}
                    </div>

                    {/* ================= DOB ================= */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <Controller
                        name="DOB"
                        control={control}
                        render={({ field }) => (
                          <DatePicker
                            selected={field.value}
                            onChange={(date) => field.onChange(date)}
                            dateFormat="d MMM yyyy"
                            placeholderText="dd mm yyyy"
                            className={inputClass}
                            wrapperClassName="w-full"
                          />
                        )}
                      />
                      {errors.DOB && (<p className="text-red-500 text-sm">{errors.DOB.message}</p>)}
                    </div>

                    {/* ================= Parent Company ================= */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Parent Company <span className="text-red-500">*</span>
                      </label>
                      {/* <input {...register("ParentCompany")} className={inputClass} disabled /> */}
                      <Controller
                      name="ParentCompany"
                      control={control}
                      render={({ field }) => (
                        <MemoizedSelect
                          field={field}
                          options={ParentCompanyOptions}
                          placeholder="Select Parent Company"
                          styles={employeeSelectStyles}
                          onChange={field.onChange}
                          menuPortalTarget={document.body}
                          menuPosition="fixed"
                        />
                      )}
                    />
                      {errors.ParentCompany && (<p className="text-red-500 text-sm">{errors.ParentCompany.message}</p>)}
                    </div>

                    {/* ================= Role ================= */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role <span className="text-red-500">*</span>
                      </label>
                      {/* <input {...register("Role")} className={inputClass} disabled/> */}
                      <Controller
                      name="Role"
                      control={control}
                      render={({ field }) => (
                        <MemoizedSelect
                          field={field}
                          options={RoleOptions}
                          placeholder="Select Role"
                          styles={employeeSelectStyles}
                          onChange={field.onChange}
                          menuPortalTarget={document.body}
                          menuPosition="fixed"
                        />
                      )}
                    />
                      {errors.Role && (<p className="text-red-500 text-sm">{errors.Role.message}</p>)}
                    </div>

                    {/* ================= Subsidiary ================= */}                   
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subsidiary <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name="Subsidiary"
                      control={control}
                      render={({ field }) => (
                        <MemoizedSelect
                          field={field}
                          options={SubsidiaryOptions}
                          placeholder="Select Subsidiary"
                          styles={employeeSelectStyles}
                          onChange={field.onChange}
                          menuPortalTarget={document.body}
                          menuPosition="fixed"
                        />
                      )}
                    />
                    {errors.Subsidiary && (<p className="text-red-500 text-sm">{errors.Subsidiary.message}</p>)}
                  </div>

                  {/* ================= WhatsApp No================= */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      WhatsApp No <span className="text-red-500">*</span>
                    </label>
                    <input type="number" {...register("WhatsAppNo")} className={inputClass} placeholder='WhatsApp No'/>
                    {errors.WhatsAppNo && (<p className="text-red-500 text-sm">{errors.WhatsAppNo.message}</p>)}
                  </div>

                  {/* ================= Calling No================= */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Calling No <span className="text-red-500">*</span>
                    </label>
                    <input type="number" {...register("CallingNo")} className={inputClass} placeholder='Calling No'/>
                    {errors.CallingNo && (<p className="text-red-500 text-sm">{errors.CallingNo.message}</p>)}
                  </div>

                  {/* ================= Email Id================= */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input type="email" {...register("Email")} className={inputClass} placeholder='Email'/>
                    {errors.Email && (<p className="text-red-500 text-sm">{errors.Email.message}</p>)}
                  </div>

                  {/* ================= Permanent Address ================= */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Permanent Address <span className="text-red-500">*</span>
                    </label>
                    <textarea {...register("PermanentAddress")} rows={1} className={inputClass} placeholder='Permanent Address'/>
                    {errors.PermanentAddress && (<p className="text-red-500 text-sm">{errors.PermanentAddress.message}</p>)}
                  </div>

                  {/* ================= Temporary Address ================= */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Temporary Address <span className="text-red-500">*</span>
                    </label>
                    <textarea {...register("TemporaryAddress")} rows={1} className={inputClass} placeholder='Temporary Address'/>
                    {errors.TemporaryAddress && (<p className="text-red-500 text-sm">{errors.TemporaryAddress.message}</p>)}
                  </div>

                  {/* ================= Emergency Contact 1 ================= */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Emergency Contact 1 Name <span className="text-red-500">*</span>
                    </label>
                    <input {...register("EmgyCont1FullName")} className={inputClass} placeholder='Emergency Contact 1 Name'/>
                    {errors.EmgyCont1FullName && (<p className="text-red-500 text-sm">{errors.EmgyCont1FullName.message}</p>)}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Emergency Contact 1 No <span className="text-red-500">*</span>
                    </label>
                    <input type="number" {...register("EmgyCont1No")} className={inputClass} placeholder='Emergency Contact 1 No'/>
                    {errors.EmgyCont1No && (<p className="text-red-500 text-sm">{errors.EmgyCont1No.message}</p>)}
                  </div>

                  {/* ================= Emergency Contact 2 ================= */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Emergency Contact 2 Name <span className="text-red-500">*</span>
                    </label>
                    <input {...register("EmgyCont2FullName")} className={inputClass} placeholder='Emergency Contact 2 Name'/>
                    {errors.EmgyCont2FullName && (<p className="text-red-500 text-sm">{errors.EmgyCont2FullName.message}</p>)}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Emergency Contact 2 No <span className="text-red-500">*</span>
                    </label>
                    <input type="number" {...register("EmgyCont2No")} className={inputClass} placeholder='Emergency Contact 2 No'/>
                    {errors.EmgyCont2No && (<p className="text-red-500 text-sm">{errors.EmgyCont2No.message}</p>)}
                  </div>

                  {/* ================= Login ID ================= */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Login ID <span className="text-red-500">*</span>
                    </label>
                    <input type="email" {...register("LoginID")} className={inputClass} placeholder='Login ID'/>
                    {errors.LoginID && (<p className="text-red-500 text-sm">{errors.LoginID.message}</p>)}
                  </div>
                                      
                  {/* Worklogs */}
                  {editingRow && (
                  <div className='col-span-1 md:col-span-3 lg:col-span-3'>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Worklogs
                    </label>
                    <Controller
                      name="Worklogs"
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
                  )}

                {/* ================= BUTTONS ================= */}
                <div className="flex pt-7 items-center gap-4 col-span-1">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className={`px-6 h-10 rounded font-semibold flex items-center justify-center gap-2
                        ${isUpdating
                        ? "bg-orange-300 cursor-not-allowed"
                        : "bg-orange-500 hover:bg-orange-600 text-white"
                      }`}
                  >
                    {isUpdating ? (
                      <>
                        <LoaderPage />
                        <span>{editingRow ? "Updating..." : "Creating..."}</span>
                      </>
                    ) : (
                      editingRow ? "Update" : "Create"
                    )}
                  </button>

                  <button type="button"  onClick={() => { if (!editingRow) {setCurrentPage(1); }reset(); setActiveTab("LIST"); setEditingRow(null); }} 
                  className="px-6 py-2 h-10 bg-gray-200 hover:bg-gray-300 rounded font-semibold">
                    Cancel
                  </button>
                </div>
                </div>  
            </form>

        {/* =====================Document Upload==============================*/}
          <div className="max-w-full md:px-4 py-6">
            <div className="bg-white border border-orange-300 rounded-lg shadow-sm p-6">
              <div className=' flex justify-between items-center'>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <i className="fas fa-folder-open mr-2 text-orange-500"></i>
                Document Upload & Preview  
              </h2>

              {/* ===== SAVE BUTTON ===== */}
              <div className="flex justify-end mb-4  border  w-fit">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={!allDocsUploaded}
                    className={`px-4 py-2 rounded flex items-center justify-center min-w-[180px] ${
                      allDocsUploaded
                        ? "bg-orange-500 hover:bg-orange-600"
                        : "bg-gray-300 cursor-not-allowed"}
                       text-white transition`}
                  >
                    {pendingDocType === "all" ? (
                      <>
                      <div className="flex justify-center items-center gap-2">
                        <LoaderPage className="mr-2" />
                        <span>Saving Documents</span>
                      </div>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save mr-2"></i>
                        Save Documents
                      </>
                    )}
                  </button>
                </div>
                </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
                {documentsList.map((doc) => {
                  const uploaded = uploadedDocs[doc.type] || [];
                  const existing = existingDocs[doc.type] || [];

                  return (
                    <div
                      key={doc.type}
                      className="border-2 border-orange-200 rounded-lg p-4 h-full flex flex-col "
                    >
                      {/* ================= HEADER ================= */}
                      <div className="flex justify-between items-center mb-4 ">
                        <div className="flex items-center">
                          <i className={`fas text-2xl mr-3 ${doc.icon} text-orange-500`} />
                          <div>
                            <h3 className="font-semibold text-sm md:text-lg">
                              {doc.label}
                              {doc.required && (<span className="text-red-500 ml-1">*</span>)}
                            </h3>
                            <p className="text-sm text-gray-500">{doc.desc}</p>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          {/* Upload Button */}
                          <button
                            type="button"
                            onClick={() => handleUploadClick(doc.type)}
                            className="bg-orange-600 text-white px-3 py-1.5 text-sm rounded hover:bg-orange-700"
                          >
                            <i className="fas fa-upload mr-1"></i> Upload
                          </button>                                                   
                        </div>
                      </div>

                      {/* ================= PREVIEW GRID ================= */}
                      <div className="space-y-2 grid gap-6 grid-cols-2 md:grid-cols-2 items-center" >

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
                                            <div className="text-center">
                                                <h4 className="font-semibold text-lg text-gray-800">PDF</h4>
                                                <p className="text-sm text-gray-500">{url.split('/').pop()}</p>
                                            </div>
                                        ) : (
                                          
                                            <i className="w-10 h-10 flex items-center justify-center fas fa-file-pdf text-red-500 text-2xl"></i>
                                        )}
                                    </a>
                                    
                                </div>
                            ))
                        )}
                        {/* Uploaded New Files (preview) */}
                        
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
                                        <i className="fas fa-file-pdf text-red-500 text-2xl"></i>
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
                    </div>

                      {/* Hidden File Input */}
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        ref={fileInputRefs[doc.type]}
                        onChange={(e) => handleFileChange(doc.type, e)}
                      />
                    </div>
                  );
                })}                                
              </div>
            </div>
          </div>
    </div>
  )
};

export default EmployeesCreate;