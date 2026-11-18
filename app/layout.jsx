import "./globals.css";

export const metadata = {
  title: "PizzaHub — Your next favorite slice",
  description: "Discover local pizza and get the good stuff delivered fresh.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
