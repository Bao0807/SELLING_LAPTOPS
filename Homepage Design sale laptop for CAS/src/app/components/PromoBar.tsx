import { useState } from "react";
import { Tag, Clock, Zap } from "lucide-react";

const promos = [
  {
    id: 1,
    title: "Flash Sale Hôm Nay",
    desc: "Giảm đến 30% cho các dòng laptop gaming",
    end: new Date(Date.now() + 4 * 60 * 60 * 1000),
    color: "#dc2626",
    icon: <Zap size={16} />,
    badge: "HOT",
  },
  {
    id: 2,
    title: "Ưu Đãi Sinh Viên",
    desc: "Xuất trình thẻ sinh viên – Giảm thêm 500K",
    end: new Date(Date.now() + 72 * 60 * 60 * 1000),
    color: "#7c3aed",
    icon: <Tag size={16} />,
    badge: "SV",
  },
];

function useCountdown(end: Date) {
  const [now, setNow] = useState(Date.now());
  // Simple static for demo - no interval to avoid complexity
  const diff = Math.max(0, end.getTime() - now);
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { h, m, s };
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span
        className="text-white rounded px-1.5 py-0.5 text-sm leading-none"
        style={{ backgroundColor: "rgba(0,0,0,0.3)", fontWeight: 700, minWidth: "28px", textAlign: "center" }}
      >
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-white/60 text-[10px] mt-0.5">{label}</span>
    </div>
  );
}

export function PromoBar() {
  const [activePromo, setActivePromo] = useState(0);
  const promo = promos[activePromo];
  const { h, m, s } = useCountdown(promo.end);

  return (
    <div
      className="py-3 px-4 lg:px-8 transition-all duration-500"
      style={{ backgroundColor: promo.color }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: promo tabs */}
        <div className="hidden sm:flex gap-2">
          {promos.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActivePromo(i)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all duration-200"
              style={{
                backgroundColor: i === activePromo ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.1)",
                color: "#fff",
                fontWeight: i === activePromo ? 600 : 400,
              }}
            >
              {p.icon}
              <span
                className="px-1.5 py-0.5 rounded text-white text-[10px]"
                style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
              >
                {p.badge}
              </span>
              <span className="hidden md:inline">{p.title}</span>
            </button>
          ))}
        </div>

        {/* Center: desc */}
        <div className="flex items-center gap-2 text-white text-sm flex-1 justify-center sm:justify-start">
          <span className="hidden sm:block">{promo.icon}</span>
          <span>{promo.desc}</span>
        </div>

        {/* Right: countdown */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Clock size={14} className="text-white/70" />
          <div className="flex items-center gap-1">
            <CountdownUnit value={h} label="giờ" />
            <span className="text-white/60 text-sm pb-3">:</span>
            <CountdownUnit value={m} label="phút" />
            <span className="text-white/60 text-sm pb-3">:</span>
            <CountdownUnit value={s} label="giây" />
          </div>
          <button
            className="ml-2 px-3 py-1.5 rounded-lg text-xs transition-all hidden md:flex items-center"
            style={{ backgroundColor: "rgba(255,255,255,0.9)", color: promo.color, fontWeight: 700 }}
          >
            Mua ngay
          </button>
        </div>
      </div>
    </div>
  );
}
