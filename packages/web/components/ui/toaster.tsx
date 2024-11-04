"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="flex gap-2 items-center w-fit">
              {props.variant === "success" && (
                <Image
                  src={"/images/success.svg"}
                  width={24}
                  height={24}
                  alt=""
                />
              )}
              {props.variant === "error" && (
                <Image
                  src={"/images/error.svg"}
                  width={24}
                  height={24}
                  alt=""
                />
              )}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
