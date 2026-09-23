
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import QuantityControl from "../components/QuantityControl";
import PageState from "../components/PageState";

import { getProduct } from "../services/products";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function ProductDetails() {
  const { id } = useParams();

  const { addItem, buyNow } = useCart();

  const {
    toggleWishlist,
    isSaved,
  } = useWishlist();

  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState("");

  async function loadProduct(signal) {
    try {
      setStatus("loading");
      setError("");
      setProduct(null);

      const data = await getProduct(id, signal);

      setProduct(data);
      setQuantity(1);
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

    loadProduct(controller.signal);

    return () => {
      controller.abort();
    };
  }, [id]);

  function handleAddToCart() {
    if (!product || product.stock <= 0) {
      return;
    }

    const success = addItem(product, quantity);

    if (success) {
      setAddedMessage(
        `${quantity} ${
          quantity === 1 ? "item" : "items"
        } added to your cart.`
      );

      setTimeout(() => {
        setAddedMessage("");
      }, 3000);
    }
  }

  function handleOrderNow() {
    if (!product || product.stock <= 0) {
      return;
    }

    if (buyNow) {
      buyNow(product, quantity);
      window.location.href = "/checkout";
    } else {
      const success = addItem(product, quantity);

      if (success) {
        window.location.href = "/checkout";
      }
    }
  }

  function handleWishlistToggle() {
    if (!product) {
      return;
    }

    toggleWishlist(product);
  }

  if (status === "loading") {
    return (
      <main className="shop-page-shell">
        <div className="shop-container">
          <PageState type="loading" />
        </div>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="shop-page-shell">
        <div className="shop-container">
          <PageState
            type="error"
            message={error}
            onRetry={() => loadProduct()}
          />
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="shop-page-shell">
        <div className="shop-container">
          <PageState
            type="error"
            message="Product not found."
          />
        </div>
      </main>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const saved = isSaved(product.id);

  const rating = product.rating
    ? product.rating.toFixed(1)
    : "N/A";

  const reviewCount = product.reviews?.length || 0;

  return (
    <main className="product-details-page">
      <div className="shop-container">

        {/* Breadcrumb */}
        <nav
          className="product-breadcrumb"
          aria-label="breadcrumb"
        >
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link to="/products">Products</Link>
          <span aria-hidden="true">/</span>
          <span className="product-breadcrumb-current">
            {product.title}
          </span>
        </nav>

        {/* Main Product Area */}
        <section className="product-details-layout">

          {/* =========================================
              LEFT — PRODUCT VISUAL
              ========================================= */}
          <div className="product-details-visual">

            <div className="product-details-image-card">

              {/* Decorative background */}
              <div
                className="product-details-glow"
                aria-hidden="true"
              />

              <div
                className="product-details-image-stage"
                data-category={product.category}
              >
                <span className="product-details-floating-label">
                  Premium Pick
                </span>

                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="product-details-image"
                />
              </div>

              {/* Image footer */}
              <div className="product-visual-footer">
                <div>
                  <span className="product-visual-footer-label">
                    Product ID
                  </span>

                  <strong>
                    #{product.id}
                  </strong>
                </div>

                <div className="product-visual-category">
                  {product.category}
                </div>
              </div>
            </div>

            {/* Trust Cards */}
            <div className="product-trust-grid">

              <div className="product-trust-card">
                <span className="product-trust-icon">
                  ✓
                </span>

                <div>
                  <strong>Quality Product</strong>
                  <span>Carefully selected</span>
                </div>
              </div>

              <div className="product-trust-card">
                <span className="product-trust-icon">
                  ⚡
                </span>

                <div>
                  <strong>Fast Shopping</strong>
                  <span>Simple checkout</span>
                </div>
              </div>

              <div className="product-trust-card">
                <span className="product-trust-icon">
                  ♡
                </span>

                <div>
                  <strong>Save for Later</strong>
                  <span>Add to wishlist</span>
                </div>
              </div>

              <div className="product-trust-card">
                <span className="product-trust-icon">
                  🚚
                </span>

                <div>
                  <strong>Free Delivery</strong>
                  <span>Always included</span>
                </div>
              </div>

            </div>
          </div>

          {/* =========================================
              RIGHT — PRODUCT INFORMATION
              ========================================= */}
          <div className="product-details-info">

            {/* Category */}
            <div className="product-details-category-row">
              <span className="product-details-category">
                {product.category}
              </span>

              {isOutOfStock ? (
                <span className="product-details-stock out">
                  Out of Stock
                </span>
              ) : (
                <span className="product-details-stock">
                  <span className="stock-dot" />
                  In Stock
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="product-details-title">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="product-details-rating">
              <div className="rating-stars-large">
                {"★".repeat(
                  Math.max(
                    0,
                    Math.min(5, Math.round(product.rating || 0))
                  )
                )}
              </div>

              <strong>{rating}</strong>

              <span>
                {reviewCount > 0
                  ? `${reviewCount} ${
                      reviewCount === 1
                        ? "review"
                        : "reviews"
                    }`
                  : "No reviews yet"}
              </span>
            </div>

            {/* Price */}
            <div className="product-details-price-box">
              <span className="product-details-price-label">
                Current Price
              </span>

              <div className="product-details-price">
                ${product.price.toFixed(2)}
              </div>

              <span className="product-details-price-note">
                Free delivery included
              </span>
            </div>

            {/* Description */}
            <div className="product-details-description">
              <h2>About this product</h2>

              <p>
                {product.description}
              </p>
            </div>

            {/* Stock Information */}
            {!isOutOfStock && (
              <div className="product-stock-information">
                <div className="stock-info-top">
                  <span>Availability</span>
                  <strong>
                    {product.stock} units available
                  </strong>
                </div>

                <div className="stock-progress">
                  <div
                    className="stock-progress-bar"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(
                          8,
                          (product.stock / 100) * 100
                        )
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Quantity */}
            {!isOutOfStock && (
              <div className="product-details-quantity-section">
                <div className="product-details-quantity-heading">
                  <label>
                    Quantity
                  </label>

                  <span>
                    Maximum {product.stock}
                  </span>
                </div>

                <QuantityControl
                  value={quantity}
                  max={product.stock}
                  onChange={setQuantity}
                />
              </div>
            )}

            {/* Success Message */}
            {addedMessage && (
              <div
                className="product-added-message"
                role="status"
                aria-live="polite"
              >
                <span className="product-added-icon">
                  ✓
                </span>

                <div>
                  <strong>Added to cart</strong>
                  <span>{addedMessage}</span>
                </div>
              </div>
            )}

            {/* Main Actions */}
            <div className="product-details-actions">

              <button
                type="button"
                className="product-action-cart"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
              >
                <span>🛒</span>

                {isOutOfStock
                  ? "Out of Stock"
                  : "Add to Cart"}
              </button>

              <button
                type="button"
                className="product-action-order"
                disabled={isOutOfStock}
                onClick={handleOrderNow}
              >
                <span>⚡</span>
                Order Now
              </button>

            </div>

            {/* Wishlist */}
            <button
              type="button"
              className={`product-details-wishlist ${
                saved ? "saved" : ""
              }`}
              aria-pressed={saved}
              onClick={handleWishlistToggle}
            >
              <span>
                {saved ? "♥" : "♡"}
              </span>

              {saved
                ? "Saved to Wishlist"
                : "Save to Wishlist"}
            </button>

            {/* Delivery / Service Information */}
            <div className="product-service-box">

              <div className="product-service-item">
                <span className="product-service-icon">
                  🚚
                </span>

                <div>
                  <strong>Free Delivery</strong>
                  <span>
                    Delivery is included with your order.
                  </span>
                </div>
              </div>

              <div className="product-service-divider" />

              <div className="product-service-item">
                <span className="product-service-icon">
                  🔒
                </span>

                <div>
                  <strong>Secure Checkout</strong>
                  <span>
                    Simple and protected checkout experience.
                  </span>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* Bottom Navigation */}
        <div className="product-details-bottom">
          <Link
            to="/products"
            className="product-back-link"
          >
            <span>←</span>
            Back to Products
          </Link>

          <span className="product-bottom-message">
            Find something you love? Save it or order it instantly.
          </span>
        </div>

      </div>
    </main>
  );
}

export default ProductDetails;

