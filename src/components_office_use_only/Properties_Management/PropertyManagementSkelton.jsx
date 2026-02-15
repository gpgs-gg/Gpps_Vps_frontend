const TableCellSkeleton = ({ width }) => (
  <div
    className="h-4 bg-gray-200 rounded animate-pulse"
    style={{ width: width || "100%" }}
  />
);

const TableRowSkeleton = ({ columns }) => (
  <tr className="border-b">
    {columns.map((_, i) => (
      <td key={i} className="px-3 py-4">
        <TableCellSkeleton />
      </td>
    ))}

    {/* Action column */}
    <td className="px-3 py-4">
      <div className="flex gap-3">
        <div className="w-4 h-4 bg-gray-300 rounded-full animate-pulse" />
        <div className="w-4 h-4 bg-gray-300 rounded-full animate-pulse" />
      </div>
    </td>
  </tr>
);

const PropertyManagementSkeleton = () => {
  const SKELETON_COLUMNS = 10; // approximate visible columns
  const SKELETON_ROWS = 8;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* HEADER */}
      <nav className="px-6 shadow-sm pt-12 pb-4 mt-2">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-gray-300 rounded animate-pulse" />
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
          </div>

          <div className="h-10 w-32 bg-gray-300 rounded animate-pulse" />
        </div>
      </nav>

      {/* TABLE */}
      <div className="mt-4 mx-6 bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed">
            <thead className="bg-gray-200">
              <tr>
                {Array.from({ length: SKELETON_COLUMNS }).map((_, i) => (
                  <th key={i} className="px-3 py-3">
                    <div className="h-4 bg-gray-300 rounded animate-pulse" />
                  </th>
                ))}
                <th className="px-3 py-3">
                  <div className="h-4 bg-gray-300 rounded animate-pulse" />
                </th>
              </tr>
            </thead>

            <tbody>
              {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                <TableRowSkeleton
                  key={i}
                  columns={Array.from({ length: SKELETON_COLUMNS })}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center gap-6 py-4 border-t">
          <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="h-9 w-24 bg-gray-300 rounded animate-pulse" />
          <div className="h-9 w-24 bg-gray-300 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default PropertyManagementSkeleton;