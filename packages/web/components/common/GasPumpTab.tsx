"use client";

import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const GasPumpTab = () => {
  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex gap-2 items-center gap-2">
        <Button className="flex justify-center items-center gap-2 py-2 px-6 relative  h-fit">
          <Image
            src="/images/shape.png"
            alt="shape"
            width={16}
            height={20}
            className="absolute w-full h-full"
          />
          <div className="flex justify-center items-center gap-2 z-10">
            <Image src="/images/hot.svg" alt="hot" width={16} height={20} />

            <div className="text text-white  text-sm leading-6">Hot</div>
          </div>
        </Button>
        <Button className="flex justify-center items-center gap-2 py-2 px-6 relative  h-fit">
          <Image
            src="/images/shape.png"
            alt="shape"
            width={16}
            height={20}
            className="absolute w-full h-full"
          />
          <div className="flex justify-center items-center gap-2 z-10">
            <Image
              src="/images/moneybag.svg"
              alt="hot"
              width={24}
              height={24}
            />

            <div className="text text-white  text-sm leading-6">Top Cap</div>
          </div>
        </Button>
        <Button className="flex justify-center items-center gap-2 py-2 px-6 relative  h-fit">
          <Image
            src="/images/shape.png"
            alt="shape"
            width={16}
            height={20}
            className="absolute w-full h-full"
          />
          <div className="flex justify-center items-center gap-2 z-10">
            <Image src="/images/stats.svg" alt="hot" width={24} height={24} />

            <div className="text text-white  text-sm leading-6">Top Volume</div>
          </div>
        </Button>
      </div>
      {/* <div className="flex justify-center items-center gap-2 py-1 px-3">
        <div className="flex flex-col items-start gap-4 w-[5.5625rem] h-8">
          <div className="shape-4 self-stretch bg-[#bbff2a]" />
        </div>
        <div className="flex justify-center items-center w-6 h-6"></div>
        <div className="text-3 text-white  text-sm leading-6">
          New
        </div>
      </div> */}
      <div className="flex flex-col items-start gap-3 w-full">
        {mockData.map((item) => (
          <div
            className="flex items-center gap-2 self-stretch rounded-xl h-fit relative  w-full"
            key={item.name}
          >
            <Image
              src="/images/shape2.png"
              alt="shape"
              width={16}
              height={20}
              className="absolute  w-full h-full"
            />
            <div className="left flex items-center gap-3 z-10 py-2 px-4 ">
              <Avatar className="w-10 h-10 rounded-md">
                <AvatarImage src="/images/avatar.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="placeholder flex flex-col items-start gap-2">
                <div className="flex items-start gap-2">
                  <div className="flex items-center gap-2">
                    <div className="ohhlongmeme text-[#adadad]  text-sm leading-6">
                      {item.name}
                    </div>
                    <div className="_olm text-white  text-sm leading-6">
                      {item.symbol}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2 self-stretch">
                  <div className="flex items-center gap-1">
                    <div className="mc-1 text-[#adadad]  text-xs">MC</div>
                    <div className="_4_7k text-white  text-xs font-semibold">
                      {item.marketCap}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Image
                      src="/images/leaf.svg"
                      alt="clock"
                      width={16}
                      height={16}
                    />
                    <div className="11h text-[#bbff2a]  text-xs font-semibold">
                      11h
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Image
                      src="/images/friend.svg"
                      alt="holder"
                      width={16}
                      height={16}
                    />
                    <div className="86 text-white  text-xs font-semibold">
                      {item.holders}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Image
                      src="/images/chat.svg"
                      alt="transaction"
                      width={16}
                      height={16}
                    />
                    <div className="6 text-white  text-xs font-semibold">
                      {item.transactions}
                    </div>
                  </div>
                </div>
                <div className="progress flex flex-col items-start self-stretch">
                  <div className="self-stretch h-0.5 bg-neutral-600" />
                  <div className="w-[6.25rem] h-0.5 bg-[#bbff2a] absolute" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
const mockData = [
  {
    name: "OhhLongMeme",
    symbol: "$OLM",
    marketCap: "$4.7K",
    time: "11h",
    holders: 86,
    transactions: 6,
  },
  {
    name: "OhhLongMeme",
    symbol: "$OLM",
    marketCap: "$4.7K",
    time: "11h",
    holders: 86,
    transactions: 6,
  },
  {
    name: "OhhLongMeme",
    symbol: "$OLM",
    marketCap: "$4.7K",
    time: "11h",
    holders: 86,
    transactions: 6,
  },
  {
    name: "OhhLongMeme",
    symbol: "$OLM",
    marketCap: "$4.7K",
    time: "11h",
    holders: 86,
    transactions: 6,
  },
];

export default GasPumpTab;
