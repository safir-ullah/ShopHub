function SortSelect({ value, onChange }) {
  return (
    <div className="shop-sort-wrapper">
      <label htmlFor="product-sort" className="shop-control-label">
        Sort By
      </label>

      <div className="shop-select-box">
        <span className="shop-select-icon" aria-hidden="true">
          ↕
        </span>

        <select
          id="product-sort"
          className="shop-custom-select"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-label="Sort products"
        >
          <option value="default">Recommended</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}

export default SortSelect;