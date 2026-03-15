"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import {
  ChartBarIcon,
  DocumentTextIcon,
  RectangleStackIcon,
  UsersIcon,
  ChevronLeftIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";

const navLinks = [
  { href: "/admin", label: "Overview", icon: ChartBarIcon, exact: true },
  { href: "/admin/content", label: "Content", icon: DocumentTextIcon },
  { href: "/admin/bundles", label: "Bundles", icon: RectangleStackIcon },
  { href: "/admin/subscribers", label: "Subscribers", icon: UsersIcon },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleSignOut = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <nav
      className={`flex flex-col border-r border-admin-sidebar-border bg-admin-sidebar transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="flex h-16 items-center border-b border-admin-sidebar-border px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Link href="/admin" className="text-xl font-bold text-white">
              Curly Girl
            </Link>
            <span className="rounded bg-gold px-2 py-0.5 text-xs font-semibold text-ink">
              Admin
            </span>
          </div>
        )}
        {collapsed && (
          <Link href="/admin" className="mx-auto text-xl font-bold text-white">
            CG
          </Link>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={`flex items-center gap-2 border-b border-admin-sidebar-border px-4 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-admin-sidebar-dark hover:text-white ${
          collapsed ? "justify-center" : ""
        }`}
      >
        <ChevronLeftIcon
          className={`h-4 w-4 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
        />
        {!collapsed && <span>Collapse</span>}
      </button>

      <div className="flex flex-1 flex-col justify-between p-2">
        <ul className="space-y-1">
          {navLinks.map((link) => {
            const isActive = link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  title={collapsed ? link.label : undefined}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-lg font-medium transition-colors ${
                    isActive
                      ? "bg-pink text-white"
                      : "text-white/70 hover:bg-white hover:ring-2 hover:ring-pink hover:text-pink"
                  } ${collapsed ? "justify-center" : ""}`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{link.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          onClick={handleSignOut}
          title={collapsed ? "Sign Out" : undefined}
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-white/70 transition-colors hover:bg-admin-sidebar-dark hover:text-white ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <ArrowRightStartOnRectangleIcon className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </nav>
  );
}
