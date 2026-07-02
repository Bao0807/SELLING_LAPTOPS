const brands = [
  { name: "ASUS", logo: "ASUS", color: "#1a1a2e" },
  { name: "Acer", logo: "Acer", color: "#1e1e1e" },
  { name: "MSI", logo: "MSI", color: "#dc2626" },
  { name: "Dell", logo: "Dell", color: "#0076ce" },
  { name: "HP", logo: "HP", color: "#0096d6" },
  { name: "Lenovo", logo: "Lenovo", color: "#e2231a" },
  { name: "Apple", logo: "Apple", color: "#555" },
  { name: "Samsung", logo: "Samsung", color: "#1428a0" },
];

export function BrandBanner() {
  return (
    <section className="py-10 px-4 lg:px-8 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <p className="text-gray-400 text-sm">Phân phối chính hãng từ các thương hiệu hàng đầu</p>
        </div>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {brands.map((brand) => (
            <button
              key={brand.name}
              className="flex items-center justify-center px-6 py-3 rounded-xl border-2 border-transparent transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              style={{ backgroundColor: "#f8fafc", minWidth: "100px" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = brand.color + "30";
                e.currentTarget.style.backgroundColor = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "transparent";
                e.currentTarget.style.backgroundColor = "#f8fafc";
              }}
            >
              <span
                className="text-lg select-none"
                style={{ color: brand.color, fontWeight: 800, letterSpacing: "-0.02em" }}
              >
                {brand.logo}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
