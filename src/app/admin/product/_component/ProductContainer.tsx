"use client";
import Controller from "@/app/_component/controller/Controller";
import Gnb from "@/app/_component/gnb/Gnb";
import React, { useEffect, useState } from "react";
import ProductList from "./ProductList";
import ProductModal from "./ProductModal";
import { Product, ProductWithCheck } from "@/model/Products";
import { useQuery } from "@tanstack/react-query";
import { InitCategoryData } from "@/app/_util/categoryData";
import { Category } from "@/model/Categories";
import { InitProductData } from "@/app/_util/productData";

// 카테고리 데이터를 상품에서 사용해줘야함
// 카테고리가 여기선 select option 으로 존재했으면 좋겠음

export default function ProductContainer() {
  const [product, setProduct] = useState<ProductWithCheck[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const { data: productData } = useQuery<Product[]>({
    queryKey: ["admin", "product"],
    queryFn: InitProductData,
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
  });
  if (productData) {
    console.log("initialProducts", productData);
  }

  const { data: categoryData = [] } = useQuery<Category[]>({
    queryKey: ["admin", "category"],
    queryFn: InitCategoryData,
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
  });

  // if (!categoryData) {
  //   return null;
  // } // 리턴 밑에서 react 훅 써서 에러 발생한 적 있음
  // console.log("categoryData", categoryData);

  useEffect(() => {
    if (productData) {
      console.log("productData", productData);
      const productsWithCheckId = productData.map((product: Product) => ({
        ...product,
        checked: false,
      }));
      setProduct(productsWithCheckId);
      // 셋 업데이트 무한 루프 방지 useEffect
    }
  }, [productData]);

  const onSearch = () => {};
  const openModal = () => {
    setIsOpen(true);
  };

  const onRemove = () => {};
  // const onModalClose = () => {};
  // 카테고리 데이터가 null일 수 있어서 return null 을 해주다가, 리턴 널 밑에 react hook이 존재해서 에러가 발생했음
  // Rendered more hooks than during the previous render. 에러
  if (!productData) {
    return null;
  }
  return (
    <div>
      <Gnb />
      <Controller
        onSearch={onSearch}
        openModal={openModal}
        onRemove={onRemove}
      />
      <ProductList products={product} />
      <ProductModal
        categoryData={categoryData}
        setProduct={setProduct}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        // onModalClose={onModalClose}
      />
    </div>
  );
}

// 카테고리
