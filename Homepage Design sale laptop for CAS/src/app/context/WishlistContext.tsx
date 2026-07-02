import { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { ReactNode } from "react";
import type { Product } from "../data/products";
import { customerApi, mapBackendProduct } from "../utils/api";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

type WishlistEntry = {
  id?: number;
  product: Product;
};

type WishlistContextType = {
  items: Product[];
  totalItems: number;
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
  isWishlisted: (productId: number) => boolean;
  toggleWishlist: (product: Product) => Promise<void>;
};

const WishlistContext = createContext<WishlistContextType | null>(null);
const GUEST_WISHLIST_KEY = "cas_guest_wishlist";

const loadGuestWishlist = (): WishlistEntry[] => {
  try {
    return JSON.parse(localStorage.getItem(GUEST_WISHLIST_KEY) || "[]");
  } catch {
    return [];
  }
};

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user, token, loading } = useAuth();
  const [entries, setEntries] = useState<WishlistEntry[]>([]);

  const persistGuest = (next: WishlistEntry[]) => {
    localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(next));
  };

  const fetchServerWishlist = useCallback(async () => {
    const rows = await customerApi.wishlist();
    setEntries(rows.map((row) => ({ id: row.id, product: mapBackendProduct(row.product) })));
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!token || !user) {
      setEntries(loadGuestWishlist());
      return;
    }

    const mergeAndFetch = async () => {
      const guestItems = loadGuestWishlist();
      if (guestItems.length > 0) {
        await Promise.all(guestItems.map((item) => customerApi.addWishlist(item.product.id).catch(() => null)));
        localStorage.removeItem(GUEST_WISHLIST_KEY);
      }
      await fetchServerWishlist();
    };

    mergeAndFetch().catch((error) => toast.error(error.message || "Không thể tải danh sách yêu thích"));
  }, [fetchServerWishlist, loading, token, user]);

  const addToWishlist = useCallback(async (product: Product) => {
    if (token && user) {
      await customerApi.addWishlist(product.id);
      await fetchServerWishlist();
      toast.success("Đã thêm vào yêu thích");
      return;
    }

    setEntries((prev) => {
      if (prev.some((entry) => entry.product.id === product.id)) return prev;
      const next = [...prev, { product }];
      persistGuest(next);
      return next;
    });
  }, [fetchServerWishlist, token, user]);

  const removeFromWishlist = useCallback(async (productId: number) => {
    const target = entries.find((entry) => entry.product.id === productId);
    if (token && user && target?.id) {
      await customerApi.removeWishlist(target.id);
      await fetchServerWishlist();
      return;
    }

    setEntries((prev) => {
      const next = prev.filter((entry) => entry.product.id !== productId);
      persistGuest(next);
      return next;
    });
  }, [entries, fetchServerWishlist, token, user]);

  const isWishlisted = useCallback(
    (productId: number) => entries.some((entry) => entry.product.id === productId),
    [entries]
  );

  const toggleWishlist = useCallback(async (product: Product) => {
    if (entries.some((entry) => entry.product.id === product.id)) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  }, [addToWishlist, entries, removeFromWishlist]);

  const items = entries.map((entry) => entry.product);

  return (
    <WishlistContext.Provider value={{ items, totalItems: items.length, addToWishlist, removeFromWishlist, isWishlisted, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
