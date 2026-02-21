import {  useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import axios from "axios";

const apiClient = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_URL}`, // for vercel deployement
  // baseURL: "http://localhost:3000/api", // For local development
});



 const fetchExpensesDetails = async () => {
  
 const response = await apiClient.get('/get-expense-data') 
  return response.data;
};

// React Query hook to fetch property data
export const useExpensesDetails = () => {
  return useQuery({
    queryKey: ["ExpensesDetails"],
    queryFn: fetchExpensesDetails,
    staleTime:Infinity
  });
};


const postClientDeatails = async (data)=> {
  
  // const result = await axios.post("https://jsonplaceholder.typicode.com/users",data);
  const result =await apiClient.post('/upsert-expense-data',data)
  return result.data
};

export const useUpdateExpensesDetails =() =>{
    const queryClient = useQueryClient(); 

    return useMutation({
      mutationFn: postClientDeatails,
      onSuccess:()=>{
        queryClient.invalidateQueries(['ClientDetail'])
      }
    })
}