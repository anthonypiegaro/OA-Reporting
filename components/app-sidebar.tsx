import Link from "next/link"
import { House, User } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const buildItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: House,
  },
  {
    title: "Users",
    url: "/dashboard/users",
    icon: User,
  },
]

export function AppSidebar() {
  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarContent>
          <SidebarGroup>
              <SidebarGroupLabel>Optimum Athletes</SidebarGroupLabel>
              <SidebarGroupContent>
                  <SidebarMenu>
                  {buildItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild tooltip={item.title}>
                              <Link href={item.url}>
                                  <item.icon />
                                  <span>{item.title}</span>
                              </Link>
                          </SidebarMenuButton>
                      </SidebarMenuItem>
                  ))}
                  </SidebarMenu>
              </SidebarGroupContent>
          </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
