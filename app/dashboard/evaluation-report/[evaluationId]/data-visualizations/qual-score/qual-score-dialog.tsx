"use client"

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import PassFailIcon from "../pass-fail-icon";

interface QualScoreDialogProps {
    name: string;
    url: string;
    description: string;
    isPassing: boolean;
    score: string;
    scoreDescription: string;
}

export default function QualScoreDialog({ name, url, description, isPassing, score, scoreDescription }: QualScoreDialogProps) {
    const openAssessmentVideo = () => {
        window.open(url, "_blank");
    }

    return (
        <Dialog>
            <DialogTrigger>
                {name}
            </DialogTrigger>
            <DialogContent className="h-[80vh] md:h-[90vh] overflow-y-auto overflow-x-hidden scrollbar-hide pt-8">
                <DialogHeader>
                    <DialogTitle className="flex flex-row justify-between items-center">
                        <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={openAssessmentVideo}
                            className="text-lg font-semibold leading-none tracking-tight"
                        >
                            {name}
                        </Button>
                        <PassFailIcon isPassing={isPassing} />
                    </DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <div>
                    Score: {score}
                </div>
                <DialogFooter>
                        {scoreDescription}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}