export const CheckInOutSkeleton = ({ isMobile }) => {
  return (
    <div className="bg-gray-100 min-h-screen md:flex gap-6 p-6">

      {/* LEFT SECTION SKELETON */}
      <div className="w-full md:w-1/2 space-y-6">

        {/* Header */}
        <div className="bg-white shadow rounded-xl p-6 space-y-4">
          {/* <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div> */}
        </div>

        {/* Webcam Skeleton */}
        <div className="bg-white shadow rounded-xl p-6 space-y-6">
          <div className="w-full h-64 bg-gray-200 rounded animate-pulse"></div>

          <div className="flex justify-center gap-6">
            <div className="h-12 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-12 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION SKELETON */}
      <div className="w-full md:w-1/2 mt-10 md:mt-0">

        {isMobile ? (
          /* MOBILE CARD SKELETON */
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white shadow rounded-lg p-4 space-y-4"
              >
                <div className="h-5 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse"></div>

                <div className="flex justify-between">
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* DESKTOP TABLE SKELETON */
          <div className="bg-white shadow rounded-lg p-4">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((row) => (
                <div
                  key={row}
                  className="grid grid-cols-8 gap-4"
                >
                  {[...Array(8)].map((_, col) => (
                    <div
                      key={col}
                      className="h-4 bg-gray-200 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
