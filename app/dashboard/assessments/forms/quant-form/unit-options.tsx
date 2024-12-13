"use client"

import { useQuery } from "@tanstack/react-query";
import {
    SelectContent,
    SelectItem
} from "@/components/ui/select";
import { SelectUnit } from "@/app/db/schema";

const fetchUnits = async (): Promise<SelectUnit[]> => {
    const response = await fetch("/api/get-units");
    if (!response.ok) {
      throw new Error("Failed to fetch units");
    }
    return response.json();
};

export default function UnitOptions() {
    const { data, error, isLoading } = useQuery({
        queryKey: ["units"],
        queryFn: fetchUnits,
    });

    if (isLoading) {
        return <SelectContent></SelectContent>
    } else if (error) {
        console.log(error);
        return <SelectContent></SelectContent>
    }

    return (
        <SelectContent>
            {data?.map(unit => (
                <SelectItem key={unit.id} value={unit.name}>{unit.name}</SelectItem>
            ))}
        </SelectContent>
    )
}