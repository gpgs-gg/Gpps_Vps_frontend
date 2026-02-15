import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiClient = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_URL}`, // for vercel deployement
  // baseURL: "http://localhost:3000/api", // for Local Developement
});

const fetchPropertyData = async () => {
  const response = await apiClient.get("/properties-data");
  return response.data;
};

export const usePropertyData = () => {
  return useQuery({
    queryKey: ["properties"],
    queryFn: fetchPropertyData,
  });
};

//Create

export const addTransaction = async (payload) => {
  const response = await apiClient.post("/addBank", payload);
  return response.data;
};

export const useAddBankTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addTransaction,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["BankTransaction"] }),
  });
};

//Read

export const getTransaction = async () => {
  const response = await apiClient.get("/getBank");
  return response.data;
};

export const useBankTransactionData = () => {
  return useQuery({
    queryKey: ["BankTransaction"],
    queryFn: getTransaction,
    refetchOnWindowFocus: false,
  });
};

//Update

export const updateTransaction = async (payload) => {
  const response = await apiClient.put("/updateBank", payload);
  return response.data;
};

export const useUpdateBankTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTransaction,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["BankTransaction"] }),
  });
};

//Delete 

export const deleteTransaction = async ({ index }) => {
  const response = await apiClient.delete("/deleteBank", { data: { index } });
  return response.data;
};

export const useDeleteBankTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["BankTransaction"] }),
  });
};