import { useParams, Link, useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { useAuth } from "../../auth/hooks/useAuth";
import DeleteButton from "../components/DeleteButton";
import EditButton from "../components/EditButton";
import "../styles/products.scss";
import { useEffect, useState } from "react";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, loading, error } = useProducts();
  const { isAdmin } = useAuth();
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

  if (loading)
    return <div className="loading-state">Loading product details...</div>;
  if (error) return <div className="error-state">{error}</div>;
  if (!product) return <div className="error-state">Product not found</div>;

  return (
    <div className="product-details-container">
      <div className="detail-header">
        <Link to="/products" className="back-link">
          ← Back to Products
        </Link>
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
          <div className="main-image">
            <img src={product.images[activeImage]} alt={product.name} />
          </div>
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

            {product.sizes && product.sizes.length > 0 && (
              <div className="option-group">
                <h3>Available Sizes</h3>
                <div className="size-list">
                  {product.sizes.map((size, index) => (
                    <span key={index} className="size-tag">
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="stock-info">
            <span
              className={`status-dot ${product.stock > 0 ? "in-stock" : "out-of-stock"}`}
            ></span>
            {product.stock > 0
              ? `${product.stock} units in stock`
              : "Out of Stock"}
          </div>

          <button
            className="add-to-cart-big-btn"
            disabled={product.stock === 0}
          >
            {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
