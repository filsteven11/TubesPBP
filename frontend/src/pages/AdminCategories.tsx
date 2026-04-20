import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { api } from "../api/axios";

interface Category {
  id: number;
  name: string;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");
  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      setError("Failed to fetch categories");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authContext?.token || !categoryName) return;

    try {
      await api.post(
        "/categories",
        { name: categoryName },
        {
          headers: { Authorization: `Bearer ${authContext.token}` },
        }
      );

      fetchCategories();
      setShowForm(false);
      setCategoryName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add category");
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h2>🏷️ Manage Categories</h2>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + Add Category
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="form-box">
          <h3>Add New Category</h3>

          <div className="form-group">
            <label>Category Name:</label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g., Breakfast, Lunch, Snacks"
              required
            />
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-success">
              Add
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setShowForm(false);
                setCategoryName("");
              }}
            >
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
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
