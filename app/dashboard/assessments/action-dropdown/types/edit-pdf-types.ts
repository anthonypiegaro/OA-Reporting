import { SelectAssessment } from "@/app/db/schema";

export type PDFAssessment = Pick<SelectAssessment, "id" | "name" | "description" | "url">;

export type EditPDFFormType = Pick<SelectAssessment, "id"> & Partial<Omit<SelectAssessment, "id">>;