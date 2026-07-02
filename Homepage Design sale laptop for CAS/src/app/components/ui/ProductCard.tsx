import { useState } from "react";
import { Link } from "react-router";
import { Eye, Heart, ShoppingCart, Star } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { formatPrice } from "../../data/products";
import type { Product } from "../../data/products";

export function StarRating({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          fill={rating > 0 && star <= Math.floor(rating) ? "#f59e0b" : rating > 0 && star - 0.5 <= rating ? "#f59e0b" : "none"}
          style={{ color: rating > 0 ? "#f59e0b" : "#cbd5e1" }}
        />
      ))}
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [addedToCart, setAddedToCart] = useState(false);

  const wishlisted = isWishlisted(product.id);
  const inCart = isInCart(product.id);
  const outOfStock = product.stock <= 0;

  const handleAddToCart = async (event: React.MouseEvent) => {
    event.preventDefault();
    if (outOfStock) return;
    try {
      await addToCart(product);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (error: any) {
      toast.error(error.message || "Không thể thêm vào giỏ hàng");
    }
  };

  const handleToggleWishlist = async (event: React.MouseEvent) => {
    event.preventDefault();
    try {
      await toggleWishlist(product);
    } catch (error: any) {
      toast.error(error.message || "Không thể cập nhật yêu thích");
    }
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
      <div className="relative overflow-hidden bg-gray-50" style={{ aspectRatio: "4/3" }}>
        <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />

        {product.discount && (
          <div className="absolute left-3 top-3 rounded-lg bg-red-600 px-2 py-1 text-xs font-bold text-white">
            -{product.discount}%
          </div>
        )}
        {product.badge && (
          <div className="absolute right-3 top-3 rounded-lg px-2.5 py-1 text-xs font-semibold" style={{ backgroundColor: product.badge.bg, color: product.badge.color }}>
            {product.badge.label}
          </div>
        )}
        {outOfStock && (
          <div className="absolute bottom-3 left-3 rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white">
            Hết hàng
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button onClick={handleToggleWishlist} className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-transform hover:scale-110" title={wishlisted ? "Bỏ yêu thích" : "Thêm yêu thích"}>
            <Heart size={18} fill={wishlisted ? "#ef4444" : "none"} style={{ color: wishlisted ? "#ef4444" : "#374151" }} />
          </button>
          <Link to={`/product/${product.id}`} className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-transform hover:scale-110" title="Xem chi tiết">
            <Eye size={18} style={{ color: "#374151" }} />
          </Link>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <span className="mb-1 text-xs text-gray-400">{product.brand}</span>
        <h3 className="mb-2 line-clamp-2 text-sm font-semibold leading-tight text-slate-800">{product.name}</h3>

        <div className="mb-3 space-y-1">
          {[product.specs.cpu, `RAM ${product.specs.ram}`, product.specs.ssd, product.specs.gpu].filter(Boolean).map((spec) => (
            <div key={spec} className="flex items-center gap-1.5">
              <span className="h-1 w-1 flex-shrink-0 rounded-full bg-blue-600" />
              <span className="truncate text-xs text-gray-500">{spec}</span>
            </div>
          ))}
        </div>

        <div className="mb-3 flex items-center gap-2">
          <StarRating rating={product.rating} />
          {product.rating > 0 ? (
            <>
              <span className="text-xs font-semibold text-amber-500">{product.rating}</span>
              <span className="text-xs text-gray-400">({product.reviewCount} đánh giá)</span>
            </>
          ) : (
            <span className="text-xs text-gray-400">Chưa có đánh giá</span>
          )}
        </div>

        <div className="mt-auto">
          <div className="mb-1 flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-blue-600">{formatPrice(product.price)}</span>
          </div>
          {product.oldPrice && <span className="text-xs text-gray-400 line-through">{formatPrice(product.oldPrice)}</span>}
        </div>

        <div className="mt-3 flex gap-2">
          <Link to={`/product/${product.id}`} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border-2 border-blue-600 py-2.5 text-xs text-blue-600 transition-all duration-200 hover:bg-blue-50">
            <Eye size={14} /> Chi tiết
          </Link>
          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs text-white transition-all duration-200 disabled:cursor-not-allowed disabled:bg-slate-300"
            style={{ backgroundColor: outOfStock ? "#cbd5e1" : addedToCart || inCart ? "#10b981" : "#2563eb" }}
          >
            <ShoppingCart size={14} />
            {outOfStock ? "Hết hàng" : addedToCart ? "Đã thêm" : inCart ? "Trong giỏ" : "Thêm giỏ"}
          </button>
        </div>
      </div>
    </div>
  );
}
