import axios, { AxiosInstance, AxiosError, AxiosResponse, AxiosRequestConfig } from "axios";
import { IAddWorkPlaceData } from "./interfaces/types";

const api: AxiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Rozszerzamy standardowy konfig o pole retry
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  retry?: boolean;
}

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig; // Asercja typu tutaj
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest.retry
    ) {
      originalRequest.retry = true;
      try {
        const tokenResponse = await axios.post<{ access: string }>("http://127.0.0.1:8000/api/token/refresh/", {
          refresh: localStorage.getItem("refreshToken")
        });
        if (tokenResponse.data.access) {
          localStorage.setItem("accessToken", tokenResponse.data.access);
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${tokenResponse.data.access}`;
          }
          return api(originalRequest); // Ponowne wykonanie żądania z nowym tokenem
        }
      } catch (refreshError: any) {
        console.error("Error refreshing token:", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = '/login'; // Przekierowanie do logowania
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Funkcje API do dodawania i usuwania miejsc pracy
export const addWorkPlace = async (data: IAddWorkPlaceData): Promise<any> => {
  try {
    const response = await api.post("/workplace/", data);
    console.log("Miejsce pracy zostało dodane", response.data);
    return response.data;
  } catch (error) {
    console.error("Błąd podczas dodawania miejsca pracy", error);
    throw error;
  }
};

export const deleteWorkPlace = async (id: number): Promise<any> => {
  try {
    const response = await api.delete(`/workplace/${id}`);
    console.log("Miejsce pracy usunięte", response.data);
    return response.data;
  } catch (error) {
    console.error("Błąd przy usuwaniu miejsca pracy:", error);
    throw error;
  }
};

export default api;
