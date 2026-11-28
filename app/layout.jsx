import "./globals.css";
import { DemoAuthProvider } from "../components/DemoAuthProvider";
import { CartProvider } from "../components/CartProvider";

export const metadata = {
  title: "PizzaHub — Your next favorite slice",
  description: "Discover local pizza and get the good stuff delivered fresh.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("pizzahub-theme");if(t==="dark"){document.documentElement.dataset.theme="dark"}}catch(e){}`,
          }}
        />
      </head>
      <body>
        <DemoAuthProvider>
          <CartProvider>{children}</CartProvider>
        </DemoAuthProvider>
      </body>
    </html>
  );
}
