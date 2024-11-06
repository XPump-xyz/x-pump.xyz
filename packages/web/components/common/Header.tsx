"use client";
import React from "react";
import { Avatar } from "../ui/avatar";
import { Button } from "../ui/button";
import Image from "next/image";

const NavBar = () => (
  <div className="flex justify-between items-center py-0 px-4 w-full h-11 ">
    <div className="button_l flex items-start gap-1">
      <Avatar />
    </div>
    <Button className="relative flex justify-end items-center gap-1 ">
      <Image
        src="/images/button.svg"
        alt="Connect Wallet"
        width={176}
        height={32}
        className="absolute w-full h-full left-0 top-0"
      />

      <div className="text text-text-gray text-center font-rigamesh text-xs leading-6 z-10">
        Connect Wallet
      </div>
    </Button>
  </div>
);

export default NavBar;
