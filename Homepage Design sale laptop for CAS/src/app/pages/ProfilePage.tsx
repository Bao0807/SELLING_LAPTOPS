import { useEffect, useState } from "react";
import { Lock, Mail, Package, Phone, User } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { customerApi, type AdminOrder } from "../utils/api";
import { formatPrice } from "../data/products";

const STATUS_LABELS: Record<AdminOrder["status"], string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  processing: "Đang xử lý",
  shipped: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};

export function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<"info" | "orders" | "password">("info");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({ fullName: user?.full_name || "", phone: user?.phone || "" });
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });

  const loadOrders = () => {
    setLoadingOrders(true);
    return customerApi.orders()
      .then(setOrders)
      .catch((error) => toast.error(error.message))
      .finally(() => setLoadingOrders(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    setProfile({ fullName: user?.full_name || "", phone: user?.phone || "" });
  }, [user]);

  const saveProfile = async () => {
    const result = await updateProfile(profile.fullName.trim(), profile.phone.trim());
    if (result.success) {
      toast.success(result.message);
      setEditMode(false);
    } else {
      toast.error(result.message);
    }
  };

  const changePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (passwords.next.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }
    if (passwords.next !== passwords.confirm) {
      toast.error("Mật khẩu mới không khớp");
      return;
    }
    try {
      await customerApi.changePassword(passwords.current, passwords.next);
      toast.success("Đã đổi mật khẩu");
      setPasswords({ current: "", next: "", confirm: "" });
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const cancelOrder = async (id: number) => {
    try {
      await customerApi.cancelOrder(id);
      toast.success("Đã hủy đơn hàng");
      loadOrders();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div style={{ paddingTop: "140px", minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
        <h1 className="mb-8 text-2xl font-bold text-gray-900">Tài khoản của tôi</h1>
        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="lg:w-64">
            <div className="mb-3 rounded-2xl border border-gray-100 bg-white p-6 text-center">
              <img src={user?.avatar || `https://i.pravatar.cc/120?u=${user?.email}`} alt={user?.full_name} className="mx-auto mb-3 h-20 w-20 rounded-full object-cover" />
              <div className="font-bold">{user?.full_name}</div>
              <div className="text-xs text-gray-400">{user?.email}</div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
              {[
                { key: "info" as const, label: "Thông tin", icon: User },
                { key: "orders" as const, label: "Đơn hàng", icon: Package },
                { key: "password" as const, label: "Mật khẩu", icon: Lock },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)} className="flex w-full items-center gap-2.5 px-4 py-3.5 text-sm" style={{ color: activeTab === tab.key ? "#2563eb" : "#374151", backgroundColor: activeTab === tab.key ? "#eff6ff" : "transparent", fontWeight: activeTab === tab.key ? 600 : 400 }}>
                    <Icon size={16} /> {tab.label}
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="flex-1">
            {activeTab === "info" && (
              <div className="rounded-2xl border border-gray-100 bg-white p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-lg font-bold">Thông tin cá nhân</h2>
                  <button onClick={() => setEditMode(!editMode)} className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm text-blue-700">{editMode ? "Hủy" : "Chỉnh sửa"}</button>
                </div>
                <div className="space-y-5">
                  <ProfileInput label="Họ tên" icon={User} disabled={!editMode} value={profile.fullName} onChange={(value) => setProfile({ ...profile, fullName: value })} />
                  <ProfileInput label="Email" icon={Mail} disabled value={user?.email || ""} onChange={() => null} />
                  <ProfileInput label="Số điện thoại" icon={Phone} disabled={!editMode} value={profile.phone} onChange={(value) => setProfile({ ...profile, phone: value })} />
                </div>
                {editMode && <button onClick={saveProfile} className="mt-6 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white">Lưu thay đổi</button>}
              </div>
            )}

            {activeTab === "orders" && (
              <div className="space-y-4">
                {loadingOrders && <div className="rounded-2xl bg-white p-8 text-center text-sm text-gray-500">Đang tải đơn hàng...</div>}
                {!loadingOrders && orders.length === 0 && <div className="rounded-2xl bg-white p-8 text-center text-sm text-gray-500">Bạn chưa có đơn hàng.</div>}
                {orders.map((order) => (
                  <div key={order.id} className="rounded-2xl border border-gray-100 bg-white p-5">
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <div className="text-sm font-semibold">#{order.id}</div>
                        <div className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString("vi-VN")}</div>
                      </div>
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">{STATUS_LABELS[order.status]}</span>
                    </div>
                    {order.items?.map((item, index) => (
                      <div key={`${order.id}-${index}`} className="flex justify-between border-t border-gray-50 py-2 text-sm">
                        <span>{item.product?.name} x {item.quantity}</span>
                        <span>{formatPrice(Number(item.price_at_purchase) * item.quantity)}</span>
                      </div>
                    ))}
                    <div className="mt-2 space-y-1 border-t border-gray-100 pt-3 text-sm">
                      <div className="flex justify-between text-gray-500"><span>Tạm tính</span><span>{formatPrice(Number(order.subtotal_amount || 0))}</span></div>
                      <div className="flex justify-between text-gray-500"><span>Vận chuyển</span><span>{Number(order.shipping_fee || 0) === 0 ? "Miễn phí" : formatPrice(Number(order.shipping_fee))}</span></div>
                      {Number(order.discount_amount || 0) > 0 && <div className="flex justify-between text-green-600"><span>Giảm giá</span><span>-{formatPrice(Number(order.discount_amount))}</span></div>}
                      <div className="flex justify-between pt-2 font-bold"><span>Tổng đơn hàng</span><span className="text-blue-600">{formatPrice(Number(order.total_amount))}</span></div>
                    </div>
                    {["pending", "confirmed", "processing"].includes(order.status) && <button onClick={() => cancelOrder(order.id)} className="mt-3 rounded-lg border px-3 py-1.5 text-sm text-red-600">Hủy đơn</button>}
                  </div>
                ))}
              </div>
            )}

            {activeTab === "password" && (
              <form onSubmit={changePassword} className="rounded-2xl border border-gray-100 bg-white p-6">
                <h2 className="mb-6 text-lg font-bold">Đổi mật khẩu</h2>
                {[
                  { label: "Mật khẩu hiện tại", key: "current" as const },
                  { label: "Mật khẩu mới", key: "next" as const },
                  { label: "Xác nhận mật khẩu mới", key: "confirm" as const },
                ].map((field) => (
                  <div key={field.key} className="mb-4">
                    <label className="mb-1.5 block text-sm text-gray-700">{field.label}</label>
                    <input type="password" value={passwords[field.key]} onChange={(event) => setPasswords({ ...passwords, [field.key]: event.target.value })} className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none" />
                  </div>
                ))}
                <button className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white">Cập nhật mật khẩu</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileInput({
  label,
  icon: Icon,
  disabled,
  value,
  onChange,
}: {
  label: string;
  icon: typeof User;
  disabled?: boolean;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm text-gray-600">{label}</label>
      <div className="relative">
        <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input disabled={disabled} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border-2 border-gray-200 py-3 pl-10 pr-4 text-sm disabled:bg-gray-50" />
      </div>
    </div>
  );
}
