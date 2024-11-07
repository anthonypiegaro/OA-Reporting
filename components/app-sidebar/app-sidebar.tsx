"use client";

import Link from "next/link"
import { useUser, SignOutButton } from "@clerk/nextjs";
import { ChevronUp, User2 } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import React from "react";

export function AppSidebar({ children }: {children: React.ReactNode}) {
  const { user } = useUser();
  const name = user?.publicMetadata.name;

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarContent>
          <SidebarGroup>
              <SidebarGroupLabel>Optimum Athletes</SidebarGroupLabel>
              <SidebarGroupContent>
                  <SidebarMenu>
                  {children}
                  </SidebarMenu>
              </SidebarGroupContent>
          </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 /> <>{name}</>
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <SignOutButton redirectUrl="/sign-in">
                    <DropdownMenuItem>
                      <span>
                        Sign Out
                      </span>
                    </DropdownMenuItem>
                  </SignOutButton>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
    </Sidebar>
  )
}
