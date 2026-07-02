import { Link } from "react-router";
import type { ReactNode } from "react";
import { Facebook, Instagram, Mail, MapPin, Monitor, Phone, Youtube } from "lucide-react";

const productCategories = [
  { label: "Gaming Laptop", to: "/products?category=gaming" },
  { label: "Laptop Văn Phòng", to: "/products?category=office" },
  { label: "Laptop Sinh Viên", to: "/products?category=student" },
  { label: "Laptop Đồ Họa", to: "/products?category=creative" },
  { label: "Ultrabook", to: "/products?category=ultrabook" },
  { label: "MacBook", to: "/products?brand=Apple" },
];

const policies = [
  { label: "Chính sách bảo hành", to: "/support" },
  { label: "Chính sách đổi trả", to: "/support" },
  { label: "Chính sách vận chuyển", to: "/support" },
  { label: "Hướng dẫn mua hàng", to: "/support" },
  { label: "Thanh toán COD", to: "/support" },
  { label: "Chính sách bảo mật", to: "/support" },
];

const brands = ["ASUS", "Acer", "MSI", "Dell", "HP", "Lenovo", "Apple", "LG"];

export function Footer() {
  return (
    <footer id="footer" style={{ backgroundColor: "#0f172a" }}>
      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
                <Monitor size={22} className="text-white" />
              </div>
              <span className="text-2xl font-extrabold text-white">CAS</span>
            </Link>
            <p className="mb-5 text-sm leading-relaxed text-gray-400">
              CAS cung cấp laptop chính hãng với giá tốt, bảo hành rõ ràng và hỗ trợ tận tâm cho học tập, làm việc và gaming.
            </p>

            <div className="flex gap-3">
              {[
                { icon: <Facebook size={18} />, color: "#1877f2", label: "Facebook" },
                { icon: <Instagram size={18} />, color: "#e1306c", label: "Instagram" },
                { icon: <Youtube size={18} />, color: "#ff0000", label: "Youtube" },
              ].map((social) => (
                <button key={social.label} className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-gray-400 transition-all duration-200 hover:scale-110" aria-label={social.label}>
                  {social.icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-5 text-sm font-semibold text-white">Danh Mục Sản Phẩm</h4>
            <ul className="space-y-2.5">
              {productCategories.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="group flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white">
                    <span className="h-1 w-1 rounded-full bg-blue-600 transition-all group-hover:w-2" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="mb-4 mt-6 text-sm font-semibold text-white">Thương Hiệu</h4>
            <div className="flex flex-wrap gap-2">
              {brands.map((brand) => (
                <Link key={brand} to={`/products?brand=${brand}`} className="rounded border border-gray-700 px-2.5 py-1 text-xs text-gray-400 transition-all hover:border-blue-500 hover:text-white">
                  {brand}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-5 text-sm font-semibold text-white">Chính Sách</h4>
            <ul className="space-y-2.5">
              {policies.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="group flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white">
                    <span className="h-1 w-1 rounded-full bg-blue-600 transition-all group-hover:w-2" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="mb-4 mt-6 text-sm font-semibold text-white">Thanh Toán</h4>
            <span className="rounded-lg border border-gray-700 bg-slate-800 px-3 py-1.5 text-xs text-gray-300">COD</span>
          </div>

          <div>
            <h4 className="mb-5 text-sm font-semibold text-white">Thông Tin Liên Hệ</h4>
            <div className="space-y-4">
              <FooterContact icon={<Phone size={16} />} title="Hotline" href="tel:18006975" text="1800-6975" subText="Miễn phí cuộc gọi" />
              <FooterContact icon={<Mail size={16} />} title="Email" href="mailto:support@cas.vn" text="support@cas.vn" />
              <FooterContact icon={<MapPin size={16} />} title="Địa chỉ" href="/contact" text="123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh" />
            </div>

            <div className="mt-6 rounded-xl bg-slate-800 p-4">
              <div className="mb-2 text-xs text-gray-400">Giờ làm việc</div>
              <div className="flex justify-between text-sm"><span className="text-gray-300">Thứ 2 - Thứ 6</span><span className="font-semibold text-white">8:00 - 21:00</span></div>
              <div className="mt-1 flex justify-between text-sm"><span className="text-gray-300">Thứ 7 - CN</span><span className="font-semibold text-white">9:00 - 20:00</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-sm text-gray-500 sm:flex-row lg:px-8">
          <span>© 2026 CAS Laptop Store. Tất cả quyền được bảo lưu.</span>
          <div className="flex gap-4">
            <Link to="/support" className="transition-colors hover:text-gray-300">Điều khoản</Link>
            <Link to="/support" className="transition-colors hover:text-gray-300">Bảo mật</Link>
            <Link to="/contact" className="transition-colors hover:text-gray-300">Liên hệ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterContact({ icon, title, href, text, subText }: { icon: ReactNode; title: string; href: string; text: string; subText?: string }) {
  const isInternal = href.startsWith("/");
  const content = (
    <>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-900 text-blue-300">{icon}</div>
      <div>
        <div className="mb-0.5 text-xs text-gray-500">{title}</div>
        <div className="text-sm leading-relaxed text-white">{text}</div>
        {subText && <div className="mt-0.5 text-xs text-gray-500">{subText}</div>}
      </div>
    </>
  );

  return isInternal ? (
    <Link to={href} className="flex items-start gap-3 transition-colors hover:text-blue-400">{content}</Link>
  ) : (
    <a href={href} className="flex items-start gap-3 transition-colors hover:text-blue-400">{content}</a>
  );
}
