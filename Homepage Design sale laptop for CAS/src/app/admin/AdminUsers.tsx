import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminCard } from "./AdminLayout";
import { adminApi, type AdminUser } from "../utils/api";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";

export function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    return adminApi.users({ q, limit: 100 })
      .then((data) => setUsers(data.users))
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: number) => {
    await adminApi.deleteUser(id);
    toast.success("Đã xóa người dùng");
    setDeleteId(null);
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold">Người dùng</h1>
          <p className="text-sm text-slate-500">Quản lý khách hàng và admin.</p>
        </div>
        <form onSubmit={(event) => { event.preventDefault(); load(); }} className="flex gap-2">
          <input value={q} onChange={(event) => setQ(event.target.value)} placeholder="Tìm người dùng" className="rounded-md border px-3 py-2 text-sm" />
          <button className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white">Tìm</button>
        </form>
      </div>

      <AdminCard className="overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">Đang tải người dùng...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">Không có người dùng phù hợp.</div>
        ) : (
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b text-xs uppercase text-slate-500">
              <tr><th className="py-3">Tên</th><th>Email</th><th>Phone</th><th>Role</th><th>Ngày tạo</th><th className="text-right">Thao tác</th></tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b last:border-0">
                  <td className="py-3 font-medium">{user.full_name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>
                    <select value={user.role} onChange={(event) => adminApi.updateUserRole(user.id, event.target.value as AdminUser["role"]).then(load).catch((error) => toast.error(error.message))} className="rounded-md border px-2 py-1">
                      <option value="customer">customer</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString("vi-VN")}</td>
                  <td className="text-right">
                    <button onClick={() => setDeleteId(user.id)} className="rounded-md border px-3 py-1.5 text-red-600">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </AdminCard>

      <ConfirmDialog
        open={deleteId !== null}
        title="Xóa người dùng?"
        description="Chỉ tài khoản khách hàng mới có thể bị xóa. Tài khoản admin được bảo vệ bởi backend."
        confirmLabel="Xóa"
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId !== null && remove(deleteId).catch((error) => toast.error(error.message))}
      />
    </div>
  );
}
