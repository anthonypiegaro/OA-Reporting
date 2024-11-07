"user server"

import { auth, clerkClient } from "@clerk/nextjs/server";
import Link from "next/link";
import { House, User } from "lucide-react"
import {
    SidebarMenuButton,
    SidebarMenuItem,
  } from "@/components/ui/sidebar"

export default async function AppSidebarContent() {
    const { userId } = await auth();

    const clerkUser = await (await clerkClient()).users.getUser(userId as string);

    const isTrainer = clerkUser.privateMetadata.role === "trainer";

    let buildItems;

    if (isTrainer) {
        buildItems = [
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
    } else {
        buildItems = [
            {
              title: "Dashboard",
              url: "/dashboard",
              icon: House,
            },
        ]
    }
    return (
        <>
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
        </>
    )
}