import { useEffect, useState } from "react";
import { Boxes, PackageCheck, Users, Wallet } from "lucide-react";
import { AdminCard } from "./AdminLayout";
import { adminApi, type AdminDashboardStats } from "../utils/api";
import { formatPrice } from "../data/products";
import { toast } from "sonner";

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);

  useEffect(() => {
    adminApi.dashboard().then(setStats).catch((error) => toast.error(error.message));
  }, []);

  const cards = [
    { label: "San pham", value: stats?.totalProducts || 0, icon: Boxes },
    { label: "Khach hang", value: stats?.totalUsers || 0, icon: Users },
    { label: "Don hang", value: stats?.totalOrders || 0, icon: PackageCheck },
    { label: "Doanh thu", value: formatPrice(stats?.totalRevenue || 0), icon: Wallet },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-slate-500">Tong quan van hanh cua CAS Laptop Store.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <AdminCard key={card.label}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-500">{card.label}</div>
                  <div className="mt-1 text-2xl font-bold">{card.value}</div>
                </div>
                <div className="rounded-md bg-blue-50 p-3 text-blue-700"><Icon size={22} /></div>
              </div>
            </AdminCard>
          );
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <AdminCard>
          <h2 className="mb-3 font-semibold">Don gan day</h2>
          <div className="space-y-2">
            {(stats?.recentOrders || []).map((order: any) => (
              <div key={order.id} className="flex items-center justify-between rounded-md bg-slate-50 p-3 text-sm">
                <div>
                  <div className="font-medium">#{order.id} - {order.full_name || order.user?.full_name}</div>
                  <div className="text-slate-500">{order.status}</div>
                </div>
                <div className="font-semibold">{formatPrice(Number(order.total_amount))}</div>
              </div>
            ))}
          </div>
        </AdminCard>
        <AdminCard>
          <h2 className="mb-3 font-semibold">San pham ban chay</h2>
          <div className="space-y-2">
            {(stats?.topProducts || []).map((product: any) => (
              <div key={product.id} className="flex items-center justify-between rounded-md bg-slate-50 p-3 text-sm">
                <div className="line-clamp-1 font-medium">{product.name}</div>
                <div className="text-slate-500">{product.orderItems?.length || product.totalSold || 0} da ban</div>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
