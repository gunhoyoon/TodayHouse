"use client";
import Gnb from "@/app/_component/gnb/Gnb";
import React, { useEffect, useRef, useState } from "react";
import Controller from "@/app/_component/controller/Controller";

import { Category, CategoryWithCheckId } from "@/model/Categories";
import CategoryList from "./CategoryList";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { getCategory } from "../_lib/getCategory";
import CategoryModal from "./CategoryModal";
import { response } from "express";
const CategoryContainer = () => {
  const key = "카테고리";
  const [categories, setCategories] = useState<CategoryWithCheckId[]>([]);
  const queryClient = useQueryClient();
  const checkRef = useRef<HTMLInputElement>(null);

  // useEffect(() => {
  //   const initialCategories = JSON.parse(localStorage.getItem(key) || "[]");
  //   const categoriesWithCheck = initialCategories.map(
  //     (category: Category, index: number) => ({
  //       ...category,
  //       checked: false,
  //       id: index + 1,
  //     })
  //   );

  //   setCategories(categoriesWithCheck);
  // }, []);

  // msw 받은 응답 Category[] 타입임 name 만 들어있으니까,
  // 결국 useState를 사용해야하는 이유. 로컬 데이터(msw 핸들러에서 응답해주는 데이터 타입) , 클라이언트에서 상태로 사용하는 데이터(id+ checked)추가된 타입이랑 달라서
  const { data } = useQuery<Category[]>({
    queryKey: ["admin", "category"],
    queryFn: getCategory,
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
  });
  console.log("data", data);
  // [{name: string}]
  // 데이터가 바뀔 떄마다 useEffect 의 의존성인 data 가 트리거 되면서, category 상태를 업데이트한다.
  useEffect(() => {
    // useQuery로부터 가져온 데이터에 기반해서 상태를 업데이트합니다.
    if (data) {
      const categoriesWithCheckId = data.map((category) => ({
        ...category,
        checked: false, // 기본적으로 모든 카테고리를 unchecked 상태로 설정합니다.
        // 리스트마다 고유의 아이디가 있을텐데, checked가 true인 친구의 id를 delete로 보낸다?
      }));
      setCategories(categoriesWithCheckId);
      // 셋 업데이트 무한 루프 방지 useEffect
    }
  }, [data]);
  // useEffect(() => {
  //   const initialCategories = JSON.parse(localStorage.getItem(key) || "[]");
  //   const categoriesWithCheck = initialCategories.map((category: Category) => ({
  //     ...category,
  //     checked: false,
  //   }));
  //   setCategories(categoriesWithCheck);
  // }, []);

  // const [searchTerm, setSearchTerm] = useState("");
  // const localData = localStorage.getItem("카테고리");
  // if (localData !== null) {
  //   JSON.parse(localData);
  // }
  // msw 추가 +
  // msw 추가 +
  // msw 추가 +
  // msw 추가 + react query

  function deepCopy<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }
  // 여기선 json 데이터 다시 불러오니까 초기값 넣어줄 용으로 checked 사용
  const [isAllCheck, setIsAllCheck] = useState<boolean>(false);

  const origin = deepCopy(categories);
  // const [originCategories, setOriginCategories] =
  //   useState<CategoryWithCheckId[]>(categoriesWithCheck); // 서버상태용,

  // 추가시 오리진 데이터 변경, 오리진 데이터 변경 시 카테고리도 변경 사항이 있고 적용해줘야함
  // useEffect(() => {
  //   setCategories(deepCopy(originCategories));
  // }, [originCategories]);
  // 지금은 오리진이 바뀌었을 때 셋 카테고리 업데이트 해주는 과정
  // 로컬이 바뀌었을 때 오리진 업데이트를 해줘야함, 추가하는 과정

  // console.log("categories", categories);
  const [isAddModal, setIsAddModal] = useState(false);
  const [isModal, setIsModal] = useState(false);

  // const searchHandler = (searchTerm: string) => {
  //   const debouncedKeyword = useDebounce(searchTerm, 500);

  // onSearch 이벤트 핸들러 내부에서 hook을 사용하지 못하는 규칙
  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    // setSearchTerm(searchTerm);
    const copyData = deepCopy(origin); // 매번 검색 시 딥카피해옴
    const filteredCategories = copyData.filter((category: Category) =>
      category.name.includes(searchTerm)
    );
    // 딥카피,
    setCategories(filteredCategories);
    // 서치 할 때, 필터링하고 해당 데이터를 . 아 이것도 다 뮤테이트로 해줘야되는구나.

    // if (searchTerm === "") {
    //   setCategories(initialCategories); // 전체 리스트로 초기화
    // } else {
    //   const searchData = categories.filter((category: CategoryWithCheck) =>
    //     category.name.includes(searchTerm)
    //   );
    //   setCategories(searchData);
    // }
    // } // 와  ... 초기값이 아니라 실제 데이터를 필터링하고 있구나 나 .... 미친놈인가

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
      console.log("SuccessData", data);
      localStorage.setItem(key, JSON.stringify(data));

      queryClient.invalidateQueries({ queryKey: ["admin", "category"] });
      // 카테고리에 셋 해줘야힘?

      // 삭제하고 남은 데이터 돌려받아서 set해주기
    },
  });

  const onSelectDEL = () => {
    const selectDEL = categories.filter(
      (category: CategoryWithCheckId) => category.checked === true
    );
    // 체크된 친구 통째로 그냥 전달해줘.

    // console.log("selectDEL", selectDEL);
    // localStorage.setItem(key, JSON.stringify(selectDELData));

    // 스트링인채로 내가 가지고 있으니까, JSON으로만 만들어주면 됨. 제발 능동적으로 생각하자
    // setCategories(selectDEL);

    remove.mutate(selectDEL);
  };

  const onAllDEL = () => {
    const isAllCheck = categories.every(
      (category: CategoryWithCheckId) => category.checked === true
    );
    if (isAllCheck) {
      const allDEL = categories.filter(
        (category: CategoryWithCheckId) => !category.checked
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
        onSearch={onSearch}
        onAdd={onAdd}
        onSelectDEL={onSelectDEL}
        onAllDEL={onAllDEL}
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
