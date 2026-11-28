"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const CART_STORAGE_KEY = "pizzahub-cart";
const CartContext = createContext(null);

function isCartItem(item) {
  return item &&
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    Number.isFinite(Number(item.price)) &&
    Number(item.price) > 0 &&
    Number.isInteger(Number(item.quantity)) &&
    Number(item.quantity) > 0 &&
    Number(item.quantity) <= 99 &&
    (item.image === undefined || typeof item.image === "string") &&
    (item.vendor === undefined || typeof item.vendor === "string");
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed)) throw new Error("Saved cart data is not a list");
        setItems(parsed.filter(isCartItem));
      }
    } catch (error) {
      console.error("Could not restore the saved cart:", error);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const addItem = useCallback((item) => {
    const newItem = {
      id: String(item.id),
      name: item.name,
      price: Number(item.price),
      image: item.image || "",
      vendor: item.vendor || "",
      quantity: 1,
    };
    setItems((current) => {
      const existing = current.find((entry) => entry.id === newItem.id);
      return existing
        ? current.map((entry) => entry.id === newItem.id ? { ...entry, quantity: Math.min(entry.quantity + 1, 99) } : entry)
        : [...current, newItem];
    });
  }, []);

  const setQuantity = useCallback((itemId, quantity) => {
    if (!Number.isFinite(quantity)) return;
    if (quantity <= 0) {
      setItems((current) => current.filter((entry) => entry.id !== itemId));
      return;
    }
    setItems((current) => current.map((entry) =>
      entry.id === itemId ? { ...entry, quantity: Math.min(Math.floor(quantity), 99) } : entry
    ));
  }, []);

  const removeItem = useCallback((itemId) => {
    setItems((current) => current.filter((entry) => entry.id !== itemId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, itemCount, ready, addItem, setQuantity, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
