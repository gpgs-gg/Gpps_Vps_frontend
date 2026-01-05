import React from "react";
import { useBedsAvailabeData } from ".";

const BedAvailabeDetails = ({ isOpen, setIsOpen }) => {
    const {data, isLoading, isError} = useBedsAvailabeData();    
    if (!isOpen) return null;
    return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl w-[90%] max-w-8xl max-h-[95vh] overflow-y-auto relative">

          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <h2 className="text-xl font-bold">Available Beds</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-black text-2xl"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="py-10 px-10 flex flex-wrap gap-5 justify-center">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="border rounded-md shadow-md p-5 flex h-56 w-96 flex-col justify-between"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between">
                    <h1 className="font-bold text-xl">
                      Private - Non AC
                    </h1>
                    <p className="text-green-500">Available</p>
                  </div>

                  <p>Bed No: 1, Room No: Hall</p>

                  <p className="text-orange-500 font-bold text-lg">
                    ₹8000 / month
                  </p>

                  <p className="text-sm flex gap-2">
                    <span className="bg-gray-50 px-2 rounded-full">
                      No Attached Bathroom
                    </span>
                    <span className="bg-gray-50 px-2 rounded-full">
                      Nerul (W)
                    </span>
                  </p>

                  <button className="border bg-orange-500 text-white px-4 py-2 rounded-md w-full hover:bg-orange-600 transition">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BedAvailabeDetails;
