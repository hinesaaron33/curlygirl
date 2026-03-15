"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

const navLinks = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/bundles", label: "Bundles" },
  { href: "/admin/subscribers", label: "Subscribers" },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <nav className="flex w-64 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-6">
        <Link href="/admin" className="text-xl font-bold text-pink-600">
          Curly Girl
        </Link>
        <span className="rounded bg-pink-100 px-2 py-0.5 text-xs font-semibold text-pink-700">
          Admin
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-between p-4">
        <ul className="space-y-1">
          {navLinks.map((link) => {
            const isActive = link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-pink-50 text-pink-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          onClick={handleSignOut}
          className="w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}
