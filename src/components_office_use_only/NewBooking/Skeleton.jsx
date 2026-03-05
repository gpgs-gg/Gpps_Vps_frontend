export const TableSkeleton = () => {
  return (
    <div className="max-w-full mx-auto mt-3 p-2 bg-gray-50 rounded-lg shadow-md animate-pulse">

      {/* ===== FILTER BAR SKELETON ===== */}
      <div className="flex flex-wrap gap-3 mb-4 justify-start">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="h-8 w-32 bg-gray-200 rounded-md"
          />
        ))}
      </div>

      {/* ===== TABLE SKELETON ===== */}
      <div className="overflow-hidden bg-white rounded-lg shadow">
        <table className="min-w-full border">
          <thead className="bg-black text-gray-200">
            <tr>
              {Array.from({ length: 12 }).map((_, i) => (
                <th key={i} className="p-4">
                  <div className="h-4 bg-gray-300 rounded w-20 mx-auto"></div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: 8 }).map((_, row) => (
              <tr key={row} className="border-b">
                {Array.from({ length: 12 }).map((_, col) => (
                  <td key={col} className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== PAGINATION SKELETON ===== */}
      <div className="flex justify-center gap-4 mt-5">
        <div className="h-8 w-24 bg-gray-200 rounded" />
        <div className="h-8 w-24 bg-gray-200 rounded" />
      </div>
    </div>
  );
};


const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-xl shadow p-5 border-l-4 border-gray-200 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
      <div className="h-8 bg-gray-300 rounded w-16 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-32"></div>
    </div>
  );
};

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-6 p-5 animate-pulse">
      
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="h-6 bg-gray-300 rounded w-56 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-72"></div>
        </div>

        <div className="h-10 bg-gray-200 rounded w-72"></div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
};