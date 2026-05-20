import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import "../styles/cartdrawer.scss";

const CartDrawer = () => {
  const {
    cartItems,
    totalAmount,
    updateQuantity,
    isCartOpen,
    setIsCartOpen,
    loading,
  } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    navigate("/cart");
  };

  const handleQuantityChange = async (productId, currentQty, amount) => {
    const newQty = currentQty + amount;
    if (newQty < 0) return;
    await updateQuantity(productId, newQty);
  };

  // Calculate total count of items in cart
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      {/* Dimmed backdrop overlay */}
      <div 
        className={`cart-drawer-backdrop ${isCartOpen ? "visible" : ""}`} 
        onClick={() => setIsCartOpen(false)}
      />

      {/* Sliding cart drawer */}
      <div className={`cart-drawer ${isCartOpen ? "open" : ""}`}>
        {/* Header */}
        <div className="cart-drawer__header">
          <h2 className="cart-drawer__title">
            {totalItemsCount} {totalItemsCount === 1 ? "item" : "items"} in cart
          </h2>
          <button 
            className="cart-drawer__close-btn" 
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="cart-drawer__content">
          {cartItems.length === 0 ? (
            <div className="cart-drawer__empty">
              <p>Your cart is empty.</p>
              <button 
                className="cart-drawer__shop-btn"
                onClick={() => {
                  setIsCartOpen(false);
                  navigate("/products");
                }}
              >
                Shop Now
              </button>
            </div>
          ) : (
            <div className="cart-drawer__items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-drawer-item">
                  <div className="cart-drawer-item__image">
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <div className="cart-drawer-item__image-placeholder">No Image</div>
                    )}
                  </div>
                  
                  <div className="cart-drawer-item__info">
                    <div className="cart-drawer-item__header">
                      <h4 className="cart-drawer-item__name">{item.name}</h4>
                      <span className="cart-drawer-item__price">${item.price.toFixed(2)}</span>
                    </div>

                    <div className="cart-drawer-item__actions">
                      <div className="cart-drawer-item__qty-selector">
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                          disabled={loading}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                          disabled={loading}
                        >
                          +
                        </button>
                      </div>
                      
                      <button 
                        className="cart-drawer-item__remove-btn"
                        onClick={() => updateQuantity(item.id, 0)}
                        disabled={loading}
                        aria-label="Remove item"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-drawer__subtotal-row">
              <span className="cart-drawer__subtotal-label">Subtotal</span>
              <span className="cart-drawer__subtotal-val">${totalAmount.toFixed(2)}</span>
            </div>
            
            <button 
              className="cart-drawer__checkout-btn"
              onClick={handleCheckoutClick}
              disabled={loading}
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
