import { notFound } from "next/navigation";
import MenuItemAccess from "../../../components/MenuItemAccess";
import { menuItems } from "../../../lib/menu-data";

export default async function MenuItemPage({ params }) {
  const { id } = await params;
  const item = menuItems.find((menuItem) => menuItem.id === id);

  if (!item) notFound();

  return <MenuItemAccess item={item} />;
}
