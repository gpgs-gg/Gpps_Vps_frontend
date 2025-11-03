import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiClient = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_URL}`, // for vercel deployement
  // baseURL: "http://localhost:3000/api", // for Local Developement
});

const fetchClientDetailsData = async () => {
  const response = await apiClient.get("/Clients-details");
  return response.data;
};

// React Query hook to fetch property data
export const useClientDetails = () => {
  return useQuery({
    queryKey: ["clientsDetails"],
    queryFn: fetchClientDetailsData,
  });
};


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


// ✅ Update Ticket Sheet
const updateClientCreation= async (data) => {
  const response = await apiClient.post("/create-client", data);
  return response.data;
};

export const useUpdateClientCreation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateClientCreation,
    onSuccess: () => {
      // 🔄 Refetch ticket sheet after update
      queryClient.invalidateQueries(["clientsDetails"]);
    },
  });
};



const UploadClientDocs = async (formData) => {
  // No need to set headers manually for FormData
  const response = await apiClient.post("/client-upload-docs", formData);
  return response.data;
};

export const useUploadClientDocs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UploadClientDocs,
    onSuccess: () => {
      // Invalidate query cache to refetch fresh data
      queryClient.invalidateQueries(["clientsDetails"]);
    },
    onError: (error) => {
      console.error("Upload failed:", error);
      // You can add additional error handling here if you want
    },
  });
};

