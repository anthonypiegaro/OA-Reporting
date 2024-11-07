import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar/app-sidebar";
import AppSidebarContent from "@/components/app-sidebar/app-sidebar-content";
import AppBreadcrumb from "@/components/app-breadcrumb";
import ColorThemeToggleButton from "@/components/color-theme-toggle";

export default function Layout({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider defaultOpen={false}>
          <AppSidebar>
            <AppSidebarContent />
          </AppSidebar>
          <div className="flex flex-col flex-1">
            <div className="flex flex-row items-center py-4 w-full space-x-4">
                <SidebarTrigger />
                <ColorThemeToggleButton />
                <AppBreadcrumb />
            </div>
            <main className="flex flex-col flex-1">
              {children}
            </main>
          </div>
        </SidebarProvider>
    )
}