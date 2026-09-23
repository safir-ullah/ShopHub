import { useEffect, useRef, useState } from "react";

function FilterPanel({
  categories,
  category,
  onCategoryChange,
  onReset,
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside.
  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  function handleCategorySelect(value) {
    onCategoryChange(value);
    setOpen(false);
  }

  const selectedLabel = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : "All Categories";

  return (
    <div className="shop-filter-wrapper">
      <div className="shop-filter-header">
        <label className="shop-control-label">
          Category
        </label>

        {category && (
          <button
            type="button"
            className="shop-filter-reset-mini"
            onClick={onReset}
          >
            Reset
          </button>
        )}
      </div>

      {/* Custom Dropdown */}
      <div
        className={`shop-custom-dropdown ${open ? "is-open" : ""}`}
        ref={dropdownRef}
      >
        <button
          type="button"
          className="shop-custom-dropdown-trigger"
          onClick={() => setOpen((current) => !current)}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className="shop-dropdown-left">
            <span className="shop-select-icon" aria-hidden="true">
              ◈
            </span>

            <span className="shop-dropdown-value">
              {selectedLabel}
            </span>
          </span>

          <span
            className="shop-dropdown-arrow"
            aria-hidden="true"
          >
           ⌄
          </span>
        </button>

        {open && (
          <div
            className="shop-custom-dropdown-menu"
            role="listbox"
            aria-label="Product categories"
          >
            <button
              type="button"
              className={`shop-dropdown-option ${
                category === "" ? "selected" : ""
              }`}
              onClick={() => handleCategorySelect("")}
              role="option"
              aria-selected={category === ""}
            >
              <span className="shop-option-icon">✦</span>
              <span>All Categories</span>

              {category === "" && (
                <span className="shop-option-check">✓</span>
              )}
            </button>

            {categories.map((item) => {
              const label =
                item.charAt(0).toUpperCase() + item.slice(1);

              const isSelected = category === item;

              return (
                <button
                  type="button"
                  key={item}
                  className={`shop-dropdown-option ${
                    isSelected ? "selected" : ""
                  }`}
                  onClick={() => handleCategorySelect(item)}
                  role="option"
                  aria-selected={isSelected}
                >
                  <span className="shop-option-icon">◇</span>

                  <span>{label}</span>

                  {isSelected && (
                    <span className="shop-option-check">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <button
        type="button"
        className="shop-filter-reset"
        onClick={onReset}
      >
        <span aria-hidden="true">↺</span>
        Reset Filters
      </button>
    </div>
  );
}

export default FilterPanel;