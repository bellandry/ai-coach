import { AppSidebar } from "@/components/app-sidebar";
import { ToggleTheme } from "@/components/toggle-theme";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getCurrentUser } from "@/core/current-user";
import { HomeIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export default async function Page({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser({
    redirectIfNotFound: true,
    withFullUser: true,
  });
  return (
    <SidebarProvider>
      <AppSidebar user={currentUser} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center justify-between gap-2 px-4 w-full">
            <div className="flex gap-2 items-center">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <ToggleTheme />
            </div>

            <Button asChild variant="outline">
              <Link href="/" className="flex gap-2 items-center">
                <HomeIcon className="size-4" />
                Accueil
              </Link>
            </Button>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
