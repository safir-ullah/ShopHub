import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ProductGrid from "../components/ProductGrid";
import PageState from "../components/PageState";
import { getProducts } from "../services/products";
import { useCart } from "../context/CartContext";

function Home() {
  const { addItem } = useCart();

  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  async function loadProducts(signal) {
    try {
      setStatus("loading");
      setError("");

      const data = await getProducts(signal);

      setProducts(data);
      setStatus("success");
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      }

      setError(error.message);
      setStatus("error");
    }
  }

  useEffect(() => {
    const controller = new AbortController();

    loadProducts(controller.signal);

    return () => controller.abort();
  }, []);

  const featuredProducts = products.slice(0, 8);

  const categories = [
    {
      name: "Beauty",
      slug: "beauty",
      icon: "✦",
      description: "Care & essentials",
    },
    {
      name: "Fragrances",
      slug: "fragrances",
      icon: "✧",
      description: "Find your scent",
    },
    {
      name: "Furniture",
      slug: "furniture",
      icon: "▰",
      description: "Modern living",
    },
    {
      name: "Groceries",
      slug: "groceries",
      icon: "✚",
      description: "Everyday essentials",
    },
  ];

  return (
    <main className="home-page">

      {/* =====================================================
          HERO
          ===================================================== */}
      <section className="home-hero">
        <div className="home-hero-grid"></div>

        <div className="hero-orb hero-orb-one"></div>
        <div className="hero-orb hero-orb-two"></div>
        <div className="hero-orb hero-orb-three"></div>

        <div className="shop-container home-hero-container">
          <div className="home-hero-content">

            <div className="hero-copy page-entrance">
              <div className="hero-eyebrow">
                <span className="hero-eyebrow-dot"></span>
                Welcome to ShopHub
              </div>

              <h1 className="hero-title">
                Shopping made
                <span> beautifully simple.</span>
              </h1>

              <p className="hero-description">
                Discover products you love, save your favorites,
                and enjoy a smooth shopping experience designed
                around you.
              </p>

              <div className="hero-actions">
                <Link
                  to="/products"
                  className="hero-primary-btn"
                >
                  <span>Explore Products</span>
                  <span className="hero-btn-arrow">→</span>
                </Link>

                <Link
                  to="/wishlist"
                  className="hero-secondary-btn"
                >
                  <span>♡</span>
                  View Wishlist
                </Link>
              </div>

              <div className="hero-trust-row">
                <div className="hero-trust-item">
                  <span className="trust-icon">✓</span>
                  Free delivery
                </div>

                <div className="hero-trust-item">
                  <span className="trust-icon">✓</span>
                  Easy checkout
                </div>

                <div className="hero-trust-item">
                  <span className="trust-icon">✓</span>
                  Secure account
                </div>
              </div>
            </div>

            {/* Hero visual */}
            <div className="hero-visual page-entrance">

              <div className="hero-floating-card hero-floating-top">
                <span className="floating-card-icon">✦</span>
                <div>
                  <strong>Curated for you</strong>
                  <small>Explore something new</small>
                </div>
              </div>

              <div className="hero-product-stage">

                <div className="hero-stage-glow"></div>

                <div className="hero-shopping-bag">
                  <div className="bag-handle"></div>

                  <div className="bag-body">
                    <span className="bag-logo">S</span>
                    <span className="bag-text">SHOPHUB</span>
                  </div>
                </div>

                <div className="hero-product-orbit orbit-one"></div>
                <div className="hero-product-orbit orbit-two"></div>

                <div className="hero-mini-product mini-one">
                  <span>✦</span>
                </div>

                <div className="hero-mini-product mini-two">
                  <span>◇</span>
                </div>

                <div className="hero-mini-product mini-three">
                  <span>+</span>
                </div>
              </div>

              <div className="hero-floating-card hero-floating-bottom">
                <span className="floating-rating">★</span>
                <div>
                  <strong>Smart shopping</strong>
                  <small>Browse • Save • Buy</small>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          QUICK BENEFITS
          ===================================================== */}
      <section className="home-benefits">
        <div className="shop-container">
          <div className="benefits-grid">

            <div className="benefit-card">
              <div className="benefit-icon">↯</div>
              <div>
                <h3>Quick Shopping</h3>
                <p>Find what you need faster.</p>
              </div>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">♡</div>
              <div>
                <h3>Save Favorites</h3>
                <p>Keep products you love close.</p>
              </div>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">✓</div>
              <div>
                <h3>Simple Checkout</h3>
                <p>A clean and easy buying flow.</p>
              </div>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">⌁</div>
              <div>
                <h3>Track Orders</h3>
                <p>Keep your purchases organized.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          CATEGORIES
          ===================================================== */}
      <section className="home-section home-categories">
        <div className="shop-container">

          <div className="section-heading-row">
            <div>
              <span className="section-eyebrow">
                Explore
              </span>

              <h2 className="section-title">
                Shop by category
              </h2>

              <p className="section-description">
                Browse collections built around the things
                you shop for most.
              </p>
            </div>

            <Link
              to="/products"
              className="section-link"
            >
              Browse all
              <span>→</span>
            </Link>
          </div>

          <div className="home-category-grid">

            {categories.map((category, index) => (
              <Link
                key={category.slug}
                to={`/products?category=${category.slug}`}
                className={`home-category-card category-card-${index + 1}`}
              >
                <div className="category-card-number">
                  0{index + 1}
                </div>

                <div className="category-icon">
                  {category.icon}
                </div>

                <div className="category-card-content">
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                </div>

                <span className="category-arrow">
                  →
                </span>
              </Link>
            ))}

          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURED PRODUCTS
          ===================================================== */}
      <section className="home-section featured-section">
        <div className="shop-container">

          <div className="section-heading-row featured-heading">
            <div>
              <span className="section-eyebrow">
                Handpicked
              </span>

              <h2 className="section-title">
                Featured products
              </h2>

              <p className="section-description">
                A selection from our latest collection.
              </p>
            </div>

            <Link
              to="/products"
              className="section-link"
            >
              View all products
              <span>→</span>
            </Link>
          </div>

          <div className="featured-products-wrapper">

            {status === "loading" && (
              <PageState type="loading" />
            )}

            {status === "error" && (
              <PageState
                type="error"
                message={error}
                onRetry={() => loadProducts()}
              />
            )}

            {status === "success" && (
              <>
                {featuredProducts.length > 0 ? (
                  <ProductGrid
                    products={featuredProducts}
                    onAdd={addItem}
                  />
                ) : (
                  <PageState
                    type="empty"
                    message="No featured products available."
                  />
                )}

                <div className="mobile-view-all">
                  <Link
                    to="/products"
                    className="hero-primary-btn"
                  >
                    View All Products
                    <span>→</span>
                  </Link>
                </div>
              </>
            )}

          </div>
        </div>
      </section>

      {/* =====================================================
          DISCOVER BANNER
          ===================================================== */}
      <section className="home-discover">
        <div className="shop-container">
          <div className="discover-card">

            <div className="discover-glow"></div>

            <div className="discover-content">
              <span className="discover-eyebrow">
                Your next favorite is waiting
              </span>

              <h2>
                Ready to discover
                something new?
              </h2>

              <p>
                Explore the complete ShopHub collection
                and find products that fit your style.
              </p>

              <Link
                to="/products"
                className="discover-btn"
              >
                Start Exploring
                <span>→</span>
              </Link>
            </div>

            <div className="discover-visual">
              <div className="discover-circle circle-one"></div>
              <div className="discover-circle circle-two"></div>
              <div className="discover-circle circle-three"></div>

              <div className="discover-symbol">
                S
              </div>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}

export default Home;