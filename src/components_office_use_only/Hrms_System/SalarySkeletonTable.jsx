export const SalarySkeletonTable = () => {
    const SkeletonCell = ({ width = "w-full", height = "h-4" }) => (
  <div className={`animate-pulse bg-gray-300 rounded ${width} ${height}`} />
);

    const SkeletonRow = () => {
  return (
    <tr className="text-center">
      {/* EmpID */}
      <td className="border px-2 py-2 sticky left-0 bg-orange-200 z-30">
        <SkeletonCell width="w-12" />
      </td>

      {/* Name */}
      <td className="border px-2 py-2 sticky left-20 bg-orange-200 z-30">
        <SkeletonCell width="w-40" />
      </td>

      {/* 31 Attendance Cells */}
      {[...Array(31)].map((_, i) => (
        <td key={i} className="border px-1 py-1">
          <SkeletonCell width="w-6" height="h-3" />
        </td>
      ))}

      {/* Total Days */}
      <td className="border px-2 py-2">
        <SkeletonCell width="w-12" />
      </td>

      {/* Fix Salary */}
      <td className="border px-2 py-2">
        <SkeletonCell width="w-20" />
      </td>

      {/* Per Day */}
      <td className="border px-2 py-2">
        <SkeletonCell width="w-16" />
      </td>

      {/* Adjusted Amt */}
      <td className="border px-2 py-2">
        <SkeletonCell width="w-16" />
      </td>

      {/* Paid Leaves */}
      <td className="border px-2 py-2">
        <SkeletonCell width="w-10" />
      </td>

      {/* Payable Salary */}
      <td className="border px-2 py-2">
        <SkeletonCell width="w-20" />
      </td>

      {/* Paid Amt */}
      <td className="border px-2 py-2">
        <SkeletonCell width="w-16" />
      </td>

      {/* Current Due */}
      <td className="border px-2 py-2">
        <SkeletonCell width="w-16" />
      </td>

      {/* Previous Due */}
      <td className="border px-2 py-2">
        <SkeletonCell width="w-16" />
      </td>

      {/* Comments */}
      <td className="border px-2 py-2">
        <SkeletonCell width="w-32" />
      </td>

      {/* Action */}
      <td className="border px-2 py-2">
        <SkeletonCell width="w-14" height="h-6" />
      </td>
    </tr>
  );
};

  return (
    <div className="overflow-auto max-h-[510px] rounded-lg">
      <table className="min-w-full border-collapse">
        <thead className="bg-orange-300 sticky top-0 z-40">
          <tr>
            <th className="border px-2 py-2">EmpID</th>
            <th className="border px-2 py-2">Employee</th>
            {[...Array(31)].map((_, i) => (
              <th key={i} className="border px-1 py-2 w-6">
                {i + 1}
              </th>
            ))}
            <th className="border px-2 py-2">Total</th>
            <th className="border px-2 py-2">Salary</th>
            <th className="border px-2 py-2">Per Day</th>
            <th className="border px-2 py-2">Adjusted</th>
            <th className="border px-2 py-2">Leaves</th>
            <th className="border px-2 py-2">Payable</th>
            <th className="border px-2 py-2">Paid</th>
            <th className="border px-2 py-2">Due</th>
            <th className="border px-2 py-2">Prev Due</th>
            <th className="border px-2 py-2">Comments</th>
            <th className="border px-2 py-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {[...Array(8)].map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
