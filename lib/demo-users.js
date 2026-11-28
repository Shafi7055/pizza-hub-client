export const demoUsers = {
  customer: {
    role: "customer",
    name: "Jamie Rivera",
    email: "jamie@example.com",
    initials: "JR",
  },
  vendor: {
    role: "vendor",
    name: "Little Oven Pizzeria",
    email: "hello@littleoven.example",
    initials: "LO",
    businessName: "Little Oven Pizzeria",
  },
  admin: {
    role: "admin",
    name: "PizzaHub Admin",
    email: "admin@pizzahub.example",
    initials: "PA",
  },
};

export const demoRoleDetails = {
  customer: {
    label: "Customer",
    description: "Browse the menu and review your sample orders.",
    icon: "♡",
  },
  vendor: {
    label: "Restaurant vendor",
    description: "Manage Little Oven's sample menu and incoming orders.",
    icon: "✳",
  },
  admin: {
    label: "Platform admin",
    description: "Review sample users, listings, and transactions.",
    icon: "⌘",
  },
};

export function getDashboardPath(role) {
  return Object.prototype.hasOwnProperty.call(demoUsers, role)
    ? `/dashboard/${role}`
    : "/dashboard";
}

export function getDemoSignInDestination(role, requestedPath) {
  const canReturnToRequestedPath =
    role === "customer" &&
    requestedPath &&
    !requestedPath.startsWith("//") &&
    (requestedPath === "/cart" || requestedPath.startsWith("/menu/"));
  return canReturnToRequestedPath ? requestedPath : getDashboardPath(role);
}
