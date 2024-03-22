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
  onModalClose: () => void;
};

const CategoryModal = ({ isModal, onModalClose }: Props) => {
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
  const addCategoryMutation = useMutation({
    mutationFn: async (inputValue: string) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/category`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: inputValue }),
          // 객체에 담아서 보내준다.
        }
      );
      if (!response.ok) {
        throw new Error("Request failed with status " + response.status);
      }
      // 에러가 발생한다해도 에러 처리를 해주지 않으면 onSuccess로 넘어가게 된다.
      return response.json();
    },
    // 포스트 요청시 id를 생성해서 같이 넘겨주고, 핸들러에서 아이디를 받게 하려고 했지만
    // 보안상의 이유로 서버에서 id를 생성하는 것이 맞음

    onSuccess: (data: Category) => {
      // 로컬이 지금 디비와 같은 역할이므로 로컬을 업데이트 해주는건 msw handler에서 해주자

      alert("카테고리가 성공적으로 추가되었습니다!");
      // queryClient.invalidateQueries({ queryKey: ["admin", "category"] });
      queryClient.setQueryData(["admin", "category"], data);
    },
    onError(error) {
      console.error(error);
      alert("이미 존재하는 카테고리입니다");
    },
  });

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setInputValue("");

    if (inputValue) {
      addCategoryMutation.mutate(inputValue);
    } else {
      alert("유효한 카테고리명을 입력해주세요");
    }
  };
  // mutate.mutate()
  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    // const trimmedInput = e.target.value.trim();
    const noSpaceValue = e.target.value.replace(/\s/g, "");
    // 공백문자 제거하는 정규표현식
    // 이렇게 되면 입력시마다 리랜더가 되니까, 이런 부분을 디바운싱으로 처리해줄 수 있음
    // 로다쉬 사용하면 디바운스나 깊은 복사 와 같은 기능들을 쉽게 가져올 수 있는데 라이브러리 자체가 무게가 무겁다는 단점이 있음
    // 위의 단점은 웹펙의 트리쉐이킹을 통해 사용되지 않는 코드를 제거해서 번들의 크기를 줄일 수 있음
    if (noSpaceValue.length < e.target.value.length) {
      alert("카테고리에 공백이 추가될 수 없습니다.");
    } else {
      setInputValue(noSpaceValue);
    }
  };

  return (
    <>
      {isModal && (
        <div className={styles.modalContainer}>
          <div className={styles.modalHead}>
            <div>카테고리</div>
            <div>
              <button onClick={onModalClose}>❌</button>
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
