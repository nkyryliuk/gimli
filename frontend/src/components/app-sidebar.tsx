"use client";

import * as React from "react";
import { BookOpen, Swords, LifeBuoy, Send, Settings2, Map } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/stores/useAuthStore";

const data = {
  navMain: [
    {
      title: "Campaigns",
      url: "/campaigns",
      icon: Map,
      isActive: false,
      items: [
        {
          title: "History",
          url: "/campaigns/history",
        },
        {
          title: "Starred",
          url: "/campaigns/starred",
        },
      ],
    },
    {
      title: "Bestiary",
      url: "/bestiary",
      icon: BookOpen,
      items: [
        {
          title: "Your Monsters",
          url: "/bestiary/your-monsters",
        },
        {
          title: "All Monsters",
          url: "/bestiary/all-monsters",
        },
        {
          title: "Legendary and Mythic Creatures",
          url: "/bestiary/legendary-and-mythic-creatures",
        },
        {
          title: "Recent Additions",
          url: "/bestiary/recent-additions",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, logout } = useAuthStore();

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Swords className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Gimli</span>
                  <span className="truncate text-xs">BETA</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {user && (
          <NavUser
            user={{
              name: user.first_name ?? "",
              email: user.email,
              avatar: "",
            }}
            logout={logout}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
