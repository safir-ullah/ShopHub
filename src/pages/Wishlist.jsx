
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function Wishlist() {
  const {
    wishlist,
    removeFromWishlist,
  } = useWishlist();

  const { addItem } = useCart();

  function handleMoveToCart(product) {
    if (!product || product.stock <= 0) {
      return;
    }

    const success = addItem(product, 1);

    if (success) {
      removeFromWishlist(product.id);
    }
  }

  // Empty Wishlist
  if (wishlist.length === 0) {
    return (
      <main className="wishlist-page">
        <div className="shop-container">
          <section className="wishlist-empty-state">
            <div className="wishlist-empty-icon" aria-hidden="true">
              ♡
            </div>

            <span className="wishlist-empty-eyebrow">
              YOUR SAVED COLLECTION
            </span>

            <h1 className="wishlist-empty-title">
              Your Wishlist is Empty
            </h1>

            <p className="wishlist-empty-text">
              Save products you love and build your personal collection
              for later.
            </p>

            <Link
              to="/products"
              className="wishlist-primary-btn"
            >
              <span>Explore Products</span>
              <span aria-hidden="true">→</span>
            </Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="wishlist-page">
      <div className="shop-container">

        {/* Page Header */}
        <header className="wishlist-page-header">
          <div>
            <span className="wishlist-page-eyebrow">
              YOUR COLLECTION
            </span>

            <h1 className="wishlist-page-title">
              Wishlist
            </h1>

            <p className="wishlist-page-subtitle">
              Products you've saved for later.
            </p>
          </div>

          <div className="wishlist-count-badge">
            <span className="wishlist-count-icon" aria-hidden="true">
              ♡
            </span>

            <div>
              <span className="wishlist-count-number">
                {wishlist.length}
              </span>

              <span className="wishlist-count-label">
                {wishlist.length === 1
                  ? "saved product"
                  : "saved products"}
              </span>
            </div>
          </div>
        </header>

        {/* Wishlist Grid */}
        <section className="wishlist-grid" aria-label="Wishlist products">
          {wishlist.map((product) => {
            const isOutOfStock = product.stock <= 0;

            return (
              <article
                className="wishlist-card"
                key={product.id}
              >
                {/* Product Image */}
                <div className="wishlist-card-visual">
                  <Link
                    to={`/products/${product.id}`}
                    className="wishlist-image-link"
                  >
                    <div className="wishlist-image-wrap">
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="wishlist-image"
                        loading="lazy"
                      />
                    </div>
                  </Link>

                  <span className="wishlist-saved-badge">
                    <span aria-hidden="true">♥</span>
                    Saved
                  </span>

                  {isOutOfStock && (
                    <span className="wishlist-stock-badge wishlist-stock-out">
                      Out of Stock
                    </span>
                  )}

                  {!isOutOfStock && product.stock <= 10 && (
                    <span className="wishlist-stock-badge wishlist-stock-low">
                      Only {product.stock} left
                    </span>
                  )}

                  <button
                    type="button"
                    className="wishlist-remove-float"
                    onClick={() =>
                      removeFromWishlist(product.id)
                    }
                    aria-label={`Remove ${product.title} from wishlist`}
                  >
                    ♥
                  </button>
                </div>

                {/* Product Information */}
                <div className="wishlist-card-body">
                  <span className="wishlist-product-label">
                    Saved Product
                  </span>

                  <h2 className="wishlist-product-title">
                    <Link to={`/products/${product.id}`}>
                      {product.title}
                    </Link>
                  </h2>

                  <div className="wishlist-product-meta">
                    <span className="wishlist-product-price">
                      ${product.price.toFixed(2)}
                    </span>

                    <span className="wishlist-delivery">
                      <span aria-hidden="true">✓</span>
                      Free delivery
                    </span>
                  </div>

                  {isOutOfStock && (
                    <p className="wishlist-out-text">
                      Currently unavailable
                    </p>
                  )}

                  {/* Actions */}
                  <div className="wishlist-card-actions">
                    <button
                      type="button"
                      className="wishlist-cart-btn"
                      disabled={isOutOfStock}
                      onClick={() =>
                        handleMoveToCart(product)
                      }
                    >
                      <span aria-hidden="true">🛒</span>

                      <span>
                        {isOutOfStock
                          ? "Out of Stock"
                          : "Move to Cart"}
                      </span>
                    </button>

                    <Link
                      to={`/products/${product.id}`}
                      className="wishlist-view-btn"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {/* Bottom Navigation */}
        <div className="wishlist-bottom-row">
          <Link
            to="/products"
            className="wishlist-continue-link"
          >
            <span aria-hidden="true">←</span>
            Continue Shopping
          </Link>

          <div className="wishlist-secure-note">
            <span className="wishlist-secure-icon" aria-hidden="true">
              ✦
            </span>

            <span>Your favorites stay saved</span>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Wishlist;
