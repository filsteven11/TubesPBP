import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function AdminDashboard() {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  if (!authContext) {
    return <div>Loading...</div>;
  }

  const handleLogout = () => {
    authContext.logout();
    navigate("/login");
  };

  return (
    <div className="admin-container">
      <nav className="admin-navbar">
        <div className="navbar-brand">
          <h2>🍔 McD Admin Panel</h2>
        </div>
        <div className="navbar-menu">
          <Link to="/admin/products" className="nav-link">Products</Link>
          <Link to="/admin/categories" className="nav-link">Categories</Link>
          <Link to="/admin/orders" className="nav-link">Orders</Link>
          <span className="user-info">👤 {authContext.user?.email}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <main className="admin-main">
        <div className="dashboard-cards">
          <div className="card">
            <h3>📦 Products</h3>
            <p>Manage menu items</p>
            <Link to="/admin/products" className="card-link">Manage</Link>
          </div>
          <div className="card">
            <h3>🏷️ Categories</h3>
            <p>Manage product categories</p>
            <Link to="/admin/categories" className="card-link">Manage</Link>
          </div>
          <div className="card">
            <h3>📋 Orders</h3>
            <p>View and update orders</p>
            <Link to="/admin/orders" className="card-link">View</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
