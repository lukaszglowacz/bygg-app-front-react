import axios, { AxiosInstance, AxiosError } from "axios";
import { IAddWorkPlaceData } from "./interfaces/types";

const api: AxiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

//Dodanie interceptora zadan do dolaczania tokena JWT do kazdego zadania
api.interceptors.request.use(
  (config) => {
    //Pobieranie tokena z localStorage
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//Dodanie nowego miejsca pracy na serwer
export const addWorkPlace = async (
  IAddWorkPlaceData: IAddWorkPlaceData
): Promise<any> => {
  try {
    const response = await api.post("/workplace/", IAddWorkPlaceData);
    console.log("Miejsce pracy zostalo dodane", response.data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // Teraz możemy bezpiecznie korzystać z `error.response` i `error.message`
      console.error(
        "Blad podczas dodawania miejsca pracy",
        error.response ? error.response.data : error.message
      );
    } else {
      // Obsługa przypadków, gdy błąd nie pochodzi z Axios
      console.error("Blad podczas dodawania miejsca pracy", error);
    }
    throw error;
  }
};

//Usuniecie miejsca pracy z serwera
export const deleteWorkPlace = async (id: number): Promise<any> => {
  try {
    const response = await api.delete(`/workplace/${id}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Błąd przy usuwaniu miejsca pracy:", error);
    throw error;
  }
};

export default api;
