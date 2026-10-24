"use client";

import { usePathname } from "next/navigation";
import FloatingContactWidget from "./FloatingContactWidget";

export default function ConditionalTimedLeadPopup() {
  const pathname = usePathname();

  const isExcludedRoute =
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/login" ||
    pathname.startsWith("/auth/") ||
    pathname === "/forgot-password" ||
    pathname === "/forget-password" ||
    pathname === "/reset-password";

  if (isExcludedRoute) {
    return null;
  }

  return <FloatingContactWidget />;
}