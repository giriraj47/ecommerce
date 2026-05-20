import React, { useEffect, useState } from "react";
import { getAllOrdersApi, updateOrderStatusApi } from "../services/order.api";
import "../styles/orders.scss";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getAllOrdersApi();
      setOrders(data.orders);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatusApi(orderId, newStatus);
      // Update local state to reflect change without refetching all
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order,
        ),
      );
      alert("Order status updated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update order status");
    }
  };

  if (loading) return <div className="loading-state">Loading admin dashboard...</div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="admin-orders-page">
      <h2>Manage Orders</h2>
      {orders.length === 0 ? (
        <p className="start-shopping-msg">No orders found.</p>
      ) : (
        <div className="table-responsive">
          <table className="admin-orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>
                    <span className="cust-name">{order.user ? order.user.name : "Unknown"}</span>
                    <br />
                    <span className="cust-email">
                      {order.user ? order.user.email : ""}
                    </span>
                  </td>
                  <td>${order.totalAmount.toFixed(2)}</td>
                  <td style={{ textTransform: "capitalize" }}>
                    {order.paymentMethod}
                  </td>
                  <td>
                    <span className={`admin-status-badge status-${order.orderStatus}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td>
                    <select
                      className="status-select"
                      value={order.orderStatus}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      disabled={order.orderStatus === "delivered"}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
