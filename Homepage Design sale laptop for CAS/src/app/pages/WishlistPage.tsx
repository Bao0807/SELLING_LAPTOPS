import { Link } from "react-router";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../data/products";
import { StarRating } from "../components/ui/ProductCard";

export function WishlistPage() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart, isInCart } = useCart();

  if (items.length === 0) {
    return (
      <div
        style={{ paddingTop: "140px", minHeight: "100vh", backgroundColor: "#f8fafc" }}
        className="flex flex-col items-center justify-center"
      >
        <div className="text-center">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: "#fff1f2" }}
          >
            <Heart size={40} style={{ color: "#ef4444" }} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Danh sách yêu thích trống
          </h2>
          <p className="text-gray-500 mb-8">
            Hãy thêm sản phẩm yêu thích để dễ dàng tìm lại sau!
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium"
            style={{ backgroundColor: "#2563eb" }}
          >
            <ShoppingBag size={18} />
            Khám phá sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: "140px", minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Heart size={24} style={{ color: "#ef4444" }} />
          <h1 className="text-2xl font-bold text-gray-900">
            Yêu thích ({items.length} sản phẩm)
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map((product) => {
            const inCart = isInCart(product.id);
            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                {/* Image */}
                <div className="relative" style={{ aspectRatio: "4/3" }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.discount && (
                    <div
                      className="absolute top-3 left-3 px-2 py-1 rounded-lg text-white text-xs font-bold"
                      style={{ backgroundColor: "#dc2626" }}
                    >
                      -{product.discount}%
                    </div>
                  )}
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center hover:bg-red-50 transition-colors"
                    title="Xóa khỏi yêu thích"
                  >
                    <Trash2 size={14} className="text-red-500" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-4">
                  <span className="text-xs text-gray-400 mb-1">{product.brand}</span>
                  <h3 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2 mb-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <StarRating rating={product.rating} />
                    <span className="text-xs text-amber-500 font-semibold">{product.rating}</span>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-base font-extrabold" style={{ color: "#2563eb" }}>
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    {product.oldPrice && (
                      <span className="text-xs line-through text-gray-400">
                        {formatPrice(product.oldPrice)}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-3">
                    <Link
                      to={`/product/${product.id}`}
                      className="flex-1 py-2.5 rounded-xl text-xs border-2 text-center transition-all hover:bg-blue-50"
                      style={{ borderColor: "#2563eb", color: "#2563eb" }}
                    >
                      Xem chi tiết
                    </Link>
                    <button
                      onClick={() => addToCart(product)}
                      className="flex-1 py-2.5 rounded-xl text-xs text-white transition-all"
                      style={{ backgroundColor: inCart ? "#10b981" : "#2563eb" }}
                      onMouseEnter={(e) => {
                        if (!inCart) e.currentTarget.style.backgroundColor = "#1d4ed8";
                      }}
                      onMouseLeave={(e) => {
                        if (!inCart) e.currentTarget.style.backgroundColor = "#2563eb";
                      }}
                    >
                      {inCart ? "✓ Đã thêm" : "Thêm vào giỏ"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
