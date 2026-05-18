import React, { useEffect, useState } from "react";
import { getAllOrdersApi, updateOrderStatusApi } from "../services/order.api";

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

  if (loading) return <div className="loading">Loading admin dashboard...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div
      className="admin-orders-container"
      style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}
    >
      <h2
        style={{
          marginBottom: "2rem",
          fontSize: "2rem",
          color: "var(--primary-color)",
        }}
      >
        Manage Orders
      </h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="table-responsive" style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "var(--card-bg)",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <thead
              style={{
                background: "var(--primary-color)",
                color: "white",
                textAlign: "left",
              }}
            >
              <tr>
                <th style={{ padding: "1rem" }}>Order ID</th>
                <th style={{ padding: "1rem" }}>Customer</th>
                <th style={{ padding: "1rem" }}>Total</th>
                <th style={{ padding: "1rem" }}>Payment</th>
                <th style={{ padding: "1rem" }}>Status</th>
                <th style={{ padding: "1rem" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  style={{ borderBottom: "1px solid var(--border-color)" }}
                >
                  <td style={{ padding: "1rem" }}>{order._id}</td>
                  <td style={{ padding: "1rem" }}>
                    {order.user ? order.user.name : "Unknown"} <br />
                    <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
                      {order.user ? order.user.email : ""}
                    </span>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td style={{ padding: "1rem", textTransform: "capitalize" }}>
                    {order.paymentMethod}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <span
                      style={{
                        padding: "0.25rem 0.5rem",
                        borderRadius: "4px",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        background:
                          order.orderStatus === "delivered"
                            ? "#dcfce7"
                            : "#fef9c3",
                        color:
                          order.orderStatus === "delivered"
                            ? "#166534"
                            : "#854d0e",
                      }}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <select
                      value={order.orderStatus}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      disabled={order.orderStatus === "delivered"}
                      style={{
                        padding: "0.5rem",
                        borderRadius: "4px",
                        border: "1px solid var(--border-color)",
                      }}
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
