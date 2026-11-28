"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { demoRoleDetails, demoUsers, getDemoSignInDestination } from "../lib/demo-users";
import { api } from "../lib/api";
import { authClient } from "../lib/auth-client";
import { useDemoAuth } from "./DemoAuthProvider";
import PublicPageFrame from "./PublicPageFrame";

export default function AuthPage({ mode }) {
  const isSignUp = mode === "sign-up";
  const router = useRouter();
  const { signInAs, login, register, user, ready } = useDemoAuth();
  const [choosingRole, setChoosingRole] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "customer", image: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleEnabled, setGoogleEnabled] = useState(false);

  useEffect(() => {
    let active = true;
    api("/api/auth/providers")
      .then(({ google }) => {
        if (active) setGoogleEnabled(google);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isSignUp && !choosingRole && ready && user) {
      const requestedPath = new URLSearchParams(window.location.search).get("next");
      router.replace(getDemoSignInDestination(user.role, requestedPath));
    }
  }, [choosingRole, isSignUp, ready, router, user]);

  async function handleDemoSignIn(role) {
    if (submitting || choosingRole) return;
    setChoosingRole(true);
    setError("");
    try {
      const authenticatedUser = await signInAs(role);
      const requestedPath = new URLSearchParams(window.location.search).get("next");
      router.push(getDemoSignInDestination(authenticatedUser.role, requestedPath));
    } catch (requestError) {
      setError(requestError.message);
      setChoosingRole(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting || choosingRole) return;
    setError("");
    setSubmitting(true);
    try {
      const authenticatedUser = isSignUp
        ? await register({ name: form.name, email: form.email, password: form.password, role: form.role })
        : await login(form.email, form.password);
      const requestedPath = new URLSearchParams(window.location.search).get("next");
      router.push(getDemoSignInDestination(authenticatedUser.role, requestedPath));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    if (submitting || choosingRole) return;
    setError("");
    setSubmitting(true);
    try {
      window.localStorage.removeItem("pizzahub-token");
      window.localStorage.removeItem("pizzahub-demo-role");
      window.localStorage.removeItem("pizzahub-auth-mode");
      const requestedPath = new URLSearchParams(window.location.search).get("next");
      const callbackURL = requestedPath
        ? `${window.location.origin}/sign-in?next=${encodeURIComponent(requestedPath)}`
        : window.location.origin;
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL,
      });
      if (result.error) throw new Error(result.error.message);
    } catch (requestError) {
      setError(requestError.message);
      setSubmitting(false);
    }
  }

  function updateForm(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  return (
    <PublicPageFrame>
      <section className="auth-layout">
        <div className="auth-story">
          <div className="eyebrow"><span className="eyebrow-dot" /> {isSignUp ? "COME ON IN" : "GOOD TO SEE YOU"}</div>
          <h1>{isSignUp ? <>Good pizza.<br />Good <span>people.</span></> : <>Welcome<br /><span>back.</span></>}</h1>
          <p>{isSignUp ? "Create your PizzaHub account to find local favorites or bring your restaurant to the neighborhood." : "Sign in to pick up where you left off and get back to the good stuff."}</p>
          <div className="auth-note"><span>✳</span><p>{isSignUp ? "Create a customer or restaurant account, or use a demo role to explore the platform." : "Sign in with your account or choose a seeded demo role."}</p></div>
        </div>
        <section className="auth-card">
          <div className="auth-card-heading">
            <h2>{isSignUp ? "Create your account" : "Try a demo role"}</h2>
            <p>{isSignUp ? "Create your PizzaHub account." : "Sign in or choose a sample account."}</p>
          </div>
          {isSignUp ? (
            <form onSubmit={handleSubmit}>
            <fieldset className="demo-fieldset">
              <label>Full name<input name="name" value={form.name} onChange={updateForm} autoComplete="name" placeholder="Your name" required /></label>
              <label>Email address<input name="email" value={form.email} onChange={updateForm} autoComplete="email" placeholder="you@example.com" type="email" required /></label>
              <label>Password<input name="password" value={form.password} onChange={updateForm} autoComplete="new-password" placeholder="At least 6 characters" type="password" minLength="6" required /></label>
              <label>Profile image (optional)<input accept="image/*" type="file" /></label>
              <label>Account type
                <select name="role" value={form.role} onChange={updateForm}>
                  <option value="customer">Customer</option>
                  <option value="vendor">Restaurant owner</option>
                </select>
              </label>
              {error && <p className="demo-note" role="alert">{error}</p>}
              <button className="button button-orange auth-submit" type="submit" disabled={submitting || choosingRole}>{submitting ? "Creating account…" : "Create account"} <span>→</span></button>
            </fieldset>
            </form>
          ) : (
            <div className="sign-in-options">
              <form className="demo-fieldset" onSubmit={handleSubmit}>
                <label>Email address<input name="email" value={form.email} onChange={updateForm} type="email" autoComplete="email" required /></label>
                <label>Password<input name="password" value={form.password} onChange={updateForm} type="password" autoComplete="current-password" required /></label>
                {error && <p className="demo-note" role="alert">{error}</p>}
                <button className="button button-orange auth-submit" type="submit" disabled={submitting || choosingRole}>{submitting ? "Signing in…" : "Sign in"} <span>→</span></button>
              </form>
              {googleEnabled && <button className="button button-dark auth-submit" onClick={handleGoogleSignIn} type="button" disabled={submitting || choosingRole}>Continue with Google</button>}
              <div className="demo-role-list">
              {Object.entries(demoRoleDetails).map(([role, details]) => {
                const user = demoUsers[role];
                return (
                  <button className="demo-role-card" key={role} onClick={() => handleDemoSignIn(role)} type="button" disabled={choosingRole || submitting}>
                    <span className={`demo-role-icon ${role}`}>{details.icon}</span>
                    <span className="demo-role-info">
                      <strong>{details.label}</strong>
                      <small>{details.description}</small>
                      <small className="demo-role-email">{user.email}</small>
                    </span>
                    <span className="demo-role-arrow" aria-hidden="true">→</span>
                  </button>
                );
              })}
              <p className="demo-session-hint">No password needed · Sample data only</p>
              </div>
            </div>
          )}
          <p className="auth-switch">{isSignUp ? "Already have an account?" : "New to PizzaHub?"} <Link href={isSignUp ? "/sign-in" : "/sign-up"}>{isSignUp ? "Sign in" : "Create an account"}</Link></p>
        </section>
      </section>
    </PublicPageFrame>
  );
}
