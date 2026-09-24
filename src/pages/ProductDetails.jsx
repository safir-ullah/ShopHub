import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import QuantityControl from "../components/QuantityControl";
import PageState from "../components/PageState";

import { getProduct } from "../services/products";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addItem, buyNow } = useCart();
  const { toggleWishlist, isSaved } = useWishlist();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      setStatus("loading");
      setError("");

      try {
        const result = await getProduct(id);

        if (!isMounted) return;

        if (!result) {
          setProduct(null);
          setStatus("not-found");
          return;
        }

        setProduct(result);
        setQuantity(1);
        setStatus("success");
      } catch (err) {
        if (!isMounted) return;

        console.error("Failed to load product:", err);

        setError(
          err?.message || "Unable to load this product. Please try again."
        );

        setStatus("error");
      }
    }

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  function handleQuantityChange(value) {
    if (!product) return;

    const maxQuantity = Math.max(1, product.stock || 1);
    const nextQuantity = Math.min(
      Math.max(1, value),
      maxQuantity
    );

    setQuantity(nextQuantity);
  }

  function handleAddToCart() {
    if (!product || product.stock <= 0) {
      return;
    }

    const success = addItem(product, quantity);

    if (success === false) {
      return;
    }
  }

  function handleOrderNow() {
    if (!product || product.stock <= 0) {
      return;
    }

    if (buyNow) {
      buyNow(product, quantity);
    } else {
      const success = addItem(product, quantity);

      if (success === false) {
        return;
      }
    }

    // Use React Router instead of window.location.href.
    // This prevents Vercel from treating /checkout as a physical file.
    navigate("/checkout");
  }

  function handleWishlistToggle() {
    if (!product) return;

    toggleWishlist(product);
  }

  if (status === "loading") {
    return (
      <PageState
        type="loading"
        title="Loading product..."
        message="Please wait while we load the product details."
      />
    );
  }

  if (status === "error") {
    return (
      <PageState
        type="error"
        title="Unable to load product"
        message={error}
      />
    );
  }

  if (status === "not-found" || !product) {
    return (
      <PageState
        type="empty"
        title="Product not found"
        message="The product you are looking for does not exist or is no longer available."
      />
    );
  }

  const isOutOfStock =
    !product.stock || product.stock <= 0;

  // FIXED:
  // The WishlistContext provides "isSaved",
  // not "isWishlisted".
  const wishlisted = isSaved(product.id);

  const productImage =
    product.image ||
    product.imageUrl ||
    product.thumbnail ||
    "https://via.placeholder.com/600x600?text=No+Image";

  const price = Number(product.price || 0);

  return (
    <div className="product-details-page">
      <div className="container py-4">

        {/* Breadcrumb */}
        <nav
          aria-label="breadcrumb"
          className="mb-4"
        >
          <ol className="breadcrumb">

            <li className="breadcrumb-item">
              <Link to="/">Home</Link>
            </li>

            <li className="breadcrumb-item">
              <Link to="/products">Products</Link>
            </li>

            <li
              className="breadcrumb-item active"
              aria-current="page"
            >
              {product.title ||
                product.name ||
                "Product"}
            </li>

          </ol>
        </nav>

        {/* Product Details */}
        <div className="row g-4">

          {/* Product Image */}
          <div className="col-lg-6">
            <div className="product-details-image-wrapper">
              <img
                src={productImage}
                alt={
                  product.title ||
                  product.name ||
                  "Product"
                }
                className="product-details-image img-fluid"
              />
            </div>
          </div>

          {/* Product Information */}
          <div className="col-lg-6">
            <div className="product-details-content">

              {/* Category */}
              {product.category && (
                <p className="text-muted text-uppercase small mb-2">
                  {product.category}
                </p>
              )}

              {/* Product Title */}
              <h1 className="product-details-title mb-3">
                {product.title || product.name}
              </h1>

              {/* Rating */}
              {product.rating !== undefined &&
                product.rating !== null && (
                  <div className="product-details-rating mb-3">
                    <span className="me-2">
                      ⭐
                    </span>

                    <strong>
                      {Number(product.rating).toFixed(1)}
                    </strong>
                  </div>
                )}

              {/* Price */}
              <div className="product-details-price mb-4">
                ${price.toFixed(2)}
              </div>

              {/* Description */}
              {product.description && (
                <div className="product-details-description mb-4">
                  <h5>Description</h5>
                  <p>{product.description}</p>
                </div>
              )}

              {/* Stock */}
              <div className="mb-4">
                {isOutOfStock ? (
                  <span className="badge bg-danger">
                    Out of Stock
                  </span>
                ) : (
                  <span className="badge bg-success">
                    {product.stock} available
                  </span>
                )}
              </div>

              {/* Quantity */}
              {!isOutOfStock && (
                <div className="mb-4">
                  <h6 className="mb-2">
                    Quantity
                  </h6>

                  <QuantityControl
                    quantity={quantity}
                    onChange={handleQuantityChange}
                    max={product.stock}
                  />
                </div>
              )}

              {/* Actions */}
              <div className="product-details-actions d-flex flex-wrap gap-2">

                {/* Add To Cart */}
                <button
                  type="button"
                  className="product-action-cart btn btn-outline-dark"
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                >
                  🛒 Add to Cart
                </button>

                {/* Order Now */}
                <button
                  type="button"
                  className="product-action-order btn btn-dark"
                  disabled={isOutOfStock}
                  onClick={handleOrderNow}
                >
                  ⚡ Order Now
                </button>

                {/* Wishlist */}
                <button
                  type="button"
                  className="product-action-wishlist btn btn-outline-danger"
                  onClick={handleWishlistToggle}
                  aria-label={
                    wishlisted
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                >
                  {wishlisted ? "❤️" : "🤍"}{" "}
                  {wishlisted
                    ? "Remove from Wishlist"
                    : "Add to Wishlist"}
                </button>

              </div>

              {/* Back to Products */}
              <div className="mt-4">
                <Link
                  to="/products"
                  className="btn btn-link px-0"
                >
                  ← Back to Products
                </Link>
              </div>

            </div>
          </div>
        </div>

        {/* Additional Product Information */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="product-details-extra">

              {product.brand && (
                <p>
                  <strong>Brand:</strong>{" "}
                  {product.brand}
                </p>
              )}

              {product.sku && (
                <p>
                  <strong>SKU:</strong>{" "}
                  {product.sku}
                </p>
              )}

              {product.category && (
                <p>
                  <strong>Category:</strong>{" "}
                  {product.category}
                </p>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProductDetails;