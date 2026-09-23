import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);

const CART_STORAGE_KEY = "shophub-cart-v1";

function isValidCartItem(item) {
  return (
    item &&
    Number.isInteger(item.id) &&
    typeof item.title === "string" &&
    item.title.trim() !== "" &&
    Number.isFinite(item.price) &&
    item.price >= 0 &&
    Number.isInteger(item.quantity) &&
    item.quantity >= 1 &&
    Number.isInteger(item.stock) &&
    item.stock >= 1 &&
    typeof item.thumbnail === "string" &&
    item.thumbnail.trim() !== ""
  );
}

function loadSavedCart() {
  try {
    const savedCart = localStorage.getItem(
      CART_STORAGE_KEY
    );

    if (!savedCart) {
      return [];
    }

    const parsedCart = JSON.parse(savedCart);

    if (!Array.isArray(parsedCart)) {
      return [];
    }

    const validItems = parsedCart.filter(
      isValidCartItem
    );

    const uniqueItems = [];
    const seenIds = new Set();

    for (const item of validItems) {
      if (!seenIds.has(item.id)) {
        seenIds.add(item.id);

        uniqueItems.push({
          ...item,
          quantity: Math.min(
            item.quantity,
            item.stock
          ),
        });
      }
    }

    return uniqueItems;
  } catch (error) {
    console.warn(
      "Unable to restore saved cart.",
      error
    );

    return [];
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(loadSavedCart);

  useEffect(() => {
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cart)
      );
    } catch (error) {
      console.warn(
        "Unable to save cart.",
        error
      );
    }
  }, [cart]);

  /*
   * Add a product to the existing cart.
   */
  function addItem(product, quantity = 1) {
    if (!product || product.stock <= 0) {
      return false;
    }

    const safeQuantity = Math.max(
      1,
      Math.floor(Number(quantity) || 1)
    );

    const existingItem = cart.find(
      (item) => item.id === product.id
    );

    // Already at maximum stock.
    if (
      existingItem &&
      existingItem.quantity >= product.stock
    ) {
      return false;
    }

    setCart((currentCart) => {
      const currentItem = currentCart.find(
        (item) => item.id === product.id
      );

      if (currentItem) {
        const newQuantity = Math.min(
          currentItem.quantity + safeQuantity,
          product.stock
        );

        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: newQuantity,
                stock: product.stock,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          quantity: Math.min(
            safeQuantity,
            product.stock
          ),
          stock: product.stock,
        },
      ];
    });

    return true;
  }

  /*
   * Buy Now:
   * Replace the current cart with only the
   * selected product and quantity 1.
   *
   * This allows Checkout to use the same
   * existing checkout system.
   */
  function buyNow(product) {
    if (!product || product.stock <= 0) {
      return false;
    }

    const buyNowItem = {
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      quantity: 1,
      stock: product.stock,
    };

    setCart([buyNowItem]);

    return true;
  }

  /*
   * Update product quantity.
   */
  function updateQuantity(productId, quantity) {
    setCart((currentCart) =>
      currentCart.map((item) => {
        if (item.id !== productId) {
          return item;
        }

        const safeQuantity = Math.floor(
          Number(quantity) || 1
        );

        const newQuantity = Math.max(
          1,
          Math.min(
            safeQuantity,
            item.stock
          )
        );

        return {
          ...item,
          quantity: newQuantity,
        };
      })
    );
  }

  /*
   * Remove product from cart.
   */
  function removeItem(productId) {
    setCart((currentCart) =>
      currentCart.filter(
        (item) => item.id !== productId
      )
    );
  }

  /*
   * Clear entire cart.
   */
  function clearCart() {
    setCart([]);
  }

  /*
   * Total number of products.
   */
  const itemCount = useMemo(
    () =>
      cart.reduce(
        (total, item) =>
          total + item.quantity,
        0
      ),
    [cart]
  );

  /*
   * Cart subtotal.
   */
  const subtotal = useMemo(
    () =>
      cart.reduce(
        (total, item) =>
          total +
          item.price * item.quantity,
        0
      ),
    [cart]
  );

  /*
   * ShopHub uses free delivery,
   * therefore total = subtotal.
   */
  const total = subtotal;

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        buyNow,
        updateQuantity,
        removeItem,
        clearCart,
        itemCount,
        subtotal,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside a CartProvider"
    );
  }

  return context;
}