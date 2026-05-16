import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import "../styles/cart.scss";

const Cart = () => {
  const { cartItems, totalAmount, updateQuantity, clearCart, loading, error } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 0) return;
    await updateQuantity(productId, newQuantity);
  };

  const handleCheckout = () => {
    // Navigate to checkout page when built
    alert("Checkout functionality coming soon!");
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
          <Link to="/products" className="btn-primary">Continue Shopping</Link>
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
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={loading}
                    >-</button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      disabled={loading}
                    >+</button>
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
            
            <button className="checkout-btn" onClick={handleCheckout} disabled={loading}>
              Proceed to Checkout
            </button>
            <button className="clear-cart-btn" onClick={clearCart} disabled={loading}>
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
