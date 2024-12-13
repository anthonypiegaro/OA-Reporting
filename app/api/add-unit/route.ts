import { NextResponse } from "next/server";
import { addUnit } from "@/app/db/queries/add-unit/add-unit";

export async function POST(request: Request): Promise<NextResponse> {
    const values = await request.json();
    await addUnit(values);
    return NextResponse.json({ message: "Success" });
}