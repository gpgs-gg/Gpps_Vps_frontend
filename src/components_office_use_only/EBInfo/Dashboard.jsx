import { useMemo } from "react";
import DashboardSkeleton from "./DashboardSkeleton";

const StatCard = ({ title, value, subtitle, color }) => {
  return (
    <div
      className="bg-white rounded-xl shadow p-5 border-l-4"
      style={{ borderColor: color }}
    >
      <h3 className="text-sm font-semibold text-gray-600">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
};

const Dashboard = ({ data = [], isPending }) => {
  const stats = useMemo(() => {
    const totalRecords = data.length;

    const calculated = data.filter(
      (r) => r.EBCalnStatus?.toLowerCase() === "approved",
    ).length;

    const pendingCalculation = data.filter(
      (r) => r.EBCalnStatus?.toLowerCase() !== "calculated",
    ).length;

    const paid = data.filter(
      (r) => r.EBPaidStatus?.toLowerCase() === "paid",
    ).length;

    const pendingPaid = data.filter(
      (r) => r.EBPaidStatus?.toLowerCase() !== "paid",
    ).length;

    const totalEBAmount = data.reduce(
      (sum, r) => sum + Number(r.FlatEB || 0),
      0,
    );

    const totalUnits = data.reduce(
      (sum, r) => sum + Number(r.FlatUnits || 0),
      0,
    );

    return {
      totalRecords,
      calculated,
      pendingCalculation,
      paid,
      pendingPaid,
      totalEBAmount,
      totalUnits,
    };
  }, [data]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          EB Calculation Dashboard
        </h2>
        <p className="text-gray-500 text-sm">
          Overview of EB calculation & payment status
        </p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total EB Records"
          value={stats.totalRecords}
          color="#2563eb"
        />

        <StatCard
          title="EB Calculated"
          value={stats.calculated}
          subtitle="Completed calculations"
          color="#16a34a"
        />
                <StatCard
          title="Pending Calculation"
          value={stats.pendingCalculation}
          subtitle="Needs action"
          color="#f59e0b"
        />
<StatCard
          title="Paid Records"
          value={stats.paid}
          subtitle="EB paid"
          color="#22c55e"
        />
       

        
      </div>

     
    </div>
  );
};

export default Dashboard;

// import { useMemo } from "react";

// const StatCard = ({ title, value, subtitle, color }) => {
//   return (
//     <div
//       className="bg-white rounded-xl shadow p-5 border-l-4"
//       style={{ borderColor: color }}
//     >
//       <h3 className="text-sm font-semibold text-gray-600">{title}</h3>
//       <p className="text-3xl font-bold mt-2">{value}</p>
//       {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
//     </div>
//   );
// };

// const Dashboard = ({ data = [] }) => {
//   const stats = useMemo(() => {
//     const totalRecords = data.length;

//     const calculated = data.filter(
//       (r) => r.EBCalnStatus?.toLowerCase() === "calculated",
//     ).length;

//     const pendingCalculation = data.filter(
//       (r) => r.EBCalnStatus?.toLowerCase() !== "calculated",
//     ).length;

//     const paid = data.filter(
//       (r) => r.EBPaidStatus?.toLowerCase() === "paid",
//     ).length;

//     const pendingPaid = data.filter(
//       (r) => r.EBPaidStatus?.toLowerCase() !== "paid",
//     ).length;

//     const totalEBAmount = data.reduce(
//       (sum, r) => sum + Number(r.FlatEB || 0),
//       0,
//     );

//     const totalUnits = data.reduce(
//       (sum, r) => sum + Number(r.FlatUnits || 0),
//       0,
//     );

//     return {
//       totalRecords,
//       calculated,
//       pendingCalculation,
//       paid,
//       pendingPaid,
//       totalEBAmount,
//       totalUnits,
//     };
//   }, [data]);

//   return (
//     <div className="space-y-6">
//       {/* HEADER */}
//       <div>
//         <h2 className="text-2xl font-bold text-gray-900">
//           EB Calculation Dashboard
//         </h2>
//         <p className="text-gray-500 text-sm">
//           Overview of EB calculation & payment status
//         </p>
//       </div>

//       {/* STATS GRID */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatCard
//           title="Total EB Records"
//           value={stats.totalRecords}
//           color="#2563eb"
//         />

//         <StatCard
//           title="EB Calculated"
//           value={stats.calculated}
//           subtitle="Completed calculations"
//           color="#16a34a"
//         />

        // <StatCard
        //   title="Pending Calculation"
        //   value={stats.pendingCalculation}
        //   subtitle="Needs action"
        //   color="#f59e0b"
        // />
//         <StatCard
//           title="Paid Records"
//           value={stats.paid}
//           subtitle="EB paid"
//           color="#22c55e"
//         />

       
//       </div>

//       {/* FINANCIAL SUMMARY */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      

      

        
//       </div>
//     </div>
//   );
// };

// export default Dashboard;