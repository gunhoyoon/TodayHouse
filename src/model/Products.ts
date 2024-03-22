export interface Image {
  [key: string]: string; // 이 부분을 변경
}
export interface Product {
  category: {
    name: string;
    id: string;
  };
  image: Image;
  id: string;
  name: string;
  price: string;
  description: string;
}
// 추가할 때 product 스테이트가 가지고 있을 타입이고
// export type ProductWithImg = Product & { image: string };
// 이미지는 폼 전송할 때 추가되는거니까 전송할 때 타입은 ProductWithImg
export type ProductWithCheck = Product & { checked: boolean };
// 핸들러에서 get요청해서 프로덕트에 관한 데이터를 받아와서 checked까지 붙여줄 땐 ProductWithCheck

// 카테고리,
// 상품명
// 가격
// 소개
