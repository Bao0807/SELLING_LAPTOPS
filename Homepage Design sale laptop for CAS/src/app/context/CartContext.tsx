import { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { ReactNode } from "react";
import type { Product } from "../data/products";
import { customerApi, mapBackendProduct } from "../utils/api";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

export type CartItem = {
  id?: number;
  product: Product;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isInCart: (productId: number) => boolean;
};

const CartContext = createContext<CartContextType | null>(null);
const GUEST_CART_KEY = "cas_guest_cart";

const loadGuestCart = (): CartItem[] => {
  try {
    return JSON.parse(localStorage.getItem(GUEST_CART_KEY) || "[]");
  } catch {
    return [];
  }
};

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, token, loading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);

  const persistGuest = (next: CartItem[]) => {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(next));
  };

  const fetchServerCart = useCallback(async () => {
    const rows = await customerApi.cart();
    setItems(rows.map((row) => ({
      id: row.id,
      product: mapBackendProduct(row.product),
      quantity: row.quantity,
    })));
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!token || !user) {
      setItems(loadGuestCart());
      return;
    }

    const mergeAndFetch = async () => {
      const guestItems = loadGuestCart();
      if (guestItems.length > 0) {
        await Promise.all(guestItems.map((item) => customerApi.addCart(item.product.id, item.quantity).catch(() => null)));
        localStorage.removeItem(GUEST_CART_KEY);
      }
      await fetchServerCart();
    };

    mergeAndFetch().catch((error) => toast.error(error.message || "Không thể tải giỏ hàng"));
  }, [fetchServerCart, loading, token, user]);

  const addToCart = useCallback(async (product: Product, quantity = 1) => {
    if (quantity <= 0) throw new Error("Số lượng phải lớn hơn 0");

    if (token && user) {
      await customerApi.addCart(product.id, quantity);
      await fetchServerCart();
      toast.success("Đã thêm vào giỏ hàng");
      return;
    }

    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      const nextQuantity = (existing?.quantity || 0) + quantity;
      if (nextQuantity > product.stock) {
        throw new Error("Không đủ hàng trong kho");
      }
      const next = existing
        ? prev.map((item) => item.product.id === product.id ? { ...item, quantity: nextQuantity } : item)
        : [...prev, { product, quantity }];
      persistGuest(next);
      return next;
    });
  }, [fetchServerCart, token, user]);

  const removeFromCart = useCallback(async (productId: number) => {
    const target = items.find((item) => item.product.id === productId);
    if (token && user && target?.id) {
      await customerApi.removeCart(target.id);
      await fetchServerCart();
      return;
    }

    setItems((prev) => {
      const next = prev.filter((item) => item.product.id !== productId);
      persistGuest(next);
      return next;
    });
  }, [fetchServerCart, items, token, user]);

  const updateQuantity = useCallback(async (productId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    const target = items.find((item) => item.product.id === productId);
    if (target && quantity > target.product.stock) {
      throw new Error("Không đủ hàng trong kho");
    }
    if (token && user && target?.id) {
      await customerApi.updateCart(target.id, quantity);
      await fetchServerCart();
      return;
    }

    setItems((prev) => {
      const next = prev.map((item) => item.product.id === productId ? { ...item, quantity } : item);
      persistGuest(next);
      return next;
    });
  }, [fetchServerCart, items, removeFromCart, token, user]);

  const clearCart = useCallback(async () => {
    if (token && user) {
      await customerApi.clearCart().catch(() => null);
    }
    localStorage.removeItem(GUEST_CART_KEY);
    setItems([]);
  }, [token, user]);

  const isInCart = useCallback(
    (productId: number) => items.some((item) => item.product.id === productId),
    [items]
  );

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, totalItems, totalPrice, addToCart, removeFromCart, updateQuantity, clearCart, isInCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
