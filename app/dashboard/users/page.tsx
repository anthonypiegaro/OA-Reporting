import { UserRoundPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import AddUserButton from "@/components/add-user-button";

export default function Page() {
    return (
        <div className="flex flex-col flex-1">
            <div className="w-12">
                <AddUserButton />
            </div>
        </div>
    )
}