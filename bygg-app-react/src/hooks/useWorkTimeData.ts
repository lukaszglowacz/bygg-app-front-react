import { useState, useEffect, useCallback } from "react";
import api from "../api/api";
import { IWorkTimeData, IWorkTimesResponse } from "../api/interfaces/types";

export const useWorkTimeData = () => {
  const [workTimes, setWorkTimes] = useState<IWorkTimeData[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const response = await api.get<IWorkTimesResponse>(`/worksession/?page=${page}`);
      if (page === 1) {
        setWorkTimes(response.data.results);
      } else {
        const newRecords = response.data.results.filter(
          (newRecord) => !workTimes.some((existingRecord) => existingRecord.id === newRecord.id)
        );
        setWorkTimes(prevWorkTimes => [...prevWorkTimes, ...newRecords]);
      }
      setHasMore(response.data.next !== null);
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error("Error fetching work times", error);
    }
  }, [page, workTimes]);

  useEffect(() => {
    fetchData();
  }, []);

  return { workTimes, fetchData, hasMore };
};
