"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { demoUsers } from "../lib/demo-users";
import { api } from "../lib/api";
import { authClient } from "../lib/auth-client";

const STORAGE_KEY = "pizzahub-demo-role";
const TOKEN_KEY = "pizzahub-token";
const AUTH_MODE_KEY = "pizzahub-auth-mode";
const DemoAuthContext = createContext(null);

export function DemoAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function restore() {
      try {
        const { user: authenticatedUser } = await api("/api/auth/me");
        setUser(authenticatedUser);
        window.localStorage.setItem(STORAGE_KEY, authenticatedUser.role);
        window.localStorage.setItem(AUTH_MODE_KEY, window.localStorage.getItem(TOKEN_KEY) ? "token" : "better-auth");
      } catch {
        window.localStorage.removeItem(TOKEN_KEY);
        window.localStorage.removeItem(STORAGE_KEY);
        window.localStorage.removeItem(AUTH_MODE_KEY);
        setUser(null);
      } finally {
        setReady(true);
      }
    }
    restore();
  }, []);

  async function login(email, password) {
    const { betterAuth } = await api("/api/auth/providers");
    let authenticatedUser;
    if (betterAuth) {
      const result = await authClient.signIn.email({ email, password });
      if (result.error) throw new Error(result.error.message);
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.setItem(AUTH_MODE_KEY, "better-auth");
      ({ user: authenticatedUser } = await api("/api/auth/me"));
    } else {
      const response = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      authenticatedUser = response.user;
      window.localStorage.setItem(TOKEN_KEY, response.token);
      window.localStorage.setItem(AUTH_MODE_KEY, "token");
    }
    window.localStorage.setItem(STORAGE_KEY, authenticatedUser.role);
    setUser(authenticatedUser);
    return authenticatedUser;
  }

  async function register(details) {
    const { betterAuth } = await api("/api/auth/providers");
    let authenticatedUser;
    if (betterAuth) {
      const result = await authClient.signUp.email(details);
      if (result.error) throw new Error(result.error.message);
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.setItem(AUTH_MODE_KEY, "better-auth");
      ({ user: authenticatedUser } = await api("/api/auth/me"));
    } else {
      const response = await api("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(details)
      });
      authenticatedUser = response.user;
      window.localStorage.setItem(TOKEN_KEY, response.token);
      window.localStorage.setItem(AUTH_MODE_KEY, "token");
    }
    window.localStorage.setItem(STORAGE_KEY, authenticatedUser.role);
    setUser(authenticatedUser);
    return authenticatedUser;
  }

  async function signInAs(role) {
    const demoUser = demoUsers[role];
    if (!demoUser) throw new Error(`Unknown PizzaHub role: ${role}`);
    const { betterAuth } = await api("/api/auth/providers");
    if (betterAuth && window.localStorage.getItem(AUTH_MODE_KEY) === "better-auth") {
      const result = await authClient.signOut();
      if (result.error) throw new Error(result.error.message);
    }
    const { token, user: authenticatedUser } = await api("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: demoUser.email, password: "password" })
    });
    window.localStorage.setItem(TOKEN_KEY, token);
    window.localStorage.setItem(STORAGE_KEY, authenticatedUser.role);
    window.localStorage.setItem(AUTH_MODE_KEY, "token");
    setUser(authenticatedUser);
    return authenticatedUser;
  }

  async function signOut() {
    if (window.localStorage.getItem(AUTH_MODE_KEY) === "better-auth") {
      const result = await authClient.signOut();
      if (result.error) throw new Error(result.error.message);
    }
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(AUTH_MODE_KEY);
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
