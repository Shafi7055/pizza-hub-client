"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ProfileSettingsPage from "./ProfileSettingsPage";
import PublicPageFrame from "./PublicPageFrame";
import { useDemoAuth } from "./DemoAuthProvider";

export default function ProfileSettingsAccess() {
  const router = useRouter();
  const { user, ready } = useDemoAuth();

  useEffect(() => {
    if (ready && !user) {
      router.replace("/sign-in?next=/profile-settings");
    }
  }, [ready, router, user]);

  if (!ready || !user) {
    return (
      <main className="role-check" aria-live="polite">
        <span className="role-check-spinner" />
        <strong>{ready ? "Please sign in to view profile settings…" : "Loading demo session…"}</strong>
      </main>
    );
  }

  return (
    <PublicPageFrame>
      <ProfileSettingsPage audience={user.role} />
    </PublicPageFrame>
  );
}
