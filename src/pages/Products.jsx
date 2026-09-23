
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ProductGrid from "../components/ProductGrid";
import PageState from "../components/PageState";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import SortSelect from "../components/SortSelect";
import { getProducts } from "../services/products";
import { useCart } from "../context/CartContext";

function Products() {
  const { addItem } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(
    searchParams.get("category") || ""
  );
  const [sort, setSort] = useState("default");

  async function loadProducts(signal) {
    try {
      setStatus("loading");
      setError("");

      const data = await getProducts(signal);

      setProducts(data);
      setStatus("success");
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      }

      setError(error.message);
      setStatus("error");
    }
  }

  useEffect(() => {
    const controller = new AbortController();

    loadProducts(controller.signal);

    return () => controller.abort();
  }, []);

  // Keep category filter synchronized with the URL.
  useEffect(() => {
    const urlCategory = searchParams.get("category") || "";
    setCategory(urlCategory);
  }, [searchParams]);

  // Create a unique, sorted category list from the products.
  const categories = useMemo(() => {
    return [...new Set(products.map((product) => product.category))].sort();
  }, [products]);

  // Search → category filter → sorting.
  const filteredProducts = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    let result = products.filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(searchText);

      const matchesCategory =
        category === "" || product.category === category;

      return matchesSearch && matchesCategory;
    });

    if (sort === "low") {
      result = [...result].sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, search, category, sort]);

  function handleCategoryChange(newCategory) {
    setCategory(newCategory);

    if (newCategory) {
      setSearchParams({ category: newCategory });
    } else {
      setSearchParams({});
    }
  }

  function resetFilters() {
    setSearch("");
    setCategory("");
    setSort("default");
    setSearchParams({});
  }

  return (
    <main className="container py-5">
      {/* Page heading */}
      <div className="mb-4">
        <h1 className="fw-bold">All Products</h1>

        <p className="text-muted">
          Browse our complete product collection.
        </p>
      </div>

      {/* Loading state */}
      {status === "loading" && <PageState type="loading" />}

      {/* Error state */}
      {status === "error" && (
        <PageState
          type="error"
          message={error}
          onRetry={() => loadProducts()}
        />
      )}

      {/* Success state */}
      {status === "success" && (
        <>
          {/* Filters */}
          <div className="bg-white rounded-4 shadow-sm p-4 mb-4">
            <div className="row g-3 align-items-end">
              {/* Search */}
              <div className="col-lg-6">
                <SearchBar
                  value={search}
                  onChange={setSearch}
                />
              </div>

              {/* Sort */}
              <div className="col-lg-3">
                <SortSelect
                  value={sort}
                  onChange={setSort}
                />
              </div>

              {/* Category */}
              <div className="col-lg-3">
                <FilterPanel
                  categories={categories}
                  category={category}
                  onCategoryChange={handleCategoryChange}
                  onReset={resetFilters}
                />
              </div>
            </div>
          </div>

          {/* Result information */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <p className="text-muted mb-0">
              <strong>{filteredProducts.length}</strong>{" "}
              {filteredProducts.length === 1
                ? "product"
                : "products"}{" "}
              found
            </p>

            {(search || category || sort !== "default") && (
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={resetFilters}
              >
                Clear All
              </button>
            )}
          </div>

          {/* Empty state */}
          {filteredProducts.length === 0 ? (
            <PageState type="empty" />
          ) : (
            <ProductGrid
              products={filteredProducts}
              onAdd={addItem}
            />
          )}
        </>
      )}
    </main>
  );
}

export default Products;
