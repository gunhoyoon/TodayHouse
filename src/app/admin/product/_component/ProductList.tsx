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
