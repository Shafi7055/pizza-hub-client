import ProfileSettingsPage from "../../components/ProfileSettingsPage";
import PublicPageFrame from "../../components/PublicPageFrame";

export const metadata = { title: "Profile settings | PizzaHub" };

export default function ProfileSettingsRoute() {
  return (
    <PublicPageFrame>
      <ProfileSettingsPage audience="customer" />
    </PublicPageFrame>
  );
}
