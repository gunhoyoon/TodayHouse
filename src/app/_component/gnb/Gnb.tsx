import Link from "next/link";
import React from "react";
import styles from "./gnb.module.css";
export default function Gnb() {
  return (
    <div className={styles.gnbContainer}>
      <Link href={"/admin/product"}>상품</Link>
      <Link href={"/admin/category"}>카테고리</Link>
    </div>
  );
}

// #35C5F0
