
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "../services/firebase";

function getSafeReturnPath(value) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  return value;
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const returnPath = getSafeReturnPath(location.state?.from);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!form.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!form.password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setPending(true);

      await signInWithEmailAndPassword(
        auth,
        form.email.trim(),
        form.password
      );

      navigate(returnPath, { replace: true });
    } catch (err) {
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        setError("Invalid email or password.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Unable to log in. Please try again.");
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-background-orb auth-background-orb-one" />
      <div className="auth-background-orb auth-background-orb-two" />

      <div className="shop-container">
        <div className="auth-layout">

          {/* Left Visual Panel */}
          <section className="auth-showcase">
            <div className="auth-showcase-grid" />

            <div className="auth-showcase-content">
              <div className="auth-brand-mark">
                <span className="auth-brand-icon">S</span>
                <span>ShopHub</span>
              </div>

              <span className="auth-showcase-eyebrow">
                WELCOME BACK
              </span>

              <h1 className="auth-showcase-title">
                Your shopping world
                <span> is waiting.</span>
              </h1>

              <p className="auth-showcase-text">
                Sign in to access your saved products, wishlist,
                orders and a smoother shopping experience.
              </p>

              <div className="auth-feature-list">
                <div className="auth-feature">
                  <span className="auth-feature-icon">♡</span>
                  <div>
                    <strong>Save your favorites</strong>
                    <span>Keep products you love in one place.</span>
                  </div>
                </div>

                <div className="auth-feature">
                  <span className="auth-feature-icon">✓</span>
                  <div>
                    <strong>Simple checkout</strong>
                    <span>Get through your next order faster.</span>
                  </div>
                </div>

                <div className="auth-feature">
                  <span className="auth-feature-icon">◈</span>
                  <div>
                    <strong>Track your orders</strong>
                    <span>Keep your shopping history organized.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="auth-floating-card auth-floating-card-one">
              <span>✦</span>
              <div>
                <strong>Smart Shopping</strong>
                <small>Made beautifully simple</small>
              </div>
            </div>

            <div className="auth-floating-card auth-floating-card-two">
              <span>🛒</span>
              <strong>Ready to shop?</strong>
            </div>
          </section>

          {/* Login Panel */}
          <section className="auth-form-panel">
            <div className="auth-form-header">
              <span className="auth-mobile-brand">
                <span className="auth-mobile-brand-icon">S</span>
                ShopHub
              </span>

              <span className="auth-form-eyebrow">
                ACCOUNT ACCESS
              </span>

              <h2 className="auth-form-title">
                Welcome back
              </h2>

              <p className="auth-form-subtitle">
                Login to continue shopping on ShopHub.
              </p>
            </div>

            {error && (
              <div
                className="auth-error"
                role="alert"
              >
                <span className="auth-error-icon">!</span>
                <span>{error}</span>
              </div>
            )}

            <form
              className="auth-form"
              onSubmit={handleSubmit}
            >
              {/* Email */}
              <div className="auth-field">
                <label
                  htmlFor="login-email"
                  className="auth-label"
                >
                  Email address
                </label>

                <div className="auth-input-wrapper">
                  <span
                    className="auth-input-icon"
                    aria-hidden="true"
                  >
                    @
                  </span>

                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    className="auth-input"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    disabled={pending}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="auth-field">
                <div className="auth-label-row">
                  <label
                    htmlFor="login-password"
                    className="auth-label"
                  >
                    Password
                  </label>
                </div>

                <div className="auth-input-wrapper">
                  <span
                    className="auth-input-icon"
                    aria-hidden="true"
                  >
                    •
                  </span>

                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="auth-input auth-password-input"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    disabled={pending}
                    required
                  />

                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    disabled={pending}
                  >
                    {showPassword ? "◉" : "○"}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="auth-submit-btn"
                disabled={pending}
              >
                {pending ? (
                  <>
                    <span className="auth-spinner" />
                    <span>Logging in...</span>
                  </>
                ) : (
                  <>
                    <span>Login to ShopHub</span>
                    <span className="auth-submit-arrow">→</span>
                  </>
                )}
              </button>
            </form>

            <div className="auth-divider">
              <span>NEW TO SHOPHUB?</span>
            </div>

            <div className="auth-signup-box">
              <p>
                Don't have an account?
              </p>

              <Link
                to="/signup"
                state={{ from: returnPath }}
                className="auth-signup-link"
              >
                Create an account
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <p className="auth-bottom-note">
              By continuing, you're joining a simple and secure
              shopping experience.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

