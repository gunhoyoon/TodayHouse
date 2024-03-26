"use client";

import { ProductDetailData } from "@/app/_util/productDetailData";
import { Product } from "@/model/Products";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import React from "react";
import NotFound from "./not-found";
import Loading from "../../_component/Loading";
import styles from "./productDetail.module.css";
import Link from "next/link";

export default function ProductDetailPage() {
  const pathname = usePathname();
  const id = pathname.split("/")[3];
  const {
    data: productDetailData,
    isPending,
    isError,
  } = useQuery<
    Product[], // 해당 쿼리가 반환할 타입
    Object, // 데이터를 가져올 때 발생할 수 있는 오류에 관한 타입(광범위하게 설정)
    Product[], // 쿼리가져오는 것을 성공했을 때, 해당 데이터의 타입
    [_1: string, _2: string, _3: string] // queryKey에 관한 타입, id는 동적으로 들어오는 값이지만 값만 다를 뿐, string임
    // 지금 쿼리키 타입을 넓게 잡았지만, 사실 "admin": string , "product" : string 타입으로 좁게 가져가는게 좀 더 바람직함, 근데 에러남
  >({
    queryKey: ["admin", "product", id],
    // queryFn은 queryKey 배열에서 파라미터를 받아서 사용한다.
    queryFn: ProductDetailData,
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
  });
  console.log("productDetailData", productDetailData);
  // 해당 id가 존재하지 않는 아이디일 수 있잖아. 그러니까 말도 안되는 아이디로 요청하면 404가 나와야지
  const defaultImage =
    "https://iuc.cnu.ac.kr/_custom/cnu/resource/img/tmp_gallery.png";
  // 로딩 중 처리
  if (isPending) {
    return (
      <div style={{ marginTop: 30 }}>
        <Loading />
      </div>
    );
  }

  // 에러 (데이터가 없거나 유효하지 않은 경우) 처리
  if (isError || !productDetailData) {
    return <NotFound />;
  }

  // 데이터가 있는 경우, 상품 정보 표시
  return (
    <>
      <Link href={"/admin/product"} className={styles.backButton}>
        🔙
      </Link>
      <div className={styles.productDetailContainer}>
        {productDetailData &&
          productDetailData.map((product: Product) => (
            <div className={styles.productWrapper} key={product.id}>
              <div className={styles.productDetailImage}>
                {Object.values(product.image)[0] ? (
                  <img
                    src={`data:image/png;base64,${
                      Object.values(product.image)[0]
                    }`}
                    alt={product.name}
                    width={400}
                    height={400}
                  />
                ) : (
                  <img
                    src={defaultImage}
                    alt="이미지 없음"
                    width={200}
                    height={200}
                  />
                )}
              </div>
              <div className={styles.productInfo}>
                <p className={styles.category}>
                  Category : {product.category.name}
                </p>
                <p className={styles.name}>상품명 : {product.name}</p>
                <p className={styles.price}>
                  가격 : {Number(product.price).toLocaleString()}원
                </p>
                <p>상품 소개 : {product.description}</p>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}

// 이미지가 가운데로 뜨고, 설명 옆에
