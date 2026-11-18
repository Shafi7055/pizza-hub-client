import MenuExplorer from "../../components/MenuExplorer";
import PageIntro from "../../components/PageIntro";
import PublicPageFrame from "../../components/PublicPageFrame";

export const metadata = { title: "Browse menu | PizzaHub" };

export default function BrowseMenuPage() {
  return (
    <PublicPageFrame>
      <PageIntro
        eyebrow="THE GOOD STUFF"
        title={<>Find your next<br /><span>favorite slice.</span></>}
        description="Explore the neighborhood's best pizza, made fresh by local kitchens."
      />
      <MenuExplorer />
    </PublicPageFrame>
  );
}
