import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminCard } from "./AdminLayout";
import { adminApi, type AdminOrder } from "../utils/api";
import { formatPrice } from "../data/products";

const statusLabels: Record<AdminOrder["status"], string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  processing: "Đang xử lý",
  shipped: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};

const nextStatuses: Record<AdminOrder["status"], AdminOrder["status"][]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

const statuses = Object.keys(statusLabels) as AdminOrder["status"][];

export function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  const load = () => {
    setLoading(true);
    return adminApi.orders({ status, q, limit: 100 })
      .then((data) => setOrders(data.orders))
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [status]);

  const updateStatus = async (id: number, nextStatus: AdminOrder["status"]) => {
    const updated = await adminApi.updateOrderStatus(id, nextStatus);
    toast.success("Đã cập nhật đơn hàng");
    setSelectedOrder((current) => current?.id === id ? { ...current, status: updated.status } : current);
    load();
  };

  const openOrder = async (id: number) => {
    try {
      setSelectedOrder(await adminApi.order(id));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 xl:flex-row xl:items-end">
        <div>
          <h1 className="text-2xl font-bold">Đơn hàng</h1>
          <p className="text-sm text-slate-500">Theo dõi và cập nhật trạng thái theo đúng vòng đời đơn.</p>
        </div>
        <form onSubmit={(event) => { event.preventDefault(); load(); }} className="flex flex-wrap gap-2">
          <input value={q} onChange={(event) => setQ(event.target.value)} placeholder="Tìm mã đơn, khách, SĐT" className="h-10 rounded-md border px-3 text-sm" />
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-10 rounded-md border px-3 text-sm">
            <option value="">Tất cả trạng thái</option>
            {statuses.map((item) => <option key={item} value={item}>{statusLabels[item]}</option>)}
          </select>
          <button className="h-10 rounded-md bg-slate-900 px-3 text-sm text-white">Lọc</button>
        </form>
      </div>

      <AdminCard className="overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">Đang tải đơn hàng...</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">Không có đơn hàng phù hợp.</div>
        ) : (
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="border-b text-xs uppercase text-slate-500">
              <tr><th className="py-3">Mã</th><th>Khách</th><th>Sản phẩm</th><th>Tổng</th><th>Trạng thái</th><th>Ngày</th><th className="text-right">Chi tiết</th></tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const allowedStatuses = nextStatuses[order.status];
                return (
                  <tr key={order.id} className="border-b align-top last:border-0">
                    <td className="py-3 font-semibold">#{order.id}</td>
                    <td><div>{order.full_name}</div><div className="text-xs text-slate-500">{order.phone}</div></td>
                    <td>{order.items?.slice(0, 3).map((item) => <div key={`${order.id}-${item.product?.name}`}>{item.product?.name} x {item.quantity}</div>)}</td>
                    <td>{formatPrice(Number(order.total_amount))}</td>
                    <td>
                      <select
                        value=""
                        disabled={allowedStatuses.length === 0}
                        onChange={(event) => event.target.value && updateStatus(order.id, event.target.value as AdminOrder["status"]).catch((error) => toast.error(error.message))}
                        className="rounded-md border px-2 py-1 disabled:bg-slate-50 disabled:text-slate-400"
                      >
                        <option value="">{statusLabels[order.status]}</option>
                        {allowedStatuses.map((item) => <option key={item} value={item}>{statusLabels[item]}</option>)}
                      </select>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString("vi-VN")}</td>
                    <td className="text-right"><button onClick={() => openOrder(order.id)} className="rounded-md border px-3 py-1.5 text-blue-700">Xem</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </AdminCard>

      {selectedOrder && (
        <AdminCard>
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold">Chi tiết đơn #{selectedOrder.id}</h2>
              <p className="text-sm text-slate-500">{selectedOrder.full_name} - {selectedOrder.phone}</p>
              <p className="text-sm text-slate-500">{selectedOrder.shipping_address}</p>
            </div>
            <button onClick={() => setSelectedOrder(null)} className="rounded-md border px-3 py-1.5 text-sm">Đóng</button>
          </div>
          <div className="space-y-2 text-sm">
            {selectedOrder.items?.map((item, index) => (
              <div key={index} className="flex justify-between rounded-md bg-slate-50 p-3">
                <span>{item.product?.name} x {item.quantity}</span>
                <span>{formatPrice(Number(item.price_at_purchase) * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-2 text-sm sm:grid-cols-4">
            <SummaryItem label="Tạm tính" value={formatPrice(Number(selectedOrder.subtotal_amount || 0))} />
            <SummaryItem label="Vận chuyển" value={Number(selectedOrder.shipping_fee || 0) === 0 ? "Miễn phí" : formatPrice(Number(selectedOrder.shipping_fee))} />
            <SummaryItem label="Giảm giá" value={`-${formatPrice(Number(selectedOrder.discount_amount || 0))}`} />
            <SummaryItem label="Tổng" value={formatPrice(Number(selectedOrder.total_amount))} strong />
          </div>
        </AdminCard>
      )}
    </div>
  );
}

function SummaryItem({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="rounded-md bg-slate-50 p-3">
      <div className="text-xs text-slate-500">{label}</div>
      <div className={strong ? "font-bold text-blue-700" : "font-medium"}>{value}</div>
    </div>
  );
}
