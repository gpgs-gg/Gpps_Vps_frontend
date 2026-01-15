import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

/* ================= AXIOS CLIENT ================= */

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || "http://localhost:4000/api",
});

/* ================= FETCH ================= */

export const fetchEbCalculationData = async (sheetName) => {
  if (!sheetName) throw new Error("sheetName is required");

  const res = await apiClient.get(`/electricity-bill/${sheetName}`);

  // assuming backend returns { success, data }
  return res.data.data;
};

export const useEbCalculationData = (sheetName) => {
  return useQuery({
    queryKey: ["eb-calculation"],
    queryFn: () => fetchEbCalculationData(sheetName),
    enabled: !!sheetName,
    staleTime: 1000 * 60, // 1 min
  });
};

/* ================= UPDATE (ROW BASED) ================= */

const updateEbCalculationRow = async (payload) => {
  const { sheetName } = payload;

  if (!sheetName) {
    throw new Error("sheetName is missing in update payload");
  }

  const res = await apiClient.post(
    `/electricity-bill/${sheetName}/update`,
    payload
  );

  return res.data;
};

export const useUpdateEbCalculationRow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEbCalculationRow,
    onSuccess: (_, variables) => {
      // 🔄 Refetch EB data for the same sheet
      queryClient.invalidateQueries({
        queryKey: ["eb-calculation"],
      });
    },
  });
};

/* ================= CREATE (NEW ROW) ================= */

const createEbCalculationRow = async (payload) => {
  const { sheetName } = payload;

  if (!sheetName) {
    throw new Error("sheetName is missing in create payload");
  }

  const res = await apiClient.post(
    `/electricity-bill/${sheetName}/create`,
    payload
  );

  return res.data;
};

export const useCreateEbCalculationRow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEbCalculationRow,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["eb-calculation"],
      });
    },
  });
};

/* ================= FETCH EMPLOYEES ================= */

const fetchEmployees = async () => {
  const res = await apiClient.get("/Employees-details");
  return res.data.data || [];
};

const fetchReviewers = async () => {
  const employees = await fetchEmployees();

  return [
    ...new Map(
      employees
        .filter((emp) => emp.Department?.toLowerCase() === "accounts")
        .map((emp) => emp.Name?.trim())
        .filter(Boolean)
        .map((name) => [name, { value: name, label: name }])
    ).values(),
  ];
};

export const useReviewerOptions = () => {
  return useQuery({
    queryKey: ["reviewer-options"],
    queryFn: fetchReviewers,
    staleTime: 1000 * 60 * 10, // 10 mins (employees rarely change)
    cacheTime: 1000 * 60 * 30,
  });
};

/* ================= FETCH PROPERTIES ================= */

const fetchPropertyCodes = async () => {
  const res = await apiClient.get("/properties-data");

  return (
    res.data?.data?.map((item) => item["Property Code"]).filter(Boolean) || []
  );
};

export const usePropertyCodes = () => {
  return useQuery({
    queryKey: ["property-codes"],
    queryFn: fetchPropertyCodes,
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
  });
};