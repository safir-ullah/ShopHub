function PageState({ type, message, onRetry }) {
  if (type === "loading") {
    return (
      <div className="text-center py-5">
        <div
          className="spinner-border text-primary"
          role="status"
        >
          <span className="visually-hidden">
            Loading...
          </span>
        </div>

        <p className="text-muted mt-3 mb-0">
          Loading products...
        </p>
      </div>
    );
  }

  if (type === "error") {
    return (
      <div className="text-center py-5">
        <div className="alert alert-danger">
          {message || "Something went wrong."}
        </div>

        {onRetry && (
          <button
            className="btn btn-primary"
            onClick={onRetry}
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  if (type === "empty") {
    return (
      <div className="text-center py-5">
        <h4>No products found</h4>

        <p className="text-muted">
          There are no products to display.
        </p>
      </div>
    );
  }

  return null;
}

export default PageState;