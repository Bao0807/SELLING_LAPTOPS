import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./app/context/AuthContext.tsx";
import { CartProvider } from "./app/context/CartContext.tsx";
import { WishlistProvider } from "./app/context/WishlistContext.tsx";
import App from "./app/App.tsx";
import "./styles/index.css";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <App />
          <Toaster richColors position="top-right" />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);
