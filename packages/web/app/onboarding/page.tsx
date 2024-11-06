"use client";

import Image from "next/image";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { initBackButton } from "@telegram-apps/sdk-react";
import { Button } from "@/components/ui/button";

const Onboarding = () => {
  const router = useRouter();
  const [backButton] = initBackButton();
  useEffect(() => {
    backButton.show();
    backButton.on("click", () => {
      router.back();
    });
  }, []);

  return (
    <div className="flex flex-col items-center w-full h-full p-4 relative">
      <div className="flex justify-center items-center gap-2 py-3 px-4 w-[21.4375rem]">
        <Image src="/images/Image.png" alt="back" width={240} height={240} />
      </div>
      <div className=" w-[19.4375rem] text-white text-center font-rigamesh text-xl leading-7 mt-8">
        Create your memecoin in 30s
      </div>
      <div className="here_is_a_quick_guide_on_how_to_launch_a_successful_memecoin w-[19.4375rem] text-[#adadad] text-center  text-sm leading-[1.375rem] mt-2">
        Here is a quick guide on how to launch a successful memecoin
      </div>
      <Button
        className="flex justify-center items-center gap-2   relative w-[calc(100%-32px)] fixed bottom-8"
        onClick={() => router.push("/onboarding")}
      >
        <Image
          src="/images/button_shape.png"
          alt="Connect Wallet"
          width={56}
          height={56}
          className="absolute w-full h-full"
        />
        <div className="text text-[#333] font-rigamesh leading-6 z-10">
          Continue
        </div>
      </Button>
    </div>
  );
};

export default Onboarding;
