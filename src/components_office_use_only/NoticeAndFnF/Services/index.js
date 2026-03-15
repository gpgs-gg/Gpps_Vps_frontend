


import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiClient = axios.create({
    baseURL: `${process.env.REACT_APP_BASE_URL}`, // for Vps
    // baseURL: "http://localhost:3000/api", // for Local Developement
});

const fetchMainSheetData = async (sheetId) => {
    if (sheetId) {
        const response = await apiClient.get(`/main-sheet-data-for-notice?sheetId=${sheetId}`);
        return response.data;
    }
};

export const useMainSheetData = (sheetId, enabled) => {
    return useQuery({
        queryKey: ["main-sheet-data-for-notice", sheetId],
        queryFn: () => fetchMainSheetData(sheetId),
        enabled: !!sheetId && enabled, // Only fetch when sheetId is available
    });
};

const fetchNoticeSheetData = async () => {

        const response = await apiClient.get(`/get-notice-bedstatus-fnf`);
        return response.data;

};

export const useNoticeSheetData = () => {
    return useQuery({
        queryKey: ["create-notice-data"],
        queryFn: () => fetchNoticeSheetData(),
        // enabled: !!sheetId && enabled, // Only fetch when sheetId is available
    });
};


const CreateNotice = async (data) => {
  const response = await apiClient.post("/create-notice", data);
  return response.data;
};

export const useCreateNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: CreateNotice,
    onSuccess: () => {
      // 🔄 Refetch the Notice sheet after creation
      queryClient.invalidateQueries(["create-notice-data"]);
    },
  });
};



const UpdateMainSheetData = async ({ sheetId, data }) => {
  const response = await apiClient.post(`/update-main-sheet-data?sheetId=${sheetId}`, data );
  return response.data;
};
export const useUpdateMainSheetData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UpdateMainSheetData,

    onSuccess: () => {
      // 🔄 refetch after update
      queryClient.invalidateQueries({
        queryKey: ["create-notice-data"],
      });
    },
  });
};

const UpdateNoticeList = async (data) => {
  const response = await apiClient.post(`/update-notice`, data );
  return response.data;
};
export const useUpdateNoticeList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UpdateNoticeList,

    onSuccess: () => {
      // 🔄 refetch after update
      queryClient.invalidateQueries({
        queryKey: ["create-notice-data"],
      });
    },
  });
};









