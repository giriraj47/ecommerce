import React, { useMemo, useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useProductsQuery, useProducts } from "../hooks/useProducts";
import { useAuth } from "../../auth/hooks/useAuth";
import DeleteButton from "../components/DeleteButton";
import "../styles/products.scss";
import { updateParams } from "../utils/UpdateParams";

const CATEGORIES = ["ALL", "TOPS", "BOTTOMS", "FOOTWEAR", "ACCESSORIES"];
const SORT_OPTIONS = [
  "Relevance",
  "Price: Low to High",
  "Price: High to Low",
  "Newest",
];
const PRICE_BANDS = [
  "Under $25",
  "$25 - $50",
  "$50 - $100",
  "$100 - $200",
  "$200 - $500",
  "Above $500",
];

// Helper to transform raw Cloudinary URLs into optimized low-bandwidth thumbnails
const getOptimizedImage = (url) => {
  if (!url) return null;
  if (url.includes("cloudinary.com")) {
    return url.replace("/upload/", "/upload/f_auto,q_auto,w_400/");
  }
  return url;
};

// Helper to generate pagination page numbers with ellipsis
const getPaginationItems = (currentPage, totalPages) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = [];
  const delta = 1;
  const left = currentPage - delta;
  const right = currentPage + delta;

  let range = [];
  let rangeWithDots = [];
  let l;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= left && i <= right)) {
      range.push(i);
    }
  }

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push("...");
      }
    }
    rangeWithDots.push(i);
    l = i;
  }

  return rangeWithDots;
};

const Products = () => {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [sortLabel, setSortLabel] = useState("Relevance");
  const [sortOpen, setSortOpen] = useState(false);
  const [priceBands, setPriceBands] = useState([]);
  const [params, setParams] = useSearchParams();

  const { deleteProduct } = useProducts();
  const { isAdmin } = useAuth();

  const priceFilter = useMemo(() => priceBands.join(","), [priceBands]);
  const currentPage = Number(params.get("page")) || 1;
  const search = params.get("search") || "";

  // TanStack Query custom hook for cached, instant data fetching
  const { data, isLoading, isError, error, refetch } = useProductsQuery(
    currentPage,
    search,
    activeCategory,
    sortLabel,
    priceFilter,
  );

  const products = data?.products || (Array.isArray(data) ? data : []);
  const totalPages = data?.totalPages || 1;
  const totalProductsCount = data?.totalProducts ?? products.length;

  const toggleBand = (band) =>
    setPriceBands((prev) =>
      prev.includes(band) ? prev.filter((b) => b !== band) : [...prev, band],
    );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  if (isError) return <div className="pp-error">{error?.message || "Failed to load products"}</div>;

  return (
    <div className="pp">
      {/* ── Sub-header: Categories title + Sort + Count ───────────────────── */}
      <div className="pp__subheader">
        <h1 className="pp__page-title">Categories</h1>

        <div className="pp__subheader-right">
          {/* Sort dropdown */}
          <div className="pp__sort-dropdown">
            <button
              className="pp__sort-trigger"
              onClick={() => setSortOpen(!sortOpen)}
            >
              Sort by {sortLabel}
              <svg width="11" height="6" viewBox="0 0 11 6" fill="none">
                <path
                  d="M1 1L5.5 5L10 1"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            {sortOpen && (
              <ul className="pp__sort-menu">
                {SORT_OPTIONS.map((opt) => (
                  <li
                    key={opt}
                    className={sortLabel === opt ? "active" : ""}
                    onClick={() => {
                      setSortLabel(opt);
                      setSortOpen(false);
                    }}
                  >
                    {opt}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <span className="pp__count">
            {isLoading ? "—" : `${totalProductsCount} Products`}
          </span>
        </div>
      </div>

      {/* ── Category pills ───────────────────────────────────────────────── */}
      <div className="pp__cats">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`pp__cat-pill${activeCategory === cat ? " pp__cat-pill--active" : ""}`}
            onClick={() => {
              setActiveCategory(cat);
              updateParams(setParams, 1, search);
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Body: sidebar + grid ─────────────────────────────────────────── */}
      <div className="pp__body">
        {/* Sidebar */}
        <aside className="pp__sidebar">
          <p className="pp__sidebar-heading">Filters</p>
          <p className="pp__sidebar-sub">Price</p>

          <div className="pp__price-list">
            {PRICE_BANDS.map((band) => (
              <label key={band} className="pp__checkbox-row">
                <span
                  className={`pp__checkbox-box${priceBands.includes(band) ? " pp__checkbox-box--checked" : ""}`}
                  onClick={() => toggleBand(band)}
                />
                <span
                  className="pp__checkbox-label"
                  onClick={() => toggleBand(band)}
                >
                  {band}
                </span>
              </label>
            ))}
          </div>
        </aside>

        {/* Grid */}
        <main className="pp__grid-area">
          {isLoading ? (
            <div className="pp__grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div className="pp__skeleton" key={i} />
              ))}
            </div>
          ) : (
            <div className="pp__grid">
              {products.map((product) => (
                <Link
                  to={`/products/${product._id}`}
                  key={product._id}
                  className={`pp__card ${product.stock === 0 ? "pp__card--out-of-stock" : ""}`}
                >
                  {isAdmin && (
                    <div
                      className="pp__admin-actions"
                      onClick={(e) => e.preventDefault()}
                    >
                      <DeleteButton
                        productId={product._id}
                        productName={product.name}
                        onDeleteSuccess={refetch}
                      />
                    </div>
                  )}

                  <div className="pp__card-img">
                    {product.images?.length > 0 ? (
                      <img
                        src={getOptimizedImage(product.images[0])}
                        alt={product.name}
                        loading="lazy"
                      />
                    ) : (
                      <div className="pp__card-placeholder" />
                    )}
                  </div>

                  <div className="pp__card-info">
                    <p className="pp__card-name">{product.name}</p>
                    <p className="pp__card-price">
                      ${Number(product.price).toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pp__pagination">
              <button
                className="pp__page-btn"
                onClick={() => updateParams(setParams, currentPage - 1, search)}
                disabled={currentPage === 1}
              >
                ← Prev
              </button>
              <div className="pp__page-numbers">
                {getPaginationItems(currentPage, totalPages).map((p, idx) =>
                  p === "..." ? (
                    <span key={`dots-${idx}`} className="pp__page-dots">
                      ...
                    </span>
                  ) : (
                    <button
                      key={p}
                      className={`pp__page-num${p === currentPage ? " pp__page-num--active" : ""}`}
                      onClick={() => updateParams(setParams, p, search)}
                    >
                      {p}
                    </button>
                  ),
                )}
              </div>
              <button
                className="pp__page-btn"
                onClick={() => updateParams(setParams, currentPage + 1, search)}
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
