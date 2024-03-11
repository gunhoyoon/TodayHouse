"use client";
import React, { FormEventHandler, useEffect, useRef, useState } from "react";
import { ChangeEventHandler } from "react";
import styles from "./controller.module.css";
import { CategoryWithCheck } from "@/model/Categories";

type Props = {
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAdd: () => void;
  onSelectDEL: () => void;
  onAllDEL: () => void;
  isAllCheck: boolean;
  setCategories: (category: CategoryWithCheck[]) => void;
};

export default function Controller({
  onSearch,
  onAdd,
  onSelectDEL,
  onAllDEL,
  isAllCheck,
  setCategories,
}: Props) {
  return (
    <>
      <div className={styles.listContainer}>
        <label htmlFor="search">검색</label>
        <input id="search" type="text" onChange={onSearch} />
        <button onClick={onAdd}>추가하기</button>
        <button onClick={onSelectDEL}>선택삭제</button>
        <button onClick={onAllDEL}>전체삭제</button>
      </div>
    </>
  );
}
