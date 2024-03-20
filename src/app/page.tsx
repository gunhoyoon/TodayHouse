import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.linkSection}>
      <div className={styles.linkItem}>
        <Link href={"/admin"}>어드민 바로가기</Link>
      </div>
      <div className={styles.linkItem}>
        <Link href={"/user"}>사용자 바로가기</Link>
      </div>
    </div>
  );
}
