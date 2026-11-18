import Link from "next/link";
import PublicPageFrame from "./PublicPageFrame";

export default function AuthPage({ mode }) {
  const isSignUp = mode === "sign-up";

  return (
    <PublicPageFrame>
      <section className="auth-layout">
        <div className="auth-story">
          <div className="eyebrow"><span className="eyebrow-dot" /> {isSignUp ? "COME ON IN" : "GOOD TO SEE YOU"}</div>
          <h1>{isSignUp ? <>Good pizza.<br />Good <span>people.</span></> : <>Welcome<br /><span>back.</span></>}</h1>
          <p>{isSignUp ? "Create your PizzaHub account to find local favorites or bring your restaurant to the neighborhood." : "Sign in to pick up where you left off and get back to the good stuff."}</p>
          <div className="auth-note"><span>✳</span><p>Authentication will be connected in a later implementation step. This form is a visual route placeholder.</p></div>
        </div>
        <section className="auth-card">
          <div className="auth-card-heading"><h2>{isSignUp ? "Create your account" : "Sign in to PizzaHub"}</h2><p>{isSignUp ? "It only takes a minute." : "Your next favorite slice is waiting."}</p></div>
          <fieldset className="demo-fieldset" disabled>
            {isSignUp && <label>Full name<input autoComplete="name" placeholder="Your name" /></label>}
            <label>Email address<input autoComplete="email" placeholder="you@example.com" type="email" /></label>
            <label>Password<input autoComplete={isSignUp ? "new-password" : "current-password"} placeholder="At least 6 characters" type="password" /></label>
            {isSignUp && (
              <>
                <label>Profile image (optional)<input accept="image/*" type="file" /></label>
                <label>Account type
                  <select defaultValue="customer">
                    <option value="customer">Customer</option>
                    <option value="vendor">Restaurant owner</option>
                  </select>
                </label>
              </>
            )}
            <button className="button button-orange auth-submit" type="button">{isSignUp ? "Create account" : "Sign in"} <span>→</span></button>
            <button className="google-button" type="button">Continue with Google</button>
          </fieldset>
          <p className="auth-switch">{isSignUp ? "Already have an account?" : "New to PizzaHub?"} <Link href={isSignUp ? "/sign-in" : "/sign-up"}>{isSignUp ? "Sign in" : "Create an account"}</Link></p>
        </section>
      </section>
    </PublicPageFrame>
  );
}
