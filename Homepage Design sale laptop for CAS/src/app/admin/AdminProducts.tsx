import { useEffect, useState } from "react";
import { Edit, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminCard } from "./AdminLayout";
import { adminApi, type AdminCategory, type AdminProductForm } from "../utils/api";
import { formatPrice } from "../data/products";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";

const emptyForm = {
  name: "",
  slug: "",
  brand: "",
  category_id: "",
  price: "",
  discount_price: "",
  stock_quantity: "",
  cpu: "",
  ram: "",
  storage: "",
  gpu: "",
  display: "",
  battery: "",
  weight: "",
  description: "",
  is_featured: false,
  image: null as File | null,
};

export function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [form, setForm] = useState({ ...emptyForm });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [productData, categoryData] = await Promise.all([
        adminApi.products({ q, limit: 100 }),
        adminApi.categories(),
      ]);
      setProducts(productData.rawProducts);
      setCategories(categoryData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load().catch((error) => toast.error(error.message));
  }, []);

  const reset = () => {
    setForm({ ...emptyForm });
    setEditingId(null);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload: AdminProductForm = { ...form };
    try {
      if (editingId) {
        await adminApi.updateProduct(editingId, payload);
        toast.success("Da cap nhat san pham");
      } else {
        await adminApi.createProduct(payload);
        toast.success("Da tao san pham");
      }
      reset();
      await load();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const edit = (product: any) => {
    setEditingId(product.id);
    setForm({
      name: product.name || "",
      slug: product.slug || "",
      brand: product.brand || "",
      category_id: String(product.category_id || ""),
      price: String(product.price || ""),
      discount_price: String(product.discount_price || ""),
      stock_quantity: String(product.stock_quantity || ""),
      cpu: product.cpu || "",
      ram: product.ram || "",
      storage: product.storage || "",
      gpu: product.gpu || "",
      display: product.display || "",
      battery: product.battery || "",
      weight: product.weight || "",
      description: product.description || "",
      is_featured: Boolean(product.is_featured),
      image: null,
    });
  };

  const remove = async (id: number) => {
    await adminApi.deleteProduct(id);
    toast.success("Đã xóa sản phẩm");
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold">Sản phẩm</h1>
          <p className="text-sm text-slate-500">Thêm, sửa, xóa laptop và thông số kỹ thuật.</p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); load().catch((error) => toast.error(error.message)); }} className="flex gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm sản phẩm" className="rounded-md border border-slate-200 px-3 py-2 text-sm" />
          <button className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white">Tìm</button>
        </form>
      </div>

      <AdminCard>
        <form onSubmit={submit} className="grid gap-3 lg:grid-cols-4">
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Tên sản phẩm" className="rounded-md border px-3 py-2 text-sm" />
          <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="slug" className="rounded-md border px-3 py-2 text-sm" />
          <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="Hang" className="rounded-md border px-3 py-2 text-sm" />
          <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="rounded-md border px-3 py-2 text-sm">
            <option value="">Danh mục</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
          <input required type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Giá" className="rounded-md border px-3 py-2 text-sm" />
          <input type="number" value={form.discount_price} onChange={(e) => setForm({ ...form, discount_price: e.target.value })} placeholder="Giá giảm" className="rounded-md border px-3 py-2 text-sm" />
          <input type="number" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} placeholder="Tồn kho" className="rounded-md border px-3 py-2 text-sm" />
          <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })} className="rounded-md border px-3 py-2 text-sm" />
          {["cpu", "ram", "storage", "gpu", "display", "battery", "weight"].map((field) => (
            <input key={field} value={(form as any)[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} placeholder={field} className="rounded-md border px-3 py-2 text-sm" />
          ))}
          <label className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} />
            Nổi bật
          </label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Mô tả" className="min-h-20 rounded-md border px-3 py-2 text-sm lg:col-span-4" />
          <div className="flex gap-2 lg:col-span-4">
            <button className="inline-flex items-center gap-2 rounded-md bg-blue-700 px-4 py-2 text-sm text-white"><Plus size={16} />{editingId ? "Lưu sản phẩm" : "Thêm sản phẩm"}</button>
            {editingId && <button type="button" onClick={reset} className="rounded-md border px-4 py-2 text-sm">Hủy</button>}
          </div>
        </form>
      </AdminCard>

      <AdminCard className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b text-xs uppercase text-slate-500">
            <tr><th className="py-3">Sản phẩm</th><th>Hãng</th><th>Giá</th><th>Tồn</th><th>Nổi bật</th><th className="text-right">Thao tác</th></tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6} className="py-8 text-center text-slate-500">Đang tải sản phẩm...</td></tr>}
            {!loading && products.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-slate-500">Không có sản phẩm phù hợp.</td></tr>}
            {products.map((product) => (
              <tr key={product.id} className="border-b last:border-0">
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <img src={product.thumbnail || "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=80"} className="h-12 w-14 rounded object-cover" />
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-xs text-slate-500">{product.category?.name}</div>
                    </div>
                  </div>
                </td>
                <td>{product.brand}</td>
                <td>{formatPrice(Number(product.discount_price || product.price))}</td>
                <td>{product.stock_quantity}</td>
                <td>{product.is_featured ? "Có" : "Không"}</td>
                <td className="text-right">
                  <button onClick={() => edit(product)} className="mr-2 rounded-md border p-2 text-blue-700"><Edit size={15} /></button>
                  <button onClick={() => setDeleteId(product.id)} className="rounded-md border p-2 text-red-600"><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminCard>
      <ConfirmDialog
        open={deleteId !== null}
        title="Xóa sản phẩm?"
        description="Sản phẩm sẽ bị xóa khỏi danh sách bán. Thao tác này không nên thực hiện nếu sản phẩm đã có đơn hàng lịch sử."
        confirmLabel="Xóa"
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId === null) return;
          remove(deleteId).then(() => setDeleteId(null)).catch((error) => toast.error(error.message));
        }}
      />
    </div>
  );
}
