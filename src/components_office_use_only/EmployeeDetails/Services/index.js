import { useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import axios from "axios";

const apiClient = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_URL}`, // for vercel deployement
  // baseURL: "http://localhost:3000/api", // for Local Developement
});

//========================Read Data==========================
export const getEmployeesDetails = async () => {
  const response = await apiClient.get("/getEmployeeDetails");
  return response.data;
};

export const useEmployeeDetailsData = () => {
  return useQuery({
    queryKey: ["EmployeeDetails"],
    queryFn: getEmployeesDetails,
    refetchOnWindowFocus: true,
  });
};

/* ========================== UPDATE ========================== */
export const updateEmployeeDetails = async (payload) => {
  const response = await apiClient.put("/update-employee", payload);
  return response.data;
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateEmployeeDetails,
    onSuccess: () => {
      //After update, refetch employee list automatically
      queryClient.invalidateQueries(["EmployeeDetails"]);
    },
  });
};

//=========================== Create Employee========================
export const createEmployeeDetails = async (payload) => {
  const response = await apiClient.post("/create-employee", payload);
  return response.data;
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEmployeeDetails,
    onSuccess: () => {
      queryClient.invalidateQueries(["EmployeeDetails"]); 
    },
  });
};

//=====================Upload Docs=======================
const UploadEmployeetDocs = async (formData) => {
  const response = await apiClient.post("/employee-upload-docs", formData);
  return response.data;
};

export const useUploadEmployeeDocs = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: UploadEmployeetDocs,
    onSuccess: () => {
      // Invalidate query cache to refetch fresh data
      queryClient.invalidateQueries(["EmployeeDetails"]);
    },
    onError: (error) => {
      console.error("Upload failed:", error);
    },
  });
};

//==================Dynamic-Values (DropDown)=============
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


//=======EmployeeData from Emp matser Table=========

// const fetchEmployeesDetail = async () => {
//   const response = await apiClient.get("/Employees-details");
//   return response.data;
// };

// // React Query hook to fetch property data
// export const useEmployeesDetails = () => {
//   return useQuery({
//     queryKey: ["employeeDetails"],
//     queryFn: fetchEmployeesDetail,
//   });
// };


