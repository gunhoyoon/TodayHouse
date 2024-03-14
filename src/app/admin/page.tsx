"use client";
import React, { useEffect } from "react";
import Gnb from "../_component/gnb/Gnb";

// async function enableMocking() {
//   if (process.env.NODE_ENV !== "development") {
//     return;
//   }

//   const { worker } = await import("../../mocks/browser");

//   `worker.start()`;
//   return worker.start();
// }
// enableMocking();
// useEffect(() => {
//
// }, []);

export default function Admin() {
  return <Gnb />;
}
