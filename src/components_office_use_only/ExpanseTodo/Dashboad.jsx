import React, { useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useExpensesDetails } from "./services/index";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    CartesianGrid,
} from "recharts";
import { isPdfFile } from "pdfjs-dist";
import { DashboardSkeleton } from "./Skeleton";

function Dashboard() {
    const { data, isPending } = useExpensesDetails();
    const expenses = data?.data || [];

    const [dateRange, setDateRange] = useState({
        from: null,
        to: null,
    });

    /* ================= HELPERS ================= */

    const parseAmount = (amount) => {
        if (!amount) return 0;

        const cleaned = String(amount)
            .replace(/,/g, "")
            .replace(/[^\d.-]/g, "");

        const number = parseFloat(cleaned);
        return isNaN(number) ? 0 : number;
    };

    const parseDate = (dateString) => {
        if (!dateString) return null;

        // Format: "07 Feb 2026"
        const parts = dateString.split(" ");
        if (parts.length !== 3) return null;

        const [day, month, year] = parts;
        const date = new Date(`${day} ${month} ${year}`);
        return isNaN(date) ? null : date;
    };

    /* ================= DATE FILTER ================= */

    const filteredExpenses = useMemo(() => {
        if (!dateRange.from && !dateRange.to) return expenses;

        return expenses.filter((e) => {
            const expenseDate = parseDate(e.Date);
            if (!expenseDate) return false;

            const start = dateRange.from
                ? new Date(new Date(dateRange.from).setHours(0, 0, 0, 0))
                : null;

            const end = dateRange.to
                ? new Date(new Date(dateRange.to).setHours(23, 59, 59, 999))
                : null;

            if (start && expenseDate < start) return false;
            if (end && expenseDate > end) return false;

            return true;
        });
    }, [expenses, dateRange]);

    /* ================= SUMMARY ================= */

    const totalExpense = useMemo(() => {
        return filteredExpenses.reduce(
            (sum, e) => sum + parseAmount(e.Amount),
            0
        );
    }, [filteredExpenses]);

    const todayExpense = useMemo(() => {
        const today = new Date().toDateString();

        return filteredExpenses
            .filter((e) => {
                const d = parseDate(e.Date);
                return d && d.toDateString() === today;
            })
            .reduce((sum, e) => sum + parseAmount(e.Amount), 0);
    }, [filteredExpenses]);

    const thisMonthExpense = useMemo(() => {
        const now = new Date();

        return filteredExpenses
            .filter((e) => {
                const d = parseDate(e.Date);
                return (
                    d &&
                    d.getMonth() === now.getMonth() &&
                    d.getFullYear() === now.getFullYear()
                );
            })
            .reduce((sum, e) => sum + parseAmount(e.Amount), 0);
    }, [filteredExpenses]);

    /* ================= CATEGORY CHART ================= */

    const categoryData = useMemo(() => {
        const grouped = {};

        filteredExpenses.forEach((e) => {
            const category = e.Category?.label || e.Category;
            if (!category) return;

            if (!grouped[category]) grouped[category] = 0;
            grouped[category] += parseAmount(e.Amount);
        });

        return Object.keys(grouped).map((key) => ({
            name: key,
            value: grouped[key],
        }));
    }, [filteredExpenses]);

    /* ================= MONTHLY TREND ================= */

    const monthlyData = useMemo(() => {
        const grouped = {};

        filteredExpenses.forEach((e) => {
            const d = parseDate(e.Date);
            if (!d) return;

            const key = `${d.getFullYear()}-${d.getMonth()}`;

            if (!grouped[key]) {
                grouped[key] = {
                    month: d.toLocaleString("default", { month: "short" }),
                    total: 0,
                    date: new Date(d.getFullYear(), d.getMonth(), 1),
                };
            }

            grouped[key].total += parseAmount(e.Amount);
        });

        return Object.values(grouped).sort((a, b) => a.date - b.date);
    }, [filteredExpenses]);

    /* ================= VEHICLE CHART ================= */

    const vehicleData = useMemo(() => {
        const grouped = {};

        filteredExpenses.forEach((e) => {
            const vehicle = e.VehicleNo?.label || e.VehicleNo;
            if (!vehicle) return;

            if (!grouped[vehicle]) grouped[vehicle] = 0;
            grouped[vehicle] += parseAmount(e.Amount);
        });

        return Object.keys(grouped).map((key) => ({
            name: key,
            value: grouped[key],
        }));
    }, [filteredExpenses]);

const COLORS = [
  "#f97316", // Orange
  "#22c55e", // Green
  "#3b82f6", // Blue
  "#ef4444", // Red
  "#a855f7", // Purple
  "#eab308", // Yellow
  "#14b8a6", // Teal
  "#f43f5e", // Pink
  "#6366f1", // Indigo
  "#84cc16", // Lime
  "#06b6d4", // Cyan
  "#d946ef", // Fuchsia
  "#fb7185", // Rose
  "#10b981", // Emerald
  "#f59e0b"  // Amber
];

    if (isPending) {
        return <DashboardSkeleton />;
    }
    /* ================= UI ================= */

    return (
        <div className="p-6 bg-[#F8F9FB] min-h-screen space-y-6">

            {/* HEADER + DATE FILTER */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                {/* Heading */}
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-center lg:text-left">
                    Expense Dashboard
                </h1>

                {/* Date Filter Card */}
                <div className="
      flex flex-wrap items-center justify-center lg:justify-end
      gap-2 sm:gap-3
      bg-white 
      border border-orange-400
      px-2 sm:px-3 
      py-1
      rounded-2xl 
      shadow-md
      w-full lg:w-auto
    ">

                    <span className="text-xs sm:text-sm text-orange-600 font-semibold">
                        From
                    </span>

                    <DatePicker
                        selected={dateRange.from}
                        onChange={(date) =>
                            setDateRange((p) => ({ ...p, from: date }))
                        }
                        selectsStart
                        startDate={dateRange.from}
                        endDate={dateRange.to}
                        dateFormat="dd MMM yyyy"
                        placeholderText="Start Date"
                        className="w-24 sm:w-32 text-center outline-none text-xs sm:text-sm  rounded-lg py-1"
                    />

                    <span className="text-xs sm:text-sm text-orange-600 font-semibold">
                        To
                    </span>

                    <DatePicker
                        selected={dateRange.to}
                        onChange={(date) =>
                            setDateRange((p) => ({ ...p, to: date }))
                        }
                        selectsEnd
                        startDate={dateRange.from}
                        endDate={dateRange.to}
                        minDate={dateRange.from}
                        dateFormat="dd MMM yyyy"
                        placeholderText="End Date"
                        className="w-24 sm:w-32 text-center outline-none text-xs sm:text-sm  rounded-lg py-1"
                    />

                    <button
                        onClick={() => setDateRange({ from: null, to: null })}
                        className="
        bg-orange-500 hover:bg-orange-600 
        transition-all duration-200
        text-white 
        px-3 py-1 
        rounded-lg 
        text-xs sm:text-sm 
        font-medium
      "
                    >
                        <span className="sm:hidden text-lg font-bold">×</span>
                        <span className="hidden sm:inline">Clear</span>
                    </button>

                </div>

            </div>


            {/* SUMMARY */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SummaryCard
                    title="Total Expense"
                    value={`₹ ${totalExpense.toLocaleString()}`}
                />
                <SummaryCard
                    title="Today Expense"
                    value={`₹ ${todayExpense.toLocaleString()}`}
                />
                <SummaryCard
                    title="This Month"
                    value={`₹ ${thisMonthExpense.toLocaleString()}`}
                />
            </div>

            {/* CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 border  gap-6">

                {/* Category Chart */}
                <Card title="Category Wise Expense">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={categoryData}
                            margin={{ top: 20, right: 20, left: 60, bottom: 20 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis
                                tickFormatter={(value) =>
                                    ` ${Number(value).toLocaleString()}`
                                }
                            />
                            <Tooltip
                                formatter={(value) =>
                                    `${Number(value).toLocaleString()}`
                                }
                            />
                            <Bar dataKey="value" fill="#fb923c" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                {/* Vehicle Pie Chart */}
                <Card title="Vehicle Expense Distribution">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={vehicleData}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={100}
                                label={({ name }) => name}
                            >
                                {vehicleData.map((entry, index) => (
                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value) =>
                                    `₹ ${Number(value).toLocaleString()}`
                                }
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            {/* Monthly Trend */}
            <Card title="Monthly Expense Trend">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                        data={monthlyData}
                        margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis
                            width={80}
                            tickFormatter={(value) => value.toLocaleString()}
                        />
                        <Tooltip formatter={(value) => value.toLocaleString()} />
                        <Line
                            type="monotone"
                            dataKey="total"
                            stroke="#fb923c"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
}

/* ================= REUSABLE COMPONENTS ================= */

const SummaryCard = ({ title, value }) => (
    <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
        <h2 className="text-gray-500 text-sm">{title}</h2>
        <p className="text-3xl font-bold text-orange-500 mt-2">{value}</p>
    </div>
);

const Card = ({ title, children }) => (
    <div className={`bg-white p-6 rounded-2xl shadow-md ${title === "Category Wise Expense" ? "col-span-2 " : ""}`}>
        <h2 className="text-lg font-semibold mb-4 text-gray-700">{title}</h2>
        {children}
    </div>
);

export default Dashboard;