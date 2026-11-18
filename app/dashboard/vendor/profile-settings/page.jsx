import ProfileSettingsPage from "../../../../components/ProfileSettingsPage";

export const metadata = { title: "Vendor profile settings | PizzaHub" };

export default function VendorProfileSettingsRoute() {
  return <ProfileSettingsPage audience="vendor" />;
}
