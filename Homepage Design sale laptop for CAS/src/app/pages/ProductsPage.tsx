import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { toast } from "sonner";
import { ProductCard } from "../components/ui/ProductCard";
import { BRANDS, PRICE_RANGES, type Product } from "../data/products";
import { publicApi, type AdminCategory, type Pagination } from "../utils/api";

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [localSearch, setLocalSearch] = useState(searchParams.get("q") || "");
  const [showFilters, setShowFilters] = useState(false);

  const category = searchParams.get("category") || "";
  const brand = searchParams.get("brand") || "";
  const price = searchParams.get("price") || "";
  const sort = searchParams.get("sort") || "newest";
  const q = searchParams.get("q") || "";
  const discount = searchParams.get("discount") === "true";
  const page = Number(searchParams.get("page") || 1);

  useEffect(() => {
    publicApi.categories().then(setCategories).catch(() => null);
  }, []);

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    if (key !== "page") params.set("page", "1");
    setSearchParams(params);
  };

  useEffect(() => {
    const params: Record<string, string | number | boolean | undefined> = { page, limit: 12, category, brand, sort, q };
    if (discount) params.discount = true;
    if (price) {
      const range = PRICE_RANGES[Number(price)];
      if (range) {
        params.minPrice = range.min;
        if (Number.isFinite(range.max)) params.maxPrice = range.max;
      }
    }

    setLoading(true);
    publicApi.products(params)
      .then((data) => {
        setProducts(data.products);
        setPagination(data.pagination);
      })
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false));
  }, [brand, category, discount, page, price, q, sort]);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setParam("q", localSearch.trim());
  };

  const clearFilters = () => {
    setSearchParams({});
    setLocalSearch("");
  };

  return (
    <div style={{ paddingTop: "140px", minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="mb-6">
          <h1 className="mb-1 text-2xl font-bold text-gray-900">Tất cả sản phẩm</h1>
          <p className="text-sm text-gray-500">
            Tìm thấy <span className="font-semibold text-blue-600">{pagination?.total || products.length}</span> sản phẩm
          </p>
        </div>

        <div className="mb-6 flex gap-3">
          <form onSubmit={submitSearch} className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={localSearch}
              onChange={(event) => setLocalSearch(event.target.value)}
              placeholder="Tìm laptop, hãng, CPU, RAM..."
              className="w-full rounded-xl border-2 border-gray-200 bg-white py-3 pl-10 pr-28 text-sm focus:border-blue-500 focus:outline-none"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-blue-600 px-4 py-1.5 text-sm text-white">
              Tìm
            </button>
          </form>
          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 rounded-xl border-2 bg-white px-4 py-3 text-sm lg:hidden">
            <SlidersHorizontal size={16} /> Lọc
          </button>
        </div>

        {(q || brand || price || category || discount) && (
          <div className="mb-5 flex flex-wrap gap-2">
            {[q && `Từ khóa: ${q}`, brand && `Hãng: ${brand}`, price && PRICE_RANGES[Number(price)]?.label, category && `Danh mục: ${categories.find((item) => item.slug === category)?.name || category}`, discount && "Đang giảm giá"].filter(Boolean).map((label) => (
              <span key={String(label)} className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">{label}</span>
            ))}
            <button onClick={clearFilters} className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
              <X size={12} /> Xóa lọc
            </button>
          </div>
        )}

        <div className="flex gap-6">
          <aside className={`w-64 shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="rounded-md border border-gray-100 bg-white p-4">
              <div className="mb-4 text-sm font-semibold">Bộ lọc</div>
              <label className="mb-1 block text-xs font-medium text-gray-500">Danh mục</label>
              <select value={category} onChange={(event) => setParam("category", event.target.value)} className="mb-4 w-full rounded-md border px-3 py-2 text-sm">
                <option value="">Tất cả</option>
                {categories.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}
              </select>
              <label className="mb-1 block text-xs font-medium text-gray-500">Hãng</label>
              <select value={brand} onChange={(event) => setParam("brand", event.target.value)} className="mb-4 w-full rounded-md border px-3 py-2 text-sm">
                <option value="">Tất cả</option>
                {BRANDS.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              <label className="mb-1 block text-xs font-medium text-gray-500">Giá</label>
              <select value={price} onChange={(event) => setParam("price", event.target.value)} className="mb-4 w-full rounded-md border px-3 py-2 text-sm">
                <option value="">Tất cả</option>
                {PRICE_RANGES.map((item, index) => <option key={item.label} value={index}>{item.label}</option>)}
              </select>
              <label className="mb-1 flex items-center gap-2 text-xs font-medium text-gray-500">
                <input type="checkbox" checked={discount} onChange={(event) => setParam("discount", event.target.checked ? "true" : "")} />
                Chỉ sản phẩm giảm giá
              </label>
              <label className="mb-1 mt-4 block text-xs font-medium text-gray-500">Sắp xếp</label>
              <select value={sort} onChange={(event) => setParam("sort", event.target.value)} className="w-full rounded-md border px-3 py-2 text-sm">
                <option value="newest">Mới nhất</option>
                <option value="price_asc">Giá tăng dần</option>
                <option value="price_desc">Giá giảm dần</option>
                <option value="name_asc">Tên A-Z</option>
              </select>
            </div>
          </aside>

          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-80 animate-pulse rounded-2xl bg-white" />)}
              </div>
            ) : products.length === 0 ? (
              <div className="rounded-md bg-white py-20 text-center">
                <h3 className="mb-2 text-xl font-semibold text-gray-700">Không tìm thấy sản phẩm</h3>
                <button onClick={clearFilters} className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm text-white">Xóa bộ lọc</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
            )}

            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                {Array.from({ length: pagination.totalPages }).map((_, index) => {
                  const nextPage = index + 1;
                  return (
                    <button
                      key={nextPage}
                      onClick={() => setParam("page", String(nextPage))}
                      className="h-9 min-w-9 rounded-md border px-3 text-sm"
                      style={{ backgroundColor: pagination.page === nextPage ? "#2563eb" : "#fff", color: pagination.page === nextPage ? "#fff" : "#334155" }}
                    >
                      {nextPage}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
