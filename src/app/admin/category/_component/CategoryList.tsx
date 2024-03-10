"use client";
import React, { ChangeEventHandler, ForwardedRef, forwardRef } from "react";
// import styles from "./categoryList.module.css";
import { CategoryWithCheck } from "@/model/Categories";
import { collectGenerateParams } from "next/dist/build/utils";

type Props = {
  setCategories: (categories: CategoryWithCheck[]) => void;
  categories: CategoryWithCheck[];
  isAllCheck: boolean;
  setIsAllCheck: (isAllCheck: boolean) => void;
  ref: React.RefObject<HTMLInputElement>;
};

const CategoryList = forwardRef(
  (
    { setCategories, categories, setIsAllCheck, isAllCheck }: Props,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    // 카테고리 배열. 인덱스 -> .checked 속성 접근 -> 변경.
    console.log("isAllCheck", isAllCheck);

    const onChange = (index: number) => {
      const updatedCategories = [...categories];
      updatedCategories[index].checked = !updatedCategories[index].checked;
      // 체크된 인덱스 받아서 걔 체크드 들어가서 부정값 넣어줌(토글)
      setCategories(updatedCategories);
      // 그리고 상태ㅔ 업데이트 근데 이 업데이트 되는 과정이 좀늦어, 즉 업데이트 되기 전의 상태로 some 체크?

      const isAnyCategoryNotChecked = categories.some(
        (category: CategoryWithCheck) => category.checked === false
      );
      // 업데이트 됐어. 그 배열에서 check가 하나라도 false냐 ? false면 전체 선택 false,
      // 아니고 전체 다 선택됐냐 하면 isAllCheck true 값 업데이트

      console.log("categories", categories);
      console.log("isAnyCategoryNotChecked", isAnyCategoryNotChecked);
      if (isAnyCategoryNotChecked) {
        setIsAllCheck(false);
      } else {
        setIsAllCheck(true);
      }

      console.log("isAllCheck", isAllCheck);

      if (ref && typeof ref !== "function" && ref.current) {
        // ref가 있고, ref가 유효한 객체인지,
        ref.current.checked = updatedCategories.every(
          (category) => category.checked
        );
      }
    };

    const onAllCheck: ChangeEventHandler<HTMLInputElement> = () => {
      const allCheckCategories = [...categories];
      // 얕은 복사를 하고
      const isAllCheck = categories.every(
        (category) => category.checked === true
      ); //초기에 실행시 false , checked 초기값이 false니까

      // 체크가 전부 트루인지 확인, 하나라도 false면 false 반환할거니까
      // 근데 여기서 중요한건 값을 업데이트하기전의 값을 가지고 함수 도는거임

      allCheckCategories.forEach(
        (category: CategoryWithCheck) => (category.checked = !isAllCheck)
      );

      // 복사한거 돌면서 checked를 isAllCheck의 부정값으로 업데이트, 여기서 업데이트해줌
      // 전체가 true 면 false 할당, 하나라도 false면 true 할당

      setCategories(allCheckCategories);
      // 업데이트한 복사본 할당
      setIsAllCheck(!isAllCheck);
      // 현재 올 체크의 부정, 들어가는 값의 부정이니까.
      console.log("isAllCheck", !isAllCheck);

      // 56번 라인의 isAllCheck를 찍는거임. 그러니까 처음 checked의 값은 false니까 저 함수 자체가 false 리턴
      // 그러니까 카테고리의 값은 이후에 업데이트 됐고, isAllCheck는 그 이전에 찍었으니까 false가 맞음
      // 근데 난 이걸 컨테이너 레벨로 관리할거고, 이 상태에 따라서 전체 삭제를 해줄건데, 지금 반대로 값이 찍히고 있으니까, 그냥 부정값으로 전달해서 사용해야되는지 ... ?
      // 근데 반대로 하기엔 onChange함수에서는 또 제대로 동작해

      if (ref && typeof ref !== "function" && ref.current) {
        ref.current.checked = !isAllCheck;
      }
    };

    return (
      <>
        <input id="전체선택" type="checkbox" ref={ref} onChange={onAllCheck} />
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
                <span>{category.name}</span>
              </li>
            ))}
        </ul>
      </>
    );
  }
);

// 리스트 안에 인풋.

// 맵을 돌면서 check 속성을 넣어주고 그걸 카테고리state의 초기값으로 사용하고 있음.
// 여기서 중요한건 카테고리 네임은 로컬에 저장되었고, check는 상태에만 저장되어있는 상태임
// 리스트 전체로 체크박스와 라벨로 체크상태와 name 값을 나타내고 있고, checked 가 true 가 됐을 때, 해당 리스트의 값도 잘 바뀜
// 근데 값이 저장이 안됨. 예를 들어 체크를 하고 새로고침하면 다시 풀림. 당연히 새로 렌더링하기 때문에 컴포넌트들 다시 그리니까 초기값 상태로 돌아온거임
// check의 초기값은 false 이므로 체크를 해서 true 로 바꿨다 해도 여전히 false임.
// 근데 이 상태를 로컬에 업데이트 하자니 로컬은 name 값만 가지고 있고 , check 는 안가지고 있음.
export default CategoryList;
