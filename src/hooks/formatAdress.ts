import { IWorkPlacesData } from "../api/interfaces/types";

export const formatAddress = (workplace: IWorkPlacesData) => {
  return `${workplace.street} ${workplace.street_number}, ${workplace.postal_code} ${workplace.city}`;
};
