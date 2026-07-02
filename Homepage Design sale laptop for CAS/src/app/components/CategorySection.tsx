import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { publicApi, type AdminCategory } from "../utils/api";

const icons = ["Gaming", "Office", "Student", "Creative", "MacBook", "Ultra", "Work"];
const colors = ["#7c3aed", "#2563eb", "#0891b2", "#d97706", "#64748b", "#059669", "#dc2626"];

export function CategorySection() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<AdminCategory[]>([]);

  useEffect(() => {
    publicApi.categories().then(setCategories).catch(() => null);
  }, []);

  return (
    <section className="py-16 px-4 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <span className="mb-3 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-600">Danh mục sản phẩm</span>
          <h2 className="text-gray-900" style={{ fontWeight: 700, fontSize: "1.75rem" }}>Chọn Laptop Theo Nhu Cầu</h2>
          <p className="mt-2 text-sm text-gray-500">Đa dạng danh mục, đáp ứng mọi nhu cầu của bạn</p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.slice(0, 10).map((category, index) => {
            const color = colors[index % colors.length];
            return (
              <button
                key={category.id}
                onClick={() => navigate(`/products?category=${category.slug}`)}
                className="group flex flex-col items-center rounded-2xl border border-transparent p-5 text-center transition-all hover:-translate-y-1 hover:shadow-lg"
                style={{ backgroundColor: `${color}10` }}
              >
                <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl text-sm font-bold transition-transform group-hover:scale-110" style={{ backgroundColor: `${color}18`, color }}>
                  {icons[index % icons.length]}
                </div>
                <span className="mb-1 text-sm font-semibold text-slate-800">{category.name}</span>
                <span className="text-xs text-gray-400">{category.description || "Laptop CAS"}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
