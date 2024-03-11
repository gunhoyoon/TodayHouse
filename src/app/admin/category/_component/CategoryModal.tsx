"use client";
import React, {
  ChangeEventHandler,
  FormEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./categoryModal.module.css";
import { Category, CategoryWithCheck } from "@/model/Categories";

type Props = {
  isModal: boolean;
  onClose: () => void;
  setCategories: (category: CategoryWithCheck[]) => void;
};

const CategoryModal = ({ isModal, onClose, setCategories }: Props) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isModal) {
      inputRef.current?.focus();
    }
  }, [isModal]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const key = "카테고리";
    // 카테고리로 가져온 key값이 있으면 파싱 없으면 빈 배열
    let storedCategories: Category[] = JSON.parse(
      localStorage.getItem(key) || "[]"
    );
    //trim 문자열의 중복, 공백 제거 / 원본 수정 X
    const newCategoryValue = inputValue.trim();
    // 값이 있고, 기존 카테고리에 같은 값이 없으면.
    if (
      newCategoryValue &&
      !storedCategories.some((category) => category.name === newCategoryValue)
    ) {
      const newCategory = {
        name: newCategoryValue,
      };
      storedCategories.push(newCategory);
      localStorage.setItem(key, JSON.stringify(storedCategories));
      // 처음 생성할 떄 네임,
      const categoriesWithCheck = JSON.parse(
        localStorage.getItem(key) || "[]"
      ).map((category: Category) => ({
        ...category,
        checked: false,
      }));
      setCategories(categoriesWithCheck);
      // 아 로컬에서 처음 받아서 업데이트해줄 때 상태 업데이트 해줄 때

      // 입력 필드 초기화
      setInputValue("");
    }
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <>
      {isModal && (
        <div className={styles.modalContainer}>
          <div className={styles.modalHead}>
            <div>카테고리</div>
            <div>
              <button onClick={onClose}>❌</button>
            </div>
          </div>
          <div className={styles.modalBody}>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={inputValue}
                onChange={handleChange}
                ref={inputRef}
              />

              <button type="submit">카테고리 추가</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
export default CategoryModal;
