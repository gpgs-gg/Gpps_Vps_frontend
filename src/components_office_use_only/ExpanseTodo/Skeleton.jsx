import React from "react";

/* ==========================================
   Expenses Page Skeleton (UI Matched)
========================================== */

export function TableSkeleton({ rows = 8 }) {
  return (
    <div className="max-w-full mx-auto p-2 bg-[#F8F9FB] rounded shadow animate-pulse">

      {/* FILTER SECTION */}
      <div className="flex flex-wrap justify-center items-center gap-3 mb-3">
        <div className="flex flex-wrap gap-2 items-center mx-auto">

          {/* Search */}
          <div className="h-8 w-28 bg-gray-200 rounded-xl"></div>

          {/* Date Range */}
          <div className="h-8 w-52 bg-gray-200 rounded-xl"></div>

          {/* Category Filter */}
          <div className="h-8 w-32 bg-gray-200 rounded-xl"></div>

          {/* Save Button */}
          <div className="h-10 w-24 bg-orange-300 rounded"></div>

          {/* Add Button */}
          <div className="h-10 w-28 bg-green-300 rounded"></div>

          {/* Delete Button */}
          <div className="h-10 w-32 bg-red-300 rounded"></div>

        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="overflow-auto max-h-[400px] bg-white rounded">

        <table className="min-w-full border-collapse">

          {/* Header */}
          <thead className="bg-black sticky top-0 z-10">
            <tr>
              {Array.from({ length: 8 }).map((_, i) => (
                <th key={i} className="px-5 py-3 border">
                  <div className="h-4 bg-gray-300 rounded w-20 mx-auto"></div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b">
                {Array.from({ length: 8 }).map((_, colIndex) => (
                  <td key={colIndex} className="px-3 py-4 border text-center">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-6 m-5">
        <div className="h-4 w-28 bg-gray-200 rounded"></div>
        <div className="h-10 w-28 bg-orange-300 rounded"></div>
        <div className="h-10 w-20 bg-orange-300 rounded"></div>
      </div>

    </div>
  );
}

export const DashboardSkeleton = () => {
  return (
    <div className="p-6 bg-[#F8F9FB] min-h-screen space-y-6 animate-pulse">

      {/* HEADER */}
      <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
        <div className="h-8 w-48 bg-gray-300 rounded"></div>

        <div className="flex items-center gap-2 bg-white border px-3 py-2 rounded-xl shadow w-[320px]">
          <div className="h-4 w-10 bg-gray-300 rounded"></div>
          <div className="h-6 w-24 bg-gray-200 rounded"></div>
          <div className="h-4 w-8 bg-gray-300 rounded"></div>
          <div className="h-6 w-24 bg-gray-200 rounded"></div>
          <div className="h-6 w-14 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((_, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-md space-y-4"
          >
            <div className="h-4 w-32 bg-gray-300 rounded"></div>
            <div className="h-8 w-40 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>

      {/* CHART ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Category Chart Skeleton */}
        <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
          <div className="h-5 w-48 bg-gray-300 rounded"></div>
          <div className="h-[260px] w-full bg-gray-200 rounded-xl"></div>
        </div>

        {/* Vehicle Chart Skeleton */}
        <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
          <div className="h-5 w-56 bg-gray-300 rounded"></div>
          <div className="h-[260px] w-full bg-gray-200 rounded-xl"></div>
        </div>

      </div>

      {/* Monthly Trend Skeleton */}
      <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
        <div className="h-5 w-56 bg-gray-300 rounded"></div>
        <div className="h-[260px] w-full bg-gray-200 rounded-xl"></div>
      </div>

    </div>
  );
}