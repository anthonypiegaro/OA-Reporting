import { clerkClient, clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/"]);

const isTrainerRoute = createRouteMatcher([
  "/dashboard/users",
  "/dashboard/templates",
  "/dashboard/assessments",
  "/dashboard/evaluations"
]);

export default clerkMiddleware(async (auth, request) => {
  if (isTrainerRoute(request)) {
    const { userId } = await auth();

    if (!userId) {
      const signInUrl = new URL('/sign-in', request.url);
      return NextResponse.redirect(signInUrl);
    }

    const user = await (await clerkClient()).users.getUser(userId);
    if (user.privateMetadata.role !== "trainer") {
      const signInUrl = new URL('/sign-in', request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};