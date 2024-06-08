import { useState, useEffect } from "react";
import api from "../api/api";
import { IWorkPlacesData } from "../api/interfaces/types";

export const useWorkPlaceData = (): IWorkPlacesData[] => {
  const [workplaces, setWorkPlaces] = useState<IWorkPlacesData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get<IWorkPlacesData[]>("/workplace");
        setWorkPlaces(response.data);
      } catch (error) {
        console.error(
          "Failed to load workplaces: ",
          error
        );
      }
    };
    fetchData();
  }, []);
  return workplaces;
};
