import { useState, useEffect } from "react";
import api from "../api/api";
import { IWorkTimeData, IWorkTimesResponse } from "../api/interfaces/types";

export const useWorkTimeData = () => {
  const [workTimes, setWorkTimes] = useState<IWorkTimeData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get<IWorkTimesResponse>("/worksession");
        setWorkTimes(response.data.results);
      } catch (error) {
        console.error(
          "Wystąpił błąd podczas pobierania danych o godzinach pracy",
          error
        );
      }
    };
    fetchData();
  }, []);
  
  return workTimes;
};
