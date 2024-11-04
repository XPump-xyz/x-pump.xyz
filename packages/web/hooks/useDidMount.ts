"use client";
import { retrieveLaunchParams } from "@telegram-apps/sdk";
import { useEffect, useState } from "react";

/**
 * @return True, if component was mounted.
 */
export function useDidMount(): boolean {
  const [didMount, setDidMount] = useState(false);

  useEffect(() => {
    setDidMount(true);
  }, []);

  return didMount;
}
