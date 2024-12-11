import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default async function EnterAppButton() {
    const { userId } = await auth();
    const signedIn = userId ? true : false;

    return (
        <Button
            type="button"
            variant={signedIn ? "default" : "outline"}
            asChild
        >
            {signedIn ? <Link href="/dashboard">Dashboard</Link> : <Link href="/signin">Sign In</Link>}
        </Button>
    )
}