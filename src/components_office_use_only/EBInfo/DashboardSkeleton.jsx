export const DashboardSkeleton = () => {
  const StatCardSkeleton = () => {
    return (
      <div className="bg-white rounded-xl shadow p-5 border-l-4 border-gray-200 animate-pulse">
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
        <div className="h-8 w-32 bg-gray-300 rounded mt-3"></div>
        <div className="h-3 w-20 bg-gray-200 rounded mt-2"></div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="space-y-2 animate-pulse">
        <div className="h-6 w-64 bg-gray-300 rounded"></div>
        <div className="h-4 w-80 bg-gray-200 rounded"></div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* FINANCIAL SUMMARY */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div> */}
    </div>
  );
};

export const EBSkeleton = () => {
  return (
    <div className="mx-6 my-6 animate-pulse">
      {/* FILTER SKELETON */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-4 overflow-x-auto">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="w-[200px]">
              <div className="h-5 bg-gray-300 rounded w-24 mb-2"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* TABLE SKELETON */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* TABLE HEADER */}
        <div className="flex bg-orange-200 px-4 py-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-6 bg-orange-300 rounded mx-2"
              style={{ width: i === 0 ? 80 : 150 }}
            />
          ))}
        </div>

        {/* TABLE ROWS */}
        <div className="max-h-[44vh] overflow-auto">
          {Array.from({ length: 8 }).map((_, rowIdx) => (
            <div key={rowIdx} className="flex items-center px-4 py-4 border-b">
              {Array.from({ length: 8 }).map((_, colIdx) => (
                <div
                  key={colIdx}
                  className="h-5 bg-gray-200 rounded mx-2"
                  style={{ width: colIdx === 0 ? 60 : 140 }}
                />
              ))}

              {/* ACTIONS */}
              <div className="flex gap-4 ml-auto">
                <div className="h-6 w-6 bg-gray-300 rounded-full" />
                <div className="h-6 w-6 bg-gray-300 rounded-full" />
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center gap-4 py-4">
          <div className="h-10 w-24 bg-gray-300 rounded" />
          <div className="h-10 w-24 bg-gray-300 rounded" />
        </div>
      </div>
    </div>
  );
};

export const HousekeepingSkelton = () => {
  return (
    <div className="mx-6 my-6 animate-pulse">
      {/* TABLE SKELETON */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* TABLE HEADER */}
        <div className="flex bg-black px-4 py-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="h-6 bg-gray-300 rounded mx-2"
              style={{ width: i === 0 ? 80 : 150 }}
            />
          ))}
        </div>

        {/* TABLE ROWS */}
        <div className="max-h-[74vh] overflow-auto w-full">
          {Array.from({ length: 13 }).map((_, rowIdx) => (
            <div key={rowIdx} className="flex items-center px-4 py-4 border-b">
              {Array.from({ length: 13 }).map((_, colIdx) => (
                <div
                  key={colIdx}
                  className="h-5 bg-gray-200 rounded mx-2"
                  style={{ width: colIdx === 0 ? 60 : 140 }}
                />
              ))}

              {/* ACTIONS */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};