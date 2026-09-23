function QuantityControl({ value, max, onChange }) {
  const decrease = () => {
    if (value > 1) {
      onChange(value - 1);
    }
  };

  const increase = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div>
      <label className="form-label fw-semibold">
        Quantity
      </label>

      <div
        className="d-flex align-items-center"
        style={{ maxWidth: "180px" }}
      >
        <button
          type="button"
          className="btn btn-outline-secondary"
          style={{ minWidth: "44px", height: "44px" }}
          onClick={decrease}
          disabled={value <= 1}
          aria-label="Decrease quantity"
        >
          −
        </button>

        <div
          className="form-control text-center fw-semibold mx-2"
          style={{ width: "70px", height: "44px" }}
          aria-live="polite"
        >
          {value}
        </div>

        <button
          type="button"
          className="btn btn-outline-secondary"
          style={{ minWidth: "44px", height: "44px" }}
          onClick={increase}
          disabled={value >= max}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <small className="text-muted d-block mt-2">
        Maximum available: {max}
      </small>
    </div>
  );
}

export default QuantityControl;