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
  return res.data.data;
};

export const useEbCalculationData = (sheetName) => {
  return useQuery({
    queryKey: ["eb-calculation", sheetName],
    queryFn: () => fetchEbCalculationData(sheetName),
    enabled: !!sheetName,
  });
};

/* ================= UPDATE (ROW BASED) ================= */

const updateEbCalculationRow = async ({ sheetName, formData }) => {
  if (!sheetName) throw new Error("sheetName missing");

  const res = await apiClient.post(
    `/electricity-bill/${sheetName}/update`,
    formData,
    // {
    //   headers: { "Content-Type": "multipart/form-data" },
    // },
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
        queryKey: ["eb-calculation", variables.sheetName],
      });
    },
  });
};

/* ================= UPDATE (Assignee) ================= */
const updateEbAssignee = async ({ sheetName, formData }) => {
  if (!sheetName) throw new Error("sheetName missing");

  const res = await apiClient.post(
    `/electricity-bill/${sheetName}/changed-assignee`,
    formData,
    // {
    //   headers: { "Content-Type": "multipart/form-data" },
    // },
  );

  return res.data;
};

export const useUpdateEbAssignee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEbAssignee,
    onSuccess: (_, variables) => {
      // 🔄 Refetch EB data for the same sheet
      queryClient.invalidateQueries({
        queryKey: ["eb-calculation", variables.sheetName],
      });
    },
  });
};

/* ================= CREATE (NEW ROW) ================= */

const createEbCalculationRow = async ({ sheetName, formData }) => {
  if (!sheetName) throw new Error("sheetName missing");

  const res = await apiClient.post(
    `/electricity-bill/${sheetName}/create`,
    formData,
    // {
    //   headers: { "Content-Type": "multipart/form-data" },
    // },
  );

  return res.data;
};

export const useCreateEbCalculationRow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEbCalculationRow,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["eb-calculation", variables.sheetName],
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
        .map((name) => [name, { value: name, label: name }]),
    ).values(),
  ];
};

export const useReviewerOptions = () => {
  return useQuery({
    queryKey: ["reviewer-options"],
    queryFn: fetchReviewers,

    cacheTime: 1000 * 60 * 30,
  });
};

/* ================= FETCH PROPERTIES ================= */

const fetchPropertyCodes = async () => {
  const res = await apiClient.get("/properties-data");

  return res.data?.data?.map((item) => item["Property Code"]).filter(Boolean) || [];
};

export const usePropertyCodes = () => {
  return useQuery({
    queryKey: ["property-codes"],
    queryFn: fetchPropertyCodes,

    cacheTime: 1000 * 60 * 30,
  });
};

/* ================= FETCH EB DYNAMIC STATUSES ================= */

export const fetchDynamicValuesEBStatuses = async () => {
  const res = await apiClient.get("/dynamic-values");
  const list = res.data?.data || [];

  const ebPaidStatus = [
    ...new Set(list.map((item) => item.EBPaidStatus?.trim()).filter(Boolean)),
  ];

  const ebCalculationStatus = [
    ...new Set(
      list.map((item) => item.EBCalculationStatus?.trim()).filter(Boolean),
    ),
  ];
  const ebCalculationStatusPaid = [
    ...new Set(
      list
        .map((item) => item.EBCalculationStatusForPaid?.trim())
        .filter(Boolean),
    ),
  ];

  return {
    ebPaidStatus,
    ebCalculationStatus,
    ebCalculationStatusPaid,
  };
};

export const useDynamicValuesEBStatuses = () => {
  return useQuery({
    queryKey: ["dynamic-eb-statuses"],
    queryFn: fetchDynamicValuesEBStatuses,
    cacheTime: 1000 * 60 * 30,
  });
};
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import axios from "axios";

// /* ================= AXIOS CLIENT ================= */

// const apiClient = axios.create({
//   baseURL: process.env.REACT_APP_BASE_URL || "http://localhost:4000/api",
// });

// /* ================= FETCH ================= */

// export const fetchEbCalculationData = async (sheetName) => {
//   if (!sheetName) throw new Error("sheetName is required");
//   const res = await apiClient.get(`/electricity-bill/${sheetName}`);
//   return res.data.data;
// };

// export const useEbCalculationData = (sheetName) => {
//   return useQuery({
//     queryKey: ["eb-calculation", sheetName],
//     queryFn: () => fetchEbCalculationData(sheetName),
//     enabled: !!sheetName,
//   });
// };

// /* ================= UPDATE (ROW BASED) ================= */

// const updateEbCalculationRow = async (payload) => {
//   const { sheetName } = payload;

//   if (!sheetName) {
//     throw new Error("sheetName is missing in update payload");
//   }

//   const res = await apiClient.post(
//     `/electricity-bill/${sheetName}/update`,
//     payload,
//   );

//   return res.data;
// };

// export const useUpdateEbCalculationRow = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: updateEbCalculationRow,
//     onSuccess: (_, variables) => {
//       // 🔄 Refetch EB data for the same sheet
//       queryClient.invalidateQueries({
//         queryKey: ["eb-calculation", variables.sheetName],
//       });
//     },
//   });
// };

// /* ================= CREATE (NEW ROW) ================= */

// const createEbCalculationRow = async (payload) => {
//   const { sheetName } = payload;

//   if (!sheetName) {
//     throw new Error("sheetName is missing in create payload");
//   }

//   const res = await apiClient.post(
//     `/electricity-bill/${sheetName}/create`,
//     payload,
//   );

//   return res.data;
// };

// export const useCreateEbCalculationRow = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: createEbCalculationRow,
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({
//         queryKey: ["eb-calculation", variables.sheetName],
//       });
//     },
//   });
// };

// /* ================= FETCH EMPLOYEES ================= */

// const fetchEmployees = async () => {
//   const res = await apiClient.get("/Employees-details");
//   return res.data.data || [];
// };

// const fetchReviewers = async () => {
//   const employees = await fetchEmployees();

//   return [
//     ...new Map(
//       employees
//         .filter((emp) => emp.Department?.toLowerCase() === "accounts")
//         .map((emp) => emp.Name?.trim())
//         .filter(Boolean)
//         .map((name) => [name, { value: name, label: name }]),
//     ).values(),
//   ];
// };

// export const useReviewerOptions = () => {
//   return useQuery({
//     queryKey: ["reviewer-options"],
//     queryFn: fetchReviewers,

//     cacheTime: 1000 * 60 * 30,
//   });
// };

// /* ================= FETCH PROPERTIES ================= */

// const fetchPropertyCodes = async () => {
//   const res = await apiClient.get("/properties-data");

//   return (
//     res.data?.data?.map((item) => item["Property Code"]).filter(Boolean) || []
//   );
// };

// export const usePropertyCodes = () => {
//   return useQuery({
//     queryKey: ["property-codes"],
//     queryFn: fetchPropertyCodes,

//     cacheTime: 1000 * 60 * 30,
//   });
// };

// /* ================= FETCH EB DYNAMIC STATUSES ================= */

// export const fetchDynamicValuesEBStatuses = async () => {
//   const res = await apiClient.get("/dynamic-values");
//   const list = res.data?.data || [];

//   const ebPaidStatus = [
//     ...new Set(list.map((item) => item.EBPaidStatus?.trim()).filter(Boolean)),
//   ];

//   const ebCalculationStatus = [
//     ...new Set(
//       list.map((item) => item.EBCalculationStatus?.trim()).filter(Boolean),
//     ),
//   ];

//   return {
//     ebPaidStatus,
//     ebCalculationStatus,
//   };
// };

// export const useDynamicValuesEBStatuses = () => {
//   return useQuery({
//     queryKey: ["dynamic-eb-statuses"],
//     queryFn: fetchDynamicValuesEBStatuses,
//     cacheTime: 1000 * 60 * 30,
//   });
// };