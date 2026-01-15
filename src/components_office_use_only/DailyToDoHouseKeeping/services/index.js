import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || "http://localhost:4000/api",
});

/* ================= FETCH ================= */

export const fetchHouseKeepingData = async (sheetName) => {
  if (!sheetName) throw new Error("sheetName is required");

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

/* ================= UPDATE (ROW BASED – FINAL) ================= */

const updateHouseKeepingRow = async (payload) => {
  const { sheetName } = payload;

  if (!sheetName) {
    throw new Error("sheetName is missing in update payload");
  }

  const res = await apiClient.post(
    `/housekeeping/${sheetName}/update`,
    payload
  );

  return res.data;
};

export const useUpdateHouseKeepingRow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateHouseKeepingRow,
    onSuccess: (_, variables) => {
      // 🔄 Refetch same sheet after successful update
      queryClient.invalidateQueries({
        queryKey: ["housekeeping", variables.sheetName],
      });
    },
  });
};