import Axios from "axios";
import { toast } from "react-toastify";

export const axios = Axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = "An unexpected error occurred";

    if (error.response) {
      errorMessage =
        error.response.data.message || `Error ${error.response.status}`;
      toast.error(errorMessage);
    } else if (error.request) {
      errorMessage = "Network error. Please check your connection.";
      toast.error(errorMessage);
    } else {
      toast.error("Request setup failed. Please try again.");
    }

    console.error(errorMessage, error);

    return Promise.reject(error);
  }
);
