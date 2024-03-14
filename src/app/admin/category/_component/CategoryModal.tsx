"use client";
import React, {
  ChangeEventHandler,
  FormEvent,
  FormEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./categoryModal.module.css";
import { Category, CategoryWithCheckId } from "@/model/Categories";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Props = {
  isModal: boolean;
  onClose: () => void;
  setCategories: (category: CategoryWithCheckId[]) => void;
};

const CategoryModal = ({ isModal, onClose, setCategories }: Props) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const key = "카테고리";
  const queryClient = useQueryClient();
  useEffect(() => {
    if (isModal) {
      inputRef.current?.focus();
    }
  }, [isModal]);
  // 공백추가시
  // 추가
  const submit = useMutation({
    mutationFn: async (inputValue: string) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/category`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: inputValue }),
        }
      );
      return response.json();
    },
    // 포스트 요청시 id를 생성해서 같이 넘겨주고, 핸들러에서 아이디를 받게 하려고 했지만
    // 보안상의 이유로 서버에서 id를 생성하는 것이 맞음

    onSuccess: (inputValue: Category) => {
      localStorage.setItem(key, JSON.stringify(inputValue));
      alert("카테고리가 성공적으로 추가되었습니다!");
      queryClient.invalidateQueries({ queryKey: ["admin", "category"] });
    },
    onError(error) {
      console.error(error);
      alert("이미 존재하는 카테고리입니다");
    },
  });

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setInputValue("");
    // 입력 시 바로
    const trimmedInput = inputValue.trim();
    // console.log("trimmedInput", trimmedInput);
    // 문자열에서 빈 문자열 있으면, 매번 트림,
    if (trimmedInput) {
      submit.mutate(trimmedInput);
    } else {
      alert("유효한 카테고리명을 입력해주세요");
    }
  };
  // mutate.mutate()
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
