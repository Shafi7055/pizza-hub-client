import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

export default function PublicPageFrame({ children }) {
  return (
    <>
      <SiteHeader />
      <main className="content-page section-wrap">{children}</main>
      <SiteFooter />
    </>
  );
}
