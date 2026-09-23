
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import { auth } from "../services/firebase";

function getSafeReturnPath(value) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  return value;
}

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();

  const returnPath = getSafeReturnPath(location.state?.from);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    if (!form.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!form.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setPending(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email.trim(),
        form.password
      );

      await updateProfile(userCredential.user, {
        displayName: form.name.trim(),
      });

      navigate(returnPath, { replace: true });
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("An account with this email already exists.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak. Use at least 6 characters.");
      } else {
        setError("Unable to create your account. Please try again.");
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="auth-page auth-signup-page">
      <div className="auth-background-orb auth-background-orb-one" />
      <div className="auth-background-orb auth-background-orb-two" />

      <div className="shop-container">
        <div className="auth-layout">

          {/* Left Visual Panel */}
          <section className="auth-showcase auth-signup-showcase">
            <div className="auth-showcase-grid" />

            <div className="auth-showcase-content">
              <div className="auth-brand-mark">
                <span className="auth-brand-icon">S</span>
                <span>ShopHub</span>
              </div>

              <span className="auth-showcase-eyebrow">
                JOIN THE EXPERIENCE
              </span>

              <h1 className="auth-showcase-title">
                Shopping starts
                <span> with you.</span>
              </h1>

              <p className="auth-showcase-text">
                Create your ShopHub account and bring your
                wishlist, orders and favorite products together
                in one simple place.
              </p>

              <div className="auth-feature-list">
                <div className="auth-feature">
                  <span className="auth-feature-icon">♡</span>
                  <div>
                    <strong>Build your wishlist</strong>
                    <span>Save products you want to remember.</span>
                  </div>
                </div>

                <div className="auth-feature">
                  <span className="auth-feature-icon">⚡</span>
                  <div>
                    <strong>Shop with ease</strong>
                    <span>Enjoy a clean and simple experience.</span>
                  </div>
                </div>

                <div className="auth-feature">
                  <span className="auth-feature-icon">✓</span>
                  <div>
                    <strong>Keep orders organized</strong>
                    <span>Access your shopping history anytime.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="auth-floating-card auth-floating-card-one">
              <span>✦</span>
              <div>
                <strong>Welcome to ShopHub</strong>
                <small>Your shopping journey starts here</small>
              </div>
            </div>

            <div className="auth-floating-card auth-floating-card-two">
              <span>♡</span>
              <strong>Save what you love</strong>
            </div>
          </section>

          {/* Signup Panel */}
          <section className="auth-form-panel auth-signup-form-panel">
            <div className="auth-form-header">
              <span className="auth-mobile-brand">
                <span className="auth-mobile-brand-icon">S</span>
                ShopHub
              </span>

              <span className="auth-form-eyebrow">
                CREATE ACCOUNT
              </span>

              <h2 className="auth-form-title">
                Create your account
              </h2>

              <p className="auth-form-subtitle">
                Join ShopHub and start shopping today.
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
              className="auth-form auth-signup-form"
              onSubmit={handleSubmit}
            >
              {/* Full Name */}
              <div className="auth-field">
                <label
                  htmlFor="signup-name"
                  className="auth-label"
                >
                  Full name
                </label>

                <div className="auth-input-wrapper">
                  <span
                    className="auth-input-icon"
                    aria-hidden="true"
                  >
                    ◉
                  </span>

                  <input
                    id="signup-name"
                    name="name"
                    type="text"
                    className="auth-input"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                    disabled={pending}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="auth-field">
                <label
                  htmlFor="signup-email"
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
                    id="signup-email"
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
                <label
                  htmlFor="signup-password"
                  className="auth-label"
                >
                  Password
                </label>

                <div className="auth-input-wrapper">
                  <span
                    className="auth-input-icon"
                    aria-hidden="true"
                  >
                    •
                  </span>

                  <input
                    id="signup-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="auth-input auth-password-input"
                    placeholder="At least 6 characters"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
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

              {/* Confirm Password */}
              <div className="auth-field">
                <label
                  htmlFor="signup-confirm-password"
                  className="auth-label"
                >
                  Confirm password
                </label>

                <div className="auth-input-wrapper">
                  <span
                    className="auth-input-icon"
                    aria-hidden="true"
                  >
                    •
                  </span>

                  <input
                    id="signup-confirm-password"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    className="auth-input auth-password-input"
                    placeholder="Re-enter your password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    disabled={pending}
                    required
                  />

                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        (current) => !current
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    disabled={pending}
                  >
                    {showConfirmPassword ? "◉" : "○"}
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
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create my ShopHub account</span>
                    <span className="auth-submit-arrow">
                      →
                    </span>
                  </>
                )}
              </button>
            </form>

            <div className="auth-divider">
              <span>ALREADY A MEMBER?</span>
            </div>

            <div className="auth-signup-box">
              <p>
                Already have an account?
              </p>

              <Link
                to="/login"
                state={{ from: returnPath }}
                className="auth-signup-link"
              >
                Login instead
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <p className="auth-bottom-note">
              Your account lets you keep your wishlist,
              cart and order history connected.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

