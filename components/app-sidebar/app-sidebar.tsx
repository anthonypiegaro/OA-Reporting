"use client";

import { useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { ChevronUp, User2 } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = () => {
    signOut();
    router.push('/');
  }

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
                  <DropdownMenuItem onClick={handleSignOut}>
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
    </Sidebar>
  )
}
