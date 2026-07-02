import { useState } from "react";
import { ChevronDown, ChevronUp, Shield, RefreshCw, Truck, HelpCircle, Phone, MessageSquare } from "lucide-react";

type FAQ = { question: string; answer: string };

const sections = [
  {
    id: "warranty",
    title: "Chính sách bảo hành",
    icon: <Shield size={22} />,
    color: "#2563eb",
    bg: "#eff6ff",
    faqs: [
      {
        question: "CAS bảo hành sản phẩm trong bao lâu?",
        answer:
          "Tất cả sản phẩm tại CAS đều được bảo hành chính hãng từ 12 đến 24 tháng tùy hãng. ASUS, Dell, HP, Lenovo: 24 tháng. MSI, Acer: 12-24 tháng. MacBook (Apple): 12 tháng chính hãng, có thể gia hạn AppleCare+.",
      },
      {
        question: "Điều kiện được bảo hành là gì?",
        answer:
          "Sản phẩm được bảo hành khi: lỗi do nhà sản xuất, còn trong thời hạn bảo hành, có đầy đủ phiếu bảo hành và hóa đơn mua hàng. Bảo hành không áp dụng với: hư hỏng do va đập, ngấm nước, tự ý sửa chữa hoặc nâng cấp không được phép.",
      },
      {
        question: "Quy trình bảo hành như thế nào?",
        answer:
          "Bước 1: Liên hệ hotline 1800-6975 hoặc đến trực tiếp cửa hàng. Bước 2: Mang sản phẩm kèm phiếu bảo hành và hóa đơn. Bước 3: Kỹ thuật viên kiểm tra và xác nhận lỗi. Bước 4: Sửa chữa hoặc thay thế (tùy trường hợp). Thời gian xử lý: 3-7 ngày làm việc.",
      },
      {
        question: "CAS có bảo hành tại nhà không?",
        answer:
          "Có! CAS cung cấp dịch vụ bảo hành và hỗ trợ kỹ thuật tại nhà cho khu vực TP. Hồ Chí Minh. Vui lòng liên hệ trước để đặt lịch. Phí dịch vụ tại nhà: 100.000đ – 200.000đ tùy khu vực.",
      },
    ] as FAQ[],
  },
  {
    id: "return",
    title: "Chính sách đổi trả",
    icon: <RefreshCw size={22} />,
    color: "#10b981",
    bg: "#ecfdf5",
    faqs: [
      {
        question: "Tôi có thể đổi trả sản phẩm trong bao lâu?",
        answer:
          "CAS áp dụng chính sách đổi trả trong 30 ngày kể từ ngày mua hàng. Sản phẩm phải còn nguyên vẹn, đầy đủ phụ kiện, chưa qua sử dụng hoặc bị lỗi do nhà sản xuất.",
      },
      {
        question: "Những trường hợp nào được đổi trả?",
        answer:
          "Được đổi/trả khi: sản phẩm bị lỗi kỹ thuật ngay khi nhận hàng, sản phẩm không đúng mô tả, giao nhầm sản phẩm. Không áp dụng đổi/trả khi: sản phẩm đã qua sử dụng, bị hư hỏng do người dùng, hoặc đã hơn 30 ngày.",
      },
      {
        question: "Quy trình đổi trả như thế nào?",
        answer:
          "Liên hệ hotline 1800-6975 trong giờ làm việc. Cung cấp ảnh/video sản phẩm bị lỗi. Nhân viên xác nhận và hướng dẫn gửi hàng. Hoàn tiền qua chuyển khoản trong 3-5 ngày làm việc sau khi nhận hàng hoàn trả.",
      },
    ] as FAQ[],
  },
  {
    id: "shipping",
    title: "Chính sách vận chuyển",
    icon: <Truck size={22} />,
    color: "#f59e0b",
    bg: "#fffbeb",
    faqs: [
      {
        question: "CAS giao hàng những khu vực nào?",
        answer:
          "CAS giao hàng toàn quốc 63 tỉnh thành. Riêng khu vực TP. Hồ Chí Minh có dịch vụ giao trong ngày (đặt trước 15:00). Các tỉnh khác: 2-4 ngày làm việc.",
      },
      {
        question: "Phí giao hàng là bao nhiêu?",
        answer:
          "Miễn phí giao hàng cho đơn từ 5.000.000đ trở lên toàn quốc. Đơn dưới 5 triệu: 30.000đ – 50.000đ tùy khu vực. Giao hàng nhanh trong ngày (TP.HCM): 50.000đ – 80.000đ.",
      },
      {
        question: "Làm sao theo dõi đơn hàng của tôi?",
        answer:
          "Sau khi đặt hàng, bạn sẽ nhận SMS/email xác nhận kèm mã vận đơn. Truy cập website của đơn vị vận chuyển (GHTK, GHN, Viettel Post) để theo dõi. Hoặc liên hệ hotline 1800-6975 để được hỗ trợ.",
      },
      {
        question: "Hàng giao có được kiểm tra trước không?",
        answer:
          "Có! CAS cho phép kiểm tra sản phẩm trước khi thanh toán (COD). Nếu sản phẩm không đúng mô tả hoặc bị lỗi, bạn có quyền từ chối nhận và hoàn trả ngay tại chỗ.",
      },
    ] as FAQ[],
  },
];

function FAQItem({ faq }: { faq: FAQ }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-medium text-gray-800 leading-relaxed">{faq.question}</span>
        <span className="shrink-0 mt-0.5 text-gray-400">
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-50 bg-gray-50/50">
          <p className="pt-3">{faq.answer}</p>
        </div>
      )}
    </div>
  );
}

export function SupportPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  return (
    <div style={{ paddingTop: "140px", minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)" }} className="py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <HelpCircle size={48} className="text-blue-300 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Trung tâm hỗ trợ</h1>
          <p className="text-blue-200 text-lg">
            Tìm câu trả lời cho mọi thắc mắc của bạn về CAS
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-12">
        {/* Quick nav */}
        <div className="flex flex-wrap gap-3 mb-10 justify-center">
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => {
                setActiveSection(activeSection === sec.id ? null : sec.id);
                document.getElementById(sec.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border-2 transition-all"
              style={{
                borderColor: activeSection === sec.id ? sec.color : "#e5e7eb",
                color: activeSection === sec.id ? sec.color : "#374151",
                backgroundColor: activeSection === sec.id ? sec.bg : "#fff",
              }}
            >
              <span style={{ color: sec.color }}>{sec.icon}</span>
              {sec.title}
            </button>
          ))}
        </div>

        {/* FAQ Sections */}
        <div className="space-y-10">
          {sections.map((section) => (
            <div key={section.id} id={section.id}>
              {/* Section header */}
              <div
                className="flex items-center gap-3 p-5 rounded-2xl mb-5"
                style={{ backgroundColor: section.bg }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: section.color, color: "#fff" }}
                >
                  {section.icon}
                </div>
                <div>
                  <h2 className="text-lg font-bold" style={{ color: section.color }}>
                    {section.title}
                  </h2>
                  <p className="text-xs text-gray-500">{section.faqs.length} câu hỏi thường gặp</p>
                </div>
              </div>

              {/* FAQs */}
              <div className="space-y-3">
                {section.faqs.map((faq, idx) => (
                  <FAQItem key={idx} faq={faq} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still need help */}
        <div
          className="mt-14 rounded-2xl p-8 text-center"
          style={{ background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)" }}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Vẫn chưa tìm được câu trả lời?
          </h3>
          <p className="text-gray-600 text-sm mb-6">
            Đội ngũ hỗ trợ của CAS sẵn sàng giúp đỡ bạn 24/7
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="tel:18006975"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-medium text-sm"
              style={{ backgroundColor: "#2563eb" }}
            >
              <Phone size={16} />
              Gọi 1800-6975 (Miễn phí)
            </a>
            <a
              href="/contact"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm border-2"
              style={{ borderColor: "#2563eb", color: "#2563eb" }}
            >
              <MessageSquare size={16} />
              Gửi tin nhắn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
