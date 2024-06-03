import { useState, useEffect, useCallback } from "react";
import api from "../api/api";
import { IWorkTimeData } from "../api/interfaces/types";

export const useWorkTimeDataById = (id: number) => {
  const [workTime, setWorkTime] = useState<IWorkTimeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const fetchData = useCallback(async () => {
    try {
      const response = await api.get(`/worksession/?id=${id}`);
      if (response.data.results.length > 0) {
        setWorkTime(response.data.results[0]);
      } else {
        setError("No work session found with the given ID");
      }
    } catch (error) {
      setError("Error fetching work session");
      console.error("Error fetching work session data", error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchData();
  }, [id, fetchData]);

  return { workTime, isLoading, error, reload: fetchData };
};
