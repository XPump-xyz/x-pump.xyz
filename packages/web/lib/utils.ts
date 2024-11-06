import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatXrpBalance = (
  balance: string,
  decimals: number = 2
): string => {
  const num = parseFloat(balance);
  return `${Number(num.toFixed(decimals)).toLocaleString()} XRP`;
};
