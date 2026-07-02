import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { CheckCircle, MapPin, Phone, ShoppingBag, User } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../data/products";
import { customerApi } from "../utils/api";

export function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [voucher, setVoucher] = useState("");
  const [discount, setDiscount] = useState(0);
  const [voucherApplied, setVoucherApplied] = useState(false);
  const [form, setForm] = useState({ fullName: user?.full_name || "", phone: user?.phone || "", address: "", city: "", note: "" });

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      fullName: prev.fullName || user?.full_name || "",
      phone: prev.phone || user?.phone || "",
    }));
  }, [user]);

  const shippingFee = totalPrice >= 5000000 ? 0 : 50000;
  const estimatedTotal = Math.max(0, totalPrice + shippingFee - discount);

  const applyVoucher = async () => {
    const code = voucher.trim().toUpperCase();
    if (!code) return;
    try {
      const data = await customerApi.validateVoucher(code, totalPrice);
      const nextDiscount = data.discount_type === "percent" ? Math.round(totalPrice * data.discount_value / 100) : data.discount_value;
      setDiscount(Math.min(nextDiscount, totalPrice));
      setVoucher(code);
      setVoucherApplied(true);
      toast.success("Voucher hợp lệ");
    } catch (error: any) {
      setDiscount(0);
      setVoucherApplied(false);
      toast.error(error.message);
    }
  };

  const placeOrder = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.fullName.trim() || !form.phone.trim() || !form.address.trim() || !form.city.trim()) {
      toast.error("Vui lòng nhập đủ thông tin giao hàng");
      return;
    }

    setSubmitting(true);
    try {
      const code = voucher.trim().toUpperCase();
      if (code) await customerApi.validateVoucher(code, totalPrice);

      const order = await customerApi.createOrder({
        payment_method: "cod",
        full_name: form.fullName.trim(),
        phone: form.phone.trim(),
        shipping_address: `${form.address.trim()}, ${form.city.trim()}${form.note.trim() ? ` - ${form.note.trim()}` : ""}`,
        voucher_code: code || undefined,
      });
      await clearCart();
      toast.success(`Đặt hàng thành công #${order.id} - ${formatPrice(Number(order.total_amount))}`);
      navigate("/profile");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ paddingTop: "140px", minHeight: "100vh", backgroundColor: "#f8fafc" }} className="flex flex-col items-center justify-center">
        <ShoppingBag size={48} className="mx-auto mb-4 text-gray-300" />
        <h2 className="mb-2 text-xl font-bold text-gray-700">Giỏ hàng trống</h2>
        <Link to="/products" className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white">Mua sắm ngay</Link>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: "140px", minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
        <div className="mb-8 flex items-center gap-2 text-sm">
          <CheckCircle size={18} className="text-green-600" />
          <span className="font-medium text-blue-600">Thanh toán COD</span>
        </div>

        <form onSubmit={placeOrder} className="flex flex-col gap-8 lg:flex-row">
          <div className="flex-1 space-y-6">
            <div className="rounded-2xl border border-gray-100 bg-white p-6">
              <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-gray-900"><MapPin size={20} color="#2563eb" /> Thông tin giao hàng</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} placeholder="Họ và tên" className="w-full rounded-xl border-2 border-gray-200 py-3 pl-9 pr-4 text-sm focus:border-blue-500 focus:outline-none" />
                </div>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="Số điện thoại" className="w-full rounded-xl border-2 border-gray-200 py-3 pl-9 pr-4 text-sm focus:border-blue-500 focus:outline-none" />
                </div>
                <input value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} placeholder="Địa chỉ" className="rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none sm:col-span-2" />
                <input value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} placeholder="Tỉnh / thành phố" className="rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none" />
                <input value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} placeholder="Ghi chú" className="rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none" />
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6">
              <h2 className="mb-3 text-lg font-bold">Phương thức thanh toán</h2>
              <label className="flex items-center gap-3 rounded-xl bg-blue-50 p-4 text-sm font-medium text-blue-700">
                <input type="radio" checked readOnly /> Thanh toán khi nhận hàng (COD)
              </label>
            </div>
          </div>

          <div className="lg:w-96">
            <div className="sticky top-40 rounded-2xl border border-gray-100 bg-white p-6">
              <h2 className="mb-5 text-lg font-bold">Tóm tắt đơn hàng</h2>
              <div className="mb-5 max-h-64 space-y-3 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <img src={item.product.image} alt={item.product.name} className="h-12 w-14 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-xs font-medium">{item.product.name}</p>
                      <p className="text-xs text-gray-400">x{item.quantity}</p>
                    </div>
                    <span className="text-xs font-semibold">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="mb-4 flex gap-2">
                <input
                  value={voucher}
                  onChange={(event) => {
                    setVoucher(event.target.value.toUpperCase());
                    setDiscount(0);
                    setVoucherApplied(false);
                  }}
                  placeholder="Mã voucher"
                  className="min-w-0 flex-1 rounded-md border px-3 py-2 text-sm"
                />
                <button type="button" onClick={applyVoucher} className="rounded-md border px-3 py-2 text-sm">Áp dụng</button>
              </div>
              {voucherApplied && <div className="mb-3 rounded-md bg-green-50 px-3 py-2 text-xs text-green-700">Voucher đã được áp dụng. Hệ thống sẽ kiểm tra lại khi đặt hàng.</div>}

              <div className="mb-5 space-y-2 border-t border-gray-100 pt-4 text-sm">
                <div className="flex justify-between"><span>Tạm tính</span><span>{formatPrice(totalPrice)}</span></div>
                <div className="flex justify-between"><span>Vận chuyển</span><span>{shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}</span></div>
                {discount > 0 && <div className="flex justify-between text-green-600"><span>Giảm giá</span><span>-{formatPrice(discount)}</span></div>}
                <div className="flex justify-between border-t pt-2 text-base font-bold"><span>Tổng dự kiến</span><span className="text-blue-600">{formatPrice(estimatedTotal)}</span></div>
              </div>

              <button disabled={submitting} className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white disabled:opacity-60">
                {submitting ? "Đang đặt hàng..." : "Đặt hàng ngay"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
