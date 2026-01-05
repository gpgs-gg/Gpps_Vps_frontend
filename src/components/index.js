import {useQuery, useQueryClient } from "@tanstack/react-query";
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



// const addBooking= async (data) => {
//   const response = await apiClient.post("/add-row", data);
//   return response.data;
// };

// export const useAddBooking = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: addBooking,
//     onSuccess: () => {
//       // 🔄 Refetch ticket sheet after update
//       queryClient.invalidateQueries(["new-booking"]);
//     },
//   });
// };











// GET request to fetch property data
const fetchBedsAvailabeData = async () => {
  const response = await apiClient.get("/Beds-Status");
  return response.data;
};

// React Query hook to fetch property data
export const useBedsAvailabeData = () => {
  return useQuery({
    queryKey: ["Beds-Availabe-Data"],
    queryFn: fetchBedsAvailabeData,
  });
};
