
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
const fetchAttendanceData = async (selectedMonth) => {
  const response = await apiClient.get(`/Attendance-details/${selectedMonth}`);
  return response.data;
};

// React Query hook to fetch property data
export const useAttendanceData = (selectedMonth) => {
    
  return useQuery({
    queryKey: ["Check-in-out-req", selectedMonth],
    queryFn: ()=>fetchAttendanceData(selectedMonth),
  });
};


// GET request to fetch property data
const fetchSallaryTrackerDetail = async (selectedMonth) => {
  const response = await apiClient.get(`/sallary-tracker-details/${selectedMonth}`);
  return response.data;
};

// React Query hook to fetch property data
export const useSallaryTrackerDetail = (selectedMonth) => {
  return useQuery({
    queryKey: ["sallary-tracker-details" , selectedMonth],
    queryFn: ()=>fetchSallaryTrackerDetail(selectedMonth),
  });
};


const createSallaryDetails = async ({payload ,  selectedMonth}) => {
  const response = await apiClient.post(`/create-sallary-details/${selectedMonth}`, payload);
  return response.data;
};

export const useCreateSallaryDetails = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSallaryDetails,
    onSuccess: () => {
      // 🔄 Refetch ticket sheet after update
      queryClient.invalidateQueries(["sallary-tracker-details"]);
    },
  });
};









// /create-sallary-details