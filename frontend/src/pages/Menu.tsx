import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import ProductCard from "../components/ProductCard";
import CartSidebar from "../components/CartSidebar";
import { CartProvider } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

interface Product {
  id: number;
  name: string;
  price: number;
  [key: string]: unknown;
}

function MenuContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="container">
      <nav className="menu-navbar">
        <h1 className="menu-title">🍔 McDonald's Menu</h1>
        <div className="menu-nav-links">
          {authContext?.isAdmin && (
            <button
              className="btn-admin"
              onClick={() => navigate("/admin")}
            >
              Admin Panel
            </button>
          )}
          {authContext?.isAuthenticated ? (
            <button
              className="btn-logout"
              onClick={() => {
                authContext.logout();
                navigate("/login");
              }}
            >
              Logout
            </button>
          ) : (
            <button
              className="btn-login"
              onClick={() => navigate("/login")}
            >
              Admin Login
            </button>
          )}
        </div>
      </nav>

      <div className="menu">
        <div className="grid">
          {products.map((p: Product) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      <CartSidebar />
    </div>
  );
}

export default function Menu() {
  return (
    <CartProvider>
      <MenuContent />
    </CartProvider>
  );
}