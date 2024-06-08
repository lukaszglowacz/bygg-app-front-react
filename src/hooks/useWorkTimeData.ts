import { useState, useEffect, useCallback } from "react";
import api from "../api/api";
import { IWorkTimeData, IWorkTimesResponse } from "../api/interfaces/types";

export const useWorkTimeData = (userId = '') => {
  const [workTimes, setWorkTimes] = useState<IWorkTimeData[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = useCallback(async () => {
    const url = userId ? `/worksession/?user=${userId}&page=${page}` : `/worksession/?page=${page}`;
    try {
      const response = await api.get<IWorkTimesResponse>(url);
      setWorkTimes(prevWorkTimes => page === 1 ? response.data.results : [...prevWorkTimes, ...response.data.results]);
      setHasMore(response.data.next !== null);
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error("Failed to load work times: ", error);
    }
  }, [userId, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { workTimes, fetchData, hasMore, resetData: () => setPage(1) };
};

