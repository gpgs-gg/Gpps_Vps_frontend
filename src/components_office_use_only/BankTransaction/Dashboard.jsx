import { useMemo } from "react";

const StatCard = ({ title, value,subtitle, color }) => {
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

const Dashboard = ({ data = [] }) => {

  const stats = useMemo(() => {

    const total = data.length;

    const open = data.filter(r => r.StatusForView?.toLowerCase() === "open").length;
    const wip = data.filter(r => r.StatusForView?.toLowerCase() === "wip").length;
    const updated = data.filter(r => r.StatusForView?.toLowerCase() === "updated").length;
    const reviewDone = data.filter(r => r.StatusForView?.toLowerCase() === "review done").length;

    return {
      total,
      open,
      wip,
      updated,
      reviewDone
    };

  }, [data]);

  return (
    <div className="overflow-auto bg-white space-y-6">

      {/* HEADER */}
      {/* <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Bank Transaction Dashboard
        </h2>
        <p className="text-gray-500 text-sm">
          Overview based on StatusForView
        </p>
      </div> */}

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">

        <StatCard title="Total Records" value={stats.total} color="#2563eb" />

        <StatCard title="Open" value={stats.open} color="#ef4444" />

        <StatCard title="WIP" value={stats.wip} subtitle="Work In Progress" color="#f59e0b" />

        <StatCard title="Updated" value={stats.updated} color="#3b82f6" />

        <StatCard title="Review Done" value={stats.reviewDone} color="#22c55e" />

      </div>

    </div>
  );
};

export default Dashboard;