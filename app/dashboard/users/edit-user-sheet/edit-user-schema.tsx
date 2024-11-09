import { z } from "zod";

export const formSchema = z.object({
    id: z.number(),
    clerkId: z.string(),
    name: z.string().min(1, { message: "Name is required"}),
    email: z.string().email(),
    playingLevel: z.enum(["high school", "college", "professional"]),
    role: z.enum(["athlete", "trainer"])
});