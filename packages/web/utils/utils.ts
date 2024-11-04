import { usdtAbi } from "@/lib/usdt_abi";
import { zukipointAbi } from "@/lib/zukipoint_abi";
import { zukiverseAbi } from "@/lib/zukiverse_abi";
import axios from "axios";
import { detect } from "detect-browser";
import { formatEther } from "viem";

export const axiosInstance = axios.create({
  baseURL: process.env.BACKEND_URL,
});

const data = [
  { year: 2014, cumulativeDownloads: 35000000, age: 10 },
  { year: 2015, cumulativeDownloads: 85000000, age: 9 },
  { year: 2016, cumulativeDownloads: 165000000, age: 8 },
  { year: 2017, cumulativeDownloads: 315000000, age: 7 },
  { year: 2018, cumulativeDownloads: 515000000, age: 6 },
  { year: 2019, cumulativeDownloads: 815000000, age: 5 },
  { year: 2020, cumulativeDownloads: 1215000000, age: 4 },
  { year: 2021, cumulativeDownloads: 1765000000, age: 3 },
  { year: 2022, cumulativeDownloads: 2465000000, age: 2 },
  { year: 2023, cumulativeDownloads: 3265000000, age: 1 },
  { year: 2024, cumulativeDownloads: 4165000000, age: 0.5 },
];

export function getTelegramUserAge(userId: number): number {
  for (let i = 0; i < data.length; i++) {
    if (userId <= data[i].cumulativeDownloads) {
      return data[i].age + 1;
    }
  }
  return 1;
}

export function getLevelByLimit(limit: number): number {
  if (limit < 500) {
    return 0;
  }

  return Math.floor((limit - 500) / 100);
}

export function shortenEthAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
