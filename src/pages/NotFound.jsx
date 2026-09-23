
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-orb not-found-orb-one" />
      <div className="not-found-orb not-found-orb-two" />

      <div className="shop-container">
        <section className="not-found-content">
          <div className="not-found-visual" aria-hidden="true">
            <div className="not-found-number">404</div>

            <div className="not-found-cart">
              <span className="not-found-cart-icon">🛒</span>
            </div>

            <span className="not-found-dot not-found-dot-one" />
            <span className="not-found-dot not-found-dot-two" />
            <span className="not-found-dot not-found-dot-three" />
          </div>

          <div className="not-found-text">
            <span className="not-found-eyebrow">Oops! Something went missing</span>

            <h1 className="not-found-title">Page Not Found</h1>

            <p className="not-found-description">
              The page you're looking for doesn't exist or may have been moved.
              Let's get you back to shopping.
            </p>

            <div className="not-found-actions">
              <Link to="/" className="not-found-primary-btn">
                <span>←</span>
                Back to Home
              </Link>

              <Link to="/products" className="not-found-secondary-btn">
                Explore Products
                <span>→</span>
              </Link>
            </div>

            <div className="not-found-note">
              <span className="not-found-note-icon">✦</span>
              <span>There are plenty of great products waiting for you.</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default NotFound;

