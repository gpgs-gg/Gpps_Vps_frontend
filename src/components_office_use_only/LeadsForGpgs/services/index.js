import {  useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import axios from "axios";

const apiClient = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_URL}`, // for vercel deployement
  // baseURL: "http://localhost:3000/api", // For local development
});


 const fetchClientDetails = async () => {
  
 const response = await apiClient.get('/get-Leads') 
  return response.data;
};

// React Query hook to fetch property data
export const useClientDetails = () => {
  return useQuery({
    queryKey: ["ClientDetails"],
    queryFn: fetchClientDetails,
    staleTime:Infinity
  });
};




const postClientDeatails = async (data)=> {
  
  // const result = await axios.post("https://jsonplaceholder.typicode.com/users",data);
  const result =await apiClient.post('/create-Leads',data)
  return result.data
};

export const usePostClientDeatails =() =>{
    const queryClient = useQueryClient(); 

    return useMutation({
      mutationFn: postClientDeatails,
      onSuccess:()=>{
        queryClient.invalidateQueries(['ClientDetail'])
      }
    })
}


// const fetchDropDowlList = async ()=>{
//   const response = await apiClient.get('/dynamic-values')
//   return response.data.data
// }



// export const useDropDowlList = ()=>{
//   return useQuery({
//     queryKey:['dynamic-values'],
//     queryFn: fetchDropDowlList,
//      staleTime: Infinity,   
//     cacheTime: Infinity,   
//     refetchOnWindowFocus: false,  
//     refetchOnMount: false,   
//   })
// }







const updateClientDetails = async (  { srNo,data }) => {

  const result = await apiClient.put(`/update-Leads`,  { srNo, data });
  return result.data;
};

export const useUpdateClientDetails = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateClientDetails,
    onSuccess: () => {
      queryClient.invalidateQueries(["ClientDetails"]);
    },
  });
};