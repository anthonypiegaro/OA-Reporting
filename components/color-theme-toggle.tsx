"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";

export default function ColorThemeToggleButton() {
    const [isDarkMode, setIsDarkMode] = useState(true);

    const toggleColorTheme = () => {
        if (isDarkMode) {
            document.body.classList.remove("dark");
        } else {
            document.body.classList.add("dark");
        }

        setIsDarkMode(!isDarkMode);
    }

    return (
        <Button
            variant="ghost"
            className="h-7 w-7"
            onClick={toggleColorTheme}
        >
            {isDarkMode ? <Moon color="white"/> : <Sun color="black" />}
        </Button>
    )
}