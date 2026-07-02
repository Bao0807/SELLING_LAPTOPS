const features = [
  {
    icon: "🚚",
    title: "Giao Hàng Toàn Quốc",
    desc: "Giao hàng nhanh toàn quốc trong 24–48h. Miễn phí giao hàng cho đơn từ 5 triệu đồng.",
    color: "#2563eb",
    bg: "#eff6ff",
  },
  {
    icon: "🛡️",
    title: "Bảo Hành Chính Hãng",
    desc: "Bảo hành chính hãng 12–24 tháng. Hỗ trợ đổi trả trong 7 ngày nếu lỗi nhà sản xuất.",
    color: "#10b981",
    bg: "#ecfdf5",
  },
  {
    icon: "💰",
    title: "Giá Cạnh Tranh",
    desc: "Cam kết giá tốt nhất thị trường. Chênh lệch giá hoàn tiền ngay trong 24h.",
    color: "#f59e0b",
    bg: "#fffbeb",
  },
  {
    icon: "📞",
    title: "Hỗ Trợ 24/7",
    desc: "Đội ngũ kỹ thuật viên luôn sẵn sàng tư vấn và hỗ trợ bạn mọi lúc mọi nơi.",
    color: "#8b5cf6",
    bg: "#f5f3ff",
  },
];

const stats = [
  { value: "10K+", label: "Khách hàng tin dùng", icon: "👥" },
  { value: "500+", label: "Sản phẩm đa dạng", icon: "💻" },
  { value: "99%", label: "Hài lòng dịch vụ", icon: "⭐" },
  { value: "5+", label: "Năm kinh nghiệm", icon: "🏆" },
];

export function WhyCAS() {
  return (
    <section className="py-20 px-4 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs mb-3"
            style={{ backgroundColor: "#eff6ff", color: "#2563eb" }}
          >
            Tại sao chọn CAS?
          </span>
          <h2 style={{ fontWeight: 700, fontSize: "1.75rem", color: "#1e293b" }}>
            Cam Kết Của Chúng Tôi
          </h2>
          <p className="text-gray-500 mt-2 text-sm max-w-lg mx-auto">
            CAS tự hào mang đến trải nghiệm mua sắm laptop tốt nhất với các cam kết vượt trội
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-transparent cursor-default"
              style={{ backgroundColor: feature.bg }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = feature.color + "30";
                e.currentTarget.style.boxShadow = `0 15px 40px ${feature.color}20`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "transparent";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              {/* Icon */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: feature.color + "18" }}
              >
                {feature.icon}
              </div>

              {/* Title */}
              <h3
                className="mb-2"
                style={{ color: "#1e293b", fontWeight: 700, fontSize: "1rem" }}
              >
                {feature.title}
              </h3>

              {/* Desc */}
              <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div
          className="rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8"
          style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)" }}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center text-white">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div style={{ fontSize: "2rem", fontWeight: 800, lineHeight: 1.1 }}>
                {stat.value}
              </div>
              <div className="text-blue-200 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
