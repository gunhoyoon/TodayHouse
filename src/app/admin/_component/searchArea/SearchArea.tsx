import React from "react";
import styles from "./searchArea.module.css";

type Props = {
  onSearch: () => void;
  onAdd: () => void;
  onSelectDEL: () => void;
  onAllDEL: () => void;
};

export default function SearchArea({
  onSearch,
  onAdd,
  onSelectDEL,
  onAllDEL,
}: Props) {
  return (
    <div className={styles.listContainer}>
      <button onClick={onSearch}>검색</button>
      <button onClick={onAdd}>추가하기</button>
      <button onClick={onSelectDEL}>선택삭제</button>
      <button onClick={onAllDEL}>전체삭제</button>
    </div>
  );
}
// 옵션은 아님. 기능 관련 영어로 바꿔야함.
