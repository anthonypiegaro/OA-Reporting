"use client"

import { usePathname } from "next/navigation";
import { Slash } from "lucide-react"
import Link from "next/link";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function AppBreadcrumb() {
    const path = usePathname();

    const crumbs = path.split("/").slice(1);

    return (
        <Breadcrumb>
            <BreadcrumbList>
            {crumbs.map((crumb, index) => {
                if (index + 1 === crumbs.length) {
                    return (
                        <BreadcrumbItem key={crumb}>
                            <BreadcrumbPage>{crumb}</BreadcrumbPage>
                        </BreadcrumbItem>
                    )
                } else {
                    const routePath = "/" + crumbs.slice(0, index + 1).join("/");
                    
                    return (
                        <>
                            <BreadcrumbItem key={crumb}>
                                <BreadcrumbLink asChild>
                                    <Link href={routePath}>{crumb}</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator key={crumb + " seperator"}>
                                <Slash />
                            </BreadcrumbSeparator>
                        </>
                    )
                }
            })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}