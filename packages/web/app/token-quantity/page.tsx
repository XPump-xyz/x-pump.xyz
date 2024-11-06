"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatXrpBalance, useXrplBalance } from "@/hooks/useXrplBalance";
import { useUserStore } from "@/stores/provider";
import { initBackButton } from "@telegram-apps/sdk-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import BigNumber from "bignumber.js";

export default function QuantityToken() {
  const { user, saveUser } = useUserStore((state) => state);

  const { xrp, refreshBalance } = useXrplBalance(
    user?.xrplAddress || "",
    "testnet"
  );
  const router = useRouter();
  const [backButton] = initBackButton();
  useEffect(() => {
    backButton.show();
    backButton.on("click", () => {
      router.back();
    });
  }, []);

  const [xrpAmount, setXrpAmount] = useState("1");
  const [calculatedValues, setCalculatedValues] = useState({
    tokenAmount: "0",
    percentageOfSupply: "0",
    pricePerToken: "0.00000074",
    totalXrpCost: "0",
  });
  const [isValidAmount, setIsValidAmount] = useState(true);

  // Constants
  const TOKENS_PER_XRP = new BigNumber("1350380.65");
  const TOTAL_SUPPLY = new BigNumber("1000000000");
  const CREATION_COST = 0.3; // XRP cost to create token

  const calculateTokens = (amount: string) => {
    try {
      const xrpInput = new BigNumber(amount);

      // Validation
      if (xrpInput.isLessThanOrEqualTo(0) || xrpInput.isNaN()) {
        setIsValidAmount(false);
        return;
      }

      //   if (xrpInput.plus(CREATION_COST).isGreaterThan(xrp)) {
      //     setIsValidAmount(false);
      //     return;
      //   }

      setIsValidAmount(true);

      // Calculate tokens
      const tokens = xrpInput.multipliedBy(TOKENS_PER_XRP);

      // Calculate percentage
      const percentage = tokens
        .dividedBy(TOTAL_SUPPLY)
        .multipliedBy(100)
        .decimalPlaces(4);

      const totalCost = xrpInput.plus(CREATION_COST);

      setCalculatedValues({
        tokenAmount: tokens.toFormat(2),
        percentageOfSupply: percentage.toString(),
        pricePerToken: "0.00000074",
        totalXrpCost: totalCost.toString(),
      });
    } catch (error) {
      setIsValidAmount(false);
      setCalculatedValues({
        tokenAmount: "0",
        percentageOfSupply: "0",
        pricePerToken: "0.00000074",
        totalXrpCost: "0",
      });
    }
  };

  useEffect(() => {
    calculateTokens(xrpAmount);
  }, [xrpAmount]);

  const handleXrpInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setXrpAmount(value);
  };

  const quickAmounts = [3, 10, 50, 100];

  return (
    <div className="flex flex-col items-center w-full h-full pt-16 p-4 justify-between">
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="how_many__gvn_you_want_to_buy_ w-[19.4375rem] text-neutral-100 text-center font-rigamesh leading-6">
          How many $GVN you want to buy?
        </div>
        <Input
          className="flex flex-col justify-center items-center gap-2 p-2 w-full 0 self-stretch text-[#adadad] text-center font-rigamesh text-[2.125rem] leading-[42px] my-4 bg-transparent border-none"
          defaultValue={0}
          type="number"
          value={xrpAmount}
          onChange={handleXrpInputChange}
        />

        <div className="inline-flex items-center gap-1">
          <div className="balance text-[#adadad]  text-xs">Balance</div>
          <div className="21_53_xrp text-white  text-xs font-semibold">
            {formatXrpBalance(xrp)}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-4 w-full">
        {xrpAmount && (
          <div className="flex flex-col items-start gap-2 p-4 w-full rounded-xl bg-[#1f1f1f]">
            <div className="flex justify-between items-center self-stretch">
              <div className="label text-[#adadad]  text-sm leading-6">
                You will Receive
              </div>
              <div className="label-1 text-white text-right  text-sm font-semibold leading-6">
                ~&nbsp;{calculatedValues.tokenAmount}
              </div>
            </div>
            <div className="flex justify-between items-center self-stretch">
              <div className="label-2 text-[#adadad]  text-sm leading-6">
                Percentage of Total Supply
              </div>
              <div className="label-3 text-white  text-sm font-semibold leading-6">
                {calculatedValues.percentageOfSupply}%
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-col items-start gap-2 p-4 w-full rounded-xl bg-[#1f1f1f] ">
          <div className="flex justify-between items-center self-stretch">
            <div className="label text-[#adadad]  text-sm leading-6">Name</div>
            <div className="flex items-center gap-2">
              <div className="url(<path-to-image>) lightgray 50% / cover no-repeat)] w-6 h-6 rounded bg-[var(--avatar-male-12," />
              <div className="label-1 text-white  text-sm font-semibold leading-6">
                Gevan coin
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center self-stretch">
            <div className="label-2 text-[#adadad]  text-sm leading-6">
              Ticker
            </div>
            <div className="label-3 text-white  text-sm font-semibold leading-6">
              $GVN
            </div>
          </div>
          <div className="flex justify-between items-center self-stretch">
            <div className="label-4 text-[#adadad]  text-sm leading-6">
              Total Suupply
            </div>
            <div className="label-5 text-white  text-sm font-semibold leading-6">
              1,000,000,000
            </div>
          </div>
        </div>
        <div className="label-6 flex-shrink-0 w-full h-6 text-[#adadad] text-center text-sm leading-6">
          Cost Creation: ~&nbsp;0.3 XRP
        </div>
        <Button className="flex justify-center items-center gap-2   relative w-full">
          <Image
            src="/images/button_shape.png"
            alt="Connect Wallet"
            width={56}
            height={56}
            className="absolute w-full h-full"
          />
          <div className="text text-[#333] font-rigamesh leading-6 z-10">
            Create Token
          </div>
        </Button>
      </div>
    </div>
  );
}
