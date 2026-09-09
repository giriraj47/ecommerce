import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueries } from "@tanstack/react-query";
import {
  getLatestProductsApi,
  getProductsByCategoryApi,
} from "../../products/services/product.api";
import "../styles/products.scss";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";

const CATEGORIES = ["TOPS", "BOTTOMS", "FOOTWEAR"];

// Transform Cloudinary URLs to modern compressed thumbnails
const getOptimizedImage = (url) => {
  if (!url) return null;
  if (url.includes("cloudinary.com")) {
    return url.replace("/upload/", "/upload/f_auto,q_auto,w_400/");
  }
  return url;
};

const formatPrice = (price) => {
  if (typeof price === "number") {
    return `$${price.toFixed(2)}`;
  }
  if (!price) return "$0.00";
  return price.startsWith("$") ? price : `$${price}`;
};

const ProductSkeleton = () => (
  <div className="prod-card prod-card--skeleton">
    <div className="prod-card__img-wrap prod-card__skeleton-img" />
    <div className="prod-card__skeleton-line prod-card__skeleton-line--title" />
    <div className="prod-card__skeleton-line prod-card__skeleton-line--price" />
  </div>
);

// Generic horizontally-scrollable product row
const ProductRow = ({ items = [], isLoading = false }) => {
  const rowRef = useRef(null);

  const scroll = (dir) => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: dir * 270, behavior: "smooth" });
    }
  };

  return (
    <div className="prod-row-wrapper">
      <button
        className="prod-arrow prod-arrow--left"
        onClick={() => scroll(-1)}
        aria-label="Scroll left"
      >
        <MdArrowBackIosNew />
      </button>

      <div className="prod-row" ref={rowRef}>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <ProductSkeleton key={i} />)
        ) : items.length > 0 ? (
          items.map((item, i) => {
            const rawImg = item.images?.[0] || item.img;
            const imgSrc =
              getOptimizedImage(rawImg) ||
              "https://res.cloudinary.com/dzplbl3yv/image/upload/v1779152697/__shhtn6.webp";
            const targetUrl = item._id ? `/products/${item._id}` : "/products";

            return (
              <Link to={targetUrl} className="prod-card" key={item._id || item.id || i}>
                <div className="prod-card__img-wrap">
                  <img
                    src={imgSrc}
                    alt={item.name}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <p className="prod-card__name">{item.name}</p>
                <p className="prod-card__price">{formatPrice(item.price)}</p>
              </Link>
            );
          })
        ) : (
          <p className="prod-row__empty">No products available</p>
        )}
      </div>

      <button
        className="prod-arrow prod-arrow--right"
        onClick={() => scroll(1)}
        aria-label="Scroll right"
      >
        <MdArrowForwardIos />
      </button>
    </div>
  );
};

const Products = () => {
  const [activeCategory, setActiveCategory] = useState("TOPS");

  // Fetch the 10 latest products added to the database
  const { data: justInProducts = [], isLoading: isJustInLoading } = useQuery({
    queryKey: ["products", "homeJustIn"],
    queryFn: () => getLatestProductsApi(10),
    staleTime: 1000 * 60 * 5,
  });

  // Concurrently fetch 7 products from each category (TOPS, BOTTOMS, FOOTWEAR)
  const categoryQueries = useQueries({
    queries: CATEGORIES.map((cat) => ({
      queryKey: ["products", "homeShopBy", cat],
      queryFn: () => getProductsByCategoryApi(cat, 7),
      staleTime: 1000 * 60 * 5,
    })),
  });

  const activeIndex = CATEGORIES.indexOf(activeCategory);
  const activeCategoryQuery = categoryQueries[activeIndex !== -1 ? activeIndex : 0];
  const shopByProducts = activeCategoryQuery?.data || [];
  const isShopByLoading = activeCategoryQuery?.isLoading;

  return (
    <section className="products">
      {/* ── JUST IN ───────────────────────────────────────────────── */}
      <div className="products__section">
        <div className="products__header">
          <div className="products__header-left">
            <h2 className="products__title">JUST IN</h2>
          </div>
          <Link to="/products" className="products__pill">
            VIEW ALL
          </Link>
        </div>

        <ProductRow items={justInProducts} isLoading={isJustInLoading} />
      </div>

      {/* ── SHOP BY ───────────────────────────────────────────────── */}
      <div className="products__section products__section--shopby">
        <div className="products__header">
          <div className="products__header-left">
            <h2 className="products__title">SHOP BY</h2>
          </div>
          <div className="products__filters">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`products__pill${activeCategory === cat ? " products__pill--active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
            <Link to="/products" className="products__pill products">
              VIEW ALL
            </Link>
          </div>
        </div>

        <ProductRow items={shopByProducts} isLoading={isShopByLoading} />
      </div>
    </section>
  );
};

export default Products;
