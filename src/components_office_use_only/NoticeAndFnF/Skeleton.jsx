export const Skeleton = () => {
  return (
    <div className="max-w-full mx-auto mt-3 p-2 bg-gray-50 rounded-lg shadow-md animate-pulse">

      {/* ===== FILTER BAR SKELETON ===== */}
      <div className="flex flex-wrap gap-3 mb-4 justify-center">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-8 w-32 bg-gray-200 rounded-xl"
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