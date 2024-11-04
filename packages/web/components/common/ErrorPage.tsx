import { useEffect } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { retrieveLaunchParams } from "@telegram-apps/sdk";
export function ErrorPage({
  error,
}: {
  error: Error & { digest?: string };
  reset?: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col flex-1 h-full w-full justify-center items-center gap-10 relative ">
      <div className=" text-white text-center flex items-center justify-center text-[5rem] font-light  uppercase relative">
        Zupad
      </div>

      <Button
        onClick={() => {
          window.open("https://zupad.org", "_blank");
        }}
        className="w-fit px-4 capitalize"
      >
        Go to App
      </Button>
    </div>
  );
}
