import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateHash(length = 4): string {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export function formatDate(date: Date | undefined, format: string = "YYYY-MM-DD"): string {
  if (!date) {
    return undefined;
  }

  return dayjs(date).format(format);

  // return date.toLocaleDateString("en-US", {
  //   day: "2-digit",
  //   month: "long",
  //   year: "numeric",
  // });
}

export function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !Number.isNaN(date.getTime());
}
