"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { getLucideIcon } from "@/lib/icon-helper";
import { LucideIcon } from "lucide-react";

// This is sample data.
export interface DataType {
  user: UserType;
  teams?: Array<{
    name: string;
    logo: string;
    plan: string;
  }>;
  navMain?: Array<{
    title: string;
    url: string;
    icon: string; // Changer ici pour correspondre au type attendu
    isActive?: boolean;
    items: Array<{
      title: string;
      url: string;
    }>;
  }>;
  projects?: Array<{
    name: string;
    url: string;
    icon: string; // ou le type approprié pour votre icône
  }>;
}

export interface UserType {
  id: string;
  role: "ADMIN" | "USER";
  name: string;
  email: string;
  profile?: string | null;
}

export function AppSidebar({
  data,
  ...props
}: React.ComponentProps<typeof Sidebar> & { data: DataType }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="">
        {data.teams && (
          <TeamSwitcher
            teams={data.teams.map((team) => ({
              ...team,
              logo: getLucideIcon(team.logo) as LucideIcon,
            }))}
          />
        )}
      </SidebarHeader>
      <SidebarContent>
        {data.navMain && (
          <NavMain
            items={data.navMain.map((item) => ({
              ...item,
              icon: getLucideIcon(item.icon) as LucideIcon,
            }))}
          />
        )}
        {data.projects && (
          <NavProjects
            projects={data.projects.map((project) => ({
              ...project,
              icon: getLucideIcon(project.icon) as LucideIcon,
            }))}
          />
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
