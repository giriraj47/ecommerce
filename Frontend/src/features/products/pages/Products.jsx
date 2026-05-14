import React, { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { useAuth } from "../../auth/hooks/useAuth";
import DeleteButton from "../components/DeleteButton";
import "../styles/products.scss";

const Products = () => {
  const [params, setParams] = useSearchParams();
  const { products, loading, error, getAllProducts, totalPages } =
    useProducts();
  const { isAdmin } = useAuth();

  const currentPage = params.get("page") || 1;

  useEffect(() => {
    setParams({ page: currentPage });
  }, []);

  useEffect(() => {
    getAllProducts(params.get("page"));
  }, [params]);

  if (loading) return <div className="loading-state">Loading products...</div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <>
      <div className="products-page">
        <h1 className="page-title">All Products</h1>
        <div className="products-grid">
          {products.map((product) => (
            <Link
              to={`/products/${product._id}`}
              key={product._id}
              className="product-card-link"
            >
              <div className="product-card">
                {isAdmin && (
                  <div className="admin-card-actions">
                    <DeleteButton
                      productId={product._id}
                      productName={product.name}
                      onDeleteSuccess={getAllProducts}
                    />
                  </div>
                )}
                <div className="product-image">
                  {product.images && product.images.length > 0 ? (
                    <img src={product.images[0]} alt={product.name} />
                  ) : (
                    <div className="image-placeholder">No Image</div>
                  )}
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">${product.price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="pagination">
        <button
          onClick={() => setParams({ page: Number(currentPage) - 1 })}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setParams({ page: Number(currentPage) + 1 })}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default Products;
