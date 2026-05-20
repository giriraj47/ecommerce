import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/home.scss";
import Products from "../components/Products";
import Footer from "../components/Footer";
import { useCart } from "../../cart/hooks/useCart";

const images = [
  "https://res.cloudinary.com/dzplbl3yv/image/upload/v1779152696/Effortless_Casual_Street_Style_White_Shirt_Wide-Leg_Denim_Look_xvkwwp.jpg",
  "https://res.cloudinary.com/dzplbl3yv/image/upload/v1779152697/That_Cool_Girl_Outfit_Navy_Shirt_Wide_Leg_Jeans_Aesthetic_fyo9qd.jpg",
  "https://res.cloudinary.com/dzplbl3yv/image/upload/v1779152696/__2_end6lx.webp",
  "https://res.cloudinary.com/dzplbl3yv/image/upload/v1779152696/__1_v3mjm5.webp",
  "https://res.cloudinary.com/dzplbl3yv/image/upload/v1779152695/__3_x38ew4.webp",
];

const Home = () => {
  const trackRef = useRef(null);
  const animFrameRef = useRef(null);
  const posRef = useRef(0);
  const speedRef = useRef(0.4); // px per frame
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartItems, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= window.innerHeight - 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // The track contains two sets of images for seamless loop
    const singleSetWidth = 554 * images.length; // 554px each × 5

    const animate = () => {
      posRef.current -= speedRef.current;

      // Reset when we've scrolled one full set
      if (Math.abs(posRef.current) >= singleSetWidth) {
        posRef.current = 0;
      }

      track.style.transform = `translateX(${posRef.current}px)`;
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Duplicate images for seamless infinite loop
  const allImages = [...images, ...images];

  return (
    <>
      <section className="hero">
        {/* Navbar overlay */}
        <nav className={`hero-nav${isScrolled ? " hero-nav--scrolled" : ""}`}>
          <div className="hero-nav__left">
            <Link to="/">Home</Link>
            <Link to="/products">Shop</Link>
            <Link to="/about">About Us</Link>
          </div>
          <div className="hero-nav__logo">
            <img
              src="https://res.cloudinary.com/dzplbl3yv/image/upload/v1779163941/loogo_xf53lj.png"
              alt="Empire"
            />
          </div>
          <div className="hero-nav__right">
            <Link to="/search">Search</Link>
            <button 
              className="hero-nav__cart-btn" 
              onClick={() => setIsCartOpen(true)}
              style={{ background: "none", border: "none", cursor: "pointer", font: "inherit", padding: 0 }}
            >
              Cart {cartItems?.length > 0 && `(${cartItems.reduce((acc, item) => acc + item.quantity, 0)})`}
            </button>
          </div>
        </nav>

        {/* Infinite scroll strip */}
        <div className="hero__viewport">
          <div className="hero__track" ref={trackRef}>
            {allImages.map((src, i) => (
              <div className="hero__slide" key={i}>
                <img src={src} alt={`Look ${(i % images.length) + 1}`} />
              </div>
            ))}
          </div>

          {/* Bottom gradient */}
          <div className="hero__gradient-bottom" />

          {/* Center overlay content */}
          <div className="hero__content">
            {/* <div className="hero__nav-line hero__nav-line--left" /> */}
            <div className="hero__text">
              <h1 className="hero__title">
                SUMMER
                <br />
                ESSENTIALS
              </h1>
              <p className="hero__year">2026</p>
              <Link to="/products" className="hero__btn">
                Explore
              </Link>
            </div>
            {/* <div className="hero__nav-line hero__nav-line--right" /> */}
          </div>
        </div>
      </section>
      <Products />
      <Footer />
    </>
  );
};

export default Home;
