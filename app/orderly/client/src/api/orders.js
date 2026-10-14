import { axios } from "./axiosInstance";

export const fetchOrdersAPI = async ({ page = 1, limit = 10 }) => {
  const response = await axios.get(`/orders?page=${page}&limit=${limit}`);
  return response.data;
};

export const fetchOrderByIdAPI = async (id) => {
  const response = await axios.get(`/orders/${id}`);
  return response.data;
};

export const addOrderAPI = async (data) => {
  const response = await axios.post(`/orders`, data);
  return response.data;
};

export const exportToExcel = () => {
  window.open(`${import.meta.env.VITE_BASE_URL}/orders/export`, "_blank");
};
