import { useEffect, useRef, useMemo } from "react";
import { useApp } from "./AppProvider";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { SelectStylesfilter } from "../../Config";
import { useDynamicDetails } from "./Services";

export const Dashboard = () => {
  const { tickets } = useApp();
  const { data: DynamicValuesDetails } = useDynamicDetails();

  const statusChartRef = useRef(null);
  const priorityChartRef = useRef(null);

  const { control, watch } = useForm();
  const selectedDepartment = watch("Department");

  // ✅ Department Options
  const DepartmentOptions = useMemo(() => {
    return (
      DynamicValuesDetails?.data
        ?.filter((prop) => prop.Departments)
        ?.map((prop) => ({
          value: prop.Departments,
          label: prop.Departments,
        })) || []
    );
  }, [DynamicValuesDetails]);

  // ✅ Department Wise Filter
  const filteredTickets = useMemo(() => {
    if (!selectedDepartment?.value) return tickets;
    return tickets.filter(
      (t) => t.Department === selectedDepartment.value
    );
  }, [tickets, selectedDepartment]);

  // ✅ Stats
  const stats = useMemo(() => {
    return {
      total: filteredTickets.length,
      open: filteredTickets.filter((t) => t.Status === "Open").length,
      inProgress: filteredTickets.filter((t) => t.Status === "In Progress").length,
      resolved: filteredTickets.filter((t) => t.Status === "Resolved").length,
      closed: filteredTickets.filter((t) => t.Status === "Closed").length,
      critical: filteredTickets.filter((t) => t.Priority === "Critical").length,
      Acknowledged: filteredTickets.filter((t) => t.Status === "Acknowledged").length,
      Assigned: filteredTickets.filter((t) => t.Status === "Assigned").length,
    };
  }, [filteredTickets]);

  // ✅ Charts
  useEffect(() => {
    const statusCtx = document.getElementById("statusChart");
    const priorityCtx = document.getElementById("priorityChart");

    if (statusChartRef.current) statusChartRef.current.destroy();
    if (priorityChartRef.current) priorityChartRef.current.destroy();

    if (window.Chart && statusCtx) {
      statusChartRef.current = new window.Chart(statusCtx, {
        type: "doughnut",
        data: {
          labels: ["Open", "In Progress", "Resolved", "Closed", "Acknowledged"],
          datasets: [
            {
              data: [
                stats.open,
                stats.inProgress,
                stats.resolved,
                stats.closed,
                stats.Acknowledged,
              ],
              backgroundColor: [
                "#f97316",
                "#3b82f6",
                "#10b981",
                "#6b7280",
                "#eab308",
              ],
            },
          ],
        },
        options: { responsive: true, maintainAspectRatio: false },
      });
    }

    if (window.Chart && priorityCtx) {
      const priorityData = {
        Low: filteredTickets.filter((t) => t.Priority === "Low").length,
        Medium: filteredTickets.filter((t) => t.Priority === "Medium").length,
        High: filteredTickets.filter((t) => t.Priority === "High").length,
        Critical: filteredTickets.filter((t) => t.Priority === "Critical").length,
      };

      priorityChartRef.current = new window.Chart(priorityCtx, {
        type: "bar",
        data: {
          labels: Object.keys(priorityData),
          datasets: [
            {
              label: "Tickets",
              data: Object.values(priorityData),
              backgroundColor: [
                "#10b981",
                "#f59e0b",
                "#f97316",
                "#ef4444",
              ],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true } },
        },
      });
    }

    return () => {
      if (statusChartRef.current) statusChartRef.current.destroy();
      if (priorityChartRef.current) priorityChartRef.current.destroy();
    };
  }, [filteredTickets, stats]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Dashboard Overview
          </h2>
          <p className="text-gray-600">
            Comprehensive view of ticket management system
          </p>
        </div>

        <div className="w-64">
          <label className="text-sm text-gray-700">Department</label>
          <Controller
            name="Department"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Select"
                isClearable
                styles={SelectStylesfilter}
                options={DepartmentOptions}
              />
            )}
          />
        </div>
      </div>

      {/* Stats Cards WITH ICONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { label: "Total", value: stats.total, icon: "fas fa-ticket-alt", color: "orange" },
          { label: "Open", value: stats.open, icon: "fas fa-clock", color: "yellow" },
          { label: "Acknowledged", value: stats.Acknowledged, icon: "fa fa-check", color: "blue" },
          { label: "Assigned", value: stats.Assigned, icon: "fas fa-tasks", color: "pink" },
          { label: "In Progress", value: stats.inProgress, icon: "fas fa-spinner", color: "orange" },
          { label: "Resolved", value: stats.resolved, icon: "fas fa-check-circle", color: "green" },
          { label: "Closed", value: stats.closed, icon: "fas fa-times-circle", color: "gray" },
          { label: "Critical", value: stats.critical, icon: "fas fa-exclamation-triangle", color: "red" },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="bg-white p-4 rounded-lg shadow card-hover">
            <div className="flex items-center">
              <div className={`p-2 rounded-full bg-${color}-100 text-${color}-600`}>
                <i className={`${icon} text-lg`}></i>
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">{label}</p>
                <p className="text-xl font-bold text-gray-900">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">
            Ticket Status Distribution
          </h3>
          <div style={{ height: "300px" }}>
            <canvas id="statusChart"></canvas>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">
            Priority Distribution
          </h3>
          <div style={{ height: "300px" }}>
            <canvas id="priorityChart"></canvas>
          </div>
        </div>
      </div>

      {/* Recent Tickets */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Recent Tickets</h3>
        <div className="space-y-3">
          {filteredTickets.slice(0, 8).map((ticket) => (
            <div
              key={ticket.TicketID}
              className="flex items-center space-x-4 p-3 hover:bg-[#F8F9FB] rounded-lg"
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  ticket.Priority === "Critical"
                    ? "bg-red-500"
                    : ticket.Priority === "High"
                    ? "bg-orange-500"
                    : ticket.Priority === "Medium"
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
              ></div>

              <div className="flex-1">
                <p className="font-medium text-sm">{ticket.Title}</p>
                <p className="text-xs text-gray-500">
                  {ticket.TicketID} • {ticket.CreatedBy} • {ticket.DateCreated}
                </p>
              </div>

              <span className={`px-2 py-1 text-xs rounded-full status-${ticket.Status.toLowerCase().replace(" ", "")}`}>
                {ticket.Status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};