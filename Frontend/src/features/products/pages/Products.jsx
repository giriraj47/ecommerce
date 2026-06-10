import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
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

const Products = () => {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [sortLabel, setSortLabel] = useState("Relevance");
  const [sortOpen, setSortOpen] = useState(false);
  const [priceBands, setPriceBands] = useState([]);
  const [totalProductsCount, setTotalProductsCount] = useState(0);
  const [params, setParams] = useSearchParams();

  const { products, loading, error, getAllProducts, totalPages } =
    useProducts();
  const { isAdmin } = useAuth();

  const priceFilter = useMemo(() => priceBands.join(","), [priceBands]);

  const currentPage = Number(params.get("page")) || 1;
  const search = params.get("search") || "";

  const handleSearch = () => updateParams(setParams, 1, query);

  const toggleBand = (band) =>
    setPriceBands((prev) =>
      prev.includes(band) ? prev.filter((b) => b !== band) : [...prev, band],
    );

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        const data = await getAllProducts(
          currentPage,
          search,
          activeCategory,
          sortLabel,
          priceFilter,
        );
        if (data && typeof data.totalProducts !== "undefined") {
          setTotalProductsCount(data.totalProducts);
        } else if (data && Array.isArray(data.products)) {
          setTotalProductsCount(data.products.length);
        }
      } catch (err) {
        console.error("Error fetching filtered products:", err);
      }
    };
    fetchFilteredProducts();

    // Sync React state back to URLSearchParams silently (without re-triggering this effect)
    const newParams = {};
    if (currentPage > 1) newParams.page = currentPage;
    if (search) newParams.search = search;
    setParams(newParams, { replace: true });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage, search, activeCategory, sortLabel, priceFilter]);

  if (error) return <div className="pp-error">{error}</div>;

  return (
    <div className="pp">
      {/* ── Sub-header: Categories title + Sort + Count ───────────────────── */}
      <div className="pp__subheader">
        <h1 className="pp__page-title">Categories</h1>

        <div className="pp__subheader-right">
          {/* Search */}
          {/* <div className="pp__search-wrap">
            <input
              className="pp__search-input"
              type="text"
              placeholder="Search…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div> */}

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
            {loading ? "—" : `${totalProductsCount} Products`}
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
          {loading ? (
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
                        onDeleteSuccess={getAllProducts}
                      />
                    </div>
                  )}

                  <div className="pp__card-img">
                    {product.images?.length > 0 ? (
                      <img
                        src={product.images[0]}
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
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
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
