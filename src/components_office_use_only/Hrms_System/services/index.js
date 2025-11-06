
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiClient = axios.create({
    baseURL: `${process.env.REACT_APP_BASE_URL}`, // for vercel deployement
    // baseURL: "http://localhost:3000/api", // for Local Developement
});



// Function to call API
const checkinout = async (formData, modalType) => {
    if (modalType === "Check In") {
        const response = await apiClient.post("/Check-in-req", formData);
        return response.data;
    } else {
        const response = await apiClient.post("/Check-out-req", formData);
        return response.data;
    }
};

// Hook
export const useCheckInOut = (modalType) => {
    const queryClient = useQueryClient();

    return useMutation({
        // mutationFn now receives variables when called
        mutationFn: (formData) => checkinout(formData, modalType),
        onSuccess: () => {
            queryClient.invalidateQueries(["Check-in-out-req"]);
        },
    });
};







// GET request to fetch property data
const fetchAttendanceData = async () => {
  const response = await apiClient.get("/Attendance-details");
  return response.data;
};

// React Query hook to fetch property data
export const useAttendanceData = () => {
  return useQuery({
    queryKey: ["Check-in-out-req"],
    queryFn: fetchAttendanceData,
  });
};
