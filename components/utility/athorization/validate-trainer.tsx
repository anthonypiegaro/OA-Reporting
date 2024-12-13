import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { type Clerk } from "@clerk/backend";

export const validateTrainerAuthorization = async (client: Clerk, callerId: string | null) => {
    if (!callerId) {
        throw new Error("Forbidden: not signed in");
    }

    const user = await client.users.getUser(callerId)
    const role = await user.privateMetadata.role

    if (role !== "trainer") {
        throw new Error("Forbidden: You do not have permission to add a Template");
    }
}