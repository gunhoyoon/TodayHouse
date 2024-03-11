"use client";
import Controller from "@/app/_component/controller/Controller";
import Gnb from "@/app/_component/gnb/Gnb";
import React, { useEffect, useState } from "react";
import ProductList from "./ProductList";
import ProductModal from "./ProductModal";
import { Product, ProductWithCheck } from "@/model/Products";

export default function ProductContainer() {
  const key = "상품";
  const initialCategories = JSON.parse(localStorage.getItem(key) || "[]");
  // 순수 로컬
  const productsWithCheck = initialCategories.map((product: Product) => ({
    ...product,
    checked: false,
  }));
  // 로컬에 체크묻은거
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
