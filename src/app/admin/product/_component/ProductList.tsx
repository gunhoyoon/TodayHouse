import { Image, ProductWithCheck } from "@/model/Products";
import React from "react";
import styles from "./productList.module.css";
type Props = {
  products: ProductWithCheck[];
};

export default function ProductList({ products }: Props) {
  // const test = products.map((v) => {
  //   return v.image;
  // });
  // console.log(test);
  // const test1 = test.forEach((item: Image) => {
  //   // 각 객체의 값을 꺼내어 순회
  //   // 프로퍼티 키 뽑아서 배열에 담고 forEach
  //   Object.keys(item).forEach((key, i) => {
  //     // key에 해당하는 value 출력
  //     console.log(key);
  //     console.log("item");
  //     const test2 = item[key];
  //     console.log("test2", test2);
  //     return test2;
  //     // const value = item[key];
  //     // console.log(value);
  //   });
  // });

  // 역직렬화 클라이언트에서 처리, 여기선 계속 역직렬화를 처리하고 있을것이므로 검색을 하고 나서도 상관없음. 서버에서 필터링된 값만 전달받을 뿐임
  return (
    <div>
      <ul className={styles.container}>
        {products.map((product: ProductWithCheck, index) => (
          <li key={index}>
            <div>
              <input
                id="category"
                type="checkbox"
                // checked={}
                onChange={() => {}}
              />
              {/* checked 에 들어간 값이 어느순간 undefined나 null이 되면 에러가 발생 */}
              <img
                src={`data:image/png;base64,${Object.values(product.image)[0]}`}
                alt="?"
                width={200}
                height={200}
              />
              <p>카테고리 : {product.category.name}</p>

              {/* <p>이미지 {product.image}</p> */}
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
