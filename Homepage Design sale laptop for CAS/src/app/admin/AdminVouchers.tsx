import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminCard } from "./AdminLayout";
import { adminApi, type AdminVoucher } from "../utils/api";
import { formatPrice } from "../data/products";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";

const empty = {
  code: "",
  discount_type: "percent" as AdminVoucher["discount_type"],
  discount_value: 0,
  minimum_order_amount: 0,
  usage_limit: 0,
  start_date: "",
  end_date: "",
  status: "active" as AdminVoucher["status"],
};

export function AdminVouchers() {
  const [vouchers, setVouchers] = useState<AdminVoucher[]>([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    return adminApi.vouchers().then(setVouchers).catch((error) => toast.error(error.message)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const payload = { ...form, start_date: new Date(form.start_date), end_date: new Date(form.end_date) } as any;
      if (editingId) await adminApi.updateVoucher(editingId, payload);
      else await adminApi.createVoucher(payload);
      toast.success("Đã lưu voucher");
      setForm(empty);
      setEditingId(null);
      load();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const remove = async (id: number) => {
    await adminApi.deleteVoucher(id);
    toast.success("Đã xóa voucher");
    setDeleteId(null);
    await load();
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Voucher</h1><p className="text-sm text-slate-500">Quản lý mã giảm giá.</p></div>
      <AdminCard>
        <form onSubmit={submit} className="grid gap-3 md:grid-cols-4">
          <input required value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value.toUpperCase() })} placeholder="Code" className="rounded-md border px-3 py-2 text-sm" />
          <select value={form.discount_type} onChange={(event) => setForm({ ...form, discount_type: event.target.value as AdminVoucher["discount_type"] })} className="rounded-md border px-3 py-2 text-sm"><option value="percent">Phần trăm</option><option value="fixed">Số tiền</option></select>
          <input type="number" min={1} value={form.discount_value} onChange={(event) => setForm({ ...form, discount_value: Number(event.target.value) })} placeholder="Giá trị" className="rounded-md border px-3 py-2 text-sm" />
          <input type="number" min={0} value={form.minimum_order_amount} onChange={(event) => setForm({ ...form, minimum_order_amount: Number(event.target.value) })} placeholder="Đơn tối thiểu" className="rounded-md border px-3 py-2 text-sm" />
          <input type="number" min={0} value={form.usage_limit} onChange={(event) => setForm({ ...form, usage_limit: Number(event.target.value) })} placeholder="Giới hạn" className="rounded-md border px-3 py-2 text-sm" />
          <input required type="date" value={form.start_date} onChange={(event) => setForm({ ...form, start_date: event.target.value })} className="rounded-md border px-3 py-2 text-sm" />
          <input required type="date" value={form.end_date} onChange={(event) => setForm({ ...form, end_date: event.target.value })} className="rounded-md border px-3 py-2 text-sm" />
          <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as AdminVoucher["status"] })} className="rounded-md border px-3 py-2 text-sm"><option value="active">Hoạt động</option><option value="inactive">Tạm tắt</option></select>
          <button className="rounded-md bg-blue-700 px-4 py-2 text-sm text-white md:col-span-4">{editingId ? "Lưu voucher" : "Thêm voucher"}</button>
        </form>
      </AdminCard>
      <AdminCard className="overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">Đang tải voucher...</div>
        ) : vouchers.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">Chưa có voucher.</div>
        ) : (
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b text-xs uppercase text-slate-500"><tr><th className="py-3">Code</th><th>Giảm</th><th>Điều kiện</th><th>Đã dùng</th><th>Trạng thái</th><th className="text-right">Thao tác</th></tr></thead>
            <tbody>{vouchers.map((voucher) => (
              <tr key={voucher.id} className="border-b last:border-0">
                <td className="py-3 font-semibold">{voucher.code}</td>
                <td>{voucher.discount_type === "percent" ? `${voucher.discount_value}%` : formatPrice(voucher.discount_value)}</td>
                <td>{formatPrice(voucher.minimum_order_amount)}</td>
                <td>{voucher.used_count}/{voucher.usage_limit || "∞"}</td>
                <td>{voucher.status === "active" ? "Hoạt động" : "Tạm tắt"}</td>
                <td className="text-right">
                  <button onClick={() => { setEditingId(voucher.id); setForm({ ...voucher, start_date: voucher.start_date.slice(0, 10), end_date: voucher.end_date.slice(0, 10) }); }} className="mr-2 rounded-md border px-3 py-1.5">Sửa</button>
                  <button onClick={() => setDeleteId(voucher.id)} className="rounded-md border px-3 py-1.5 text-red-600">Xóa</button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </AdminCard>
      <ConfirmDialog
        open={deleteId !== null}
        title="Xóa voucher?"
        description="Voucher đã dùng trong đơn hàng lịch sử có thể không xóa được do ràng buộc dữ liệu."
        confirmLabel="Xóa"
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId !== null && remove(deleteId).catch((error) => toast.error(error.message))}
      />
    </div>
  );
}
