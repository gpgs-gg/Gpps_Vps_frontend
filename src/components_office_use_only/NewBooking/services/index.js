import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiClient = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_URL}`, // for vercel deployement
  // baseURL: "http://localhost:3000/api", // for Local Developement
});

// POST request to send booking data
// const addBooking = async (data) => {
//   const response = await apiClient.post("/add-row", data);
//   return response.data;
// };

// export const useAddBooking = () => {  
//   return useMutation({
//     mutationFn: addBooking,
//   });   
// };



const addBooking = async (data) => {
  const response = await apiClient.post("/add-row", data);
  return response.data;
};

export const useAddBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addBooking,
    onSuccess: () => {
      // 🔄 Refetch ticket sheet after update
      queryClient.invalidateQueries(["new-booking"]);
    },
  });
};











// GET request to fetch property data
const fetchPropertyData = async () => {
  const response = await apiClient.get("/properties-data");
  return response.data;
};

// React Query hook to fetch property data
export const usePropertyData = () => {
  return useQuery({
    queryKey: ["properties"],
    queryFn: fetchPropertyData,
  });
};



const fetchPropertySheetData = async (sheetId, selectedPerm) => {
  if (sheetId) {
    const response = await apiClient.get(`/property-sheet-data-for-new-booking?sheetId=${sheetId}&month=${selectedPerm}`
    );
    return response.data;
  }
};

export const usePropertySheetData = (sheetId, selectedPerm, enabled) => {
  console.log("ssdfselectedPerm", selectedPerm)
  return useQuery({
    queryKey: ["property-sheet", sheetId, selectedPerm],
    queryFn: () => fetchPropertySheetData(sheetId, selectedPerm),
    enabled: Boolean(sheetId && (enabled || selectedPerm)), // always boolean // fetch only when sheetId exists

  });
};

const fetchTempPropertySheetData = async (sheetId , selectedTemp) => {
  if (sheetId) {
    const response = await apiClient.get(`/property-sheet-data-for-new-booking?sheetId=${sheetId}&month=${selectedTemp}`);
    return response.data;
  }
};

export const useTempPropertySheetData = (sheetId,selectedTemp , enabled) => {
  return useQuery({
    queryKey: ["property-sheet", sheetId, selectedTemp], // include selectedTemp
    queryFn: () => fetchTempPropertySheetData(sheetId , selectedTemp),
   enabled: Boolean(sheetId && (enabled || selectedTemp)),// fetch only when sheetId exists
  });
};


const fetchEmployeeDetailsData = async () => {
  const response = await apiClient.get("/Employees-details");
  return response.data;
};

// React Query hook to fetch property data
export const useEmployeeDetails = () => {
  return useQuery({
    queryKey: ["EmployeeDetails"],
    queryFn: fetchEmployeeDetailsData,
  });
};

