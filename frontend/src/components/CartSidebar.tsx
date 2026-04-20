import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { api } from "../api/axios";

interface CartItem {
  id: number;
  name: string;
  price: number;
  [key: string]: unknown;
}

export default function CartSidebar() {
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    return <div>Error: Cart context not available</div>;
  }

  const { cart, removeFromCart, total, resetCart } = cartContext;

  const checkout = async () => {
    const items = cart.map((c: CartItem) => ({
      productId: c.id,
      quantity: 1,
      price: c.price
    }));

    try {
      await api.post("/orders", { items });
      alert("Order success!");
      resetCart();
    } catch (error) {
      alert("Order failed!");
      console.error(error);
    }
  };

  return (
    <div className="cart">
      <h2>Cart</h2>

      {cart.map((item: CartItem, i: number) => (
        <div key={i} className="cart-item">
          {item.name}
          <button onClick={() => removeFromCart(i)}>x</button>
        </div>
      ))}

      <h3>Total: Rp {total}</h3>

      <button onClick={checkout}>Checkout</button>
    </div>
  );
}