import axios from "axios";
import { Transaction, NewTransactionPayload, ForecastDataPoint, FinancialProfile, TransactionSummary } from "./types";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || "Network error";
    return Promise.reject(new Error(message));
  }
);

// Helper for offline caching
const withCache = async <T>(key: string, fetcher: () => Promise<T>): Promise<T> => {
  try {
    const data = await fetcher();
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(data));
    }
    return data;
  } catch (error) {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem(key);
      if (cached) {
        console.warn(`API Error/Offline. Menggunakan cache untuk ${key}`);
        return JSON.parse(cached);
      }
    }
    throw error;
  }
};

export const transactionApi = {
  getAll: async (params: Record<string, any> = {}): Promise<Transaction[]> => {
    const key = "cache_tx_" + JSON.stringify(params);
    return withCache(key, async () => {
      const response = await apiClient.get("/transactions", { params });
      return response.data.data;
    });
  },
  
  getSummary: async (): Promise<TransactionSummary> => {
    return withCache("cache_summary", async () => {
      const response = await apiClient.get("/transactions/summary");
      return response.data.data;
    });
  },
  
  create: async (data: NewTransactionPayload): Promise<Transaction> => {
    const response = await apiClient.post("/transactions", data);
    return response.data.data;
  },
  
  remove: async (id: string): Promise<boolean> => {
    const response = await apiClient.delete(`/transactions/${id}`);
    return response.data.success;
  },
};

export const aiApi = {
  getForecast: async (): Promise<ForecastDataPoint[]> => {
    return withCache("cache_forecast", async () => {
      const response = await apiClient.get("/ai/forecast");
      return response.data.data;
    });
  },
  
  getFinancialProfile: async (): Promise<FinancialProfile> => {
    return withCache("cache_profile", async () => {
      const response = await apiClient.get("/ai/profile");
      return response.data.data;
    });
  }
};

export default apiClient;
