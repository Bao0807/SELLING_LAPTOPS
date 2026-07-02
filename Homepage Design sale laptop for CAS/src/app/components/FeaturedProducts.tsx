import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "./ui/ProductCard";
import { publicApi } from "../utils/api";
import type { Product } from "../data/products";

export function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState<"featured" | "bestsellers">("featured");
  const [featured, setFeatured] = useState<Product[]>([]);
  const [bestsellers, setBestsellers] = useState<Product[]>([]);

  useEffect(() => {
    Promise.all([publicApi.featured(), publicApi.bestsellers()])
      .then(([featuredRows, bestsellerRows]) => {
        setFeatured(featuredRows);
        setBestsellers(bestsellerRows);
      })
      .catch(() => null);
  }, []);

  const products = activeTab === "featured" ? featured : bestsellers;

  return (
    <section id="products" className="py-16 px-4 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="mb-3 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-600">Được yêu thích nhất</span>
            <h2 className="text-gray-900" style={{ fontWeight: 700, fontSize: "1.75rem" }}>Sản Phẩm Nổi Bật</h2>
          </div>
          <Link to="/products" className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
            Xem tất cả <ChevronRight size={16} />
          </Link>
        </div>

        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {[{ key: "featured", label: "Nổi bật" }, { key: "bestsellers", label: "Bán chạy" }].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as "featured" | "bestsellers")}
              className="shrink-0 rounded-xl border px-5 py-2 text-sm transition-all"
              style={{
                backgroundColor: activeTab === tab.key ? "#2563eb" : "#fff",
                color: activeTab === tab.key ? "#fff" : "#6b7280",
                borderColor: activeTab === tab.key ? "#2563eb" : "#e5e7eb",
                fontWeight: activeTab === tab.key ? 600 : 400,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.slice(0, 8).map((product) => <ProductCard key={product.id} product={product} />)}
        </div>

        <div className="mt-10 text-center">
          <Link to="/products" className="inline-block rounded-xl border-2 border-blue-600 px-8 py-3 text-sm text-blue-600 transition-all hover:bg-blue-50 hover:shadow-md">
            Xem thêm sản phẩm
          </Link>
        </div>
      </div>
    </section>
  );
}
