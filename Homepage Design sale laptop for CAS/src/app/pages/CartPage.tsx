import { Link, useNavigate } from "react-router";
import { ArrowLeft, Minus, Plus, ShoppingBag, ShoppingCart, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../data/products";

export function CartPage() {
  const { items, totalItems, totalPrice, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  const shippingFee = totalPrice >= 5000000 ? 0 : 50000;

  const safeUpdateQuantity = (productId: number, quantity: number) => {
    updateQuantity(productId, quantity).catch((error) => toast.error(error.message || "Không thể cập nhật giỏ hàng"));
  };

  const safeRemove = (productId: number) => {
    removeFromCart(productId).catch((error) => toast.error(error.message || "Không thể xóa sản phẩm"));
  };

  const safeClear = () => {
    clearCart().catch((error) => toast.error(error.message || "Không thể xóa giỏ hàng"));
  };

  if (items.length === 0) {
    return (
      <div style={{ paddingTop: "140px", minHeight: "100vh", backgroundColor: "#f8fafc" }} className="flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-blue-50">
            <ShoppingCart size={40} className="text-blue-600" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-800">Giỏ hàng trống</h2>
          <p className="mb-8 text-gray-500">Hãy thêm sản phẩm vào giỏ hàng của bạn.</p>
          <Link to="/products" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white">
            <ShoppingBag size={18} /> Mua sắm ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: "140px", minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <ShoppingCart size={24} className="text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Giỏ hàng ({totalItems} sản phẩm)</h1>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex-1">
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
              <div className="hidden grid-cols-12 gap-4 border-b border-gray-100 bg-gray-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 md:grid">
                <div className="col-span-5">Sản phẩm</div>
                <div className="col-span-2 text-center">Đơn giá</div>
                <div className="col-span-2 text-center">Số lượng</div>
                <div className="col-span-2 text-center">Thành tiền</div>
                <div className="col-span-1" />
              </div>

              {items.map((item, index) => (
                <div key={item.product.id} className="grid grid-cols-1 items-center gap-4 border-b border-gray-50 px-6 py-5 last:border-0 md:grid-cols-12" style={{ backgroundColor: index % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <div className="flex items-center gap-4 md:col-span-5">
                    <img src={item.product.image} alt={item.product.name} className="h-16 w-20 flex-shrink-0 rounded-xl border border-gray-100 object-cover" />
                    <div className="min-w-0">
                      <Link to={`/product/${item.product.id}`} className="line-clamp-2 text-sm font-semibold text-gray-900 transition-colors hover:text-blue-600">
                        {item.product.name}
                      </Link>
                      <p className="mt-1 text-xs text-gray-400">{item.product.brand}</p>
                      <p className="text-xs text-gray-400">{item.product.specs.cpu}</p>
                    </div>
                  </div>

                  <div className="text-center md:col-span-2">
                    <div className="text-sm font-semibold text-blue-600">{formatPrice(item.product.price)}</div>
                    {item.product.oldPrice && <div className="text-xs text-gray-400 line-through">{formatPrice(item.product.oldPrice)}</div>}
                  </div>

                  <div className="flex items-center justify-center md:col-span-2">
                    <div className="flex items-center overflow-hidden rounded-xl border-2 border-gray-200">
                      <button onClick={() => safeUpdateQuantity(item.product.id, item.quantity - 1)} className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-gray-100">
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                      <button onClick={() => safeUpdateQuantity(item.product.id, item.quantity + 1)} className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-gray-100">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="text-center md:col-span-2">
                    <span className="text-sm font-bold text-blue-600">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>

                  <div className="flex justify-center md:col-span-1">
                    <button onClick={() => safeRemove(item.product.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-all hover:bg-red-50 hover:text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-blue-600">
                <ArrowLeft size={16} /> Tiếp tục mua sắm
              </button>
              <button onClick={safeClear} className="text-sm text-red-500 transition-colors hover:text-red-600">
                Xóa tất cả
              </button>
            </div>
          </div>

          <div className="space-y-4 lg:w-80">
            <div className="rounded-2xl border border-gray-100 bg-white p-6">
              <h2 className="mb-5 text-lg font-bold text-gray-900">Tóm tắt đơn hàng</h2>
              <div className="mb-5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính ({totalItems} sản phẩm)</span>
                  <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển dự kiến</span>
                  <span className={shippingFee === 0 ? "font-medium text-green-600" : "font-medium"}>{shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}</span>
                </div>
                <div className="rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700">
                  Mã giảm giá sẽ được áp dụng ở bước thanh toán sau khi đăng nhập.
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-3">
                  <span className="font-bold text-gray-900">Tổng dự kiến</span>
                  <span className="text-xl font-extrabold text-blue-600">{formatPrice(totalPrice + shippingFee)}</span>
                </div>
              </div>

              <Link to="/checkout" className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white transition-all hover:opacity-90">
                <ShoppingCart size={18} /> Tiến hành thanh toán
              </Link>
              <p className="mt-4 text-center text-xs text-gray-400">Thanh toán COD, kiểm tra hàng khi nhận.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
