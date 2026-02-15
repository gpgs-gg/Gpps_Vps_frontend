import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";


const apiClient = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_URL}`, // for vercel deployement
  // baseURL: "http://localhost:3000/api", // for Local Developement
});




const login= async (data) => {
  const response = await apiClient.post("/login", data);
  return response.data;
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      // 🔄 Refetch ticket sheet after update
      queryClient.invalidateQueries(["login"]);
    },
  });
};






























// fecting data for employees
const fetchEmployeeDetailsData = async () => {
  const response = await apiClient.get("/Employees-details");
  return response.data;
};

// React Query hook to fetch property data
export const useEmployeeDetails = () => {
  return useQuery({
    queryKey: ["EmployeeDetails"],
    queryFn: fetchEmployeeDetailsData,
  });
};


// fecting data for clients
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

// ✅ Update Ticket Sheet
const changePassword= async (data) => {
  const response = await apiClient.post("/change-password", data);
  return response.data;
};

export const useChangePassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      // 🔄 Refetch ticket sheet after update
      queryClient.invalidateQueries(["change-password"]);
    },
  });
};



const getOtp= async (data) => {
  const response = await apiClient.post("/send-otp", data);
  return response.data;
};

export const useGetOtp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: getOtp,
    onSuccess: () => {
      // 🔄 Refetch ticket sheet after update
      queryClient.invalidateQueries(["getOtp"]);
    },
  });
};


const verifyOtp= async (data) => {
  const response = await apiClient.post("/verify-otp", data);
  return response.data;
};

export const useVerifyOtp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyOtp,
    onSuccess: () => {
      // 🔄 Refetch ticket sheet after update
      queryClient.invalidateQueries(["verifyOtp"]);
    },
  });
};
