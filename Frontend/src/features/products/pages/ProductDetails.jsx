import { useParams, Link, useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { useAuth } from "../../auth/hooks/useAuth";
import { useCart } from "../../cart/hooks/useCart";
import DeleteButton from "../components/DeleteButton";
import EditButton from "../components/EditButton";
import "../styles/productdetails.scss";
import { useEffect, useState } from "react";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";

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
          <div className="carousel-container">
            <img
              className="main-image"
              src={product.images[activeImage]}
              alt={product.name}
            />
            <div className="carousel-nav">
              <button
                className="prev-btn"
                onClick={() =>
                  setActiveImage(
                    (prev) =>
                      (prev - 1 + product.images.length) %
                      product.images.length,
                  )
                }
                aria-label="Previous Image"
              >
                <MdArrowBackIosNew />
              </button>
              <button
                className="next-btn"
                onClick={() =>
                  setActiveImage((prev) => (prev + 1) % product.images.length)
                }
                aria-label="Next Image"
              >
                <MdArrowForwardIos />
              </button>
            </div>
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

          <div className="detail-specifications">
            {product.colors && (
              <div className="spec-row">
                <span className="spec-label">Color</span>
                <span className="spec-value">{product.colors}</span>
              </div>
            )}
            {product.size && (
              <div className="spec-row">
                <span className="spec-label">Size</span>
                <span className="spec-value">{product.size}</span>
              </div>
            )}
            {product.measurements && (
              <div className="spec-row spec-row--block">
                <span className="spec-label">Measurements</span>
                <span className="spec-value">{product.measurements}</span>
              </div>
            )}
          </div>

          {/* {product.stock < 7 && (
            <div
              className={`stock-info ${product.stock > 0 ? "stock-info--low" : "stock-info--out"}`}
            >
              {product.stock === 0
                ? "Out of Stock"
                : `Only ${product.stock} left in stock`}
            </div>
          )} */}

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
