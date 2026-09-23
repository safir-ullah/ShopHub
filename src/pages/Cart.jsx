
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import OrderSummary from "../components/OrderSummary";
import QuantityControl from "../components/QuantityControl";

export default function Cart() {
  const {
    cart,
    updateQuantity,
    removeItem,
  } = useCart();

  /* =========================================================
     EMPTY CART
     ========================================================= */

  if (cart.length === 0) {
    return (
      <main className="cart-page">
        <div className="container">

          <div className="cart-empty-state">

            <div className="cart-empty-icon" aria-hidden="true">
              🛒
            </div>

            <span className="cart-empty-eyebrow">
              Your shopping bag
            </span>

            <h1 className="cart-empty-title">
              Your cart is waiting
            </h1>

            <p className="cart-empty-text">
              Looks like you haven't added anything yet.
              Explore our products and find something you love.
            </p>

            <Link
              to="/products"
              className="cart-primary-btn"
            >
              <span aria-hidden="true">✦</span>
              Browse Products
            </Link>

          </div>

        </div>
      </main>
    );
  }

  /* =========================================================
     CART PAGE
     ========================================================= */

  return (
    <main className="cart-page">

      <div className="container">

        {/* -----------------------------------------------------
            PAGE HEADER
        ----------------------------------------------------- */}

        <header className="cart-page-header">

          <div>
            <span className="cart-page-eyebrow">
              Shopping bag
            </span>

            <h1 className="cart-page-title">
              Your Cart
            </h1>

            <p className="cart-page-subtitle">
              Review your selected products before checkout.
            </p>
          </div>

          <div className="cart-item-count">
            <span className="cart-item-count-number">
              {cart.reduce(
                (total, item) => total + item.quantity,
                0
              )}
            </span>

            <span>
              {cart.reduce(
                (total, item) => total + item.quantity,
                0
              ) === 1
                ? "item"
                : "items"}
            </span>
          </div>

        </header>


        {/* -----------------------------------------------------
            CART LAYOUT
        ----------------------------------------------------- */}

        <div className="cart-layout">

          {/* ===================================================
              LEFT — CART ITEMS
              =================================================== */}

          <section
            className="cart-items-section"
            aria-label="Cart items"
          >

            <div className="cart-items-header">

              <div>
                <span className="cart-section-label">
                  Selected products
                </span>

                <strong>
                  {cart.length}{" "}
                  {cart.length === 1 ? "product" : "products"}
                </strong>
              </div>

              <span className="cart-free-delivery">
                <span aria-hidden="true">✓</span>
                Free delivery
              </span>

            </div>


            {/* -------------------------------------------------
                ITEMS
            ------------------------------------------------- */}

            <div className="cart-items-list">

              {cart.map((item) => {

                const itemTotal =
                  item.price * item.quantity;

                return (
                  <article
                    key={item.id}
                    className="cart-item-card"
                  >

                    {/* Product Image */}

                    <Link
                      to={`/products/${item.id}`}
                      className="cart-item-image-link"
                      aria-label={`View ${item.title}`}
                    >
                      <div className="cart-item-image-wrap">

                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="cart-item-image"
                        />

                      </div>
                    </Link>


                    {/* Product Information */}

                    <div className="cart-item-content">

                      <div className="cart-item-top">

                        <div>

                          <span className="cart-item-category">
                            {item.category}
                          </span>

                          <Link
                            to={`/products/${item.id}`}
                            className="cart-item-title-link"
                          >
                            <h2 className="cart-item-title">
                              {item.title}
                            </h2>
                          </Link>

                        </div>

                        <span className="cart-item-total">
                          ${itemTotal.toFixed(2)}
                        </span>

                      </div>


                      <div className="cart-item-middle">

                        <span className="cart-item-unit-price">
                          ${item.price.toFixed(2)} each
                        </span>

                        {item.stock > 0 && (
                          <span className="cart-item-stock">
                            <span
                              className="cart-stock-dot"
                              aria-hidden="true"
                            />
                            {item.stock} available
                          </span>
                        )}

                      </div>


                      {/* Bottom Controls */}

                      <div className="cart-item-actions">

                        <div className="cart-quantity-area">

                          <span className="cart-control-label">
                            Quantity
                          </span>

                          <QuantityControl
                            value={item.quantity}
                            max={item.stock}
                            onChange={(nextQuantity) =>
                              updateQuantity(
                                item.id,
                                nextQuantity
                              )
                            }
                          />

                        </div>


                        <button
                          type="button"
                          className="cart-remove-btn"
                          onClick={() =>
                            removeItem(item.id)
                          }
                          aria-label={`Remove ${item.title} from cart`}
                        >
                          <span aria-hidden="true">
                            ×
                          </span>

                          Remove
                        </button>

                      </div>

                    </div>

                  </article>
                );
              })}

            </div>


            {/* -------------------------------------------------
                CONTINUE SHOPPING
            ------------------------------------------------- */}

            <div className="cart-continue-row">

              <Link
                to="/products"
                className="cart-continue-link"
              >
                <span aria-hidden="true">←</span>
                Continue Shopping
              </Link>

              <span className="cart-secure-note">
                Secure checkout
              </span>

            </div>

          </section>


          {/* ===================================================
              RIGHT — ORDER SUMMARY
              =================================================== */}

          <aside className="cart-summary-section">

            <div className="cart-summary-sticky">

              <div className="cart-summary-heading">

                <span className="cart-section-label">
                  Order summary
                </span>

                <h2>
                  Almost yours
                </h2>

              </div>


              {/* Existing OrderSummary component */}

              <div className="cart-order-summary">

                <OrderSummary items={cart} />

              </div>


              {/* Checkout */}

              <Link
                to="/checkout"
                className="cart-checkout-btn"
              >
                <span>
                  Proceed to Checkout
                </span>

                <span
                  className="cart-checkout-arrow"
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>


              {/* Trust Information */}

              <div className="cart-summary-trust">

                <div className="cart-trust-row">

                  <span
                    className="cart-trust-icon"
                    aria-hidden="true"
                  >
                    ✓
                  </span>

                  <div>
                    <strong>
                      Free delivery
                    </strong>

                    <span>
                      No extra shipping charges
                    </span>
                  </div>

                </div>


                <div className="cart-trust-row">

                  <span
                    className="cart-trust-icon"
                    aria-hidden="true"
                  >
                    🔒
                  </span>

                  <div>
                    <strong>
                      Secure checkout
                    </strong>

                    <span>
                      Your order information is protected
                    </span>
                  </div>

                </div>

              </div>

            </div>

          </aside>

        </div>

      </div>

    </main>
  );
}

