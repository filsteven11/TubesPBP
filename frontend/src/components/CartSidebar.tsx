import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { api } from "../api/api";

interface CartItem {
  id: number;
  name: string;
  price: number;
  [key: string]: unknown;
}

export default function CartSidebar() {
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    return <div>Cart  not available</div>;
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
      <h2>Your Cart</h2>

      <div className="cart-items-container">
        {cart.map((item: CartItem, i: number) => (
          <div key={i} className="cart-item">
            <span className="cart-item-name">{item.name}</span>
            <span className="cart-item-price">Rp {item.price}</span>
            <button className="cart-item-remove" onClick={() => removeFromCart(i)}>✖</button>
          </div>
        ))}
      </div>

      <div className="cart-total">
        <span>Total:</span>
        <span>Rp {total}</span>
      </div>

      <button className="btn-checkout" onClick={checkout}>Checkout</button>
      {cart.length > 0 && (
        <button className="btn-reset" onClick={resetCart}>Clear Cart</button>
      )}
    </div>
  );
}