import "./globals.css";
import { DemoAuthProvider } from "../components/DemoAuthProvider";

export const metadata = {
  title: "PizzaHub — Your next favorite slice",
  description: "Discover local pizza and get the good stuff delivered fresh.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <DemoAuthProvider>{children}</DemoAuthProvider>
      </body>
    </html>
  );
}
