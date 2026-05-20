import React, { useEffect, useState } from "react";
import { getMyOrdersApi } from "../services/order.api";
import { Link } from "react-router-dom";
import "../styles/orders.scss";

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

  if (loading) return <div className="loading-state">Loading orders...</div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="orders-page">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p className="start-shopping-msg">
          You have no orders yet. <Link to="/products">Start shopping!</Link>
        </p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div>
                  <strong>Order ID</strong>
                  {order._id}
                </div>
                <div>
                  <strong>Status</strong>
                  <span className={`status-text status-${order.orderStatus}`}>
                    {order.orderStatus}
                  </span>
                </div>
                <div>
                  <strong>Total Amount</strong>
                  ${order.totalAmount.toFixed(2)}
                </div>
              </div>

              <div className="order-items">
                {order.products.map((item, index) => (
                  <div key={index} className="order-item-row">
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <div className="no-image-placeholder">No Image</div>
                    )}
                    <div className="order-item-info">
                      <p>{item.name}</p>
                      <p>
                        Qty: {item.quantity} × ${item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {order.shippingAddress && (
                <div className="shipping-details">
                  <strong>Shipping to:</strong>
                  {order.shippingAddress.fullName} | {order.shippingAddress.address},{" "}
                  {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                  {order.shippingAddress.postalCode}, {order.shippingAddress.country} | Phone:{" "}
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
