"use client";

import React, { useEffect, useState } from "react";
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
import { useToast } from "@/components/ui/use-toast";

const HomePage = () => {
  const { initDataRaw, initData } = retrieveLaunchParams();
  const lp = useLaunchParams();

  const { user, saveUser } = useUserStore((state) => state);
  const { toast } = useToast();

  const router = useRouter();
  const [backButton] = initBackButton();
  const utils = useUtils();

  useEffect(() => {
    backButton.hide();
  }, []);
  const authApi = useApi({
    key: ["auth"],
    method: "POST",
    url: "auth/login",
  }).post;

  const getMe = useApi({
    key: ["auth"],
    method: "GET",
    url: "user/me",
  }).get;

  const checkTelegramAge = async () => {
    try {
      const existUser = localStorage.getItem("user");
      if (existUser) {
        const localUser = JSON.parse(existUser);
        if (initData?.user?.id !== localUser?.id) {
          localStorage.clear();
        }
      }
      const existToken = localStorage.getItem("token");

      if (!existToken) {
        const response = await authApi?.mutateAsync({
          initData: initDataRaw,
          referralCode: lp.startParam,
        });
        if (response.access_token) {
          localStorage.setItem("token", response.access_token);
        }
      }
      localStorage.setItem("user", JSON.stringify(initData?.user));
      await getUser();
    } catch (error) {
      console.log(error);
    }
  };

  const getUser = async () => {
    const me = await getMe?.refetch();
    saveUser(me?.data);
  };
  useEffect(() => {
    if (initDataRaw) {
      checkTelegramAge();
    }
  }, [initDataRaw]);

  return (
    <div className="flex w-[var(--tg-viewport-width)] px-8 flex-col h-full items-center">
      <Tabs
        defaultValue="home"
        className={cn(
          "flex w-[var(--tg-viewport-width)] flex-col justify-between h-full"
        )}
      >
        <TabsList
          className={cn(
            "flex justify-between items-center pt-4 pb-8 px-8 w-[var(--tg-viewport-width)] rounded-tl-2xl rounded-tr-2xl bg-black fixed bottom-[0px] z-10"
          )}
        >
          <TabsTrigger value="home" className="flex flex-col items-center">
            <Image
              src="/images/TingNode.png"
              alt="Home"
              width={20}
              height={20}
            />
            <div className="text-xs ">HOME</div>
          </TabsTrigger>
          <TabsTrigger value="earn" className="flex flex-col items-center">
            <Image src="/images/earn.svg" alt="Home" width={20} height={20} />
            <div className="text-xs ">EARN</div>
          </TabsTrigger>
          <TabsTrigger value="rank" className="flex flex-col items-center bg-c">
            <Image
              src="/images/rank.svg"
              alt="Password"
              width={20}
              height={20}
            />
            <div className=" text-xs ">RANK</div>
          </TabsTrigger>
          <TabsTrigger
            value="friends"
            className="flex flex-col items-center bg-c"
          >
            <Image
              src="/images/friends.svg"
              alt="Password"
              width={20}
              height={20}
            />
            <div className=" text-xs ">FRIENDS</div>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="home" className="pb-[120px]">
          <Home />
        </TabsContent>

        <TabsContent value="portfolio" className="h-full"></TabsContent>

        <TabsContent value="profile" className="h-full"></TabsContent>
      </Tabs>
    </div>
  );
};

export default HomePage;
