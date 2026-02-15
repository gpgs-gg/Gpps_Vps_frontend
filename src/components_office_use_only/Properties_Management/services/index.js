import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

/* ================= AXIOS CLIENT ================= */
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || "http://localhost:4000/api",
});

/* ================= FETCH ================= */
const fetchProperties = async () => {
  const res = await apiClient.get("/properties-data");

  // ✅ RETURN ONLY ARRAY
  return res.data.data;
};

export const usePropertyLists = () => {
  return useQuery({
    queryKey: ["properties"],
    queryFn: fetchProperties,
    cacheTime: 1000 * 60 * 30,
  });
};

/* ================= CREATE ================= */
export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData) => apiClient.post("/properties/create", formData),
    onSuccess: () => {
      queryClient.invalidateQueries(["properties"]);
    },
  });
};

/* ================= UPDATE ================= */
export const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData) => apiClient.post("/properties/update", formData),
    onSuccess: () => {
      queryClient.invalidateQueries(["properties"]);
    },
  });
};
/* ================= DELETE ================= */
export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => apiClient.delete(`/properties-data/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["properties"]);
    },
  });
};

// fetch dynamic values

const fetchDynamicDetails = async () => {
  const response = await apiClient.get("/dynamic-values");
  return response.data;
};

// React Query hook to fetch property data
export const useDynamicDetails = () => {
  return useQuery({
    queryKey: ["dynamicvalues"],
    queryFn: fetchDynamicDetails,
  });
};