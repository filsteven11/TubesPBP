import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { api } from "../api/api";

interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  total: number;
  status: "pending" | "completed" | "cancelled";
  items: OrderItem[];
  createdAt: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<{ [key: number]: string }>({});
  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    if (!authContext?.token) return;

    try {
      const res = await api.get("/orders");
      setOrders(res.data);
      
      // Initialize status selector with current statuses
      const statusMap: { [key: number]: string } = {};
      res.data.forEach((order: Order) => {
        statusMap[order.id] = order.status;
      });
      setSelectedStatus(statusMap);
    } catch (err) {
      setError("Failed to fetch orders");
    }
  };

  const handleStatusUpdate = async (orderId: number) => {
    if (!authContext?.token) return;

    try {
      await api.put(`/orders/${orderId}`, { status: selectedStatus[orderId] });

      fetchOrders();
    } catch (err) {
      setError("Failed to update order status");
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h2>📋 Manage Orders</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Total</th>
              <th>Status</th>
              <th>Items</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>Rp {order.total.toLocaleString()}</td>
                <td>
                  <span className={`status-badge status-${order.status}`}>
                    {order.status}
                  </span>
                </td>
                <td>{order.items?.length || 0} items</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="action-buttons">
                  <select
                    value={selectedStatus[order.id] || order.status}
                    onChange={(e) =>
                      setSelectedStatus({
                        ...selectedStatus,
                        [order.id]: e.target.value,
                      })
                    }
                    className="status-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button
                    className="btn-success"
                    onClick={() => handleStatusUpdate(order.id)}
                  >
                    💾 Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <div className="empty-state">
          <p>No orders found</p>
        </div>
      )}
    </div>
  );
}
