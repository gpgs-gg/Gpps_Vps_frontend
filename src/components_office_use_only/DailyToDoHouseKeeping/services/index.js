import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || "http://localhost:4000/api",
});

/* ================= FETCH ================= */

export const fetchHouseKeepingData = async (sheetName) => {
  const res = await apiClient.get(`/housekeeping/${sheetName}`);
  return res.data;
};

export const useHouseKeepingData = (sheetName) => {
  return useQuery({
    queryKey: ["housekeeping", sheetName],
    queryFn: () => fetchHouseKeepingData(sheetName),
    enabled: !!sheetName,
  });
};

/* ================= UPDATE (CELL BASED) ================= */

const updateHouseKeepingCell = async ({
  name,
  sheetName,
  rowIndex,
  columnName,
  value,
}) => {
  const res = await apiClient.post(`/housekeeping/${sheetName}/update`, {
    name,
    rowIndex,
    columnName,
    value,
  });
  return res.data;
};  

export const useUpdateHouseKeepingCell = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateHouseKeepingCell,
    onSuccess: (_, variables) => {
      // 🔄 refetch same sheet after update
      queryClient.invalidateQueries(["housekeeping", variables.sheetName]);
    },
  });
};