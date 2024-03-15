import { setupWorker } from "msw/browser";
import { handlers } from "./handler";

// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(...handlers);

export default worker;

// ("use client");

// import { handlers } from "./handler";

// if (typeof window !== "undefined") {
//   // 윈도우가 있다는게 브라우저 환경이라는 뜻이니까 그 조건을 한번 거쳐서 사용
//   if (process.env.NEXT_PUBLIC_API_MOCKING === "enabled") {
//     const mswBrowser = require("msw/browser");
//     mswBrowser.setupWorker(...handlers).start();
//   }
// }
// if (typeof window !== "undefined")
