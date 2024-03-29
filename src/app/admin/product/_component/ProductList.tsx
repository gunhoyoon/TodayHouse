import { Image, Product, ProductWithCheck } from "@/model/Products";
import React, {
  ChangeEventHandler,
  ForwardedRef,
  forwardRef,
  useState,
} from "react";
import styles from "./productList.module.css";
import Loading from "../../_component/Loading";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import ProductModal from "./ProductModal";
type Props = {
  products: ProductWithCheck[];
  modifyProduct: ProductWithCheck | null;
  setProducts: (products: ProductWithCheck[]) => void;
  isAllCheck: boolean;
  setModifyProduct: React.Dispatch<
    React.SetStateAction<ProductWithCheck | null>
  >;
  setIsAllCheck: (isAllCheck: boolean) => void;
  ref: React.RefObject<HTMLInputElement>;
  isPending: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const ProductList = forwardRef(
  (
    {
      products,
      modifyProduct,
      setProducts,
      setIsAllCheck,
      setModifyProduct,
      isAllCheck,
      isPending,
      isOpen,
      setIsOpen,
    }: Props,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    // const [modifyProduct, setModifyProduct] = useState<ProductWithCheck>();
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

    const handleEditButtonClick = (productId: string) => {
      console.log("productId", productId);
      const productToModify = products.find(
        (product: Product) => product.id === productId
      ); // 클릭된 ID에 해당하는 상품 정보 찾기
      console.log("productToModify", productToModify);
      if (productToModify) {
        setIsOpen(true);
        setModifyProduct(productToModify);
      }
    };

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
                    <button onClick={() => handleEditButtonClick(product.id)}>
                      수정
                    </button>
                    <div>
                      <div className={styles.productImage}>
                        {Object.values(product.image)[0] ? (
                          <label htmlFor={`product-${index}`}>
                            <img
                              src={`data:image/png;base64,${
                                Object.values(product.image)[0]
                              }`}
                              alt={product.name}
                              width={200}
                              height={200}
                            />
                          </label>
                        ) : (
                          <label htmlFor={`product-${index}`}>
                            <img
                              src={defaultImage}
                              alt="이미지 없음"
                              width={200}
                              height={200}
                            />
                          </label>
                        )}
                      </div>
                      <div className={styles.productInfo}>
                        <Link href={`/admin/product/${product.id}`}>
                          <p>카테고리 : {product.category.name}</p>
                          <p>상품명 : {product.name}</p>
                          <p>가격 : {Number(product.price).toLocaleString()}</p>
                          <p>상품 소개 : {product.description}</p>
                          <div className={styles.detail}>
                            {product.name} 상세 보기
                          </div>
                        </Link>
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
