import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminCard } from "./AdminLayout";
import { adminApi, type AdminCategory } from "../utils/api";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";

const empty = { name: "", slug: "", description: "" };

export function AdminCategories() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    return adminApi.categories().then(setCategories).catch((error) => toast.error(error.message)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (editingId) await adminApi.updateCategory(editingId, form);
      else await adminApi.createCategory(form);
      toast.success("Da luu danh muc");
      setForm(empty);
      setEditingId(null);
      load();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Danh mục</h1><p className="text-sm text-slate-500">Quản lý nhóm sản phẩm.</p></div>
      <AdminCard>
        <form onSubmit={submit} className="grid gap-3 md:grid-cols-4">
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Tên danh mục" className="rounded-md border px-3 py-2 text-sm" />
          <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="slug" className="rounded-md border px-3 py-2 text-sm" />
          <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Mô tả" className="rounded-md border px-3 py-2 text-sm" />
          <button className="rounded-md bg-blue-700 px-4 py-2 text-sm text-white">{editingId ? "Lưu" : "Thêm"}</button>
        </form>
      </AdminCard>
      <AdminCard>
        <table className="w-full text-left text-sm">
          <thead className="border-b text-xs uppercase text-slate-500"><tr><th className="py-3">Tên</th><th>Slug</th><th>Mô tả</th><th className="text-right">Thao tác</th></tr></thead>
          <tbody>
            {loading && <tr><td colSpan={4} className="py-8 text-center text-slate-500">Đang tải danh mục...</td></tr>}
            {!loading && categories.length === 0 && <tr><td colSpan={4} className="py-8 text-center text-slate-500">Chưa có danh mục.</td></tr>}
            {categories.map((category) => (
              <tr key={category.id} className="border-b last:border-0">
                <td className="py-3 font-medium">{category.name}</td><td>{category.slug}</td><td>{category.description}</td>
                <td className="text-right">
                  <button onClick={() => { setEditingId(category.id); setForm({ name: category.name, slug: category.slug, description: category.description || "" }); }} className="mr-2 rounded-md border px-3 py-1.5">Sửa</button>
                  <button onClick={() => setDeleteId(category.id)} className="rounded-md border px-3 py-1.5 text-red-600">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminCard>
      <ConfirmDialog
        open={deleteId !== null}
        title="Xóa danh mục?"
        description="Danh mục chỉ được xóa khi chưa có sản phẩm liên kết."
        confirmLabel="Xóa"
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId === null) return;
          adminApi.deleteCategory(deleteId).then(() => { setDeleteId(null); load(); }).catch((error) => toast.error(error.message));
        }}
      />
    </div>
  );
}
