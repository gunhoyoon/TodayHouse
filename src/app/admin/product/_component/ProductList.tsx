import { ProductWithCheck } from "@/model/Products";
import React from "react";
import styles from "./productList.module.css";
type Props = {
  products: ProductWithCheck[];
};

export default function ProductList({ products }: Props) {
  return (
    <div>
      <ul className={styles.container}>
        {products.map((product: ProductWithCheck, index) => (
          <li key={index}>
            <div>
              <input
                id="category"
                type="checkbox"
                checked={product.checked}
                onChange={() => {}}
                // 체크시 t/f 토글
                // false 된 상품  선택삭제 + 전체삭제
                // 수정버튼
              />
              <p>카테고리 : {product.category}</p>
              <p>상품명 : {product.name}</p>
              <p>가격 : {product.price}</p>
              <p>상품 소개 : {product.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
