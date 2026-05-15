import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { useAuth } from "../../auth/hooks/useAuth";
import DeleteButton from "../components/DeleteButton";
import "../styles/products.scss";
import { updateParams } from "../utils/UpdateParams";

const Products = () => {
  const [query, setQuery] = useState("");
  const [params, setParams] = useSearchParams();
  const { products, loading, error, getAllProducts, totalPages } =
    useProducts();
  const { isAdmin } = useAuth();

  const currentPage = Number(params.get("page")) || 1;
  const search = params.get("search") || "";

  const handleSearch = () => {
    updateParams(setParams, 1, query);
  };

  useEffect(() => {
    getAllProducts(currentPage, search);
    setQuery(search);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage, search]);

  if (error) return <div className="error-state">{error}</div>;

  return (
    <>
      <div className={`products-page ${loading ? "is-loading" : ""}`}>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        <h1 className="page-title">
          All Products {loading && <span className="inline-loader">...</span>}
        </h1>
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
          onClick={() => updateParams(setParams, currentPage - 1, search)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => updateParams(setParams, currentPage + 1, search)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default Products;
