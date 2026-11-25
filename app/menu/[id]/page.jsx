import MenuItemAccess from "../../../components/MenuItemAccess";

export default async function MenuItemPage({ params }) {
  const { id } = await params;
  return <MenuItemAccess itemId={id} />;
}
