import React from "react";
import styles from "./not-found.module.css";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className={styles.notFoundContainer}>
      <p className={styles.notFoundMessage}>해당 상품을 찾을 수 없습니다</p>
      <Link className={styles.returnHome} href="/admin/product">
        홈으로 돌아가기
      </Link>
    </div>
  );
}
