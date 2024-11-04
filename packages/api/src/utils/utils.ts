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

export function getLimitByLevel(level: number): number {
  if (level < 1) {
    return 0;
  }

  return 500 + level * 100 > 1500 ? 1500 : 500 + level * 100;
}

export function getLevelByLimit(limit: number): number {
  if (limit < 500) {
    return 0;
  }

  return Math.floor((limit - 500) / 100);
}

export async function groupByProject(data: any[]): Promise<any[]> {
  const result: { [key: number]: any } = {};

  for (const item of data) {
    const {
      projectId,
      tokenId,
      _sum: { amount },
    } = item;

    if (!result[projectId]) {
      result[projectId] = {
        projectId,
        tokenList: [],
      };
    }

    result[projectId].tokenList.push({ tokenId, amount });
  }

  return Object.values(result);
}

export const ADMIN_ADDRESS = '0x2DEF55F3180f47F86D9239b26583a5053Eb22157';

export const transferEventAbi = [
  {
    inputs: [
      {
        indexed: true,
        name: 'from',
        type: 'address',
      },
      { indexed: true, name: 'to', type: 'address' },
      {
        indexed: false,
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
];
