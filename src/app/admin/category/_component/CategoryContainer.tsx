"use client";
import Gnb from "@/app/_component/gnb/Gnb";
import React, { useEffect, useState } from "react";
import Controller from "@/app/_component/controller/Controller";

import { Category, CategoryWithCheck } from "@/model/Categories";
import CategoryModal from "./CategoryModal";
import CategoryList from "./CategoryList";

export default function CategoryContainer() {
  const key = "카테고리";
  const initialCategories = JSON.parse(localStorage.getItem(key) || "[]");

  // const localData = localStorage.getItem("카테고리");
  // if (localData !== null) {
  //   JSON.parse(localData);
  // }

  const categoriesWithCheck = initialCategories.map((category: Category) => ({
    ...category,
    checked: false,
  }));
  // console.log("initialCategories", initialCategories);

  // category 상태를 여기서 가지고 있음. 즉 초기값을 여기서 넣어줘야하는데.
  // 카테고리 모달에서 추가하고 업데이트가 돼야함. 리액트에서 알 수 있게 셋을 해줘야함.
  // 그래서 두번 사용해줘야돼 이걸
  //  모달은 값을 추가 + check 속성 포함 생성이고 , 컨테이너는 단순 초기값임
  const [categories, setCategories] =
    useState<CategoryWithCheck[]>(categoriesWithCheck);
  console.log("categories", categories);
  const [isAddModal, setIsAddModal] = useState(false);
  const [isModal, setIsModal] = useState(false);

  //   console.log("categories", categories);
  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value;
    // 카테고리 순회, e.target.value 일치하는거만 목록 보여주기
    // 여기서 목록을 가지고 있어야 내려주든 하겠지 비교해서
  };
  const onAdd = () => {
    setIsModal(true);
  };

  const onSelectDEL = () => {};
  const onAllDEL = () => {};
  const onClose = () => {
    setIsModal(false);
    setIsAddModal(false);
  };

  return (
    <>
      <Gnb />
      <Controller
        onSearch={onSearch}
        onAdd={onAdd}
        onSelectDEL={onSelectDEL}
        onAllDEL={onAllDEL}
      />

      <CategoryList categories={categories} setCategories={setCategories} />
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
