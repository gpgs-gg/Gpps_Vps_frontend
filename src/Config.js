// Example: src/config.js
export const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;
export const MAP_KEY = process.env.Map_Api_Key

export const SelectStyles = {
  control: (base, state) => ({
    ...base,
    width: "100%",
    paddingTop: "0.25rem",
    paddingBottom: "0.10rem",
    paddingLeft: "0.75rem",
    paddingRight: "0.50rem",
    marginTop: "0.30rem",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: state.isFocused ? "#fb923c" : "#f97316",
    borderRadius: "0.375rem",
    boxShadow: state.isFocused
      ? "0 0 0 2px rgba(251,146,60,0.5)"
      : "0 1px 2px rgba(0,0,0,0.05)",
    backgroundColor: "white",
    minHeight: "10px",
    "&:hover": { borderColor: "#fb923c" },
  }),
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? "white" : "#fb923c",
    backgroundColor: state.isSelected ? "#fb923c" : "white",
    "&:hover": { backgroundColor: "#fed7aa" }
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999
  })
};



export const SelectStylesfilter = {
  control: (base, state) => ({
    ...base,
    width: "200px",
    paddingTop: "0.25rem",
    paddingBottom: "0.10rem",
    paddingLeft: "0.75rem",
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

export const CategoryOptions = [
  { value: "Others", label: "Others" },
  { value: "Rent Receipt", label: "Rent Receipt" },
  { value: "F&F Settlement", label: "F&F Settlement" },
  { value: "Rent", label: "Rent" },
  { value: "Bed", label: "Bed" },
  { value: "Red Flag", label: "Red Flag" },
  { value: "Deposit", label: "Deposit" },
  { value: "Notice", label: "Notice" },
  { value: "Agreement", label: "Agreement" },
  { value: "Police NOC", label: "Police NOC" },
  { value: "Handover", label: "Handover" },
  { value: "Possession", label: "Possession" },
  { value: "Shifting", label: "Shifting" },
  { value: "New Male PG", label: "New Male PG" },
  { value: "New Female PG", label: "New Female PG" },
  { value: "Health Issue", label: "Health Issue" },
  { value: "Safety Concerns", label: "Safety Concerns" },
  { value: "No Water", label: "No Water" },
  { value: "No Power", label: "No Power" },
  { value: "Electric Short Circuit", label: "Electric Short Circuit" },
  { value: "Fan", label: "Fan" },
  { value: "Fan Regulator", label: "Fan Regulator" },
  { value: "Fan Switch", label: "Fan Switch" },
  { value: "Fan Capacitor", label: "Fan Capacitor" },
  { value: "Exhaust Fan", label: "Exhaust Fan" },
  { value: "LED Tubelight", label: "LED Tubelight" },
  { value: "LED Bulb", label: "LED Bulb" },
  { value: "MSEB Meter", label: "MSEB Meter" },
  { value: "Sub Meter", label: "Sub Meter" },
  { value: "MSEB Bill", label: "MSEB Bill" },
  { value: "Electricity Bill", label: "Electricity Bill" },
  { value: "EB Details", label: "EB Details" },
  { value: "Client Details", label: "Client Details" },
  { value: "New Sheet", label: "New Sheet" },
  { value: "Vehicle", label: "Vehicle" },
  { value: "New Sheet", label: "New Sheet" },
  { value: "Light Switch", label: "Light Switch" },
  { value: "Three Pin Socket", label: "Three Pin Socket" },
  { value: "Extension Board", label: "Extension Board" },
  { value: "Geyser", label: "Geyser" },
  { value: "Tap Leakage", label: "Tap Leakage" },
  { value: "Water Purifier", label: "Water Purifier" },
  { value: "Washing Machine", label: "Washing Machine" },
  { value: "Fridge", label: "Fridge" },
  { value: "WiFi", label: "WiFi" },
  { value: "AC", label: "AC" },
  { value: "AC Switch", label: "AC Switch" },
  { value: "AC Remote", label: "AC Remote" },
  { value: "Water Motor Pump", label: "Water Motor Pump" },
  { value: "Main Door", label: "Main Door" },
  { value: "Main Lock", label: "Main Lock" },
  { value: "Cupboard Door", label: "Cupboard Door" },
  { value: "Cupboard Lock", label: "Cupboard Lock" },
  { value: "Bedroom Door", label: "Bedroom Door" },
  { value: "Bedroom Lock", label: "Bedroom Lock" },
  { value: "Washroom Door", label: "Washroom Door" },
  { value: "Washroom Lock", label: "Washroom Lock" },
  { value: "Washroom Window", label: "Washroom Window" },
  { value: "Washroom", label: "Washroom" },
  { value: "Bathroom", label: "Bathroom" },
  { value: "Toilet Door", label: "Toilet Door" },
  { value: "Toilet Lock", label: "Toilet Lock" },
  { value: "Toilet Window", label: "Toilet Window" },
  { value: "Toilet Commode", label: "Toilet Commode" },
  { value: "Toilet", label: "Toilet" },
  { value: "Cleaning", label: "Cleaning" },
  { value: "Wiper", label: "Wiper" },
  { value: "Rat", label: "Rat" },
  { value: "Pest Control", label: "Pest Control" },
  { value: "Emergency Contacts", label: "Emergency Contacts" },

  // IT department 
  { value: "New Requirement", label: "New Requirement" },
  { value: "Update Issue", label: "Update Issue" },
  { value: "Save Issue", label: "Save Issue" },
  { value: "Login Issue", label: "Login Issue" },
  { value: "Change Password Issue", label: "Change Password Issue" },
  { value: "Msg Issue", label: "Msg Issue" },
  { value: "Calculation Issue", label: "Calculation Issue" },
  { value: "Color Issue", label: "Color Issue" },
  { value: "Ui Size Issue", label: "UI Size Issue" }
];

export const DepartmentOptions = [
  { value: "Maintenance", label: "Maintenance" },
  { value: "Housekeeping", label: "Housekeeping" },
  { value: "Accounts", label: "Accounts" },
  { value: "Sales", label: "Sales" },
  { value: "Marketing", label: "Marketing" },
  { value: "Admin", label: "Admin" },
  { value: "Human Resource", label: "Human Resource" },
  { value: "Management", label: "Management" },
  { value: "IT", label: "IT" },

];

export const PriorityOptions = [
  { value: "", label: "All Priorities" },
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
  { value: "Critical", label: "Critical" },
];
export const PriorityOptionsForForm = [
  // { value: "", label: "All Priorities" },
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
  { value: "Critical", label: "Critical" },
];

export const StatusOptions = [
  { value: "Open", label: "Open" },
  { value: "Acknowledged", label: "Acknowledged" },
  { value: "In Progress", label: "In Progress" },
  { value: "On Hold", label: "On Hold" },
  { value: "Resolved", label: "Resolved" },
  { value: "Closed", label: "Closed" },
  { value: "Cancelled", label: "Cancelled" },
  { value: "Re-Open", label: "Re-Open" },
];

export const CusmoterImpactedOptions = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
];

export const Managers = ["Sr. Manager", "Manager", "Team Leader", "Chairman & Group CEO", "EA to Chairman & Group CEO"]







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


export  const generateWorklog = (oldData, newData, userName, empId) => {
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




