import { Image, Product, ProductWithCheck } from "@/model/Products";
import React, { ChangeEventHandler, ForwardedRef, forwardRef } from "react";
import styles from "./productList.module.css";
import Loading from "../../_component/Loading";
type Props = {
  products: ProductWithCheck[];
  setProducts: (products: ProductWithCheck[]) => void;
  isAllCheck: boolean;
  setIsAllCheck: (isAllCheck: boolean) => void;
  ref: React.RefObject<HTMLInputElement>;
  isPending: boolean;
};

const ProductList = forwardRef(
  (
    { products, setProducts, setIsAllCheck, isAllCheck, isPending }: Props,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const toggleCheck = (index: number) => {
      console.log(index);
      const updatedChecked = [...products];
      updatedChecked[index].checked = !updatedChecked[index].checked;
      console.log("updatedChecked", updatedChecked);
      setProducts(updatedChecked);

      const isAnyProductNotChecked = products.some(
        (product: ProductWithCheck) => product.checked === false
      );
      // 업데이트 됐어. 그 배열에서 check가 하나라도 false냐 ? false면 전체 선택 false,
      // 아니고 전체 다 선택됐냐 하면 isAllCheck true 값 업데이트

      // console.log("categories", categories);
      // console.log("isAnyCategoryNotChecked", isAnyCategoryNotChecked);
      if (isAnyProductNotChecked) {
        setIsAllCheck(false);
      } else {
        setIsAllCheck(true);
      }

      // console.log("isAllCheck", isAllCheck);
      const hasEl = ref && typeof ref !== "function" && ref.current;
      //
      if (hasEl) {
        // ref가 있고, ref가 유효한 객체인지,
        const el = ref.current as HTMLInputElement;

        el.checked = updatedChecked.every((product) => product.checked);
      }
    };

    const onAllCheck: ChangeEventHandler<HTMLInputElement> = () => {
      const isAllCheck = products.every(
        (product: ProductWithCheck) => product.checked === true
      );
      // 이건 그냥 값을 업데이트 해줘야되냐? 를 위한 확인 과정임
      // 체크가 전부 트루인지 확인, 하나라도 false면 false 반환할거니까
      // 근데 여기서 중요한건 값을 업데이트하기전의 값을 가지고 함수 도는거임

      // const toggledCheckedCategories = categories.forEach(
      //   (category: CategoryWithCheckId) => (category.checked = !isAllCheck)
      // );
      const toggledCheckedProducts = products.map(
        (product: ProductWithCheck) => ({
          ...product,
          checked: !isAllCheck,
        })
      );
      // 실제 값이 업데이트 되는건 여기임
      // 그럼 isAllCheck와 같은 로직을 값이 업데이트 된 아래에서 작성하면, 바뀐 값으로 찍히겠지? 업데이트해줬으니까 64라인에서
      // 복사한거 돌면서 checked를 isAllCheck의 부정값으로 업데이트, 여기서 업데이트해줌
      // 전체가 true 면 false 할당, 하나라도 false면 true 할당

      setProducts(toggledCheckedProducts);
      // 업데이트한 복사본 할당
      setIsAllCheck(!isAllCheck);
      // 삭제 성공할 때 풀어줘야하니까 컨테이너 에서 전달받는데.

      const hasEl = ref && typeof ref !== "function" && ref.current;
      if (hasEl) {
        const el = ref.current as HTMLInputElement;
        el.checked = !isAllCheck;
      }
    };
    const defaultImage =
      "https://iuc.cnu.ac.kr/_custom/cnu/resource/img/tmp_gallery.png";
    console.log("products", products);
    return (
      <>
        {isPending ? (
          <Loading />
        ) : (
          <div className={styles.productContainer}>
            <div className={styles.productAllCheck}>
              <input
                id="allCheck"
                type="checkbox"
                checked={isAllCheck}
                onChange={onAllCheck}
                ref={ref}
              />
              <label htmlFor="allCheck">전체선택</label>
            </div>
            <ul className={styles.itemContainer}>
              {products &&
                products.map((product: ProductWithCheck, index) => (
                  <li key={index}>
                    <input
                      id={`product-${index}`}
                      type="checkbox"
                      checked={product.checked}
                      onChange={() => {
                        toggleCheck(index);
                      }}
                    />
                    {/* checked 에 들어간 값이 어느순간 undefined나 null이 되면 에러가 발생 */}
                    <div>
                      {Object.values(product.image)[0] ? (
                        <img
                          src={`data:image/png;base64,${
                            Object.values(product.image)[0]
                          }`}
                          alt={product.name}
                          width={200}
                          height={200}
                        />
                      ) : (
                        <img
                          src={defaultImage}
                          alt="이미지 없음"
                          width={200}
                          height={200}
                        />
                      )}

                      <div>
                        <p>카테고리 : {product.category.name}</p>
                        <p>상품명 : {product.name}</p>
                        <p>가격 : {product.price}</p>
                        <p>상품 소개 : {product.description}</p>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </>
    );
  }
);

export default ProductList;
