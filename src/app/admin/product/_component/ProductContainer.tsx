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

// 카테고리 데이터를 상품에서 사용해줘야함
// 카테고리가 여기선 select option 으로 존재했으면 좋겠음

export default function ProductContainer() {
  const key = "상품";
  const initialCategories = JSON.parse(localStorage.getItem(key) || "[]");
  // 순수 로컬
  const productsWithCheck = initialCategories.map((product: Product) => ({
    ...product,
    checked: false,
  }));

  const { data: categoryData = [] } = useQuery<Category[]>({
    // undefined 일 수 있으니 초기값
    queryKey: ["admin", "category"],
    queryFn: InitCategoryData,
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
  });
  console.log("categoryData", categoryData);
  //

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
  const openModal = () => {
    setIsOpen(true);
  };
  const onModalClose = () => {
    setIsOpen(false);
  };
  const onRemove = () => {};

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
        onModalClose={onModalClose}
      />
    </div>
  );
}

// 카테고리
