import React from "react";

/* ================= SHIMMER STYLE ================= */

const ShimmerStyle = () => (
  <style>
    {`
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      .animate-shimmer {
        animation: shimmer 1.2s infinite;
      }
    `}
  </style>
);

/* ================= DASHBOARD SKELETON ================= */

export const DashboardSkeleton = () => {
  const CardSkeleton = () => (
    <div className="bg-white rounded-xl shadow p-5 border-l-4 border-gray-200 animate-pulse">
      <div className="h-4 w-24 bg-gray-200 rounded"></div>
      <div className="h-8 w-20 bg-gray-300 rounded mt-3"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white space-y-6">
      <ShimmerStyle />
      {/* HEADER */}
      <div className="space-y-2 animate-pulse">
        <div className="h-6 w-64 bg-gray-300 rounded"></div>
        <div className="h-4 w-80 bg-gray-200 rounded"></div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

/* ================= FORM SKELETON ================= */

export const FormSkeleton = () => {
  return (
      <div className="bg-white shadow-sm py-5 rounded-b-lg px-10 max-w-8xl w-full animate-pulse">
        <ShimmerStyle />
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {Array.from({ length: 15 }).map((_, idx) => (
            <div key={idx} className="h-12 bg-gray-200 rounded-md relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-center gap-4">
          <div className="h-10 w-24 bg-gray-300 rounded relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
          </div>
          <div className="h-10 w-24 bg-gray-300 rounded relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
          </div>
        </div>
      </div>
    );
};

/* ================= SEARCH SKELETON ================= */

export const SearchSkeleton = () => {
  return (
      <div className="bg-white shadow-sm py-5 rounded-b-lg px-10 max-w-8xl w-full animate-pulse">
        <ShimmerStyle />
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {Array.from({ length: 6}).map((_, idx) => (
            <div key={idx} className="flex flex-col gap-2">
            
            {/* Label Skeleton */}
            <div className="h-4 w-24 bg-gray-200 rounded relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
            </div>

            {/* Input / Select Box Skeleton */}
            <div className="h-10 bg-gray-200 rounded-md relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
            </div>

          </div>
          ))}
        </div>
      </div>
    );
};

/* ================= TABLE SKELETON ================= */

export const TableSkeleton = ({ rows = 8, cols = 10 }) => {
  return (
    <div className="overflow-auto max-h-[calc(100vh-12rem)] border border-gray-200 rounded-lg p-2">
      <ShimmerStyle />
      <table className="min-w-[1500px] border-collapse text-sm text-left text-gray-700 table-fixed">

        {/* Header Skeleton */}
        <thead className="sticky top-0 bg-orange-300 z-[100] shadow-md font-bold text-gray-800 text-base">
          <tr>
            {Array.from({ length: cols }).map((_, idx) => (
              <th
                key={idx}
                className="px-3 py-3 border-b border-gray-300 bg-gray-300 rounded"
              >
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
              </th>
            ))}
          </tr>
        </thead>

        {/* Body Skeleton */}
        <tbody className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <tr key={rowIdx} className="h-[50px]">
            {Array.from({ length: cols }).map((__, colIdx) => (
              <td key={colIdx} className="px-3 py-3">
                <div
                  className="h-5 w-full bg-gray-200 rounded relative overflow-hidden"
                  style={{
                    animationDelay: `${rowIdx * 100 + colIdx * 50}ms`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      </table>
    </div>
  );
};