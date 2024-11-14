import { NextResponse } from "next/server";
import { getUnits } from "@/app/db/queries/get-units/get-units";
import { SelectUnit } from "@/app/db/schema";

export async function GET(): Promise<NextResponse<SelectUnit[]>> {
  const units = await getUnits();
  return NextResponse.json(units);
}