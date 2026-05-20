import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/products.scss";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";

const justIn = [
  {
    img: "https://res.cloudinary.com/dzplbl3yv/image/upload/v1779152697/__shhtn6.webp",
    name: "Pleated loose leg pants",
    price: "$60.00",
  },
  {
    img: "https://res.cloudinary.com/dzplbl3yv/image/upload/v1779152695/__3_x38ew4.webp",
    name: "Sabine Striped Articulated Shirt",
    price: "$125.00",
  },
  {
    img: "https://res.cloudinary.com/dzplbl3yv/image/upload/v1779152696/Effortless_Casual_Street_Style_White_Shirt_Wide-Leg_Denim_Look_xvkwwp.jpg",
    name: "Oversized Button Up Shirt",
    price: "$25.00",
  },
  {
    img: "https://res.cloudinary.com/dzplbl3yv/image/upload/v1779152697/__r6hrwn.jpg",
    name: "Linen-Blend Baggy Trouser",
    price: "$90.00",
  },
  {
    img: "https://res.cloudinary.com/dzplbl3yv/image/upload/v1779152695/The_Perfect_Linen_Striped_Top_u61riq.jpg",
    name: "Blunt classic stripe shirt",
    price: "$70.00",
  },
];

const shopBy = {
  TOPS: [
    {
      img: "https://res.cloudinary.com/dzplbl3yv/image/upload/v1779152695/__4_w601yn.webp",
      name: "Elegant Long Sleeve Plaid Shirt",
      price: "$100.00",
    },
    {
      img: "https://res.cloudinary.com/dzplbl3yv/image/upload/v1779152694/Men_s_Striped_Print_Sweatshirts_Long_Sleeve_Collared_Preppy_Shirts_Half_Plack__ejwaok.jpg",
      name: "Striped Print Sweatshirt",
      price: "$55.00",
    },
    {
      img: "https://res.cloudinary.com/dzplbl3yv/image/upload/v1779152694/Rugby_shirt_with_striped_placket_irplgr.jpg",
      name: "Rugby shirt with striped placket",
      price: "$55.00",
    },
    {
      img: "https://res.cloudinary.com/dzplbl3yv/image/upload/v1779152693/daxuen-distressed-graphic-oversized-t-shirt-6-edbdd6_l7nhva.webp",
      name: "Distressed Graphic Oversized T-Shirt",
      price: "$10.00",
    },
    {
      img: "https://res.cloudinary.com/dzplbl3yv/image/upload/v1779152692/HEAVYWEIGHT_FITTED_SLUB_TEE_WHITE_-_S_zcxmep.jpg",
      name: "Heavyweight Fitted Slub Tee",
      price: "$50.00",
    },
  ],
  BOTTOMS: [
    {
      img: "https://res.cloudinary.com/dzplbl3yv/image/upload/v1779152697/__shhtn6.webp",
      name: "Pleated loose leg pants",
      price: "$60.00",
    },
    {
      img: "https://res.cloudinary.com/dzplbl3yv/image/upload/v1779152697/__r6hrwn.jpg",
      name: "Linen-Blend Baggy Trouser",
      price: "$90.00",
    },
    {
      img: "https://res.cloudinary.com/dzplbl3yv/image/upload/v1779152696/Effortless_Casual_Street_Style_White_Shirt_Wide-Leg_Denim_Look_xvkwwp.jpg",
      name: "Wide-Leg Denim",
      price: "$75.00",
    },
    {
      img: "https://res.cloudinary.com/dzplbl3yv/image/upload/v1779152695/__3_x38ew4.webp",
      name: "Relaxed Fit Trousers",
      price: "$65.00",
    },
    {
      img: "https://res.cloudinary.com/dzplbl3yv/image/upload/v1779152695/The_Perfect_Linen_Striped_Top_u61riq.jpg",
      name: "Linen Stripe Pants",
      price: "$80.00",
    },
  ],
  FOOTWARE: [
    {
      img: "https://res.cloudinary.com/dzplbl3yv/image/upload/v1779152695/__4_w601yn.webp",
      name: "Classic White Sneakers",
      price: "$110.00",
    },
    {
      img: "https://res.cloudinary.com/dzplbl3yv/image/upload/v1779152694/Rugby_shirt_with_striped_placket_irplgr.jpg",
      name: "Leather Loafers",
      price: "$145.00",
    },
    {
      img: "https://res.cloudinary.com/dzplbl3yv/image/upload/v1779152693/daxuen-distressed-graphic-oversized-t-shirt-6-edbdd6_l7nhva.webp",
      name: "Canvas Low-Top",
      price: "$55.00",
    },
    {
      img: "https://res.cloudinary.com/dzplbl3yv/image/upload/v1779152692/HEAVYWEIGHT_FITTED_SLUB_TEE_WHITE_-_S_zcxmep.jpg",
      name: "Suede Chelsea Boot",
      price: "$175.00",
    },
    {
      img: "https://res.cloudinary.com/dzplbl3yv/image/upload/v1779152697/__shhtn6.webp",
      name: "Slip-On Mule",
      price: "$90.00",
    },
  ],
};

const CATEGORIES = ["TOPS", "BOTTOMS", "FOOTWARE"];

// Generic horizontally-scrollable product row
const ProductRow = ({ items }) => {
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
        {items.map((item, i) => (
          <Link to="/products" className="prod-card" key={i}>
            <div className="prod-card__img-wrap">
              <img src={item.img} alt={item.name} loading="lazy" />
            </div>
            <p className="prod-card__name">{item.name}</p>
            <p className="prod-card__price">{item.price}</p>
          </Link>
        ))}
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

  return (
    <section className="products">
      {/* ── JUST IN ───────────────────────────────────────────────── */}
      <div className="products__section">
        <div className="products__header">
          <div className="products__header-left">
            {/* <span className="products__nav-tick" /> */}
            <h2 className="products__title">JUST IN</h2>
          </div>
          <Link to="/products" className="products__pill">
            VIEW ALL
          </Link>
        </div>

        <ProductRow items={justIn} />
      </div>

      {/* ── SHOP BY ───────────────────────────────────────────────── */}
      <div className="products__section products__section--shopby">
        <div className="products__header">
          <div className="products__header-left">
            {/* <span className="products__nav-tick" /> */}
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

        <ProductRow items={shopBy[activeCategory]} />
      </div>
    </section>
  );
};

export default Products;
