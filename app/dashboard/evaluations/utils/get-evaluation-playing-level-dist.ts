import { EvaluationsType } from "../types"
import { SelectUser } from "@/app/db/schema";

export const getEvaluationPlayingLevelDist = (evaluations: EvaluationsType[]) => {
    const playingLevelDistData = evaluations.reduce((acc, evaluation) => {
            if (evaluation.playingLevel === "high school") {
                acc[0].count += 1
            } else if (evaluation.playingLevel === "college") {
                acc[1].count += 1
            } else if (evaluation.playingLevel) {
                acc[2].count += 1
            }
    
            return acc;
        }, [
            { playingLevel: "high school", count: 0 },
            { playingLevel: "college", count: 0 },
            { playingLevel: "professional", count: 0 }
        ] as { playingLevel: SelectUser["playingLevel"], count: number }[]);
    
    return playingLevelDistData
}