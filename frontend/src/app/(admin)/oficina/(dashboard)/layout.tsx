"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/navigation/AdminSidebar";
import { AdminHeader } from "@/components/navigation/AdminHeader";
import { getAuthData } from "@/lib/auth";

import { AdminMobileNav } from "@/components/navigation/AdminMobileNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const authData = getAuthData();

    if (!authData) {
      router.replace("/oficina/acceso");
      return;
    }

    // Protección específica: AGENT no puede ver /panel
    if (authData.role === "AGENT" && pathname.startsWith("/oficina/panel")) {
      router.replace("/oficina/agenda");
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsAuthorized(true);
  }, [router, pathname]);

  if (!isAuthorized) {
    return null; // O un skeleton de carga
  }

  return (
    <div className="flex min-h-screen bg-muted/5">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        {/* pb-24 for mobile nav space, md:pb-8 for desktop */}
        <main className="p-4 md:p-8 flex-1 pb-24 md:pb-8 overflow-x-hidden">
          {children}
        </main>
      </div>
      <AdminMobileNav />
    </div>
  );
}
