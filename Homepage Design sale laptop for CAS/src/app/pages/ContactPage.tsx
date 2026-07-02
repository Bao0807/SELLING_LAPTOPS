import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";

export function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs: Partial<typeof form> = {};
    if (!form.name.trim()) errs.name = "Vui lòng nhập họ tên";
    if (!form.email.trim()) errs.email = "Vui lòng nhập email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Email không hợp lệ";
    if (!form.message.trim()) errs.message = "Vui lòng nhập nội dung";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSubmitted(true);
  };

  const contactInfo = [
    {
      icon: <MapPin size={22} />,
      title: "Địa chỉ",
      lines: ["123 Nguyễn Văn Linh, Phường Tân Phong,", "Quận 7, TP. Hồ Chí Minh"],
      color: "#2563eb",
      bg: "#eff6ff",
    },
    {
      icon: <Phone size={22} />,
      title: "Hotline",
      lines: ["1800-6975 (Miễn phí)", "0901 234 567 (Zalo)"],
      color: "#10b981",
      bg: "#ecfdf5",
    },
    {
      icon: <Mail size={22} />,
      title: "Email",
      lines: ["support@cas.vn", "sales@cas.vn"],
      color: "#f59e0b",
      bg: "#fffbeb",
    },
    {
      icon: <Clock size={22} />,
      title: "Giờ làm việc",
      lines: ["Thứ 2 – Thứ 6: 8:00 – 21:00", "Thứ 7 – CN: 9:00 – 20:00"],
      color: "#7c3aed",
      bg: "#f5f3ff",
    },
  ];

  return (
    <div style={{ paddingTop: "140px", minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)" }} className="py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Liên hệ với CAS</h1>
          <p className="text-blue-200 text-lg">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy liên hệ ngay!
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-12">
        {/* Contact info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {contactInfo.map((info) => (
            <div key={info.title} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: info.bg, color: info.color }}
              >
                {info.icon}
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-2">{info.title}</h3>
              {info.lines.map((line, i) => (
                <p key={i} className="text-gray-600 text-sm leading-relaxed">{line}</p>
              ))}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Gửi tin nhắn cho chúng tôi</h2>

            {submitted ? (
              <div className="text-center py-10">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: "#ecfdf5" }}
                >
                  <CheckCircle size={32} style={{ color: "#10b981" }} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Gửi thành công!</h3>
                <p className="text-gray-500 text-sm mb-6">
                  Chúng tôi đã nhận được tin nhắn của bạn và sẽ phản hồi trong vòng 24 giờ.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                  className="px-5 py-2.5 rounded-xl text-white text-sm"
                  style={{ backgroundColor: "#2563eb" }}
                >
                  Gửi tin nhắn khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Họ tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Nguyễn Văn A"
                      className="w-full px-4 py-3 rounded-xl border-2 text-sm focus:outline-none transition-all focus:border-blue-500"
                      style={{ borderColor: errors.name ? "#ef4444" : "#e5e7eb" }}
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="email@example.com"
                      className="w-full px-4 py-3 rounded-xl border-2 text-sm focus:outline-none transition-all focus:border-blue-500"
                      style={{ borderColor: errors.email ? "#ef4444" : "#e5e7eb" }}
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Chủ đề</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 text-sm focus:outline-none"
                  >
                    <option value="">-- Chọn chủ đề --</option>
                    <option>Tư vấn sản phẩm</option>
                    <option>Hỗ trợ kỹ thuật</option>
                    <option>Khiếu nại / Đổi trả</option>
                    <option>Bảo hành</option>
                    <option>Hợp tác kinh doanh</option>
                    <option>Khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Nội dung <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={5}
                    placeholder="Mô tả chi tiết vấn đề hoặc câu hỏi của bạn..."
                    className="w-full px-4 py-3 rounded-xl border-2 text-sm focus:outline-none resize-none transition-all focus:border-blue-500"
                    style={{ borderColor: errors.message ? "#ef4444" : "#e5e7eb" }}
                  />
                  {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-all active:scale-95"
                  style={{ backgroundColor: "#2563eb" }}
                >
                  <Send size={16} />
                  Gửi tin nhắn
                </button>
              </form>
            )}
          </div>

          {/* Map placeholder + social */}
          <div className="space-y-5">
            {/* Map placeholder */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div
                className="w-full flex flex-col items-center justify-center text-center p-10"
                style={{ height: "280px", background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)" }}
              >
                <MapPin size={48} style={{ color: "#2563eb" }} className="mb-3" />
                <h3 className="font-semibold text-gray-800 mb-1">CAS Laptop Store</h3>
                <p className="text-sm text-gray-600">123 Nguyễn Văn Linh, Quận 7</p>
                <p className="text-sm text-gray-600 mb-4">TP. Hồ Chí Minh</p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl text-white text-sm"
                  style={{ backgroundColor: "#2563eb" }}
                >
                  Xem trên Google Maps
                </a>
              </div>
            </div>

            {/* Quick contact options */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Liên hệ nhanh</h3>
              <div className="space-y-3">
                {[
                  { label: "Gọi ngay: 1800-6975", href: "tel:18006975", emoji: "📞", color: "#10b981", bg: "#ecfdf5" },
                  { label: "Chat Zalo", href: "#", emoji: "💬", color: "#0068ff", bg: "#eff6ff" },
                  { label: "Nhắn Facebook", href: "#", emoji: "📘", color: "#1877f2", bg: "#eff6ff" },
                ].map((opt) => (
                  <a
                    key={opt.label}
                    href={opt.href}
                    className="flex items-center gap-3 p-3 rounded-xl transition-all hover:shadow-sm"
                    style={{ backgroundColor: opt.bg }}
                  >
                    <span className="text-xl">{opt.emoji}</span>
                    <span className="text-sm font-medium" style={{ color: opt.color }}>{opt.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
