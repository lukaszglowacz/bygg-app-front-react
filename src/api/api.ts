import axios, { AxiosInstance, AxiosError, AxiosResponse, AxiosRequestConfig } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

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
    const originalRequest = error.config as CustomAxiosRequestConfig;
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
          return api(originalRequest);
        }
      } catch (refreshError: any) {
        console.error("Error refreshing token:", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
