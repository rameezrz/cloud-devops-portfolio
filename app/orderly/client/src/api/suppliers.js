import { axios } from "./axiosInstance";

export const fetchSuppliers = async ({ page = 1, limit = 10 }) => {
  const response = await axios.get(`/suppliers?page=${page}&limit=${limit}`);
  return response.data;
};

export const fetchActiveSuppliersAPI = async () => {
  const response = await axios.get(`/suppliers/active`);
  return response?.data?.suppliers;
};

export const fetchSupplierById = async (id) => {
  const response = await axios.get(`/suppliers/${id}`);
  return response.data;
};

export const addSupplierAPI = async (data) => {
  const response = await axios.post(`/suppliers`, data);
  return response.data;
};

export const editSupplierAPI = async ({ id, data }) => {
  const response = await axios.put(`/suppliers/${id}`, data);
  return response.data;
};
