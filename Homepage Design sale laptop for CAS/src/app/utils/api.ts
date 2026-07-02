import type { Product, ProductReview } from "../data/products";

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace(/\/$/, "");
const API_ORIGIN = new URL(API_BASE_URL).origin;

export type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type AdminDashboardStats = {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: AdminOrder[];
  topProducts: any[];
};

export type AdminCategory = {
  id: number;
  name: string;
  slug: string;
  description?: string;
};

export type AdminProductForm = Record<string, string | number | boolean | File | null | undefined>;

export type AdminOrder = {
  id: number;
  subtotal_amount: number;
  discount_amount: number;
  shipping_fee: number;
  total_amount: number;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  payment_method: string;
  shipping_address: string;
  phone: string;
  full_name: string;
  createdAt: string;
  user?: { full_name: string; email: string; phone?: string };
  voucher?: AdminVoucher | null;
  items?: Array<{ quantity: number; price_at_purchase: number; product?: any }>;
};

export type AdminVoucher = {
  id: number;
  code: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  minimum_order_amount: number;
  usage_limit: number;
  used_count: number;
  start_date: string;
  end_date: string;
  status: "active" | "inactive";
};

export type AdminUser = {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  avatar: string | null;
  role: "customer" | "admin";
  createdAt: string;
};

export type AdminReview = {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  user?: { full_name: string; email: string };
  product?: { name: string; thumbnail: string };
};

export function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("token");
  return token
    ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json" };
}

function getAuthUploadHeaders(): HeadersInit {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: options.body instanceof FormData
      ? { ...getAuthUploadHeaders(), ...(options.headers || {}) }
      : { ...getAuthHeaders(), ...(options.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    throw new Error(data.message || "Request failed");
  }
  return data.data as T;
}

function resolveAssetUrl(value?: string | null) {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `${API_ORIGIN}${value.startsWith("/") ? value : `/${value}`}`;
}

export function mapBackendProduct(p: any): Product {
  const price = Number(p.price || 0);
  const discountPrice = p.discount_price ? Number(p.discount_price) : null;
  const discount = discountPrice && price ? Math.round((1 - discountPrice / price) * 100) : undefined;
  const images = [
    resolveAssetUrl(p.thumbnail),
    ...(p.images || []).map((img: any) => resolveAssetUrl(img.image_url)),
  ].filter(Boolean);
  const fallbackImage = "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&q=80";
  const reviewRows = Array.isArray(p.reviews) ? p.reviews : [];
  const averageFromReviews = reviewRows.length
    ? Number((reviewRows.reduce((sum: number, r: any) => sum + Number(r.rating || 0), 0) / reviewRows.length).toFixed(1))
    : 0;
  const rating = Number(p.average_rating || averageFromReviews || 0);
  const reviewCount = Number(p.review_count ?? reviewRows.length ?? 0);

  return {
    id: Number(p.id),
    name: p.name,
    brand: p.brand || "CAS",
    category: p.category?.slug || "other",
    image: images[0] || fallbackImage,
    images: images.length ? images : [fallbackImage],
    badge: p.is_featured
      ? { label: "Nổi bật", color: "#2563eb", bg: "#eff6ff" }
      : discount
      ? { label: `-${discount}%`, color: "#ef4444", bg: "#fef2f2" }
      : null,
    specs: {
      cpu: p.cpu || "",
      ram: p.ram || "",
      ssd: p.storage || "",
      gpu: p.gpu || "",
      display: p.display || "",
      battery: p.battery || "",
      weight: p.weight || "",
      os: p.brand?.toLowerCase() === "apple" ? "macOS" : "Windows 11",
    },
    rating,
    reviewCount,
    reviews: reviewRows.map(mapBackendReview),
    price: discountPrice || price,
    oldPrice: discountPrice ? price : undefined,
    discount,
    isNew: Boolean(p.createdAt && Date.now() - new Date(p.createdAt).getTime() < 1000 * 60 * 60 * 24 * 30),
    isBestSeller: Number(p.totalSold || 0) > 0,
    stock: Number(p.stock_quantity || 0),
    description: p.description || "",
    shortDescription: p.description ? `${p.description.slice(0, 120)}${p.description.length > 120 ? "..." : ""}` : "",
  };
}

export function mapBackendReview(r: any): ProductReview {
  return {
    id: Number(r.id),
    author: r.user?.full_name || "Khách hàng",
    avatar: resolveAssetUrl(r.user?.avatar) || `https://i.pravatar.cc/40?img=${(Number(r.id) % 50) + 1}`,
    rating: Number(r.rating || 5),
    date: r.createdAt ? r.createdAt.split("T")[0] : new Date().toISOString().split("T")[0],
    comment: r.comment || "",
  };
}

export const publicApi = {
  products: async (params: Record<string, string | number | boolean | undefined> = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => value !== undefined && value !== "" && qs.set(key, String(value)));
    const data = await request<{ products: any[]; pagination: Pagination }>(`/products?${qs.toString()}`);
    return { products: data.products.map(mapBackendProduct), pagination: data.pagination };
  },
  product: async (id: number | string) => mapBackendProduct(await request(`/products/${id}`)),
  featured: async () => (await request<any[]>("/products/featured")).map(mapBackendProduct),
  bestsellers: async () => (await request<any[]>("/products/bestsellers")).map(mapBackendProduct),
  categories: () => request<AdminCategory[]>("/categories"),
  reviews: (productId: number | string) => request<{ reviews: any[]; pagination: Pagination }>(`/reviews/products/${productId}/reviews`),
};

export const customerApi = {
  cart: () => request<any[]>("/cart"),
  addCart: (product_id: number, quantity = 1) => request("/cart/items", { method: "POST", body: JSON.stringify({ product_id, quantity }) }),
  updateCart: (itemId: number, quantity: number) => request(`/cart/items/${itemId}`, { method: "PUT", body: JSON.stringify({ quantity }) }),
  removeCart: (itemId: number) => request(`/cart/items/${itemId}`, { method: "DELETE" }),
  clearCart: () => request("/cart", { method: "DELETE" }),
  wishlist: () => request<any[]>("/wishlist"),
  addWishlist: (product_id: number) => request("/wishlist", { method: "POST", body: JSON.stringify({ product_id }) }),
  removeWishlist: (itemId: number) => request(`/wishlist/${itemId}`, { method: "DELETE" }),
  createOrder: (payload: any) => request<AdminOrder>("/orders", { method: "POST", body: JSON.stringify(payload) }),
  orders: () => request<AdminOrder[]>("/orders"),
  cancelOrder: (id: number) => request<AdminOrder>(`/orders/${id}/cancel`, { method: "PUT" }),
  review: (payload: { product_id: number; rating: number; comment: string }) => request("/reviews", { method: "POST", body: JSON.stringify(payload) }),
  validateVoucher: (code: string, cartTotal: number) => request<AdminVoucher>("/vouchers/validate", { method: "POST", body: JSON.stringify({ code, cartTotal }) }),
  changePassword: (currentPassword: string, newPassword: string) => request("/auth/change-password", { method: "PUT", body: JSON.stringify({ currentPassword, newPassword }) }),
};

const toProductFormData = (payload: AdminProductForm) => {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") formData.append(key, value as string | Blob);
  });
  return formData;
};

export const adminApi = {
  dashboard: () => request<AdminDashboardStats>("/admin/dashboard"),
  products: async (params: Record<string, string | number | boolean | undefined> = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => value !== undefined && value !== "" && qs.set(key, String(value)));
    const data = await request<{ products: any[]; pagination: Pagination }>(`/admin/products?${qs.toString()}`);
    return { products: data.products.map(mapBackendProduct), rawProducts: data.products, pagination: data.pagination };
  },
  createProduct: (payload: AdminProductForm) => request("/admin/products", { method: "POST", body: toProductFormData(payload) }),
  updateProduct: (id: number, payload: AdminProductForm) => request(`/admin/products/${id}`, { method: "PUT", body: toProductFormData(payload) }),
  deleteProduct: (id: number) => request(`/admin/products/${id}`, { method: "DELETE" }),
  categories: () => request<AdminCategory[]>("/admin/categories"),
  createCategory: (payload: Partial<AdminCategory>) => request("/admin/categories", { method: "POST", body: JSON.stringify(payload) }),
  updateCategory: (id: number, payload: Partial<AdminCategory>) => request(`/admin/categories/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteCategory: (id: number) => request(`/admin/categories/${id}`, { method: "DELETE" }),
  orders: (params: Record<string, string | number | undefined> = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => value !== undefined && value !== "" && qs.set(key, String(value)));
    return request<{ orders: AdminOrder[]; pagination: Pagination }>(`/admin/orders?${qs.toString()}`);
  },
  order: (id: number) => request<AdminOrder>(`/admin/orders/${id}`),
  updateOrderStatus: (id: number, status: AdminOrder["status"]) => request<AdminOrder>(`/admin/orders/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }),
  vouchers: () => request<AdminVoucher[]>("/admin/vouchers"),
  createVoucher: (payload: Partial<AdminVoucher>) => request("/admin/vouchers", { method: "POST", body: JSON.stringify(payload) }),
  updateVoucher: (id: number, payload: Partial<AdminVoucher>) => request(`/admin/vouchers/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteVoucher: (id: number) => request(`/admin/vouchers/${id}`, { method: "DELETE" }),
  users: (params: Record<string, string | number | undefined> = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => value !== undefined && value !== "" && qs.set(key, String(value)));
    return request<{ users: AdminUser[]; pagination: Pagination }>(`/admin/users?${qs.toString()}`);
  },
  updateUserRole: (id: number, role: AdminUser["role"]) => request<AdminUser>(`/admin/users/${id}/role`, { method: "PUT", body: JSON.stringify({ role }) }),
  deleteUser: (id: number) => request(`/admin/users/${id}`, { method: "DELETE" }),
  reviews: (params: Record<string, string | number | undefined> = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => value !== undefined && value !== "" && qs.set(key, String(value)));
    return request<{ reviews: AdminReview[]; pagination: Pagination }>(`/admin/reviews?${qs.toString()}`);
  },
  deleteReview: (id: number) => request(`/admin/reviews/${id}`, { method: "DELETE" }),
};
