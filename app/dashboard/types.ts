import { SelectEvaluation, SelectUser } from "../db/schema"

export type DashboardData = {
    userId: SelectUser["id"],
    userName: SelectUser["name"],
    playingLevel: SelectUser["playingLevel"],
    evaluations: SelectEvaluation[]
}