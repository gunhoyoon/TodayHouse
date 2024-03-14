"use client";
import { useEffect } from "react";

export const MSWComponent = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (process.env.NEXT_PUBLIC_API_MOCKING === "enabled") {
        require("@/mocks/browser");
      }
    }
  }, []);

  return null;
};

// async function enableMocking() {
//   if (process.env.NODE_ENV !== "development") {
//     return;
//   }

//   const { worker } = await import("../../mocks/browser");

//   `worker.start()`;
//   return worker.start();
// }
// enableMocking();
