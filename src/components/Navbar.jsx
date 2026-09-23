import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();

  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    try {
      await logout();
      setMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  const navLinkClass = ({ isActive }) =>
    `shop-nav-link ${isActive ? "active" : ""}`;

  return (
    <nav className="shop-navbar">
      <div className="shop-navbar-inner">
        {/* Brand */}
        <Link
          className="shop-brand"
          to="/"
          onClick={closeMenu}
          aria-label="ShopHub home"
        >
          <span className="shop-brand-mark">
            <span className="shop-brand-icon">S</span>
          </span>

          <span className="shop-brand-text">
            <span className="shop-brand-name">ShopHub</span>
            <span className="shop-brand-tagline">Smart shopping</span>
          </span>
        </Link>

        {/* Mobile menu button */}
        <button
          className={`shop-menu-toggle ${menuOpen ? "open" : ""}`}
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          aria-controls="shopNavbarContent"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation */}
        <div
          id="shopNavbarContent"
          className={`shop-navbar-content ${
            menuOpen ? "menu-open" : ""
          }`}
        >
          <ul className="shop-nav-list">
            <li>
              <NavLink
                className={navLinkClass}
                to="/"
                onClick={closeMenu}
                end
              >
                <span className="shop-nav-icon">⌂</span>
                <span>Home</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                className={navLinkClass}
                to="/products"
                onClick={closeMenu}
              >
                <span className="shop-nav-icon">▦</span>
                <span>Products</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                className={navLinkClass}
                to="/wishlist"
                onClick={closeMenu}
              >
                <span className="shop-nav-icon">♡</span>
                <span>Wishlist</span>

                {wishlistCount > 0 && (
                  <span className="shop-nav-badge">
                    {wishlistCount}
                  </span>
                )}
              </NavLink>
            </li>

            <li>
              <NavLink
                className={navLinkClass}
                to="/cart"
                onClick={closeMenu}
              >
                <span className="shop-nav-icon">🛒</span>
                <span>Cart</span>

                {itemCount > 0 && (
                  <span className="shop-nav-badge">
                    {itemCount}
                  </span>
                )}
              </NavLink>
            </li>

            {user && (
              <li>
                <NavLink
                  className={navLinkClass}
                  to="/orders"
                  onClick={closeMenu}
                >
                  <span className="shop-nav-icon">◷</span>
                  <span>Orders</span>
                </NavLink>
              </li>
            )}
          </ul>

          {/* Right side */}
          <div className="shop-navbar-actions">
            {loading ? (
              <div className="shop-auth-loading">
                <span className="shop-loading-dot"></span>
                Checking...
              </div>
            ) : user ? (
              <>
                <div
                  className="shop-user-chip"
                  title={user.email}
                >
                  <span className="shop-user-avatar">
                    {(user.displayName || user.email || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </span>

                  <span className="shop-user-info">
                    <span className="shop-user-greeting">
                      Hi,
                    </span>

                    <span className="shop-user-name">
                      {user.displayName || user.email}
                    </span>
                  </span>
                </div>

                <button
                  type="button"
                  className="shop-logout-btn"
                  onClick={handleLogout}
                >
                  <span>↪</span>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  className="shop-login-btn"
                  to="/login"
                  onClick={closeMenu}
                >
                  Login
                </Link>

                <Link
                  className="shop-signup-btn"
                  to="/signup"
                  onClick={closeMenu}
                >
                  Sign Up
                  <span>→</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}