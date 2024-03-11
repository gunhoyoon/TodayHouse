"use client";
import Gnb from "@/app/_component/gnb/Gnb";
import React, { useEffect, useRef, useState } from "react";
import Controller from "@/app/_component/controller/Controller";

import { Category, CategoryWithCheck } from "@/model/Categories";
import CategoryModal from "./CategoryModal";
import CategoryList from "./CategoryList";
import useDebounce from "@/hook/useDebounce";

export default function CategoryContainer() {
  const key = "카테고리";
  const initialCategories = JSON.parse(localStorage.getItem(key) || "[]");
  const checkRef = useRef<HTMLInputElement>(null);
  // const [searchTerm, setSearchTerm] = useState("");
  // const localData = localStorage.getItem("카테고리");
  // if (localData !== null) {
  //   JSON.parse(localData);
  // }

  const categoriesWithCheck = initialCategories.map((category: Category) => ({
    ...category,
    checked: false,
  }));
  const [isAllCheck, setIsAllCheck] = useState<boolean>(false);
  const [categories, setCategories] =
    useState<CategoryWithCheck[]>(categoriesWithCheck);

  console.log("categories", categories);
  const [isAddModal, setIsAddModal] = useState(false);
  const [isModal, setIsModal] = useState(false);

  // const searchHandler = (searchTerm: string) => {
  //   const debouncedKeyword = useDebounce(searchTerm, 500);

  // onSearch 이벤트 핸들러 내부에서 hook을 사용하지 못하는 규칙
  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    // setSearchTerm(searchTerm);

    const filteredCategories = initialCategories.filter((category: Category) =>
      category.name.includes(searchTerm)
    );

    setCategories(filteredCategories);
    // if (searchTerm === "") {
    //   setCategories(initialCategories); // 전체 리스트로 초기화
    // } else {
    //   const searchData = categories.filter(
    //     (category: CategoryWithCheck) => category.name === searchTerm
    //   );
    //   setCategories(searchData);
    // }
    // useDebounce(searchTerm);
    // console.log("debouncedKeyword", debouncedKeyword);
    // if (debouncedKeyword === "") {
    //   setCategories(initialCategories); // 전체 리스트로 초기화
    // } else {
    //   const searchData = categories.filter(
    //     (category: CategoryWithCheck) => category.name === debouncedKeyword
    //   );

    //   setCategories(searchData);
    // }

    // useEffect(() => {
    //   const searchData = [...categories];
    //   const searchData2 = searchData.filter(
    //     (category: CategoryWithCheck) => category.name === searchTerm
    //   );
    //   // 조건을 통과하는 아이템을 새 배열로 담는다.
    //   // console.log("searchData2", searchData2);
    //   setCategories(searchData2);
    // }, [searchTerm]);

    // 검색어가 비어있으면,

    // 검색하는 필터링은 삭제가 아님. 검색한 후 다시 전체 리스트를 보여주는건 검색 이전의 원본을 보여주는것과 같음
    // 잠깐만 여기서 검색한걸 복사본을 필터를 해. 그럼 검색된 카테고리 데이터가 나오겠지.
    // 그걸 CategoryList로 어떻게 전달을 해야할까?
    // 디바운싱 ? 첫 입력 시에 바로 필터링이 되어버리면 검색 자체를 막을 순 없을거같은데,
    // 그럼 완성된 단어를 보내면서 즉 onSubmit 시에 실행이 되게하는건?
    // 일단 이 부분 고민해보자 . 여기부터 하면 됨
  };
  const onAdd = () => {
    setIsModal(true);
  };

  const onSelectDEL = () => {
    const selectDEL = categories.filter(
      (category: CategoryWithCheck) => category.checked !== true
    );
    localStorage.setItem(key, JSON.stringify(selectDEL));
    // 스트링인채로 내가 가지고 있으니까, JSON으로만 만들어주면 됨. 제발 능동적으로 생각하자
    setCategories(selectDEL);
  };
  const onAllDEL = () => {
    const isAllCheck = categories.every(
      (category: CategoryWithCheck) => category.checked === true
    );
    if (isAllCheck) {
      const allDEL = categories.filter(
        (category: CategoryWithCheck) => !category.checked
      );
      localStorage.setItem(key, JSON.stringify(allDEL));
      setCategories(allDEL);
    } else {
      alert("전체 카테고리가 선택되지 않았습니다.");
    }
  };

  const onClose = () => {
    setIsModal(false);
    setIsAddModal(false);
  };

  return (
    <>
      <Gnb />
      <Controller
        isAllCheck={isAllCheck}
        onSearch={onSearch}
        onAdd={onAdd}
        onSelectDEL={onSelectDEL}
        onAllDEL={onAllDEL}
        setCategories={setCategories}
      />

      <CategoryList
        categories={categories}
        setCategories={setCategories}
        isAllCheck={isAllCheck}
        setIsAllCheck={setIsAllCheck}
        ref={checkRef}
      />
      <CategoryModal
        setCategories={setCategories}
        isModal={isModal}
        onClose={onClose}
      />
    </>
  );
}

// 카테고리는 {name : "string'"}, 그리고 리스트에서 맵 돌면서 체크박스를 붙여주냐 ?
// 근데 이건 하나의 리스트 안에 있을건데, li를 어떻게 삭제햐나

// 하나의 데이터로 만들어서, 필터로 삭제해야됨
// 그러니까 categories 자체의 데이터를 변형해서 (만들 땐 name만 추가하고)
// 초기값을 할당 할땐 check가 붙은 채로 할당.
// 그래서 로컬에서 나온 데이터 자체를 그냥 가져다 쓰는게 아니라, check 가 붙은 완성된 category 데이터를 맵돌면서 뿌려주는게 기본이고,
// 여기서 온 클릭을 통해 필터를 해야됨. 근데 그러러면 컨테이너에서 추가된 데이터를 받아서 맵을 돌려서 check 를 붙여준 데이터를
// 컨트롤러에도 넘겨줘야함 왜? 삭제 기능도 해야되니까.
// 근데 또 전체 선택은 카테고리 리스트에 있음. = 환장하겠음

// 처음 모달에서 생성할 땐 네임만 , 리스트에서 그려질 땐 체크박스 붙여서.

// 근데 여기서 checkbox 를 추가하면, 데이터 업데이트를 안하고 그냥 로컬에만 추가하니까 리액트가 바뀐지를 모름.
