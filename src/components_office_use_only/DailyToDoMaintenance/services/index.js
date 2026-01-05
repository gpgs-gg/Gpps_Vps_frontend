import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || "http://localhost:4000/api",
});

/* ================= FETCH ================= */

export const fetchMaintenanceData = async (sheetName) => {
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

/* ================= UPDATE (CELL BASED) ================= */

const updateMaintenanceCell = async ({
  name,
  sheetName,
  rowIndex,
  columnName,
  value,
}) => {
  const res = await apiClient.post(`/maintenance/${sheetName}/update`, {
    name,
    rowIndex,
    columnName,
    value,
  });
  return res.data;
};

export const useUpdateMaintenanceCell = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMaintenanceCell,
    onSuccess: (_, variables) => {
      // 🔄 refetch same sheet after update
      queryClient.invalidateQueries(["maintenance", variables.sheetName]);
    },
  });
};