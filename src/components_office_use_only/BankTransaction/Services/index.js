import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiClient = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_URL}`, // for vercel deployement
  // baseURL: "http://localhost:3000/api", // for Local Developement
});

//PropertyData
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
 const updateTransaction = async (payload) => {
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

//EmployeeData
const fetchEmployeesDetail = async () => {
  const response = await apiClient.get("/Employees-details");
  return response.data;
};

// React Query hook to fetch property data
export const useEmployeesDetails = () => {
  return useQuery({
    queryKey: ["employeeDetails"],
    queryFn: fetchEmployeesDetail,
  });
};

//Dynamic-Values
const fetchDropDowlList = async ()=>{
  const response = await apiClient.get('/dynamic-values')
  return response.data.data
}

export const useDropDowlList = ()=>{
  return useQuery({
    queryKey:['dynamic-values'],
    queryFn: fetchDropDowlList,
     staleTime: Infinity,   
    cacheTime: Infinity,   
    refetchOnWindowFocus: false,  
    refetchOnMount: false,   
  })
}