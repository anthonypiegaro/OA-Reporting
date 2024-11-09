import { db } from "../../db";
import { users } from "../../schema";

export const getUsers = async () => await db.select().from(users);