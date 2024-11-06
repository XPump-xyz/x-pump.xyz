"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import useApi from "@/hooks/useApi";
import {
  initBackButton,
  retrieveLaunchParams,
  useLaunchParams,
  useUtils,
} from "@telegram-apps/sdk-react";
import { useUserStore } from "@/stores/provider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home } from "@/components/common/Home";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import NavBar from "@/components/common/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import GasPumpTab from "@/components/common/GasPumpTab";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  const { initDataRaw, initData } = retrieveLaunchParams();
  const lp = useLaunchParams();
  const loginInProgress = useRef(false);
  const { user, saveUser } = useUserStore((state) => state);
  const router = useRouter();
  const [backButton] = initBackButton();

  const authApi = useApi({
    key: ["login"],
    method: "POST",
    url: "auth/login",
  }).post;

  const getMe = useApi({
    key: ["auth"],
    method: "GET",
    url: "user/me",
  }).get;

  const initAuth = async () => {
    // If login is already in progress, skip
    if (loginInProgress.current) return;
    loginInProgress.current = true;

    try {
      const existUser = localStorage.getItem("user");
      const existToken = localStorage.getItem("token");

      // Check if user changed
      if (existUser && initData?.user) {
        const localUser = JSON.parse(existUser);
        if (initData.user.id !== localUser.id) {
          localStorage.clear();
        }
      }

      // Update stored user
      if (initData?.user) {
        localStorage.setItem("user", JSON.stringify(initData.user));
      }

      // Only login if no token exists
      if (!existToken) {
        const response = await authApi?.mutateAsync({
          initData: initDataRaw,
          referralCode: lp.startParam,
        });

        if (response?.access_token) {
          localStorage.setItem("token", response.access_token);
        }
      }

      // Get user data
      const me = await getMe?.refetch();
      if (me?.data) {
        saveUser(me.data);
      }
    } catch (error) {
      console.error("Auth initialization failed:", error);
    } finally {
      loginInProgress.current = false;
    }
  };

  useEffect(() => {
    backButton.hide();
    initAuth();
  }, []);

  if (!user)
    return (
      <div className="root__loading text-white">Fetching user data...</div>
    );
  return (
    <div className="flex w-[var(--tg-viewport-width)] flex-col h-full items-center">
      <NavBar />
      <div className="flex flex-col items-center gap-3 pt-4 pb-2 px-4 w-full rounded-xl">
        <div className="flex items-start gap-2 py-2 pl-2 pr-4 w-full justify-between rounded-lg bg-[#1f1f1f]">
          <div className="left flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/images/avatar.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="placeholder flex flex-col items-start gap-1">
              <div className="madalena self-stretch text-white ] text-xs font-semibold">
                Madalena
              </div>
              <div className="sold_2_ton_of_pemp self-stretch text-[#00c1ff] ] text-xs">
                Sold 2 TON of PEMP
              </div>
            </div>
          </div>
          <div className="6s text-[#adadad] ] text-xs">6s</div>
        </div>
        <div className="flex flex-col items-center justify-center gap-2  pb-2 px-4 py-4 w-full rounded-xl relative">
          <Image
            className="flex absolute justify-center items-center w-full h-full"
            src="/images/subtract.svg"
            alt="shape"
            width={243}
            height={196}
          />

          <div className="flex flex-col items-center gap-2 self-stretch z-10 py-4 w-full items-center">
            <Avatar className="w-16 h-16">
              <AvatarImage src="/images/avatar.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div className="frame_7 flex flex-col items-start">
              <div className="w-40 h-0.5 bg-neutral-600" />
              <div className="w-6 h-0.5 bg-[#bbff2a] absolute" />
            </div>
            <div className="flex items-center gap-2">
              <div className="ohhlongmeme text-[#adadad] ] text-sm font-semibold leading-6">
                OhhLongMeme
              </div>
              <div className="_olm text-white ] text-sm font-semibold leading-6">
                $OLM
              </div>
            </div>
            <div className="flex flex-col justify-center items-center gap-0.5">
              <div className="market_cap_ text-[#adadad] ] text-sm leading-6">
                Market cap:{" "}
              </div>
              <div className="_9_9963 text-[#bbff2a] font-rigamesh text-xl leading-7">
                $9,9963
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center gap-1 w-[21.4375rem] rounded-lg text text-[#bbff2a] text-center font-rigamesh text-xs leading-6">
          The Open League $100,000 airdrop
        </div>
        <Tabs className="w-full" defaultValue="gas_pump">
          <TabsList>
            <TabsTrigger value="gas_pump">Gas Pump</TabsTrigger>
            <TabsTrigger value="on_dedust">On Dedust</TabsTrigger>
          </TabsList>
          <TabsContent value="gas_pump">
            <GasPumpTab />
          </TabsContent>
        </Tabs>
      </div>
      <Button
        className="inline-flex justify-center items-center gap-2 p-4 relative h-12 w-12 fixed bottom-8 right-8 z-12"
        onClick={() => router.push("/create-token")}
      >
        <Image
          src="/images/button.png"
          alt="Connect Wallet"
          width={56}
          height={56}
          className="absolute w-full h-full left-0 top-0"
        />
        <Image
          src="/images/leaf-black.svg"
          alt="arrow"
          width={24}
          height={24}
          className="z-10"
        />
      </Button>
    </div>
  );
};

export default HomePage;
