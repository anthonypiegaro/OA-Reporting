import { SelectAssessment, SelectQuantitativeAssessment } from "@/app/db/schema";

type QuantId = {
    quantitativeId: number
}

export type EditQuantData = Omit<SelectAssessment & SelectQuantitativeAssessment & QuantId, "hidden" | "createdAt" | "updatedAt" | "assessmentId">;

export type ProcessedEditQuantData = Pick<EditQuantData, "id" | "quantitativeId"> & Partial<Omit<EditQuantData, "id" | "quantitativeId">>;