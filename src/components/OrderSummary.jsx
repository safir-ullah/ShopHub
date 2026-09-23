export default function OrderSummary({ items = [] }) {
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const delivery = 0;

  const total = subtotal + delivery;

  return (
    <div className="card shadow-sm">
      <div className="card-body p-4">

        <h2 className="h5 fw-bold mb-4">
          Order Summary
        </h2>

        {/* Cart Items */}
        {items.length > 0 ? (
          <div className="mb-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="d-flex gap-3 mb-3"
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  width="64"
                  height="64"
                  className="rounded border"
                  style={{
                    objectFit: "contain",
                    backgroundColor: "#f2f5fa",
                  }}
                />

                <div className="flex-grow-1">
                  <p className="fw-semibold mb-1">
                    {item.title}
                  </p>

                  <small className="text-muted">
                    ${item.price.toFixed(2)} × {item.quantity}
                  </small>
                </div>

                <div className="fw-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">
            Your cart is empty.
          </p>
        )}

        <hr />

        {/* Subtotal */}
        <div className="d-flex justify-content-between mb-2">
          <span className="text-muted">
            Subtotal
          </span>

          <span className="fw-semibold">
            ${subtotal.toFixed(2)}
          </span>
        </div>

        {/* Delivery */}
        <div className="d-flex justify-content-between mb-2">
          <span className="text-muted">
            Delivery
          </span>

          <span className="fw-semibold text-success">
            Free
          </span>
        </div>

        <hr />

        {/* Total */}
        <div className="d-flex justify-content-between align-items-center">
          <span className="fw-bold">
            Total
          </span>

          <span className="fw-bold fs-5">
            ${total.toFixed(2)}
          </span>
        </div>

      </div>
    </div>
  );
}