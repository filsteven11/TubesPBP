import { useContext } from "react";
import { CartContext } from "../context/CartContext";

interface Product {
  id: number;
  name: string;
  price: number;
  [key: string]: unknown;
}

export default function ProductCard({ product }: { product: Product }) {
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    return <div>Error: Cart context not available</div>;
  }

  const { addToCart } = cartContext;

  return (
    <div className="card">
      <h3>{product.name}</h3>
      <p>Rp {product.price}</p>
      <button onClick={() => addToCart(product)}>Add</button>
    </div>
  );
}