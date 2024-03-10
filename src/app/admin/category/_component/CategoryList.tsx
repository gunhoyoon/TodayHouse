"use client";
import React, {
  ChangeEvent,
  ChangeEventHandler,
  useEffect,
  useState,
} from "react";
// import styles from "./categoryList.module.css";
import { CategoryWithCheck } from "@/model/Categories";

type Props = {
  setCategories: (categories: CategoryWithCheck[]) => void;
  categories: CategoryWithCheck[];
};
const key = "카테고리";

export default function CategoryList({ setCategories, categories }: Props) {
  // 카테고리 배열. 인덱스 -> .checked 속성 접근 -> 변경.
  const onChange = (index: number) => {
    const updatedCategories = [...categories];
    // 얕은 복사
    updatedCategories[index].checked = !updatedCategories[index].checked;
    // 전달받은 category[] 의 해당 눌린 인풋의 인덱스, 찾아서 값 !(부정)
    setCategories(updatedCategories);
    // 셋 업데이트 해주기
    // 체크박스 새로고침하면 날아가는거 맞음
  };
  const onAllCheck: ChangeEventHandler<HTMLInputElement> = () => {
    // 클릭하면 on,
    // 하나씩 클릭하다가 check all true 시 on,
    // 하나라도 해제되면 off,
    // 이 부분 이어서하면 됨,
    // 켜자마자 깃허브에 올리기
    categories.some((category) => category.checked !== false);
  };

  return (
    <>
      <input id="전체선택" type="checkbox" onChange={onAllCheck} />
      <label htmlFor="전체선택">전체선택</label>
      <ul>
        {categories &&
          categories.map((category, index) => (
            <li key={index}>
              <input
                id="category"
                type="checkbox"
                checked={category.checked}
                onChange={() => {
                  onChange(index);
                }}
              />
              <label htmlFor="category">{category.name}</label>
            </li>
          ))}
      </ul>
    </>
  );
}

// 리스트 안에 인풋.

// 맵을 돌면서 check 속성을 넣어주고 그걸 카테고리state의 초기값으로 사용하고 있음.
// 여기서 중요한건 카테고리 네임은 로컬에 저장되었고, check는 상태에만 저장되어있는 상태임
// 리스트 전체로 체크박스와 라벨로 체크상태와 name 값을 나타내고 있고, checked 가 true 가 됐을 때, 해당 리스트의 값도 잘 바뀜
// 근데 값이 저장이 안됨. 예를 들어 체크를 하고 새로고침하면 다시 풀림. 당연히 새로 렌더링하기 때문에 컴포넌트들 다시 그리니까 초기값 상태로 돌아온거임
// check의 초기값은 false 이므로 체크를 해서 true 로 바꿨다 해도 여전히 false임.
// 근데 이 상태를 로컬에 업데이트 하자니 로컬은 name 값만 가지고 있고 , check 는 안가지고 있음.
