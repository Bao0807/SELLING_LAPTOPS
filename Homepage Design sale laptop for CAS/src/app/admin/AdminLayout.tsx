import type { ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { BarChart3, Boxes, FolderTree, LogOut, PackageCheck, Percent, Star, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: BarChart3, end: true },
  { to: "/admin/products", label: "San pham", icon: Boxes },
  { to: "/admin/categories", label: "Danh muc", icon: FolderTree },
  { to: "/admin/orders", label: "Don hang", icon: PackageCheck },
  { to: "/admin/vouchers", label: "Voucher", icon: Percent },
  { to: "/admin/users", label: "Nguoi dung", icon: Users },
  { to: "/admin/reviews", label: "Review", icon: Star },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-16 items-center border-b border-slate-200 px-5">
          <Link to="/admin" className="font-bold text-blue-700">CAS Admin</Link>
        </div>
        <nav className="space-y-1 p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
                    isActive ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-8">
          <div>
            <div className="text-sm font-semibold">{user?.full_name}</div>
            <div className="text-xs text-slate-500">{user?.email}</div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="rounded-md border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">Storefront</Link>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-700"
            >
              <LogOut size={16} />
              Dang xuat
            </button>
          </div>
        </header>
        <main className="px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

export function AdminCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-md border border-slate-200 bg-white p-4 shadow-sm ${className}`}>{children}</div>;
}
