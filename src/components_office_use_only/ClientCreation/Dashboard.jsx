import { useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import { DashboardSkeleton } from "./Skeleton";
import {useClientDetails} from "./services";
import { DashboardSkeleton } from "./ClientMasterSkeleton";
import { Link } from "react-router-dom";
const StatCard = ({ title, value, subtitle, color }) => {
  return (
    <div
      className="bg-white rounded-xl shadow p-5 border-l-4"
      style={{ borderColor: color }}
    >
      <h3 className="text-sm font-semibold text-gray-600">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
      {subtitle && (
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      )}
    </div>
  );
};

const Dashboard = () => {
 
 const { data, isPending: isNewBookingPending } = useClientDetails();

  // ✅ Safe raw data
  const rawData = data?.data || [];
  const [dateRange, setDateRange] = useState({
    from: null,
    to: null,
  });

  // ✅ Normalize function
 const normalize = (val) => {
  if (
    val === null ||
    val === undefined ||
    val === "" ||
    val === "NA" ||
    val === "N/A"
  ) {
    return "na";
  }

  return val.toString().trim().toLowerCase();
};

  // ✅ Filtered Data Based On Date
  const filteredData = useMemo(() => {
    if (!dateRange.from && !dateRange.to) return rawData;

    return rawData.filter((row) => {
      if (!row.Date) return false;

      const rowDate = new Date(row.Date);
      if (dateRange.from && rowDate < dateRange.from) return false;
      if (dateRange.to && rowDate > dateRange.to) return false;

      return true;
    });
  }, [rawData, dateRange]);

  // ✅ Stats Calculation
 const stats = useMemo(() => {
  const totalRecords = filteredData.length;

  // Active Clients
  const ActiveClient = filteredData.filter(
    (r) => normalize(r.IsActive) === "yes"
  ).length;

  // Aadhar Card Not Found
  const AddharCardNotFound = filteredData.filter(
    (r) => !r.AddharCard || normalize(r.AddharCard) === "na"
  ).length;

  // Photo Not Found
  const PhotoNotFound = filteredData.filter(
    (r) => !r.Photo || normalize(r.Photo) === "na"
  ).length;

  // Company ID Not Found
  const CompanyIDNotFound = filteredData.filter(
    (r) => !r.CompanyID || normalize(r.CompanyID) === "na"
  ).length;

  // College ID Not Found
  const CollageIDNotFound = filteredData.filter(
    (r) => !r.CollageID || normalize(r.CollageID) === "na"
  ).length;

  // Rental Agreement Not Found
  const rentalAgreement = filteredData.filter(
    (r) => !r.ClientAgreement || normalize(r.ClientAgreement) === "na"
  ).length;

  // Police NOC Not Found
  const policeNoc = filteredData.filter(
    (r) => !r.ClientPoliceNoc || normalize(r.ClientPoliceNoc) === "na"
  ).length;

  // PAN Card Not Found
  const panCard = filteredData.filter(
    (r) => !r.PanCard || normalize(r.PanCard) === "na"
  ).length;

  return {
    totalRecords,
    ActiveClient,
    AddharCardNotFound,
    PhotoNotFound,
    CompanyIDNotFound,
    CollageIDNotFound,
    rentalAgreement,
    policeNoc,
    panCard,
  };
}, [filteredData]);
  if (isNewBookingPending) {
    return <>
      <DashboardSkeleton/>
    </>
  }
  return (
    <div className="space-y-6 p-5">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
           Clinet Master Dashboard
          </h2>
          <p className="text-gray-500 text-sm">
            Overview of Client Master records & status
          </p>
        </div>
             <Link to={"/gpgs-actions/new-booking-list"} className="border bg-black text-white p-1 px-2 rounded-md mr-5">
          <i class="fa-solid fa-arrow-right"></i> New Booking
        </Link>

        {/* DATE RANGE */}
        {/* <div className="flex items-center gap-2 bg-white border border-orange-400 px-3 py-2 rounded-md shadow mr-5">
          <span className="text-sm text-orange-600 font-medium">From</span>

          <DatePicker
            selected={dateRange.from}
            onChange={(date) =>
              setDateRange((prev) => ({ ...prev, from: date }))
            }
            selectsStart
            startDate={dateRange.from}
            endDate={dateRange.to}
            dateFormat="dd MMM yyyy"
            isClearable
            placeholderText="Select Date"
            className="w-28 text-center outline-none text-sm"
          />

          <span className="text-sm text-orange-600 font-medium">To</span>

          <DatePicker
            selected={dateRange.to}
            onChange={(date) =>
              setDateRange((prev) => ({ ...prev, to: date }))
            }
            selectsEnd
            startDate={dateRange.from}
            endDate={dateRange.to}
            minDate={dateRange.from}
            isClearable
            dateFormat="dd MMM yyyy"
            placeholderText="Select Date"
            className="w-28 text-center outline-none text-sm"
          />
        </div> */}
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total counts"
          value={stats.totalRecords}
          color="#2563eb"
        />

        <StatCard
          title=" Active Clients"
          value={stats.ActiveClient}
          // subtitle="Booking Completed"
          color="#16a34a"
        />

        <StatCard
          title="Addhar Card Not Found"
          value={stats.AddharCardNotFound}
          // subtitle="Updated Records"
          color="#f59e0b"
        />

        <StatCard
          title="Photo Not Found"
          value={stats.PhotoNotFound}
          // subtitle="Updated Records"
          color="#22c55e"
        />

        <StatCard
          title="Company ID Not Found"
          value={stats.CompanyIDNotFound}
          // subtitle="Group Added"
          color="#6366f1"
        />

        <StatCard
          title="College ID Not Found"
          value={stats.CollageIDNotFound}
          // subtitle="Client Master Entry"
          color="#0ea5e9"
        />

        <StatCard
          title="Rental Agreement Not Found"
          value={stats.rentalAgreement}
          // subtitle="Closed Records"
          color="#ef4444"
        />
        <StatCard
          title="Police NOC Not Found"
          value={stats.policeNoc}
          // subtitle="Closed Records"
          color="#ef4444"
        />
        <StatCard
          title="PAN Card Not Found"
          value={stats.panCard}
          // subtitle="Closed Records"
          color="#ef4444"
        />


      </div>
    </div>
  );
};

export default Dashboard;