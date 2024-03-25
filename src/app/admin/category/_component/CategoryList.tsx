"use client";
import React, { ChangeEventHandler, ForwardedRef, forwardRef } from "react";
// import styles from "./categoryList.module.css";
import { CategoryWithCheckId } from "@/model/Categories";
import Loading from "../../_component/Loading";
import styles from "./categoryList.module.css";
type Props = {
  setCategories: (categories: CategoryWithCheckId[]) => void;
  categories: CategoryWithCheckId[];
  isAllCheck: boolean;
  setIsAllCheck: (isAllCheck: boolean) => void;
  ref: React.RefObject<HTMLInputElement>;
  isPending: boolean;
};

const CategoryList = forwardRef(
  (
    { setCategories, categories, setIsAllCheck, isAllCheck, isPending }: Props,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const toggleCheck = (index: number) => {
      const updatedChecked = [...categories];
      updatedChecked[index].checked = !updatedChecked[index].checked;
      // 체크된 인덱스 받아서 걔 체크드 들어가서 부정값 넣어줌(토글)
      setCategories(updatedChecked);
      // 그리고 상태ㅔ 업데이트 근데 이 업데이트 되는 과정이 좀늦어, 즉 업데이트 되기 전의 상태로 some 체크?

      const isAnyCategoryNotChecked = categories.some(
        (category: CategoryWithCheckId) => category.checked === false
      );
      // 업데이트 됐어. 그 배열에서 check가 하나라도 false냐 ? false면 전체 선택 false,
      // 아니고 전체 다 선택됐냐 하면 isAllCheck true 값 업데이트

      // console.log("categories", categories);
      // console.log("isAnyCategoryNotChecked", isAnyCategoryNotChecked);
      if (isAnyCategoryNotChecked) {
        setIsAllCheck(false);
      } else {
        setIsAllCheck(true);
      }

      // console.log("isAllCheck", isAllCheck);
      const hasEl = ref && typeof ref !== "function" && ref.current;
      //
      if (hasEl) {
        // ref가 있고, ref가 유효한 객체인지,
        const el = ref.current as HTMLInputElement;

        el.checked = updatedChecked.every((category) => category.checked);
      }
    };

    const onAllCheck: ChangeEventHandler<HTMLInputElement> = () => {
      const isAllCheck = categories.every(
        (category) => category.checked === true
      );
      // 이건 그냥 값을 업데이트 해줘야되냐? 를 위한 확인 과정임
      // 체크가 전부 트루인지 확인, 하나라도 false면 false 반환할거니까
      // 근데 여기서 중요한건 값을 업데이트하기전의 값을 가지고 함수 도는거임

      // const toggledCheckedCategories = categories.forEach(
      //   (category: CategoryWithCheckId) => (category.checked = !isAllCheck)
      // );
      const toggledCheckedCategories = categories.map(
        (category: CategoryWithCheckId) => ({
          ...category,
          checked: !isAllCheck,
        })
      );
      // 실제 값이 업데이트 되는건 여기임
      // 그럼 isAllCheck와 같은 로직을 값이 업데이트 된 아래에서 작성하면, 바뀐 값으로 찍히겠지? 업데이트해줬으니까 64라인에서
      // 복사한거 돌면서 checked를 isAllCheck의 부정값으로 업데이트, 여기서 업데이트해줌
      // 전체가 true 면 false 할당, 하나라도 false면 true 할당

      setCategories(toggledCheckedCategories);
      // 업데이트한 복사본 할당
      setIsAllCheck(!isAllCheck);
      // 현재 올 체크의 부정, 들어가는 값의 부정이니까.
      // console.log("isAllCheck", !isAllCheck);

      const hasEl = ref && typeof ref !== "function" && ref.current;
      if (hasEl) {
        const el = ref.current as HTMLInputElement;
        el.checked = !isAllCheck;
      }
    };

    return (
      <div className={styles.listContainer}>
        {isPending ? (
          <Loading />
        ) : (
          <>
            <input
              id="allCheck"
              type="checkbox"
              className="custom-checkbox"
              ref={ref}
              checked={isAllCheck}
              onChange={onAllCheck}
            />
            <label htmlFor="allCheck" className="label-allCheck">
              전체선택
            </label>
            <ul className={styles.itemContainer}>
              {categories &&
                categories.map((category, index) => (
                  <li key={index}>
                    <input
                      id={`category${index}`}
                      type="checkbox"
                      checked={category.checked}
                      onChange={() => {
                        toggleCheck(index);
                      }}
                    />
                    <label htmlFor={`category${index}`}>{category.name}</label>
                  </li>
                ))}
            </ul>
          </>
        )}
      </div>
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
