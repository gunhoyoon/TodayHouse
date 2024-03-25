"use client";
import Controller from "@/app/_component/controller/Controller";
import Gnb from "@/app/_component/gnb/Gnb";
import React, { useEffect, useRef, useState } from "react";
import ProductList from "./ProductList";
import ProductModal from "./ProductModal";
import { Product, ProductWithCheck } from "@/model/Products";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InitCategoryData } from "@/app/_util/categoryData";
import { Category } from "@/model/Categories";
import { InitProductData } from "@/app/_util/productData";

const ProductContainer = () => {
  const [products, setProducts] = useState<ProductWithCheck[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isAllCheck, setIsAllCheck] = useState(false);
  const checkRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

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
      setProducts(productsWithCheckId);
    }
  }, [productData]);
  const { mutate, isPending } = useMutation({
    mutationFn: async (product: string) => {
      const searchTerm = product;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/searchProduct?searchTerm=${searchTerm}`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    onSuccess: (data: Product[]) => {
      const searchData = data.map((product: Product) => ({
        ...product,
        checked: false,
      }));
      setProducts(searchData);
    },
    onError: (err) => {
      console.error(err);
    },
  });
  const onSearch = (searchTerm: string) => {
    mutate(searchTerm);
  };
  const openModal = () => {
    setIsOpen(true);
  };

  const remove = useMutation({
    mutationFn: async (products: ProductWithCheck[]) => {
      const ids = products.map((product) => product.id).join(",");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/product?ids=${ids}`,
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
      alert("삭제 성공");
      queryClient.setQueryData(["admin", "product"], data);
      // 쿼리에 업데이트 해주면, 쿼리에 들어가면 데이터가 바뀌므로 useEffect 트리거 그리고 checked 맵돌면서 state에 할당
      setIsAllCheck(false);
    },
    onError: (err) => {
      console.error(err);
      alert("삭제 실패");
    },
  });
  const onRemove = () => {
    const selectDEL = products.filter(
      (product: ProductWithCheck) => product.checked === true
    );
    if (selectDEL.length > 0) {
      remove.mutate(selectDEL);
    } else {
      alert("삭제할 카테고리를 선택해주세요");
    }
  };

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
      <ProductList
        products={products}
        setProducts={setProducts}
        isAllCheck={isAllCheck}
        setIsAllCheck={setIsAllCheck}
        ref={checkRef}
        isPending={isPending}
      />
      <ProductModal
        categoryData={categoryData}
        setProduct={setProducts}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </div>
  );
};

export default ProductContainer;
