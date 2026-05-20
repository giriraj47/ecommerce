import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../../auth/hooks/useAuth";
import { createOrderApi } from "../../orders/services/order.api";
import {
  checkoutRazorpayApi,
  verifyRazorpayPaymentApi,
} from "../../orders/services/payment.api";
import "../styles/cart.scss";

const Cart = () => {
  const {
    cartItems,
    totalAmount,
    updateQuantity,
    clearCart,
    loading,
    error,
    refreshCart,
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);
  const [shippingAddress, setShippingAddress] = React.useState("");
  const [selectedAddressIndex, setSelectedAddressIndex] = React.useState("");
  const [paymentMethod, setPaymentMethod] = React.useState("card");
  const [checkoutLoading, setCheckoutLoading] = React.useState(false);

  const addresses = user?.addresses || [];

  // Automatically select the default address or first address on load
  React.useEffect(() => {
    if (addresses.length > 0) {
      const defaultIdx = addresses.findIndex((addr) => addr.isDefault);
      const selectedIdx = defaultIdx !== -1 ? defaultIdx : 0;
      setSelectedAddressIndex(selectedIdx.toString());

      const addr = addresses[selectedIdx];
      const formattedAddress = `${addr.fullName}, Phone: ${addr.phone}, Address: ${addr.address}, ${addr.city}, ${addr.state} - ${addr.postalCode}, ${addr.country}`;
      setShippingAddress(formattedAddress);
    }
  }, [user]);

  const handleAddressChange = (e) => {
    const idx = parseInt(e.target.value);
    setSelectedAddressIndex(e.target.value);
    if (!isNaN(idx) && addresses[idx]) {
      const addr = addresses[idx];
      const formattedAddress = `${addr.fullName}, Phone: ${addr.phone}, Address: ${addr.address}, ${addr.city}, ${addr.state} - ${addr.postalCode}, ${addr.country}`;
      setShippingAddress(formattedAddress);
    } else {
      setShippingAddress("");
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 0) return;
    await updateQuantity(productId, newQuantity);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const submitOrder = async () => {
    const idx = parseInt(selectedAddressIndex);
    const addr = addresses[idx];
    if (!addr) {
      alert("Please select a shipping address");
      return;
    }

    const shippingAddressObj = {
      fullName: addr.fullName,
      phone: addr.phone,
      address: addr.address,
      city: addr.city || "N/A",
      state: addr.state || "N/A",
      postalCode: addr.postalCode || "N/A",
      country: addr.country || "N/A",
    };

    setCheckoutLoading(true);
    try {
      if (paymentMethod === "cod") {
        await createOrderApi({
          shippingAddress: shippingAddressObj,
          paymentMethod,
        });
        alert("Order placed successfully!");
        if (refreshCart) {
          await refreshCart();
        } else {
          // Fallback if refreshCart doesn't exist
          window.location.reload();
        }
        navigate("/orders");
      } else {
        const isScriptLoaded = await loadRazorpayScript();
        if (!isScriptLoaded) {
          alert(
            "Failed to load Razorpay SDK. Please check your internet connection.",
          );
          setCheckoutLoading(false);
          return;
        }

        // 1. Create Razorpay Order on the backend
        const { razorpayOrder } = await checkoutRazorpayApi(totalAmount);

        // 2. Configure and open Razorpay Checkout Modal
        const options = {
          key:
            import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_SqkluKBO8eYxvA",
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "E-Commerce Store",
          description: "Secure Order Payment",
          image: "/favicon.png",
          order_id: razorpayOrder.id,
          handler: async function (response) {
            try {
              setCheckoutLoading(true);
              // 3. Verify payment signature on backend
              await verifyRazorpayPaymentApi({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              });

              // 4. Create local DB order on backend after verification
              await createOrderApi({
                shippingAddress: shippingAddressObj,
                paymentMethod: "card",
              });

              alert("Payment successful! Order placed successfully.");
              if (refreshCart) {
                await refreshCart();
              } else {
                window.location.reload();
              }
              navigate("/orders");
            } catch (verifyErr) {
              alert(
                verifyErr.response?.data?.message ||
                  "Payment verification failed!",
              );
            } finally {
              setCheckoutLoading(false);
            }
          },
          prefill: {
            name: user?.name || "",
            email: user?.email || "",
            contact: addr.phone || "",
          },
          theme: {
            color: "#6366f1",
          },
          modal: {
            ondismiss: function () {
              setCheckoutLoading(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to process payment/order");
      setCheckoutLoading(false);
    }
  };

  if (loading && cartItems.length === 0) {
    return <div className="cart-page loading">Loading cart...</div>;
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>

      {error && <div className="error-message">{error}</div>}

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <Link to="/products" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  {item.image ? (
                    <img src={item.image} alt={item.name} />
                  ) : (
                    <div className="placeholder">No Image</div>
                  )}
                </div>
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="price">${item.price}</p>
                </div>
                <div className="item-actions">
                  <div className="quantity-controls">
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity - 1)
                      }
                      disabled={loading}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + 1)
                      }
                      disabled={loading}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => handleQuantityChange(item.id, 0)}
                    disabled={loading}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>

            {isCheckingOut ? (
              <div className="checkout-form" style={{ marginTop: "1rem" }}>
                {addresses.length === 0 ? (
                  <div
                    style={{
                      marginBottom: "1rem",
                      color: "var(--error-color)",
                      fontSize: "0.9rem",
                    }}
                  >
                    You have no saved addresses. Please{" "}
                    <Link
                      to="/profile"
                      style={{
                        textDecoration: "underline",
                        color: "var(--primary-color)",
                      }}
                    >
                      add an address to your profile
                    </Link>{" "}
                    before checking out.
                  </div>
                ) : (
                  <div style={{ marginBottom: "1rem" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        fontWeight: "600",
                        fontSize: "0.85rem",
                      }}
                    >
                      Select Shipping Address:
                    </label>
                    <select
                      value={selectedAddressIndex}
                      onChange={handleAddressChange}
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        borderRadius: "4px",
                        border: "1px solid var(--border-color)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {addresses.map((addr, idx) => (
                        <option key={idx} value={idx}>
                          {addr.fullName} - {addr.address}, {addr.city}{" "}
                          {addr.isDefault ? "(Default)" : ""}
                        </option>
                      ))}
                    </select>
                    <div
                      style={{
                        padding: "0.5rem",
                        background: "#f1f5f9",
                        borderRadius: "4px",
                        fontSize: "0.85rem",
                        color: "#475569",
                      }}
                    >
                      <strong>Delivery Details:</strong> <br />
                      {shippingAddress}
                    </div>
                  </div>
                )}

                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                    fontSize: "0.85rem",
                  }}
                >
                  Payment Method:
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    marginBottom: "1rem",
                    borderRadius: "4px",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <option value="paynow">Pay Now</option>
                  <option value="cod">Cash on Delivery</option>
                </select>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    className="checkout-btn"
                    onClick={submitOrder}
                    disabled={
                      checkoutLoading || loading || addresses.length === 0
                    }
                    style={{ flex: 1 }}
                  >
                    {checkoutLoading ? "Placing Order..." : "Confirm Order"}
                  </button>
                  <button
                    className="clear-cart-btn"
                    onClick={() => setIsCheckingOut(false)}
                    disabled={checkoutLoading}
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button
                  className="checkout-btn"
                  onClick={() => setIsCheckingOut(true)}
                  disabled={loading}
                >
                  Proceed to Checkout
                </button>
                <button
                  className="clear-cart-btn"
                  onClick={clearCart}
                  disabled={loading}
                >
                  Clear Cart
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
