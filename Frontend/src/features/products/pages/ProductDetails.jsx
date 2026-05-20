import { useParams, Link, useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { useAuth } from "../../auth/hooks/useAuth";
import { useCart } from "../../cart/hooks/useCart";
import DeleteButton from "../components/DeleteButton";
import EditButton from "../components/EditButton";
import "../styles/productdetails.scss";
import { useEffect, useState } from "react";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, loading, error } = useProducts();
  const { isAdmin, user } = useAuth();
  const { addToCart, loading: cartLoading } = useCart();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data.product);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      // You can either redirect to login or show a message
      alert("Please login to add items to your cart.");
      navigate("/login");
      return;
    }
    await addToCart(product._id, 1);
  };

  if (loading)
    return <div className="loading-state">Loading product details...</div>;
  if (error) return <div className="error-state">{error}</div>;
  if (!product) return <div className="error-state">Product not found</div>;

  return (
    <div className="product-details-container">
      <div className="detail-header">
        {isAdmin && (
          <div className="admin-detail-actions">
            <EditButton productId={product._id} />
            <DeleteButton
              productId={product._id}
              productName={product.name}
              onDeleteSuccess={() => navigate("/products")}
            />
          </div>
        )}
      </div>

      <div className="product-details-content">
        {/* Left Side: Images */}
        <div className="product-images-section">
          <img className="main-image" src={product.images[activeImage]} alt={product.name} />
          <div className="thumbnail-grid">
            {product.images.map((img, index) => (
              <div
                key={index}
                className={`thumbnail ${activeImage === index ? "active" : ""}`}
                onClick={() => setActiveImage(index)}
              >
                <img src={img} alt={`${product.name} ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Info */}
        <div className="product-info-section">
          <span className="category-tag">{product.category}</span>
          <h1 className="detail-name">{product.name}</h1>
          <p className="detail-price">${product.price}</p>

          <div className="detail-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="detail-options">
            {product.colors && product.colors.length > 0 && (
              <div className="option-group">
                <h3>Colors</h3>
                <div className="color-list">
                  {product.colors.map((color, index) => (
                    <span key={index} className="color-tag">
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {
              <div className="option-group">
                <h3>Available Sizes</h3>
                <div className="size-list">
                  <span className="size-tag">{product.size}</span>
                  <span className="size-tag">{product.measurements}</span>
                </div>
              </div>
            }
          </div>

          {product.stock < 7 && (
            <div className="stock-info">
              <span
                className={`status-dot ${product.stock > 0 ? "in-stock" : "out-of-stock"}`}
              ></span>
              {product.stock === 0 ? "Out of Stock" : `${product.stock} units in stock`}
            </div>
          )}

          <button
            className="add-to-cart-big-btn"
            disabled={product.stock === 0 || cartLoading}
            onClick={handleAddToCart}
          >
            {cartLoading
              ? "Adding..."
              : product.stock > 0
                ? "Add to Cart"
                : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
