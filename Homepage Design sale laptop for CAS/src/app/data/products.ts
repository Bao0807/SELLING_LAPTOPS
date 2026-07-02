export type ProductSpecs = {
  cpu: string;
  ram: string;
  ssd: string;
  gpu: string;
  display: string;
  battery: string;
  weight: string;
  os: string;
};

export type ProductReview = {
  id: number;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
};

export type Product = {
  id: number;
  name: string;
  brand: string;
  category: string;
  image: string;
  images: string[];
  badge: { label: string; color: string; bg: string } | null;
  specs: ProductSpecs;
  rating: number;
  reviewCount: number;
  reviews: ProductReview[];
  price: number;
  oldPrice?: number;
  discount?: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  stock: number;
  description: string;
  shortDescription: string;
};

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN").format(Number(price || 0)) + " ₫";
}

export const BRANDS = ["ASUS", "Apple", "Dell", "HP", "Lenovo", "MSI", "Acer", "LG"];

export const PRICE_RANGES = [
  { label: "Dưới 15 triệu", min: 0, max: 15000000 },
  { label: "15 - 25 triệu", min: 15000000, max: 25000000 },
  { label: "25 - 40 triệu", min: 25000000, max: 40000000 },
  { label: "Trên 40 triệu", min: 40000000, max: Infinity },
];
