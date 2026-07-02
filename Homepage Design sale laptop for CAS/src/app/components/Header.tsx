import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Heart, LogOut, Menu, Monitor, Search, Shield, ShoppingCart, User, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { totalItems: cartCount } = useCart();
  const { totalItems: wishlistCount } = useWishlist();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Trang chủ", to: "/" },
    { label: "Sản phẩm", to: "/products" },
    { label: "Khuyến mãi", to: "/products?discount=true" },
    { label: "Liên hệ", to: "/contact" },
    { label: "Hỗ trợ", to: "/support" },
  ];

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <header className={`fixed left-0 right-0 top-0 z-50 bg-white transition-all duration-300 ${isScrolled ? "shadow-lg" : ""}`}>
      <div className="hidden bg-blue-700 px-4 py-1.5 text-center text-xs text-white md:block">
        Ưu đãi hôm nay: giảm đến 20% cho laptop gaming, miễn phí giao hàng đơn từ 5 triệu
      </div>

      <div className="border-b border-gray-100 px-4 py-3 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center gap-4">
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex shrink-0 items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600">
              <Monitor size={20} className="text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-normal text-blue-900">CAS</span>
          </Link>

          <form onSubmit={handleSearch} className="mx-4 hidden max-w-2xl flex-1 md:block">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Tìm laptop, hãng máy, CPU, RAM..."
                className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 py-2.5 pl-10 pr-20 text-sm transition-all focus:border-blue-600 focus:bg-white focus:outline-none"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-blue-600 px-3 py-1.5 text-xs text-white">
                Tìm
              </button>
            </div>
          </form>

          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <Link to="/wishlist" className="relative hidden items-center rounded-xl p-2 transition-colors hover:bg-gray-100 sm:flex" title="Danh sách yêu thích">
              <Heart size={22} className="text-gray-600" />
              {wishlistCount > 0 && <CountBadge color="#ef4444" value={wishlistCount} />}
            </Link>
            <Link to="/cart" className="relative flex items-center rounded-xl p-2 transition-colors hover:bg-gray-100" title="Giỏ hàng">
              <ShoppingCart size={22} className="text-gray-600" />
              {cartCount > 0 && <CountBadge color="#2563eb" value={cartCount} />}
            </Link>

            <div className="hidden items-center gap-2 md:flex">
              {user ? (
                <>
                  {user.role === "admin" && (
                    <Link to="/admin" className="inline-flex items-center gap-1.5 rounded-xl border-2 border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                      <Shield size={16} /> Admin
                    </Link>
                  )}
                  <Link to="/profile" className="inline-flex max-w-44 items-center gap-1.5 rounded-xl border-2 border-blue-600 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50">
                    <User size={16} />
                    <span className="truncate">{user.full_name}</span>
                  </Link>
                  <button onClick={handleLogout} className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800">
                    <LogOut size={16} /> Thoát
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="rounded-xl border-2 border-blue-600 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50">
                    Đăng nhập
                  </Link>
                  <Link to="/register" className="rounded-xl bg-blue-600 px-4 py-2 text-sm text-white hover:opacity-90">
                    Đăng ký
                  </Link>
                </>
              )}
            </div>

            <button className="rounded-xl p-2 transition-colors hover:bg-gray-100 md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      <div className="hidden border-b border-gray-100 bg-white md:block">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.label} to={item.to} className="group relative px-4 py-3 text-sm text-gray-700 transition-colors hover:text-blue-600">
                {item.label}
                <span className="absolute bottom-0 left-0 right-0 h-0.5 origin-center scale-x-0 bg-blue-600 transition-transform duration-200 group-hover:scale-x-100" />
              </Link>
            ))}
            <div className="ml-auto flex items-center gap-4 py-2">
              <a href="tel:18006975" className="text-sm text-blue-600">Hotline: 1800-6975</a>
              <Link to="/profile" className="text-sm text-gray-600 transition-colors hover:text-blue-600">
                Tra cứu đơn hàng
              </Link>
            </div>
          </nav>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="border-b bg-white shadow-lg md:hidden">
          <div className="p-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Tìm laptop..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-4 text-sm focus:outline-none"
                />
              </div>
            </form>
          </div>
          <nav className="pb-4">
            {navItems.map((item) => (
              <Link key={item.label} to={item.to} className="flex px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600" onClick={() => setIsMobileMenuOpen(false)}>
                {item.label}
              </Link>
            ))}

            <div className="flex flex-col gap-2 px-4 pt-3">
              {user ? (
                <>
                  {user.role === "admin" && <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="rounded-xl border-2 px-4 py-2.5 text-center text-sm">Admin</Link>}
                  <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="rounded-xl border-2 border-blue-600 px-4 py-2.5 text-center text-sm text-blue-600">
                    {user.full_name}
                  </Link>
                  <button onClick={handleLogout} className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm text-white">Đăng xuất</button>
                </>
              ) : (
                <div className="flex gap-2">
                  <Link to="/login" className="flex-1 rounded-xl border-2 border-blue-600 py-2.5 text-center text-sm text-blue-600" onClick={() => setIsMobileMenuOpen(false)}>
                    Đăng nhập
                  </Link>
                  <Link to="/register" className="flex-1 rounded-xl bg-blue-600 py-2.5 text-center text-sm text-white" onClick={() => setIsMobileMenuOpen(false)}>
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function CountBadge({ value, color }: { value: number; color: string }) {
  return (
    <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full text-xs text-white" style={{ backgroundColor: color }}>
      {value}
    </span>
  );
}
