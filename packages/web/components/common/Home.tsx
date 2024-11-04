"use client";
import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { retrieveLaunchParams } from "@telegram-apps/sdk";
import { useUserStore } from "@/stores/provider";
export const Home = () => {
  const { initDataRaw, initData } = retrieveLaunchParams();
  const { user, saveUser } = useUserStore((state) => state);

  return (
    <div className="relative flex flex-col items-center justify-center w-[var(--tg-viewport-width)] bg-[#141414] overflow-y-hidden px-4">
      <div className="flex flex-col items-center gap-3 w-full mt-[130px] z-10">
        <div className="text-center text-white  text-[2.125rem] leading-[42px]">
          Hi {`${initData?.user?.firstName} ${initData?.user?.lastName}`}
        </div>
        <div className="flex items-center gap-2">
          <Image src="/images/XP.png" alt="XP" width={24} height={24} />
          <div className="3_333 text-white  text-xl leading-7"></div>
        </div>
        <div className="flex justify-center items-center gap-2 py-1 px-3 rounded-lg bg-[#6c28f7]">
          <Image src="/images/wallet.svg" alt="Wallet" width={25} height={24} />
          <div className="text-4 text-white text-center  text-xs leading-6 uppercase">
            Connect Wallet
          </div>
        </div>
      </div>
      <Image
        src="/images/hidden.png"
        alt="Avatar"
        width={296}
        height={296}
        className="absolute right-0 left-0 w-fit z-0 ms-auto me-auto top-[24px]"
      />
      <div className="flex flex-col items-start gap-2 p-2 w-full rounded-2xl border border-[#1f1f1f] mt-[90px]">
        <div className="flex justify-between items-center self-stretch">
          <div className="flex items-center gap-2">
            <div className="earn_ text-white  text-sm leading-6">Earn:</div>
            <Image src="/images/XP.png" alt="Earn" width={24} height={24} />
            <div className="11_88_1h text-white  text-sm leading-6">
              11.88/1h
            </div>
          </div>
          <div className="x0_speed text-[#66ffb8]  text-sm leading-6">
            x0 Speed
          </div>
        </div>
        <div className="flex justify-center items-center gap-2 self-stretch py-2 px-4 rounded-lg bg-[#6c28f7] text text-white  text-sm leading-6 uppercase">
          Start Mining
        </div>
        <div className="flex justify-between items-center self-stretch p-4 rounded-2xl bg-neutral-950">
          <div className="frame_14 flex flex-col items-start">
            <div className="download_tingdepin_app self-stretch text-white  text-sm leading-6">
              Download TingDepin App
            </div>
            <div className="flex items-center gap-2 self-stretch h-6">
              <div className="flex justify-center items-center gap-2">
                <div className="text-white  text-xs">x2 Speed Mining</div>
              </div>
            </div>
          </div>
          <Button className="flex justify-center items-center gap-2 py-1 px-3 rounded-lg bg-[#6c28f7] text-1 text-white text-center  text-xs leading-6 uppercase h-fit">
            Start
          </Button>
        </div>
        <div className="flex justify-between items-center self-stretch p-4 rounded-2xl bg-neutral-950">
          <div className="flex flex-col items-start">
            <div className="invite_1_friend_to_unlock self-stretch text-white  text-sm leading-6">
              Invite 1 friend to unlock
            </div>
            <div className="flex items-center gap-2 self-stretch h-6">
              <div className="flex justify-center items-center gap-2">
                <div className="text-white  text-xs">x0 Speed Mining</div>
              </div>
            </div>
          </div>
          <Button className="flex justify-center items-center gap-2 py-1 px-3 rounded-lg border border-[#3d3d3d] bg-[#292929] text-2 text-white  text-xs leading-6 uppercase h-fit">
            Check
          </Button>
        </div>
        <div className="flex justify-between items-center self-stretch p-4 rounded-2xl bg-neutral-950">
          <div className="flex flex-col items-start">
            <div className="telegram_age___ self-stretch text-[#a175fa]  text-sm leading-6">
              Telegram age: ?
            </div>
            <div className="flex items-center gap-2 self-stretch h-6">
              <div className="flex justify-center items-center gap-2">
                <div className="text-white  text-xs">x0 Speed Mining</div>
              </div>
            </div>
          </div>
          <Button className="flex justify-center items-center gap-2 py-1 px-3 rounded-lg border border-[#3d3d3d] bg-[#292929] text-3 text-white  text-xs leading-6 uppercase h-fit">
            Check
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
