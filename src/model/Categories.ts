export interface Category {
  name: string;
  id: string;
}
// 처음 로컬에서 데이터를 받아올 때 타입 정의를 위함

export type CategoryWithCheckId = Category & { checked: boolean };
