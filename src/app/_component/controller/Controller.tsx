"use client";
import React, { FormEventHandler, useEffect, useRef, useState } from "react";
import { ChangeEventHandler } from "react";
import styles from "./controller.module.css";
import { CategoryWithCheckId } from "@/model/Categories";

type Props = {
  onSearch: (keyword: string) => void;
  openModal: () => void;
  onRemove: () => void;
};

export default function Controller({ onSearch, openModal, onRemove }: Props) {
  const [inputValue, setInputValue] = useState("");
  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setInputValue(e.target.value);
  };
  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    onSearch(inputValue);
  };

  return (
    <>
      <div className={styles.listContainer}>
        <form onSubmit={onSubmit}>
          <label htmlFor="search"></label>
          <input
            id="search"
            placeholder="Search..."
            type="text"
            onChange={handleInputChange}
          />
          <button type="submit">검색하기</button>
        </form>
        <button onClick={openModal}>추가하기</button>
        <button onClick={onRemove}>삭제</button>
      </div>
    </>
  );
}
