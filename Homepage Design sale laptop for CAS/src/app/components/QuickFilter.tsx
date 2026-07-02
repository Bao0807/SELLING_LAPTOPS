import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

type FilterGroup = {
  label: string;
  key: string;
  options: string[];
};

const filterGroups: FilterGroup[] = [
  {
    label: "Hãng",
    key: "brand",
    options: ["ASUS", "Acer", "MSI", "Dell", "HP", "Lenovo"],
  },
  {
    label: "Giá",
    key: "price",
    options: ["Dưới 10 triệu", "10–20 triệu", "20–30 triệu", "Trên 30 triệu"],
  },
  {
    label: "RAM",
    key: "ram",
    options: ["8GB", "16GB", "32GB"],
  },
  {
    label: "Nhu cầu",
    key: "use",
    options: ["Học tập", "Văn phòng", "Gaming", "Đồ họa"],
  },
];

type ActiveFilters = Record<string, string[]>;

export function QuickFilter() {
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const toggleFilter = (key: string, value: string) => {
    setActiveFilters((prev) => {
      const current = prev[key] || [];
      const exists = current.includes(value);
      return {
        ...prev,
        [key]: exists ? current.filter((v) => v !== value) : [...current, value],
      };
    });
  };

  const isActive = (key: string, value: string) => (activeFilters[key] || []).includes(value);

  const totalActive = Object.values(activeFilters).flat().length;

  const clearAll = () => setActiveFilters({});

  return (
    <div
      className="py-5 px-4 lg:px-8 border-b sticky top-[120px] z-30"
      style={{ backgroundColor: "#f8fafc" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          {/* Filter icon + label */}
          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal size={18} style={{ color: "#2563eb" }} />
            <span className="text-sm text-gray-600 hidden sm:block" style={{ fontWeight: 600 }}>
              Lọc nhanh:
            </span>
          </div>

          {/* Desktop filter pills */}
          <div className="hidden md:flex items-center gap-4 flex-wrap flex-1">
            {filterGroups.map((group) => (
              <div key={group.key} className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{group.label}:</span>
                <div className="flex gap-1.5 flex-wrap">
                  {group.options.map((opt) => {
                    const active = isActive(group.key, opt);
                    return (
                      <button
                        key={opt}
                        onClick={() => toggleFilter(group.key, opt)}
                        className="px-3 py-1 rounded-lg text-xs transition-all duration-200 border"
                        style={{
                          backgroundColor: active ? "#2563eb" : "#fff",
                          color: active ? "#fff" : "#374151",
                          borderColor: active ? "#2563eb" : "#e5e7eb",
                          fontWeight: active ? 600 : 400,
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Mobile filter button */}
          <button
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm transition-all"
            style={{ borderColor: "#2563eb", color: "#2563eb" }}
            onClick={() => setShowMobileFilter(!showMobileFilter)}
          >
            <SlidersHorizontal size={14} />
            Bộ lọc {totalActive > 0 && `(${totalActive})`}
          </button>

          {/* Clear all */}
          {totalActive > 0 && (
            <button
              onClick={clearAll}
              className="ml-auto flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors shrink-0"
            >
              <X size={14} />
              Xóa bộ lọc ({totalActive})
            </button>
          )}
        </div>

        {/* Mobile filter panel */}
        {showMobileFilter && (
          <div className="md:hidden mt-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
            {filterGroups.map((group) => (
              <div key={group.key} className="mb-4 last:mb-0">
                <div className="text-sm mb-2" style={{ color: "#374151", fontWeight: 600 }}>
                  {group.label}
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.options.map((opt) => {
                    const active = isActive(group.key, opt);
                    return (
                      <button
                        key={opt}
                        onClick={() => toggleFilter(group.key, opt)}
                        className="px-3 py-1.5 rounded-lg text-xs transition-all duration-200 border"
                        style={{
                          backgroundColor: active ? "#2563eb" : "#f9fafb",
                          color: active ? "#fff" : "#374151",
                          borderColor: active ? "#2563eb" : "#e5e7eb",
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Active filter tags */}
        {totalActive > 0 && (
          <div className="hidden md:flex items-center gap-2 mt-3 flex-wrap">
            <span className="text-xs text-gray-400">Đang lọc:</span>
            {Object.entries(activeFilters).flatMap(([key, values]) =>
              values.map((val) => (
                <span
                  key={`${key}-${val}`}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs text-white"
                  style={{ backgroundColor: "#2563eb" }}
                >
                  {val}
                  <button onClick={() => toggleFilter(key, val)}>
                    <X size={12} />
                  </button>
                </span>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
