"use client";
import Controller from "@/app/_component/controller/Controller";
import Gnb from "@/app/_component/gnb/Gnb";
import React, { useEffect, useState } from "react";
import ProductList from "./ProductList";
import ProductModal from "./ProductModal";
import { Product, ProductWithCheck } from "@/model/Products";
import { useQuery } from "@tanstack/react-query";
import { getCategory } from "../../category/_lib/getCategory";
import { Category } from "@/model/Categories";

export default function ProductContainer() {
  const key = "상품";
  const initialCategories = JSON.parse(localStorage.getItem(key) || "[]");
  // 순수 로컬
  const productsWithCheck = initialCategories.map((product: Product) => ({
    ...product,
    checked: false,
  }));
  // 로컬에 체크묻은거

  const { data } = useQuery<Category[]>({
    queryKey: ["admin", "category"],
    queryFn: getCategory,
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
  });
  console.log("data", data);
  // 빈배열을 가져와야해 넌 제발 부탁이야
  // 자 카테고리 페이지에 접근 시 카테고리에 관한 데이터를 가져오게 했고, 앱이 재 시작된 상태에서 프로덕트 페이지에서
  // 처음 카테고리 요청을 하면 당연히 [] 반환, 왜냐? 카테고리 페이지에 접근을 안한 상태라 데이터도 없음
  // 근데 여기서 카테고리 탭으로 넘어간다면(페이지 전환) 그러면 그 때 요청해서 불러와야겠지
  // 그래서 초기 데이터를 불러오는 Init 에서 쿼리를 무효화 시켜서 다시 받아오게 하는거임

  const [product, setProduct] = useState<ProductWithCheck[]>(productsWithCheck);
  const [isOpen, setIsOpen] = useState(false);
  console.log("product", product);
  useEffect(() => {
    const loadProducts = () => {
      const storedProductsData = localStorage.getItem(key);
      if (storedProductsData) {
        setProduct(JSON.parse(storedProductsData));
      }
    };
    loadProducts();
  }, []);
  console.log("product", product);

  const onSearch = () => {};
  const onAdd = () => {
    setIsOpen(true);
  };
  const onClose = () => {
    setIsOpen(false);
  };
  const onSelectDEL = () => {};
  const onAllDEL = () => {};

  return (
    <div>
      <Gnb />
      <Controller
        onSearch={onSearch}
        onAdd={onAdd}
        onSelectDEL={onSelectDEL}
        onAllDEL={onAllDEL}
      />
      <ProductList products={product} />
      <ProductModal setProduct={setProduct} isOpen={isOpen} onClose={onClose} />
    </div>
  );
}

// 모달에 product 데이터 넘겨주면 됨.
// 넘겨준 데이터로 모달안에서 수정하기, 추가하기 버튼 따로 만들어서 데이터 입힌채로 보여주냐, 마냐 이거임
// 로컬에 다시 set 해서 넘겨주고 , setProduct 받아서 데이터도 업데이트
