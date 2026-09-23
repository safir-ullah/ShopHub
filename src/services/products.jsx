const API_URL = "https://dummyjson.com/products";

export async function getProducts(signal) {
  const response = await fetch(`${API_URL}?limit=0`, {
    signal,
  });

  if (!response.ok) {
    throw new Error("Failed to load products.");
  }

  const data = await response.json();

  return data.products;
}

export async function getProduct(id, signal) {
  const response = await fetch(`${API_URL}/${id}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error("Failed to load product.");
  }

  return response.json();
}