import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db/prisma";
import { AdminNav } from "@/components/layout/admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
    select: { role: true },
  });

  if (!dbUser || dbUser.role !== "ADMIN") {
    redirect("/library");
  }

  return (
    <div className="flex min-h-screen bg-[#418DA2]">
      <AdminNav />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
