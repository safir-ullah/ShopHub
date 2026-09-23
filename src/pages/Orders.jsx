
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { Link, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { db } from "../services/firebase";

export default function Orders() {
  const { user } = useAuth();
  const location = useLocation();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrders, setExpandedOrders] = useState({});

  useEffect(() => {
    let cancelled = false;

    async function loadOrders() {
      if (!user) {
        setOrders([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const ordersRef = collection(
          db,
          "users",
          user.uid,
          "orders"
        );

        const ordersQuery = query(
          ordersRef,
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(ordersQuery);

        if (cancelled) return;

        const loadedOrders = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders(loadedOrders);

        // Automatically expand the newest order.
        if (loadedOrders.length > 0) {
          setExpandedOrders({
            [loadedOrders[0].id]: true,
          });
        }
      } catch (err) {
        console.error("Failed to load orders:", err);

        if (!cancelled) {
          setError(
            "Unable to load your orders. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadOrders();

    return () => {
      cancelled = true;
    };
  }, [user]);

  function toggleOrder(orderId) {
    setExpandedOrders((current) => ({
      ...current,
      [orderId]: !current[orderId],
    }));
  }

  function formatDate(timestamp) {
    if (!timestamp?.toDate) {
      return "Processing date...";
    }

    return timestamp.toDate().toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  function getItemCount(items = []) {
    return items.reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0
    );
  }

  function formatPrice(value) {
    return `$${Number(value || 0).toFixed(2)}`;
  }

  if (loading) {
    return (
      <main className="orders-page">
        <div className="shop-container">
          <section className="orders-loading">
            <div className="orders-loading-spinner">
              <span />
            </div>

            <span className="orders-loading-eyebrow">
              SHOPHUB ORDERS
            </span>

            <h1>Loading your orders...</h1>

            <p>
              We're retrieving your purchase history.
            </p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="orders-page">
      <div className="shop-container">

        {/* Page Header */}
        <header className="orders-header">
          <div>
            <span className="orders-eyebrow">
              SHOPHUB ORDERS
            </span>

            <h1 className="orders-title">
              My Orders
            </h1>

            <p className="orders-subtitle">
              View and review your previous ShopHub
              purchases.
            </p>
          </div>

          {orders.length > 0 && (
            <div className="orders-count-card">
              <span className="orders-count-icon">
                📦
              </span>

              <div>
                <strong>{orders.length}</strong>
                <span>
                  {orders.length === 1
                    ? "Order"
                    : "Orders"}
                </span>
              </div>
            </div>
          )}
        </header>

        {/* Successful Order Message */}
        {location.state?.orderId && (
          <div
            className="orders-success"
            role="status"
          >
            <div className="orders-success-icon">
              ✓
            </div>

            <div className="orders-success-content">
              <strong>
                Order placed successfully!
              </strong>

              <p>
                Your ShopHub order has been saved
                successfully.
              </p>

              <span>
                Order ID:{" "}
                <strong>
                  {location.state.orderId}
                </strong>
              </span>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            className="orders-error"
            role="alert"
          >
            <div className="orders-error-icon">
              !
            </div>

            <div>
              <strong>
                We couldn't load your orders
              </strong>

              <p>{error}</p>

              <button
                type="button"
                className="orders-retry-btn"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!error && orders.length === 0 && (
          <section className="orders-empty">
            <div className="orders-empty-icon">
              🛍️
            </div>

            <span className="orders-empty-eyebrow">
              YOUR ORDER HISTORY
            </span>

            <h2>
              No orders yet
            </h2>

            <p>
              You haven't placed any orders yet.
              Explore our products and your purchases
              will appear here.
            </p>

            <Link
              to="/products"
              className="orders-primary-btn"
            >
              <span>Start Shopping</span>
              <span>→</span>
            </Link>
          </section>
        )}

        {/* Orders */}
        {!error && orders.length > 0 && (
          <section className="orders-list">

            {orders.map((order, index) => {
              const items = order.items || [];
              const itemCount = getItemCount(items);
              const isExpanded =
                !!expandedOrders[order.id];

              return (
                <article
                  className={`order-card ${
                    index === 0
                      ? "order-card-latest"
                      : ""
                  }`}
                  key={order.id}
                >

                  {/* Order Header */}
                  <button
                    type="button"
                    className="order-card-header"
                    onClick={() =>
                      toggleOrder(order.id)
                    }
                    aria-expanded={isExpanded}
                  >
                    <div className="order-header-left">

                      <div className="order-icon">
                        📦
                      </div>

                      <div className="order-header-info">
                        <div className="order-number-row">
                          <span className="order-number">
                            Order #{order.id}
                          </span>

                          {index === 0 && (
                            <span className="order-latest-badge">
                              Latest
                            </span>
                          )}
                        </div>

                        <span className="order-date">
                          {formatDate(order.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="order-header-right">

                      <div className="order-header-total">
                        <span>Total</span>

                        <strong>
                          {formatPrice(order.total)}
                        </strong>
                      </div>

                      <span
                        className={`order-status order-status-${String(
                          order.status || "placed"
                        ).toLowerCase()}`}
                      >
                        <span className="order-status-dot" />
                        {order.status || "Placed"}
                      </span>

                      <span
                        className={`order-expand ${
                          isExpanded
                            ? "order-expand-open"
                            : ""
                        }`}
                        aria-hidden="true"
                      >
                        ↓
                      </span>
                    </div>
                  </button>

                  {/* Preview */}
                  {!isExpanded && (
                    <div className="order-preview">
                      <div className="order-preview-products">
                        {items.slice(0, 4).map((item) => (
                          <div
                            className="order-preview-image"
                            key={item.id}
                          >
                            <img
                              src={item.thumbnail}
                              alt=""
                            />
                          </div>
                        ))}

                        {items.length > 4 && (
                          <div className="order-preview-more">
                            +{items.length - 4}
                          </div>
                        )}
                      </div>

                      <span className="order-preview-count">
                        {itemCount}{" "}
                        {itemCount === 1
                          ? "item"
                          : "items"}
                      </span>

                      <span className="order-preview-action">
                        View details →
                      </span>
                    </div>
                  )}

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="order-card-content">

                      {/* Items */}
                      <div className="order-items-section">

                        <div className="order-section-heading">
                          <div>
                            <span>
                              ORDER CONTENTS
                            </span>

                            <h3>
                              Items in this order
                            </h3>
                          </div>

                          <span className="order-item-count">
                            {itemCount}{" "}
                            {itemCount === 1
                              ? "item"
                              : "items"}
                          </span>
                        </div>

                        <div className="order-items-list">

                          {items.map((item) => (
                            <div
                              className="order-item"
                              key={item.id}
                            >
                              <div className="order-item-image">
                                <img
                                  src={item.thumbnail}
                                  alt={item.title}
                                />
                              </div>

                              <div className="order-item-info">
                                <h4>
                                  {item.title}
                                </h4>

                                <span>
                                  {formatPrice(item.price)} ×{" "}
                                  {item.quantity}
                                </span>
                              </div>

                              <strong className="order-item-total">
                                {formatPrice(
                                  Number(item.price) *
                                    Number(item.quantity)
                                )}
                              </strong>
                            </div>
                          ))}

                        </div>
                      </div>

                      {/* Bottom Information */}
                      <div className="order-bottom-grid">

                        {/* Delivery */}
                        <div className="order-delivery-box">

                          <div className="order-box-heading">
                            <span className="order-box-icon">
                              📍
                            </span>

                            <div>
                              <span>
                                DELIVERY DETAILS
                              </span>

                              <h3>
                                Shipping information
                              </h3>
                            </div>
                          </div>

                          <div className="order-delivery-info">
                            <strong>
                              {order.delivery?.fullName ||
                                "Customer"}
                            </strong>

                            <span>
                              {order.delivery?.phone ||
                                "Phone not provided"}
                            </span>

                            <span>
                              {order.delivery?.address ||
                                "Address not provided"}
                            </span>

                            <span>
                              {order.delivery?.city ||
                                ""}
                            </span>
                          </div>
                        </div>

                        {/* Summary */}
                        <div className="order-total-box">

                          <div className="order-box-heading">
                            <span className="order-box-icon">
                              💳
                            </span>

                            <div>
                              <span>
                                PAYMENT SUMMARY
                              </span>

                              <h3>
                                Order total
                              </h3>
                            </div>
                          </div>

                          <div className="order-total-lines">

                            <div>
                              <span>Subtotal</span>
                              <strong>
                                {formatPrice(
                                  order.subtotal
                                )}
                              </strong>
                            </div>

                            <div>
                              <span>Delivery</span>
                              <strong className="free-delivery">
                                Free
                              </strong>
                            </div>

                            <div className="order-grand-total">
                              <span>Total</span>

                              <strong>
                                {formatPrice(
                                  order.total
                                )}
                              </strong>
                            </div>

                          </div>
                        </div>

                      </div>

                      {/* Order Footer */}
                      <div className="order-card-footer">

                        <span>
                          🔒 Secure order record
                        </span>

                        <span>
                          Order ID: {order.id}
                        </span>

                      </div>
                    </div>
                  )}

                </article>
              );
            })}
          </section>
        )}

      </div>
    </main>
  );
}

