import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { api } from "../api/api";

interface Product {
  id: number;
  name: string;
  price: number;
  categoryId: number;
}

interface Category {
  id: number;
  name: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", price: "", categoryId: "" });
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get("/products"),
        api.get("/categories"),
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      setError("Failed to fetch data");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authContext?.token) return;

    try {
      const payload = {
        name: formData.name,
        price: parseFloat(formData.price),
        categoryId: parseInt(formData.categoryId),
      };

      if (editId) {
        await api.put(`/products/${editId}`, payload);
      } else {
        await api.post("/products", payload);
      }

      fetchData();
      setShowForm(false);
      setFormData({ name: "", price: "", categoryId: "" });
      setEditId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      price: product.price.toString(),
      categoryId: product.categoryId.toString(),
    });
    setEditId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!authContext?.token) return;

    if (!confirm("Are you sure?")) return;

    try {
      await api.delete(`/products/${id}`);
      fetchData();
    } catch (err) {
      setError("Failed to delete product");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({ name: "", price: "", categoryId: "" });
    setEditId(null);
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h2>📦 Manage Products</h2>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + Add Product
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="form-box">
          <h3>{editId ? "Edit Product" : "Add New Product"}</h3>

          <div className="form-group">
            <label>Product Name:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Price:</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Category:</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-success">
              {editId ? "Update" : "Add"}
            </button>
            <button type="button" className="btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>Rp {product.price.toLocaleString()}</td>
                <td>
                  {categories.find((c) => c.id === product.categoryId)?.name || "Unknown"}
                </td>
                <td className="action-buttons">
                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(product)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(product.id)}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
