import { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext(null);

const WISHLIST_STORAGE_KEY = "shophub-wishlist-v1";

function isValidWishlistItem(item) {
  return (
    item &&
    Number.isInteger(item.id) &&
    typeof item.title === "string" &&
    item.title.trim() !== "" &&
    Number.isFinite(item.price) &&
    item.price >= 0 &&
    typeof item.thumbnail === "string" &&
    item.thumbnail.trim() !== "" &&
    Number.isInteger(item.stock) &&
    item.stock >= 0
  );
}

function loadSavedWishlist() {
  try {
    const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);

    if (!savedWishlist) {
      return [];
    }

    const parsedWishlist = JSON.parse(savedWishlist);

    if (!Array.isArray(parsedWishlist)) {
      return [];
    }

    const validItems = parsedWishlist.filter(isValidWishlistItem);

    const uniqueItems = [];
    const seenIds = new Set();

    for (const item of validItems) {
      if (!seenIds.has(item.id)) {
        seenIds.add(item.id);
        uniqueItems.push(item);
      }
    }

    return uniqueItems;
  } catch (error) {
    console.warn("Unable to restore saved wishlist.", error);
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(loadSavedWishlist);

  useEffect(() => {
    try {
      localStorage.setItem(
        WISHLIST_STORAGE_KEY,
        JSON.stringify(wishlist)
      );
    } catch (error) {
      console.warn("Unable to save wishlist.", error);
    }
  }, [wishlist]);

  function toggleWishlist(product) {
    if (!product) {
      return;
    }

    setWishlist((currentWishlist) => {
      const exists = currentWishlist.some(
        (item) => item.id === product.id
      );

      if (exists) {
        return currentWishlist.filter(
          (item) => item.id !== product.id
        );
      }

      return [
        ...currentWishlist,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          stock: product.stock,
        },
      ];
    });
  }

  function removeFromWishlist(productId) {
    setWishlist((currentWishlist) =>
      currentWishlist.filter((item) => item.id !== productId)
    );
  }

  function isSaved(productId) {
    return wishlist.some((item) => item.id === productId);
  }

  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount,
        toggleWishlist,
        removeFromWishlist,
        isSaved,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside a WishlistProvider"
    );
  }

  return context;
}