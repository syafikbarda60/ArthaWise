import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// Response interceptor – normalize errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Network error";
    return Promise.reject(new Error(message));
  }
);

export const transactionApi = {
  getAll: (params = {}) =>
    apiClient.get("/transactions", { params }).then((r) => r.data),
  create: (data) =>
    apiClient.post("/transactions", data).then((r) => r.data),
  remove: (id) =>
    apiClient.delete(`/transactions/${id}`).then((r) => r.data),
};

export default apiClient;
