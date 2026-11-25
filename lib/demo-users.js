export const demoUsers = {
  customer: {
    role: "customer",
    name: "Alex Morgan",
    email: "customer@pizzahub.demo",
    initials: "AM",
  },
  vendor: {
    role: "vendor",
    name: "Little Oven Pizzeria",
    email: "vendor@pizzahub.demo",
    initials: "LO",
    businessName: "Little Oven Pizzeria",
  },
  admin: {
    role: "admin",
    name: "PizzaHub Admin",
    email: "admin@pizzahub.demo",
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
  const canReturnToItem =
    role === "customer" &&
    requestedPath &&
    requestedPath.startsWith("/menu/") &&
    !requestedPath.startsWith("//");
  return canReturnToItem ? requestedPath : getDashboardPath(role);
}
