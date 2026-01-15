import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || "http://localhost:4000/api",
});

/* ================= FETCH ================= */

export const fetchMaintenanceData = async (sheetName) => {
  if (!sheetName) throw new Error("sheetName is required");

  const res = await apiClient.get(`/maintenance/${sheetName}`);
  return res.data;
};

export const useMaintenanceData = (sheetName) => {
  return useQuery({
    queryKey: ["maintenance", sheetName],
    queryFn: () => fetchMaintenanceData(sheetName),
    enabled: !!sheetName,
  });
};

/* ================= UPDATE (ROW BASED – FINAL) ================= */

const updateMaintenanceRow = async (payload) => {
  const { sheetName } = payload;

  if (!sheetName) {
    throw new Error("sheetName is missing in update payload");
  }

  const res = await apiClient.post(`/maintenance/${sheetName}/update`, payload);

  return res.data;
};

export const useUpdateMaintenanceRow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMaintenanceRow,
    onSuccess: (_, variables) => {
      // 🔄 Refetch same sheet after successful update
      queryClient.invalidateQueries({
        queryKey: ["maintenance", variables.sheetName],
      });
    },
  });
};