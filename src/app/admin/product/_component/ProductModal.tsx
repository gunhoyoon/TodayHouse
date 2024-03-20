"use client";
import React, { FormEventHandler, useState } from "react";
import styles from "./productModal.module.css";
import { Product, ProductWithCheck } from "@/model/Products";
import { Category } from "@/model/Categories";
type Props = {
  onModalClose: () => void;
  isOpen: boolean;
  setProduct: (product: ProductWithCheck[]) => void;
  categoryData: Category[];
};

export default function ProductModal({
  onModalClose,
  isOpen,
  setProduct,
  categoryData,
}: Props) {
  //   const [category, setCategory] = useState("");
  //   const [name, setName] = useState("");
  //   const [price, setPrice] = useState("");
  //   const [description, setDescription] = useState("");
  const [productInput, setProductInput] = useState({
    category: "",
    name: "",
    price: "",
    description: "",
    imageInfo: { id: "" },
  });
  const key = "상품";
  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    let storedProducts: Product[] = JSON.parse(
      localStorage.getItem(key) || "[]"
    );

    // 값이 있으면 가져오고 없으면 빈배열
    // 상품 이름 중복,공백 제거
    const newProductName = productInput.name.trim();
    if (
      newProductName &&
      !storedProducts.some(
        (product: Product) => product.name === newProductName
      )
    ) {
      const newProduct = { ...productInput, name: newProductName };
      storedProducts.unshift(newProduct);
      // unshift 배열 맨 앞 추가
      // 이 로컬 업데이트는 핸들러에서 해줄거임. 그리고 성공 시 데이터를 받아 클라이언트 상태에 업데이트해줌
      localStorage.setItem(key, JSON.stringify(storedProducts));
      const productsWithCheck = JSON.parse(
        localStorage.getItem(key) || "[]"
      ).map((product: Product) => ({
        ...product,
        checked: false,
      }));
      setProduct(productsWithCheck);
      setProductInput({
        category: "",
        name: "",
        price: "",
        description: "",
        imageInfo: { id: "" },
      });
    }
  };
  return (
    <>
      {isOpen && (
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <p>상품 추가하기</p>
            <button type="button" onClick={onModalClose}>
              ❌
            </button>
          </div>
          <form onSubmit={onSubmit}>
            <div>
              <label htmlFor="category">카테고리</label>
              <input
                id="category"
                type="text"
                required
                value={productInput.category}
                onChange={(e) => {
                  setProductInput({
                    ...productInput,
                    category: e.target.value,
                  });
                  // 이미 구조분해할당한 상태임
                }}
              />
            </div>
            <div>
              <label htmlFor="image">상품 이미지</label>
              <input id="imageUpload" type="file" style={{ display: "none" }} />
            </div>

            <div>
              <label htmlFor="name">상품명</label>
              <input
                id="name"
                type="text"
                required
                value={productInput.name}
                onChange={(e) => {
                  setProductInput({ ...productInput, name: e.target.value });
                }}
              />
            </div>
            <div>
              <label htmlFor="price">가격</label>
              <input
                id="price"
                type="text"
                required
                value={productInput.price}
                onChange={(e) => {
                  setProductInput({ ...productInput, price: e.target.value });
                }}
              />
            </div>
            <div>
              <label htmlFor="description">상품 소개</label>
              <input
                id="description"
                type="text"
                required
                value={productInput.description}
                onChange={(e) => {
                  setProductInput({
                    ...productInput,
                    description: e.target.value,
                  });
                }}
              />
            </div>
            <button type="submit">저장</button>
          </form>
        </div>
      )}
    </>
  );
}

// // 이건 수정도 있음 +

// // 모달이 2가지 유형인데, 하나는 추가, 하나는 수정. 이건 기존 카테고리 데이터가 있냐 없냐에 따른거같은데
// // 아 아니면 어차피 추가버튼하고 수정하기 버튼하고 다르니까. 수정하기 버튼은 있는 데이터를 넣어줌.

// // 카테고리
// // 상품이름
// // 가격
// // 상품 소개
