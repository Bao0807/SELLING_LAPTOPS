import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ChevronLeft, Heart, ShoppingCart, Star, Zap } from "lucide-react";
import { toast } from "sonner";
import { formatPrice, type Product } from "../data/products";
import { customerApi, publicApi } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { StarRating } from "../components/ui/ProductCard";

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");
  const [review, setReview] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    publicApi.product(id)
      .then((row) => {
        setProduct(row);
        setQuantity(row.stock > 0 ? 1 : 0);
        setSelectedImage(0);
      })
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div style={{ paddingTop: "140px", minHeight: "100vh" }} className="bg-slate-50" />;
  }

  if (!product) {
    return (
      <div style={{ paddingTop: "140px", minHeight: "100vh" }} className="flex flex-col items-center justify-center">
        <h1 className="mb-4 text-2xl font-bold text-gray-700">Không tìm thấy sản phẩm</h1>
        <Link to="/products" className="rounded-xl bg-blue-600 px-6 py-3 text-white">Xem sản phẩm</Link>
      </div>
    );
  }

  const specRows = [
    { label: "CPU", value: product.specs.cpu },
    { label: "RAM", value: product.specs.ram },
    { label: "Ổ cứng", value: product.specs.ssd },
    { label: "Card đồ họa", value: product.specs.gpu },
    { label: "Màn hình", value: product.specs.display },
    { label: "Pin", value: product.specs.battery },
    { label: "Trọng lượng", value: product.specs.weight },
    { label: "Hệ điều hành", value: product.specs.os },
  ];
  const outOfStock = product.stock <= 0;

  const submitReview = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) {
      navigate("/login", { state: { from: `/product/${product.id}` } });
      return;
    }
    try {
      await customerApi.review({ product_id: product.id, rating: review.rating, comment: review.comment.trim() });
      toast.success("Đã gửi đánh giá");
      setReview({ rating: 5, comment: "" });
      setProduct(await publicApi.product(product.id));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const addCurrentToCart = async () => {
    try {
      await addToCart(product, quantity);
    } catch (error: any) {
      toast.error(error.message || "Không thể thêm vào giỏ hàng");
      throw error;
    }
  };

  return (
    <div style={{ paddingTop: "140px", minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600">
          <ChevronLeft size={16} /> Quay lại
        </button>

        <div className="mb-10 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <div className="mb-3 aspect-[4/3] overflow-hidden rounded-2xl border border-gray-100 bg-white">
              <img src={product.images[selectedImage]} alt={product.name} className="h-full w-full object-cover" />
            </div>
            <div className="flex gap-2">
              {product.images.map((image, index) => (
                <button key={image + index} onClick={() => setSelectedImage(index)} className="h-16 w-20 overflow-hidden rounded-xl border-2" style={{ borderColor: selectedImage === index ? "#2563eb" : "#e5e7eb" }}>
                  <img src={image} alt={product.name} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-sm font-medium text-blue-600">{product.brand}</span>
              {product.badge && <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ color: product.badge.color, backgroundColor: product.badge.bg }}>{product.badge.label}</span>}
            </div>
            <h1 className="mb-3 text-2xl font-bold leading-tight text-gray-900">{product.name}</h1>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <StarRating rating={product.rating} size={16} />
              {product.rating > 0 ? (
                <>
                  <span className="text-sm font-semibold text-amber-500">{product.rating}</span>
                  <span className="text-sm text-gray-400">({product.reviewCount} đánh giá)</span>
                </>
              ) : (
                <span className="text-sm text-gray-400">Chưa có đánh giá</span>
              )}
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${outOfStock ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                {outOfStock ? "Hết hàng" : `Còn ${product.stock}`}
              </span>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-gray-600">{product.shortDescription}</p>
            <div className="mb-6 grid grid-cols-2 gap-2">
              {specRows.slice(0, 4).map((spec) => (
                <div key={spec.label} className="rounded-xl bg-gray-50 p-3">
                  <div className="mb-0.5 text-xs text-gray-400">{spec.label}</div>
                  <div className="text-xs font-semibold text-gray-800">{spec.value}</div>
                </div>
              ))}
            </div>
            <div className="mb-6 rounded-2xl bg-blue-50 p-4">
              <span className="text-3xl font-extrabold text-blue-600">{formatPrice(product.price)}</span>
              {product.oldPrice && <span className="ml-3 text-lg text-gray-400 line-through">{formatPrice(product.oldPrice)}</span>}
            </div>
            <div className="mb-4 flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600">Số lượng:</span>
              <div className="flex overflow-hidden rounded-xl border-2 border-gray-200">
                <button disabled={outOfStock} onClick={() => setQuantity(Math.max(1, quantity - 1))} className="h-10 w-10 hover:bg-gray-100 disabled:opacity-50">-</button>
                <span className="flex h-10 w-12 items-center justify-center font-semibold">{quantity}</span>
                <button disabled={outOfStock} onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="h-10 w-10 hover:bg-gray-100 disabled:opacity-50">+</button>
              </div>
            </div>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row">
              <button onClick={addCurrentToCart} disabled={outOfStock} className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-blue-600 py-3.5 text-sm font-semibold text-blue-600 disabled:opacity-50">
                <ShoppingCart size={18} /> {isInCart(product.id) ? "Đã có trong giỏ" : "Thêm vào giỏ"}
              </button>
              <button onClick={() => addCurrentToCart().then(() => navigate("/cart")).catch(() => null)} disabled={outOfStock} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white disabled:opacity-50">
                <Zap size={18} /> Mua ngay
              </button>
              <button onClick={() => toggleWishlist(product).catch((error) => toast.error(error.message))} className="flex h-12 w-12 items-center justify-center rounded-xl border-2">
                <Heart size={20} fill={isWishlisted(product.id) ? "#ef4444" : "none"} color={isWishlisted(product.id) ? "#ef4444" : "#9ca3af"} />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
          <div className="flex border-b border-gray-100">
            {(["description", "specs", "reviews"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className="px-6 py-4 text-sm font-medium" style={{ color: activeTab === tab ? "#2563eb" : "#6b7280", borderBottom: activeTab === tab ? "2px solid #2563eb" : "2px solid transparent" }}>
                {tab === "description" ? "Mô tả" : tab === "specs" ? "Thông số" : `Đánh giá (${product.reviewCount})`}
              </button>
            ))}
          </div>
          <div className="p-6">
            {activeTab === "description" && <p className="text-base leading-relaxed text-gray-700">{product.description || "Sản phẩm chưa có mô tả chi tiết."}</p>}
            {activeTab === "specs" && <div className="overflow-hidden rounded-xl border border-gray-100">{specRows.map((row, index) => <div key={row.label} className="flex text-sm" style={{ backgroundColor: index % 2 === 0 ? "#f8fafc" : "#fff" }}><div className="w-48 border-r border-gray-100 px-4 py-3 font-medium text-gray-600">{row.label}</div><div className="flex-1 px-4 py-3 text-gray-800">{row.value || "-"}</div></div>)}</div>}
            {activeTab === "reviews" && (
              <div className="space-y-4">
                {product.reviews.length === 0 && <div className="rounded-xl border border-gray-100 p-5 text-sm text-gray-500">Chưa có đánh giá cho sản phẩm này.</div>}
                {product.reviews.map((item) => (
                  <div key={item.id} className="rounded-xl border border-gray-100 p-4">
                    <div className="mb-2 flex items-center gap-3">
                      <img src={item.avatar} alt={item.author} className="h-9 w-9 rounded-full" />
                      <div><div className="text-sm font-semibold">{item.author}</div><div className="text-xs text-gray-400">{item.date}</div></div>
                      <div className="ml-auto"><StarRating rating={item.rating} size={14} /></div>
                    </div>
                    <p className="text-sm text-gray-700">{item.comment}</p>
                  </div>
                ))}
                <form onSubmit={submitReview} className="rounded-xl bg-blue-50 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-sm font-medium">Đánh giá:</span>
                    <select value={review.rating} onChange={(event) => setReview({ ...review, rating: Number(event.target.value) })} className="rounded-md border px-2 py-1 text-sm">
                      {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} sao</option>)}
                    </select>
                    <Star size={16} fill="#f59e0b" color="#f59e0b" />
                  </div>
                  <textarea value={review.comment} onChange={(event) => setReview({ ...review, comment: event.target.value })} required placeholder="Chia sẻ trải nghiệm của bạn" className="mb-3 min-h-24 w-full rounded-md border px-3 py-2 text-sm" />
                  <button className="rounded-lg bg-blue-600 px-5 py-2 text-sm text-white">Gửi đánh giá</button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
