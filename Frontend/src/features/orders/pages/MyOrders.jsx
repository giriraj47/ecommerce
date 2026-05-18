import React, { useEffect, useState } from "react";
import { getMyOrdersApi } from "../services/order.api";
import { Link } from "react-router-dom";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrdersApi();
        setOrders(data.orders);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div
      className="orders-container"
      style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto" }}
    >
      <h2
        style={{
          marginBottom: "2rem",
          fontSize: "2rem",
          color: "var(--primary-color)",
        }}
      >
        My Orders
      </h2>
      {orders.length === 0 ? (
        <p>
          You have no orders yet. <Link to="/products">Start shopping!</Link>
        </p>
      ) : (
        <div
          className="orders-list"
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {orders.map((order) => (
            <div
              key={order._id}
              className="order-card"
              style={{
                background: "var(--card-bg)",
                padding: "1.5rem",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "1px solid var(--border-color)",
                  paddingBottom: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <div>
                  <strong>Order ID:</strong> {order._id}
                </div>
                <div>
                  <strong>Status:</strong>{" "}
                  <span
                    style={{
                      textTransform: "capitalize",
                      fontWeight: "600",
                      color:
                        order.orderStatus === "delivered"
                          ? "green"
                          : "var(--primary-color)",
                    }}
                  >
                    {order.orderStatus}
                  </span>
                </div>
                <div>
                  <strong>Total:</strong> ${order.totalAmount.toFixed(2)}
                </div>
              </div>

              <div className="order-items">
                {order.products.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "60px",
                          height: "60px",
                          background: "#eee",
                          borderRadius: "4px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        No Image
                      </div>
                    )}
                    <div>
                      <p style={{ fontWeight: "600" }}>{item.name}</p>
                      <p>
                        Qty: {item.quantity} x ${item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {order.shippingAddress && (
                <div
                  style={{
                    marginTop: "1.5rem",
                    borderTop: "1px dashed var(--border-color)",
                    paddingTop: "1rem",
                    fontSize: "0.85rem",
                    color: "#64748b",
                  }}
                >
                  <strong>Shipping to:</strong> {order.shippingAddress.fullName}{" "}
                  | {order.shippingAddress.address},{" "}
                  {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                  {order.shippingAddress.postalCode},{" "}
                  {order.shippingAddress.country} | Phone:{" "}
                  {order.shippingAddress.phone}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
