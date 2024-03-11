export interface Product {
  category: string;
  name: string;
  price: string;
  description: string;
}
export type ProductWithCheck = Product & { checked: boolean };

// 카테고리,
// 상품명
// 가격
// 소개
