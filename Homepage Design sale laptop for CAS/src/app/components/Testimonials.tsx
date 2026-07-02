import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

type Review = {
  id: number;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  date: string;
  product: string;
  content: string;
};

const reviews: Review[] = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    role: "Kỹ sư phần mềm",
    avatar: "NVA",
    rating: 5,
    date: "15/05/2025",
    product: "ASUS TUF Gaming F15",
    content: "Dịch vụ rất tốt, giao hàng nhanh trong vòng 24 giờ. Sản phẩm đúng mô tả, máy chạy cực mượt. Nhân viên tư vấn nhiệt tình, giải đáp mọi thắc mắc của mình. Sẽ giới thiệu cho bạn bè.",
  },
  {
    id: 2,
    name: "Trần Thị Bình",
    role: "Sinh viên Đại học",
    avatar: "TTB",
    rating: 5,
    date: "02/06/2025",
    product: "HP Pavilion 15",
    content: "Mình mua laptop đầu tiên tại CAS và rất hài lòng. Giá cả cạnh tranh, bảo hành rõ ràng. Máy dùng được 3 tháng vẫn hoạt động tốt, pin trâu hơn mình nghĩ. Chắc chắn sẽ quay lại!",
  },
  {
    id: 3,
    name: "Lê Hoàng Minh",
    role: "Designer",
    avatar: "LHM",
    rating: 5,
    date: "20/06/2025",
    product: "MacBook Pro 14\" M3",
    content: "CAS có hàng chính hãng, giá tốt hơn nhiều so với các shop khác mình từng tham khảo. Đặt online lúc 9 giờ tối, sáng hôm sau đã nhận được hàng. Cực kỳ ấn tượng!",
  },
  {
    id: 4,
    name: "Phạm Tuấn Khải",
    role: "Game thủ chuyên nghiệp",
    avatar: "PTK",
    rating: 4,
    date: "10/06/2025",
    product: "ASUS ROG Zephyrus G14",
    content: "Laptop gaming cực chất, chiến được mọi game nặng. Team hỗ trợ kỹ thuật của CAS giải quyết vấn đề cực nhanh khi mình gặp lỗi driver. Trừ 1 sao vì giao hàng hơi chậm.",
  },
  {
    id: 5,
    name: "Vũ Thị Hoa",
    role: "Kế toán",
    avatar: "VTH",
    rating: 5,
    date: "25/05/2025",
    product: "Lenovo ThinkPad X1",
    content: "Mua ThinkPad để làm việc văn phòng, cực kỳ hài lòng với chất lượng. CAS tư vấn rất tận tâm, giúp mình chọn đúng cấu hình phù hợp với nhu cầu và ngân sách.",
  },
  {
    id: 6,
    name: "Đặng Quốc Bảo",
    role: "Freelancer",
    avatar: "DQB",
    rating: 5,
    date: "08/06/2025",
    product: "Dell XPS 15",
    content: "Đây là lần thứ ba mình mua laptop tại CAS. Chưa bao giờ thất vọng. Chương trình khuyến mãi tốt, tặng thêm túi chống sốc và chuột không dây. Dịch vụ hậu mãi 10 điểm!",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={14} fill={s <= rating ? "#f59e0b" : "none"} style={{ color: "#f59e0b" }} />
      ))}
    </div>
  );
}

function AvatarCircle({ initials, index }: { initials: string; index: number }) {
  const colors = ["#2563eb", "#7c3aed", "#10b981", "#f59e0b", "#ef4444", "#0891b2"];
  const color = colors[index % colors.length];
  return (
    <div
      className="w-12 h-12 rounded-full flex items-center justify-center text-white shrink-0"
      style={{ backgroundColor: color, fontWeight: 700, fontSize: "0.9rem" }}
    >
      {initials}
    </div>
  );
}

export function Testimonials() {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 3;

  const visible = reviews.slice(startIndex, startIndex + visibleCount);

  const goNext = () => {
    if (startIndex + visibleCount < reviews.length) {
      setStartIndex(startIndex + 1);
    } else {
      setStartIndex(0);
    }
  };

  const goPrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    } else {
      setStartIndex(reviews.length - visibleCount);
    }
  };

  return (
    <section className="py-20 px-4 lg:px-8" style={{ backgroundColor: "#f8fafc" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span
              className="inline-block px-3 py-1 rounded-full text-xs mb-3"
              style={{ backgroundColor: "#eff6ff", color: "#2563eb" }}
            >
              Đánh giá từ khách hàng
            </span>
            <h2 style={{ fontWeight: 700, fontSize: "1.75rem", color: "#1e293b" }}>
              Khách Hàng Nói Gì Về CAS
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Hơn 10,000 khách hàng đã tin tưởng chúng tôi
            </p>
          </div>

          {/* Navigation */}
          <div className="flex gap-2">
            <button
              onClick={goPrev}
              className="w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-200 hover:shadow-md"
              style={{ borderColor: "#e5e7eb" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#2563eb";
                e.currentTarget.style.color = "#2563eb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.color = "#374151";
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={goNext}
              className="w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-200 hover:shadow-md"
              style={{ borderColor: "#e5e7eb" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#2563eb";
                e.currentTarget.style.color = "#2563eb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.color = "#374151";
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Overall rating */}
        <div
          className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl mb-10"
          style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)" }}
        >
          <div className="text-center sm:text-left text-white">
            <div style={{ fontSize: "3.5rem", fontWeight: 800, lineHeight: 1 }}>4.9</div>
            <div className="flex justify-center sm:justify-start gap-0.5 my-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={20} fill="#f59e0b" style={{ color: "#f59e0b" }} />
              ))}
            </div>
            <div className="text-blue-200 text-sm">Đánh giá trung bình</div>
          </div>
          <div className="w-px h-16 bg-blue-500 hidden sm:block" />
          <div className="grid grid-cols-3 gap-8 flex-1 text-white text-center">
            {[
              { label: "Tốt (5⭐)", value: "87%", color: "#f59e0b" },
              { label: "Khá (4⭐)", value: "10%", color: "#10b981" },
              { label: "Trung bình", value: "3%", color: "#94a3b8" },
            ].map((item) => (
              <div key={item.label}>
                <div style={{ fontWeight: 700, fontSize: "1.4rem", color: item.color }}>{item.value}</div>
                <div className="text-blue-200 text-xs mt-0.5">{item.label}</div>
              </div>
            ))}
          </div>
          <div className="w-px h-16 bg-blue-500 hidden sm:block" />
          <div className="text-white text-center">
            <div style={{ fontWeight: 800, fontSize: "1.8rem" }}>10K+</div>
            <div className="text-blue-200 text-sm">Lượt đánh giá</div>
          </div>
        </div>

        {/* Review cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map((review, i) => (
            <div
              key={review.id}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              {/* Quote icon */}
              <div className="mb-4">
                <Quote size={28} style={{ color: "#dbeafe" }} />
              </div>

              {/* Review content */}
              <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-4">
                "{review.content}"
              </p>

              {/* Product */}
              <div
                className="text-xs px-2.5 py-1 rounded-full inline-flex w-fit mb-4"
                style={{ backgroundColor: "#eff6ff", color: "#2563eb" }}
              >
                💻 {review.product}
              </div>

              {/* Rating + Date */}
              <div className="flex items-center justify-between mb-4">
                <StarRating rating={review.rating} />
                <span className="text-xs text-gray-400">{review.date}</span>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center gap-3">
                  <AvatarCircle initials={review.avatar} index={i + startIndex} />
                  <div>
                    <div className="text-sm" style={{ color: "#1e293b", fontWeight: 600 }}>{review.name}</div>
                    <div className="text-xs text-gray-400">{review.role}</div>
                  </div>
                  <div className="ml-auto">
                    <span className="text-xs text-green-500 flex items-center gap-1">
                      ✓ Đã mua hàng
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {reviews.slice(0, reviews.length - visibleCount + 1).map((_, i) => (
            <button
              key={i}
              onClick={() => setStartIndex(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === startIndex ? "24px" : "8px",
                height: "8px",
                backgroundColor: i === startIndex ? "#2563eb" : "#cbd5e1",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
