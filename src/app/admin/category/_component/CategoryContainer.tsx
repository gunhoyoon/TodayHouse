"use client";
import Gnb from "@/app/_component/gnb/Gnb";
import React, { useEffect, useRef, useState } from "react";
import Controller from "@/app/_component/controller/Controller";

import { Category, CategoryWithCheckId } from "@/model/Categories";
import CategoryList from "./CategoryList";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CategoryModal from "./CategoryModal";

import { InitCategoryData } from "@/app/_util/categoryData";
import { delay } from "msw";

const CategoryContainer = () => {
  const key = "카테고리";
  const [categories, setCategories] = useState<CategoryWithCheckId[]>([]);
  const queryClient = useQueryClient();
  const checkRef = useRef<HTMLInputElement>(null);

  // msw 받은 응답 Category[] 타입임 name 만 들어있으니까,
  // 결국 useState를 사용해야하는 이유. 로컬 데이터(msw 핸들러에서 응답해주는 데이터 타입) , 클라이언트에서 상태로 사용하는 데이터(id+ checked)추가된 타입이랑 달라서
  const { data } = useQuery<Category[]>({
    queryKey: ["admin", "category"],
    queryFn: InitCategoryData,
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
  });
  // console.log("data", data);
  // [{name: string}]
  // 데이터가 바뀔 떄마다 useEffect 의 의존성인 data 가 트리거 되면서, category 상태를 업데이트한다.
  useEffect(() => {
    // useQuery로부터 가져온 데이터에 기반해서 상태를 업데이트합니다.

    if (data) {
      console.log("data", data);
      const categoriesWithCheckId = data.map((category) => ({
        ...category,
        checked: false, // 기본적으로 모든 카테고리를 unchecked 상태로 설정합니다.
        // 리스트마다 고유의 아이디가 있을텐데, checked가 true인 친구의 id를 delete로 보낸다?
      }));
      setCategories(categoriesWithCheckId);
      // 셋 업데이트 무한 루프 방지 useEffect
    }
  }, [data]);

  // 여기선 json 데이터 다시 불러오니까 초기값 넣어줄 용으로 checked 사용
  const [isAllCheck, setIsAllCheck] = useState<boolean>(false);

  const [isAddModal, setIsAddModal] = useState(false);
  const [isModal, setIsModal] = useState(false);

  // const searchHandler = (searchTerm: string) => {
  //   const debouncedKeyword = useDebounce(searchTerm, 500);

  // onSearch 이벤트 핸들러 내부에서 hook을 사용하지 못하는 규칙
  const search = useMutation({
    mutationFn: async (category: string) => {
      const keyWord = category;
      console.log("keyWord", keyWord);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/searchCategory?searchTerm=${keyWord}`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      console.log(response.json);
      return response.json();
    },

    onSuccess: (data: Category[]) => {
      console.log("data", data);
      const searchData = data.map((category: Category) => ({
        ...category,
        checked: false,
      }));
      // console.log("searchData", searchData);
      setCategories(searchData);
      // console.log("categories", categories);
      // 클라이언트에 적용해줄건 딱히 없음. 그냥 성공 메시지 정도, 아 아닌가 셋을 업데이트 해줘야하나
    },
    onError: () => {
      console.log("실패");
    },
  });

  const onSearch = (keyword: string) => {
    search.mutate(keyword);
  };

  const remove = useMutation({
    mutationFn: async (categories: CategoryWithCheckId[]) => {
      const ids = categories.map((category) => category.id).join(",");

      console.log("ids", ids);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/category?ids=${ids}`,
        // 선택 삭제든 전체 삭제든 하나로 처리할거임, 데이터 타입은 동일
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    onSuccess: (data) => {
      // 로컬 데이터 변경 핸들러 내부에서 다 해주기
      alert("삭제 성공");
      delay(100);
      queryClient.setQueryData(["admin", "category"], data);
      setIsAllCheck(false);
      console.log("isAllCheck", isAllCheck);
    },
    onError: (err) => {
      console.error(err);
      alert("삭제 실패");
    },
  });

  const onRemove = () => {
    const selectDEL = categories.filter(
      (category: CategoryWithCheckId) => category.checked === true
    );
    // 체크된 친구들 mutate에 전달
    if (selectDEL.length > 0) {
      remove.mutate(selectDEL);
    } else {
      alert("삭제할 카테고리를 선택해주세요.");
    }
  };

  const openModal = () => {
    setIsModal(true);
  };

  const onModalClose = () => {
    setIsModal(false);
    setIsAddModal(false);
  };

  return (
    <>
      <Gnb />
      <Controller
        onSearch={onSearch}
        openModal={openModal}
        onRemove={onRemove}
      />

      <CategoryList
        categories={categories}
        setCategories={setCategories}
        isAllCheck={isAllCheck}
        setIsAllCheck={setIsAllCheck}
        ref={checkRef}
      />
      <CategoryModal isModal={isModal} onModalClose={onModalClose} />
    </>
  );
};
export default CategoryContainer;
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
