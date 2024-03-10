export interface Category {
  name: string;
}

export type CategoryWithCheck = Category & { checked: boolean };
