import ProfileSettingsPage from "../../../../components/ProfileSettingsPage";

export const metadata = { title: "Customer profile settings | PizzaHub" };

export default function CustomerProfileSettingsRoute() {
  return <ProfileSettingsPage audience="customer" />;
}
