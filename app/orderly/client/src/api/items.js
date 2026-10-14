import { axios } from "./axiosInstance";

export const fetchItemsAPI = async ({ page = 1, limit = 10 }) => {
  const response = await axios.get(`/items?page=${page}&limit=${limit}`);
  return response.data;
};

export const fetchActiveItemsAPI = async () => {
  const response = await axios.get(`/items/active`);
  return response?.data?.suppliers;
};

export const fetchItemById = async (id) => {
  const response = await axios.get(`/items/${id}`);
  return response.data;
};

export const addItemAPI = async (data) => {
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      value.forEach((file) => formData.append(key, file));
    } else {
      formData.append(key, value);
    }
  }
  const response = await axios.post(`/items`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const editItemAPI = async ({ id, data }) => {
  const response = await axios.put(`/items/${id}`, data);
  return response.data;
};
