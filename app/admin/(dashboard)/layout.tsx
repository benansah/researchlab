import { cookies } from "next/headers";
import { Suspense } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppSidebar from "../_components/app-sidebar";
import Flash from "../_components/flash";
import { requireAdmin } from "../auth";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const user = await requireAdmin();
  // Remember whether the sidebar was collapsed (the sidebar component writes this cookie).
  const sidebarOpen = (await cookies()).get("sidebar_state")?.value !== "false";

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider defaultOpen={sidebarOpen}>
        <AppSidebar email={user.email ?? ""} />
        <SidebarInset className="admin-ui min-w-0">{children}</SidebarInset>
      </SidebarProvider>
      <Toaster position="top-right" richColors closeButton />
      <Suspense><Flash /></Suspense>
    </TooltipProvider>
  );
}
