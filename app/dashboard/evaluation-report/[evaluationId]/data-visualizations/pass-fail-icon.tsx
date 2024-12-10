"use client"

import { CircleCheckBig, CircleX } from "lucide-react";

interface PassFailIconProps {
    isPassing: boolean;
}

export default function PassFailIcon({ isPassing }: PassFailIconProps) {
    return isPassing ? <CircleCheckBig size={24} color="green" /> : <CircleX size={24} color="red" />;
}