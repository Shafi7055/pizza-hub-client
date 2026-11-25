"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { demoUsers } from "../lib/demo-users";
import { api } from "../lib/api";

const STORAGE_KEY = "pizzahub-demo-role";
const TOKEN_KEY = "pizzahub-token";
const DemoAuthContext = createContext(null);

export function DemoAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function restore() {
      const token = window.localStorage.getItem(TOKEN_KEY);
      if (!token) {
        window.localStorage.removeItem(STORAGE_KEY);
        setReady(true);
        return;
      }
      try {
        const { user: authenticatedUser } = await api("/api/auth/me");
        setUser(authenticatedUser);
        window.localStorage.setItem(STORAGE_KEY, authenticatedUser.role);
      } catch {
        window.localStorage.removeItem(TOKEN_KEY);
        window.localStorage.removeItem(STORAGE_KEY);
        setUser(null);
      } finally {
        setReady(true);
      }
    }
    restore();
  }, []);

  async function login(email, password) {
    const { token, user: authenticatedUser } = await api("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
    window.localStorage.setItem(TOKEN_KEY, token);
    window.localStorage.setItem(STORAGE_KEY, authenticatedUser.role);
    setUser(authenticatedUser);
    return authenticatedUser;
  }

  async function register(details) {
    const { token, user: authenticatedUser } = await api("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(details)
    });
    window.localStorage.setItem(TOKEN_KEY, token);
    window.localStorage.setItem(STORAGE_KEY, authenticatedUser.role);
    setUser(authenticatedUser);
    return authenticatedUser;
  }

  async function signInAs(role) {
    const credentials = {
      customer: ["jamie@example.com", "password"],
      vendor: ["hello@littleoven.example", "password"],
      admin: ["admin@pizzahub.example", "password"]
    }[role];
    if (!credentials) throw new Error(`Unknown PizzaHub role: ${role}`);
    return login(credentials[0], credentials[1]);
  }

  function signOut() {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }

  return (
    <DemoAuthContext.Provider value={{ user, ready, login, register, signInAs, signOut }}>
      {children}
    </DemoAuthContext.Provider>
  );
}

export function useDemoAuth() {
  const context = useContext(DemoAuthContext);
  if (!context) {
    throw new Error("useDemoAuth must be used inside DemoAuthProvider");
  }
  return context;
}
