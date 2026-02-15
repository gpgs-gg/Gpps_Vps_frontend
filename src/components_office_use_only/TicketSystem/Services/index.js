import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// ✅ Axios instance
const apiClient = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_URL}`, // for vercel deployement
  // baseURL: "http://localhost:3000/api", // For local development
});

// ✅ Create Ticket
const CreateTicket = async (data) => {
  const response = await apiClient.post("/ticket-created", data);
  return response.data;
};

export const useCreateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: CreateTicket,
    onSuccess: () => {
      // 🔄 Refetch the ticket sheet after creation
      queryClient.invalidateQueries(["ticket-sheet-data"]);
    },
  });
};


// ✅ Fetch Property Sheet Data (Ticket Sheet)
const fetchTicketSheetData = async () => {
  const response = await apiClient.get("/ticket-sheet-data");
  return response.data;
};

export const useTicketSheetData = ( enabled = true ) => {
  return useQuery({
    queryKey: ["ticket-sheet-data"],
    queryFn: fetchTicketSheetData,
    enabled ,// Only fetch when enabled is true
  });
};


// ✅ Fetch Employee Details
const fetchEmployeeDetailsData = async (Role) => {
  if(Role !== "client"){
  const response = await apiClient.get("/Employees-details");
  return response.data;
  }

};

export const useEmployeeDetails = (Role) => {
  return useQuery({
    queryKey: ["EmployeeDetails"],
    queryFn: ()=>fetchEmployeeDetailsData(Role),
  });
};


// ✅ Update Ticket Sheet
const updateTicketSheetData = async (data) => {
  const response = await apiClient.post("/ticket-updated", data);
  return response.data;
};

export const useUpdateTicketSheetData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTicketSheetData,
    onSuccess: () => {
      // 🔄 Refetch ticket sheet after update
      queryClient.invalidateQueries(["ticket-sheet-data"]);
    },
  });
};

const fetchPropertyMasterData = async () => {
  const response = await apiClient.get("/properties-data");
  return response.data;
};

// React Query hook to fetch property data
export const usePropertMasteryData = () => {
  return useQuery({
    queryKey: ["properties"],
    queryFn: fetchPropertyMasterData,
  });
};


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




const fetchPermissionData = async () => {
  const response = await apiClient.get("/permissions");
  return response.data;
};

export const usePermissionData = ( enabled = true ) => {
  return useQuery({
    queryKey: ["fetch-permission-data"],
    queryFn: fetchPermissionData,
    enabled ,// Only fetch when enabled is true
  });
};
