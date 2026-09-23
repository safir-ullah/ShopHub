import { Link, useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

function ProductCard({ product, onAdd }) {
  const { toggleWishlist, isSaved } = useWishlist();
  const { buyNow } = useCart();

  const navigate = useNavigate();

  const saved = isSaved(product.id);
  const isOutOfStock = product.stock <= 0;

  function handleAdd() {
    if (onAdd && !isOutOfStock) {
      onAdd(product, 1);
    }
  }

  function handleOrderNow() {
    if (isOutOfStock) {
      return;
    }

    const success = buyNow(product);

    if (success) {
      navigate("/checkout");
    }
  }

  function handleWishlist() {
    toggleWishlist(product);
  }

  return (
    <div className="col">
      <article className="product-card-modern">

        {/* Product Image */}
        <div className="product-visual">
          <Link
            to={`/products/${product.id}`}
            className="product-image-link"
          >
            <img
              src={product.thumbnail}
              alt={product.title}
              className="product-image-modern"
              loading="lazy"
            />
          </Link>

          {/* Category Badge */}
          <span className="product-category-badge text-capitalize">
            {product.category}
          </span>

          {/* Wishlist Button */}
          <button
            type="button"
            className={`wishlist-float ${saved ? "saved" : ""}`}
            aria-label={
              saved
                ? `Remove ${product.title} from wishlist`
                : `Add ${product.title} to wishlist`
            }
            aria-pressed={saved}
            onClick={handleWishlist}
          >
            {saved ? "♥" : "♡"}
          </button>

          {/* Stock Badge */}
          {isOutOfStock && (
            <span className="stock-badge">
              Out of Stock
            </span>
          )}

          {/* View Product */}
          <Link
            to={`/products/${product.id}`}
            className="quick-view-btn"
          >
            View Product
          </Link>
        </div>

        {/* Product Information */}
        <div className="product-info-modern">

          {/* Rating */}
          <div className="product-rating-row">
            <span className="rating-stars">
              ★
            </span>

            <span className="rating-value">
              {product.rating?.toFixed(1) || "N/A"}
            </span>

            <span className="rating-label">
              Rating
            </span>
          </div>

          {/* Product Title */}
          <h3 className="product-title-modern">
            <Link to={`/products/${product.id}`}>
              {product.title}
            </Link>
          </h3>

          {/* Price + Add to Cart */}
          <div className="product-bottom">
            <div>
              <span className="price-label">
                Price
              </span>

              <p className="product-price-modern">
                ${product.price.toFixed(2)}
              </p>
            </div>

            {/* Add to Cart */}
            <button
              type="button"
              className="modern-cart-btn"
              disabled={isOutOfStock}
              onClick={handleAdd}
              aria-label={
                isOutOfStock
                  ? `${product.title} is out of stock`
                  : `Add ${product.title} to cart`
              }
            >
              {isOutOfStock ? "×" : "+"}
            </button>
          </div>

          {/* Order Now */}
          <button
            type="button"
            className="order-now-btn"
            disabled={isOutOfStock}
            onClick={handleOrderNow}
          >
            {isOutOfStock
              ? "Out of Stock"
              : "⚡ Order Now"}
          </button>

          {/* Delivery */}
          <div className="delivery-info">
            <span className="delivery-icon">
              ✓
            </span>

            <span>
              Free delivery
            </span>
          </div>

        </div>
      </article>
    </div>
  );
}

export default ProductCard;