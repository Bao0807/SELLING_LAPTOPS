import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { AdminCard } from "./AdminLayout";
import { adminApi, type AdminReview } from "../utils/api";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";

export function AdminReviews() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    return adminApi.reviews().then((data) => setReviews(data.reviews)).catch((error) => toast.error(error.message)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: number) => {
    await adminApi.deleteReview(id);
    toast.success("Đã xóa đánh giá");
    setDeleteId(null);
    await load();
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Đánh giá</h1><p className="text-sm text-slate-500">Duyệt và xóa đánh giá không phù hợp.</p></div>
      <AdminCard className="space-y-3">
        {loading && <div className="p-8 text-center text-sm text-slate-500">Đang tải đánh giá...</div>}
        {!loading && reviews.length === 0 && <div className="p-8 text-center text-sm text-slate-500">Chưa có đánh giá.</div>}
        {reviews.map((review) => (
          <div key={review.id} className="rounded-md border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-medium">{review.product?.name}</div>
                <div className="text-sm text-slate-500">{review.user?.full_name} - {review.user?.email}</div>
                <div className="mt-2 flex gap-1 text-amber-500">{Array.from({ length: review.rating }).map((_, index) => <Star key={index} size={15} fill="currentColor" />)}</div>
              </div>
              <button onClick={() => setDeleteId(review.id)} className="rounded-md border px-3 py-1.5 text-sm text-red-600">Xóa</button>
            </div>
            <p className="mt-3 text-sm text-slate-700">{review.comment}</p>
          </div>
        ))}
      </AdminCard>
      <ConfirmDialog
        open={deleteId !== null}
        title="Xóa đánh giá?"
        description="Đánh giá sẽ bị xóa khỏi sản phẩm và trang quản trị."
        confirmLabel="Xóa"
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId !== null && remove(deleteId).catch((error) => toast.error(error.message))}
      />
    </div>
  );
}
