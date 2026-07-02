import { Link } from "react-router";
import { Home, Search } from "lucide-react";

export function NotFoundPage() {
  return (
    <div
      style={{ paddingTop: "140px", minHeight: "100vh", backgroundColor: "#f8fafc" }}
      className="flex items-center justify-center px-4"
    >
      <div className="text-center max-w-md">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <div
            className="text-[10rem] font-extrabold leading-none select-none"
            style={{
              background: "linear-gradient(135deg, #2563eb, #7c3aed)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            404
          </div>
          <div
            className="absolute inset-0 text-[10rem] font-extrabold leading-none select-none opacity-10 blur-2xl"
            style={{ color: "#2563eb" }}
          >
            404
          </div>
        </div>

        {/* Illustration */}
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: "#eff6ff" }}
        >
          <Search size={40} style={{ color: "#2563eb" }} />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Trang không tìm thấy
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          Rất tiếc! Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          Hãy kiểm tra lại đường dẫn hoặc quay về trang chủ.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-medium text-sm transition-all hover:opacity-90"
            style={{ backgroundColor: "#2563eb" }}
          >
            <Home size={18} />
            Về trang chủ
          </Link>
          <Link
            to="/products"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm border-2 transition-all hover:bg-blue-50"
            style={{ borderColor: "#2563eb", color: "#2563eb" }}
          >
            Xem sản phẩm
          </Link>
        </div>

        {/* Quick links */}
        <div className="mt-10">
          <p className="text-xs text-gray-400 mb-3">Bạn có thể tìm đến:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: "Trang chủ", to: "/" },
              { label: "Sản phẩm", to: "/products" },
              { label: "Giỏ hàng", to: "/cart" },
              { label: "Liên hệ", to: "/contact" },
              { label: "Hỗ trợ", to: "/support" },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-3 py-1.5 rounded-lg text-xs border border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
