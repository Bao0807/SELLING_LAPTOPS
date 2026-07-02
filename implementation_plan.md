# Hoàn Thiện Backend & Tích Hợp Frontend - CAS Laptop Store

## Tổng quan
Dự án CAS Laptop Store đã có backend Node.js/Express.js + Sequelize/MySQL hoàn chỉnh về cấu trúc, nhưng frontend vẫn đang sử dụng **dữ liệu tĩnh (mock data)** cho hầu hết các tính năng. Cần hoàn thiện việc kết nối frontend ↔ backend để project hoạt động giống thực tế.

**Ngoại trừ**: Tính năng thanh toán (VNPay, MoMo, ZaloPay...) - chỉ giữ COD.

## Vấn đề chính cần giải quyết

### 1. 🐛 Bug: Scroll to top khi chuyển trang
**Hiện tượng**: Khi navigate sang trang mới, page hiển thị ở cuối thay vì đầu trang.
**Nguyên nhân**: React Router không tự động scroll to top khi route thay đổi.
**Giải pháp**: Tạo component `ScrollToTop` sử dụng `useLocation` và gọi `window.scrollTo(0, 0)` mỗi khi pathname thay đổi.

---

### 2. 🔗 Tích hợp Backend cho Frontend

#### A. Products — Thay mock data bằng API thực

| Frontend file | Hiện tại | Cần sửa |
|---|---|---|
| `ProductsPage.tsx` | Import từ `data/products.ts` (static) | Fetch từ `GET /api/products` |
| `ProductDetailPage.tsx` | Dùng `getProductById()` static | Fetch từ `GET /api/products/:id` (có kèm reviews) |
| `FeaturedProducts.tsx` | Dùng mock array | Fetch từ `GET /api/products/featured` |
| `HomePage.tsx` / `HeroSection.tsx` | Static products | Fetch featured + bestsellers |
| `QuickFilter.tsx` | Static filters | Fetch categories từ `GET /api/categories` |

#### B. Cart — Đồng bộ với backend (hiện chỉ client-side)
- `CartContext.tsx` hiện có TODO: Sync with backend
- Khi user đã đăng nhập: POST/PUT/DELETE `/api/cart/*`
- Khi chưa đăng nhập: giữ localStorage (guest cart)
- Khi đăng nhập: merge localStorage cart vào server cart

#### C. Wishlist — Tương tự Cart
- `WishlistContext.tsx` có TODO: Sync with backend
- Khi user đã đăng nhập: POST/DELETE `/api/wishlist/*`
- Khi chưa đăng nhập: giữ localStorage

#### D. Orders — Tích hợp đặt hàng thực
- `CheckoutPage.tsx`: Thay modal "Tính năng đang phát triển" → gọi `POST /api/orders`
- `ProfilePage.tsx`: Thay mockOrders → fetch từ `GET /api/orders`

#### E. Profile — Kết nối auth context
- `ProfilePage.tsx`: Thay `mockUser` → dùng `useAuth()` context
- Profile update: gọi `PUT /api/auth/profile`
- Đổi mật khẩu: gọi `PUT /api/auth/change-password`

#### F. Reviews — Tích hợp đánh giá
- `ProductDetailPage.tsx`: Thay nút "alert" → form đánh giá thực, gọi `POST /api/reviews`
- Hiển thị reviews từ backend (đã có trong getProductById response)

---

### 3. 🔧 Backend cần bổ sung/cải thiện

| Cần thêm | Mô tả |
|---|---|
| `GET /api/categories` | Route công khai lấy danh sách categories |
| `categoryController.js` | Controller cho categories |
| `categoryRoutes.js` | Routes cho categories |
| Stock validation khi đặt hàng | Kiểm tra tồn kho trước khi tạo order, giảm stock sau khi đặt |
| Rate limiting | Giới hạn request cho auth endpoints |
| Cancel order by user | Cho phép user hủy đơn khi còn ở trạng thái `pending` |
| Review validation | Chỉ cho review sản phẩm đã mua |
| Clear cart API | Endpoint xóa toàn bộ cart |

---

### 4. ✨ Cải thiện UX cho giống thực tế

| Feature | Chi tiết |
|---|---|
| Loading states | Skeleton/spinner khi fetch data từ API |
| Error handling | Toast thông báo lỗi khi API fail |
| Toast notifications | Thay `alert()` bằng toast (đã có `sonner` trong deps) |
| Auth guards | Redirect về login khi cần đăng nhập |
| Empty states | Cải thiện UI khi không có data |
| Pagination | Products page với pagination thực từ backend |
| Voucher validation | CartPage: kiểm tra mã giảm giá qua `POST /api/vouchers/validate` |

---

## Proposed Changes

### Component 1: Scroll To Top Fix

#### [NEW] [ScrollToTop.tsx](file:///d:/FUTURE/TUHOC/WEB_12_06/Homepage%20Design%20sale%20laptop%20for%20CAS/src/app/components/ScrollToTop.tsx)
- Component `ScrollToTop` dùng `useEffect` + `useLocation` để scroll lên đầu trang mỗi khi route thay đổi.

#### [MODIFY] [App.tsx](file:///d:/FUTURE/TUHOC/WEB_12_06/Homepage%20Design%20sale%20laptop%20for%20CAS/src/app/App.tsx)
- Import và sử dụng `ScrollToTop` component bên trong `<BrowserRouter>`.

---

### Component 2: Backend - Category Route & Các cải thiện

#### [NEW] [categoryController.js](file:///d:/FUTURE/TUHOC/WEB_12_06/backend/src/controllers/categoryController.js)
- `getCategories()` — lấy tất cả categories
- `getCategoryBySlug()` — lấy category theo slug

#### [NEW] [categoryRoutes.js](file:///d:/FUTURE/TUHOC/WEB_12_06/backend/src/routes/categoryRoutes.js)
- `GET /api/categories` — public
- `GET /api/categories/:slug` — public

#### [MODIFY] [app.js](file:///d:/FUTURE/TUHOC/WEB_12_06/backend/src/app.js)
- Register `categoryRoutes`

#### [MODIFY] [orderController.js](file:///d:/FUTURE/TUHOC/WEB_12_06/backend/src/controllers/orderController.js)
- Thêm stock validation khi tạo order
- Giảm stock_quantity sau khi order thành công
- Thêm `cancelOrder` cho phép user hủy đơn pending

#### [MODIFY] [orderRoutes.js](file:///d:/FUTURE/TUHOC/WEB_12_06/backend/src/routes/orderRoutes.js)
- Thêm `PUT /api/orders/:id/cancel`

#### [MODIFY] [cartController.js](file:///d:/FUTURE/TUHOC/WEB_12_06/backend/src/controllers/cartController.js)
- Thêm `clearCart()` — xóa toàn bộ giỏ hàng

#### [MODIFY] [cartRoutes.js](file:///d:/FUTURE/TUHOC/WEB_12_06/backend/src/routes/cartRoutes.js)
- Thêm `DELETE /api/cart` — clear all cart items

#### [MODIFY] [reviewController.js](file:///d:/FUTURE/TUHOC/WEB_12_06/backend/src/controllers/reviewController.js)
- Thêm validation: chỉ cho review sản phẩm đã mua (check OrderItem)
- Thêm pagination cho product reviews

#### [MODIFY] [productController.js](file:///d:/FUTURE/TUHOC/WEB_12_06/backend/src/controllers/productController.js)
- Tính rating trung bình từ reviews thực tế
- Thêm `relatedProducts` vào getProductById

---

### Component 3: Frontend - Tích hợp API & UX

#### [MODIFY] [api.ts](file:///d:/FUTURE/TUHOC/WEB_12_06/Homepage%20Design%20sale%20laptop%20for%20CAS/src/app/utils/api.ts)
- Thêm các hàm API cho: fetchProducts, fetchProductById, fetchFeaturedProducts, fetchCategories, cart CRUD, wishlist CRUD, orders, reviews, voucher validate

#### [MODIFY] [CartContext.tsx](file:///d:/FUTURE/TUHOC/WEB_12_06/Homepage%20Design%20sale%20laptop%20for%20CAS/src/app/context/CartContext.tsx)
- Sync cart với backend khi user đã đăng nhập
- Fallback localStorage cho guest

#### [MODIFY] [WishlistContext.tsx](file:///d:/FUTURE/TUHOC/WEB_12_06/Homepage%20Design%20sale%20laptop%20for%20CAS/src/app/context/WishlistContext.tsx)
- Sync wishlist với backend khi user đã đăng nhập

#### [MODIFY] [ProductsPage.tsx](file:///d:/FUTURE/TUHOC/WEB_12_06/Homepage%20Design%20sale%20laptop%20for%20CAS/src/app/pages/ProductsPage.tsx)
- Fetch products từ API thay vì import static data
- Thêm loading skeleton, error state
- Pagination thực

#### [MODIFY] [ProductDetailPage.tsx](file:///d:/FUTURE/TUHOC/WEB_12_06/Homepage%20Design%20sale%20laptop%20for%20CAS/src/app/pages/ProductDetailPage.tsx)
- Fetch product từ API
- Review form thực tế (gửi POST /api/reviews)
- Loading state

#### [MODIFY] [CheckoutPage.tsx](file:///d:/FUTURE/TUHOC/WEB_12_06/Homepage%20Design%20sale%20laptop%20for%20CAS/src/app/pages/CheckoutPage.tsx)
- Gọi `POST /api/orders` thay vì chỉ hiện modal placeholder
- Hiển thị order success page sau khi đặt thành công
- Auth guard: yêu cầu đăng nhập

#### [MODIFY] [ProfilePage.tsx](file:///d:/FUTURE/TUHOC/WEB_12_06/Homepage%20Design%20sale%20laptop%20for%20CAS/src/app/pages/ProfilePage.tsx)
- Dùng `useAuth()` thay mock data
- Fetch orders từ API
- Profile update & đổi mật khẩu qua API
- Auth guard

#### [MODIFY] [CartPage.tsx](file:///d:/FUTURE/TUHOC/WEB_12_06/Homepage%20Design%20sale%20laptop%20for%20CAS/src/app/pages/CartPage.tsx)
- Voucher validation qua API

#### [MODIFY] [FeaturedProducts.tsx](file:///d:/FUTURE/TUHOC/WEB_12_06/Homepage%20Design%20sale%20laptop%20for%20CAS/src/app/components/FeaturedProducts.tsx)
- Fetch từ API thay vì static data

#### [MODIFY] [main.tsx](file:///d:/FUTURE/TUHOC/WEB_12_06/Homepage%20Design%20sale%20laptop%20for%20CAS/src/main.tsx)
- Thêm `Toaster` from sonner cho toast notifications

---

## Verification Plan

### Manual Verification
1. Đăng ký tài khoản mới → kiểm tra database
2. Đăng nhập → kiểm tra token
3. Xem danh sách sản phẩm từ API
4. Xem chi tiết sản phẩm → reviews hiển thị từ database
5. Thêm vào giỏ hàng (cả guest và logged-in)
6. Thêm vào wishlist
7. Đặt hàng → kiểm tra order trong database
8. Xem lịch sử đơn hàng trong profile
9. Viết đánh giá sản phẩm
10. Áp dụng mã giảm giá
11. Chuyển trang → scroll lên đầu trang
12. Navigation giữa các trang hoạt động mượt mà
