"use client";
import { useRouter } from "next/router";
import Link from "next/link";
import React from "react";
import styles from "./gnb.module.css";
import { usePathname } from "next/navigation";

export default function Gnb() {
  const pathname = usePathname();
  // 현재 경로를 체크해서 해당 경로일 때만 active 클래스를 적용하는 함수
  const isActive = (path: string) => {
    return pathname === path;
  };
  console.log("pathname", pathname);
  return (
    <div className={styles.gnbContainer}>
      <Link href={"/admin/product"}>
        <div className={isActive("/admin/product") ? styles.active : ""}>
          Product
        </div>
      </Link>
      <Link href={"/admin/category"}>
        <div className={isActive("/admin/category") ? styles.active : ""}>
          Category
        </div>
      </Link>
    </div>
  );
}
