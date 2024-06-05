// src/utils/dateUtils.ts
import moment from "moment-timezone";

export const formatDate = (date: string | Date): string => {
  return moment(date).format("YYYY.MM.DD");
};

export const formatTime = (date: string | Date): string => {
  return moment(date).format("HH:mm");
};

export const formatDateTime = (date: string | Date): string => {
  return moment(date).format("YYYY.MM.DD HH:mm");
};
