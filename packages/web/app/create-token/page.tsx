"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { storage } from "@/hooks/useFirebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useXrplBalance } from "@/hooks/useXrplBalance";
import { useUserStore } from "@/stores/provider";
import { initBackButton } from "@telegram-apps/sdk-react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  symbol: z.string().min(1, "Ticker symbol is required"),
  description: z.string().min(1, "Description is required"),
  telegramChannel: z.string().optional(),
  telegramChat: z.string().optional(),
  twitter: z.string().optional(),
  website: z.string().optional(),
  logo: z.any({
    message: "Logo is required.",
  }),
});

export default function CreateTokenPage() {
  const router = useRouter();
  const [backButton] = initBackButton();
  useEffect(() => {
    backButton.show();
    backButton.on("click", () => {
      router.back();
    });
  }, []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      symbol: "",
      description: "",
      telegramChannel: "",
      telegramChat: "",
      twitter: "",
      website: "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      //   let logoUrl = "";

      //   if (values.logo?.[0]) {
      //     const file = values.logo[0];
      //     const storageRef = ref(
      //       storage,
      //       `token-logos/${values.symbol}-${Date.now()}`
      //     );
      //     const snapshot = await uploadBytes(storageRef, file);
      //     logoUrl = await getDownloadURL(snapshot.ref);
      //   }

      //   // Send to your API
      //   const tokenData = {
      //     ...values,
      //     logo: logoUrl, // Replace FileList with URL
      //   };
      router.push("/token-quantity");

      // Make your API call here
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="logo"
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem className="flex justify-center w-full my-8">
                <FormControl>
                  <div
                    className="flex items-center gap-2 relative"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {!(value && value[0]) ? (
                      <div className="w-16 h-16 rounded-lg bg-[#333] flex justify-center items-center">
                        <Image
                          src="/images/photo-add.svg"
                          alt="logo"
                          width={40}
                          height={40}
                        />
                      </div>
                    ) : (
                      <Image
                        src={URL.createObjectURL(value[0])}
                        alt="Token logo preview"
                        width={64}
                        height={64}
                        className="rw-16 h-16 rounded-lg"
                      />
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onChange(e.target.files)}
                      {...field}
                      className="hidden"
                      ref={fileInputRef}
                    />
                    <div className="inline-flex justify-center items-center gap-1 pt-[0.1875rem] pr-[0.1875rem] pb-[0.1875rem] pl-[0.1875rem] absolute bottom-[-10px] right-[-10px]">
                      <svg
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M5.41421 0.585786C5.78929 0.210714 6.29799 0 6.82843 0H22C23.1046 0 24 0.89543 24 2V17.1716C24 17.702 23.7893 18.2107 23.4142 18.5858L18.5858 23.4142C18.2107 23.7893 17.702 24 17.1716 24H2C0.895431 24 0 23.1046 0 22V6.82843C0 6.29799 0.210714 5.78929 0.585787 5.41421L5.41421 0.585786Z"
                          fill="#BBFF2A"
                        />
                      </svg>
                      <div className="flex justify-center items-center pt-[0.1875rem] pr-[0.1875rem] pb-[0.1875rem] pl-[0.1875rem] w-[1.125rem] h-[1.125rem] absolute">
                        <svg
                          width={12}
                          height={12}
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6 0.75V11.25"
                            stroke="#0A0A0A"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M0.75 6C4.25 6 11.25 6 11.25 6"
                            stroke="#0A0A0A"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center relative">
                    <Image
                      src="/images/InputNoLabel.png"
                      alt="logo"
                      width={200}
                      height={200}
                      className="absolute top-0 left-0 w-full h-full"
                    />
                    <Input
                      placeholder="Name"
                      {...field}
                      className="bg-transparent z-10 !border-none text-[#F5F5F5]"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="symbol"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center relative">
                    <Input
                      placeholder="Ticker"
                      {...field}
                      className="bg-transparent z-10 !border-none text-[#F5F5F5]"
                    />
                    <Image
                      src="/images/InputNoLabel.png"
                      alt="logo"
                      width={200}
                      height={200}
                      className="absolute top-0 left-0 w-full h-full z-1"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center relative">
                    <Image
                      src="/images/InputNoLabel.png"
                      alt="logo"
                      width={200}
                      height={200}
                      className="absolute top-0 left-0 w-full h-full z-1"
                    />
                    <Textarea
                      placeholder="Description"
                      {...field}
                      className="bg-transparent z-10 !border-none text-[#F5F5F5] min-h-[150px]"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="telegramChannel"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center relative">
                    <Image
                      src="/images/InputNoLabel.png"
                      alt="logo"
                      width={200}
                      height={200}
                      className="absolute top-0 left-0 w-full h-full z-1"
                    />
                    <Input
                      placeholder="Telegram channel link (optional)"
                      {...field}
                      className="bg-transparent z-10 !border-none text-[#F5F5F5]"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="telegramChat"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center relative">
                    <Image
                      src="/images/InputNoLabel.png"
                      alt="logo"
                      width={200}
                      height={200}
                      className="absolute top-0 left-0 w-full h-full z-1"
                    />
                    <Input
                      placeholder="Telegram chat link (optional)"
                      {...field}
                      className="bg-transparent z-10 !border-none text-[#F5F5F5]"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="twitter"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center relative">
                    <Image
                      src="/images/InputNoLabel.png"
                      alt="logo"
                      width={200}
                      height={200}
                      className="absolute top-0 left-0 w-full h-full z-1"
                    />
                    <Input
                      placeholder="Twitter link (optional)"
                      {...field}
                      className="bg-transparent z-10 !border-none text-[#F5F5F5]"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center relative">
                    <Image
                      src="/images/InputNoLabel.png"
                      alt="logo"
                      width={200}
                      height={200}
                      className="absolute top-0 left-0 w-full h-full z-1"
                    />
                    <Input
                      placeholder="Website link (optional)"
                      {...field}
                      className="bg-transparent z-10 !border-none text-[#F5F5F5]"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="flex justify-center items-center gap-2 relative w-full z-10"
            type="submit"
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
        </form>
      </Form>
    </div>
  );
}
