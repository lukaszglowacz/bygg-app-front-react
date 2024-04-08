import { useState, useEffect, useCallback } from "react";
import api from "../api/api";
import { IWorkTimeData, IWorkTimesResponse } from "../api/interfaces/types";

export const useWorkTimeData = () => {
  const [workTimes, setWorkTimes] = useState<IWorkTimeData[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const response = await api.get<IWorkTimesResponse>(`/worksession/?page=${page}`);
      setWorkTimes(prevWorkTimes => [...prevWorkTimes, ...response.data.results]);
      setHasMore(response.data.next !== null);
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error("Error fetching work times", error);
    }
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { workTimes, fetchData, hasMore };
};
