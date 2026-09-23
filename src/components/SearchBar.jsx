function SearchBar({ value, onChange }) {
  return (
    <div className="shop-search-wrapper">
      <label htmlFor="product-search" className="shop-control-label">
        Search Products
      </label>

      <div className="shop-search-box">
        <span className="shop-search-icon" aria-hidden="true">
          ⌕
        </span>

        <input
          id="product-search"
          type="search"
          className="shop-search-input"
          placeholder="Search products by name..."
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-label="Search products by name"
        />

        {value && (
          <button
            type="button"
            className="shop-search-clear"
            onClick={() => onChange("")}
            aria-label="Clear product search"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchBar;