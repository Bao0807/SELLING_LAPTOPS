import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2, ArrowRight } from "lucide-react";

const slides = [
  {
    id: 1,
    badge: "Mới nhất 2025",
    title: "CAS – Laptop Chính Hãng\nCho Mọi Nhu Cầu",
    desc: "Cung cấp laptop chính hãng với mức giá cạnh tranh, bảo hành uy tín và hỗ trợ kỹ thuật tận tâm.",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
    accent: "#2563eb",
    bgFrom: "#0f172a",
    bgTo: "#1e3a8a",
  },
  {
    id: 2,
    badge: "Gaming Beast",
    title: "Trải Nghiệm Gaming\nĐỉnh Cao Nhất",
    desc: "Laptop gaming hiệu năng cao, màn hình tốc độ cao, tản nhiệt mạnh mẽ cho game thủ chuyên nghiệp.",
    image: "https://images.unsplash.com/photo-1640955014216-75201056c829?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
    accent: "#7c3aed",
    bgFrom: "#1a0533",
    bgTo: "#2d1b69",
  },
  {
    id: 3,
    badge: "Văn phòng & Sinh viên",
    title: "Laptop Mỏng Nhẹ\nHiệu Năng Vượt Trội",
    desc: "Thiết kế sang trọng, pin trâu, phù hợp cho làm việc văn phòng và sinh viên năng động.",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
    accent: "#0891b2",
    bgFrom: "#0c1a2e",
    bgTo: "#164e63",
  },
];

const badges = [
  { icon: "✓", text: "Chính hãng 100%" },
  { icon: "✓", text: "Bảo hành uy tín" },
  { icon: "✓", text: "Miễn phí giao hàng" },
  { icon: "✓", text: "Hỗ trợ 24/7" },
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => goNext(), 5000);
    return () => clearInterval(timer);
  }, [current]);

  const goNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
      setIsTransitioning(false);
    }, 300);
  };

  const goPrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
      setIsTransitioning(false);
    }, 300);
  };

  const slide = slides[current];

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden transition-all duration-700"
      style={{
        background: `linear-gradient(135deg, ${slide.bgFrom} 0%, ${slide.bgTo} 60%, #0f172a 100%)`,
      }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: isTransitioning ? 0 : 1 }}
      >
        <img
          src={slide.image}
          alt="Hero background"
          className="w-full h-full object-cover"
          style={{ opacity: 0.2 }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${slide.bgFrom}ee 0%, ${slide.bgTo}cc 60%, ${slide.bgFrom}99 100%)`,
          }}
        />
      </div>

      {/* Decorative circles */}
      <div
        className="absolute top-20 right-20 w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{ backgroundColor: slide.accent }}
      />
      <div
        className="absolute bottom-20 left-10 w-64 h-64 rounded-full opacity-10 blur-3xl"
        style={{ backgroundColor: slide.accent }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-32 md:py-40 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div
            className="transition-all duration-500"
            style={{ opacity: isTransitioning ? 0 : 1, transform: isTransitioning ? "translateY(20px)" : "translateY(0)" }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-6">
              <span
                className="px-4 py-1.5 rounded-full text-sm text-white"
                style={{ backgroundColor: slide.accent, opacity: 0.9 }}
              >
                {slide.badge}
              </span>
            </div>

            {/* Title */}
            <h1
              className="text-white mb-6 leading-tight"
              style={{
                fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
                fontWeight: 800,
                lineHeight: 1.15,
                whiteSpace: "pre-line",
              }}
            >
              {slide.title}
            </h1>

            {/* Desc */}
            <p className="text-gray-300 mb-8 leading-relaxed" style={{ fontSize: "1.05rem", maxWidth: "520px" }}>
              {slide.desc}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 mb-10">
              <button
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-white transition-all duration-200 hover:scale-105 active:scale-95"
                style={{ backgroundColor: slide.accent }}
              >
                Mua ngay
                <ArrowRight size={18} />
              </button>
              <button className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-white border border-white/30 backdrop-blur-sm hover:bg-white/10 transition-all duration-200 hover:scale-105 active:scale-95">
                Xem sản phẩm
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {badges.map((b) => (
                <div key={b.text} className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} style={{ color: slide.accent }} />
                  <span className="text-gray-300 text-sm">{b.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right – hero image */}
          <div
            className="relative hidden lg:flex justify-center items-center transition-all duration-500"
            style={{ opacity: isTransitioning ? 0 : 1, transform: isTransitioning ? "translateX(30px)" : "translateX(0)" }}
          >
            <div
              className="relative w-full max-w-lg aspect-video rounded-2xl overflow-hidden shadow-2xl"
              style={{ boxShadow: `0 25px 60px ${slide.accent}40` }}
            >
              <img src={slide.image} alt="Hero laptop" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${slide.bgFrom}80, transparent)` }} />
            </div>

            {/* Floating stat cards */}
            <div
              className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl"
              style={{ minWidth: "140px" }}
            >
              <div className="text-xs text-gray-500 mb-1">Sản phẩm</div>
              <div className="flex items-end gap-1">
                <span className="text-2xl" style={{ color: "#2563eb", fontWeight: 800 }}>500+</span>
              </div>
              <div className="text-xs text-gray-500">Model đang có</div>
            </div>

            <div
              className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl"
              style={{ minWidth: "140px" }}
            >
              <div className="text-xs text-gray-500 mb-1">Khách hàng</div>
              <div className="flex items-end gap-1">
                <span className="text-2xl" style={{ color: "#10b981", fontWeight: 800 }}>10K+</span>
              </div>
              <div className="text-xs text-gray-500">Tin dùng CAS</div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide controls */}
      <button
        onClick={goPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={goNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === current ? "28px" : "8px",
              height: "8px",
              backgroundColor: i === current ? slide.accent : "rgba(255,255,255,0.4)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
