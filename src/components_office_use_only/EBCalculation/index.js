
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiClient = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_URL}`, // for vercel deployement
  // baseURL: "http://localhost:3000/api", // for Local Developement
});








const fetchMainSheetDataForEb = async (sheetId) => {
  if (sheetId) {
    const response = await apiClient.get(`/main-sheet-data-for-eb?sheetId=${sheetId}`);
    return response.data;
  }
};

export const useMainSheetDataForEb = (sheetId, enabled) => {
  return useQuery({
    queryKey: ["property-sheet-for-eb", sheetId],
    queryFn: () => fetchMainSheetDataForEb(sheetId),
    enabled: !!sheetId && enabled, // Only fetch when sheetId is available
  });
};




const createEbCalculationSheetData = async (bulkData, EBMainSheetID) => {
  const response = await apiClient.post(
    `/create-main-sheet-data-for-eb?sheetId=${EBMainSheetID}`,
    bulkData
  );
  return response.data;
};

export const useCreateEbCalculationSheetData = (EBMainSheetID) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bulkData) =>
      createEbCalculationSheetData(bulkData, EBMainSheetID),

    onSuccess: () => {
      // 🔄 Refetch ticket sheet after update
      queryClient.invalidateQueries(["property-sheet-for-eb"]);
    },
  });
};

const createEbCalculationForMainSheet = async ({bulkData, totalFreeEB}, EBMainSheetID) => {
  
  const response = await apiClient.post(
    `/create-property-main-sheet-eb?sheetId=${EBMainSheetID}&totalFreeEB=${totalFreeEB}`,
    bulkData
  );
  return response.data;
};

export const useCreateEbCalculationForMainSheetData = (EBMainSheetID) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bulkData) =>
      createEbCalculationForMainSheet(bulkData, EBMainSheetID),

    onSuccess: () => {
      // 🔄 Refetch ticket sheet after update
      queryClient.invalidateQueries(["property-sheet-for-eb"]);
    },
  });
};
