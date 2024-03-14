"use client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export default function CategoryInit() {
  const key = "카테고리";
  const queryClient = useQueryClient();
  useEffect(() => {
    const initData = localStorage.getItem(key) || "[]";
    // 로컬 데이터 있는 상태에서 앱 실행.
    console.log("initData", initData);
    // 조건문에서
    if (initData) {
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/initCategory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: initData,
      });
    }
    queryClient.invalidateQueries({ queryKey: ["admin", "category"] });
  }, [queryClient]);
  // 접근 시 마다 신선한 데이터를 요청함. 예를 들어 상품 페이지를 구경하는 동안 카테고리가 새로 업데이트 될 수 있으니,
  // 단점은 카테고리에 접근할 때마다 해당 쿼리를 무효화하고 다시 받아오는 단점이 좀 있음.

  return null;
}
