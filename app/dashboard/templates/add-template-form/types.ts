export type AddTemplateAssessmentType = {
    id: number,
    name: string
}

export type AddTemplateType = {
    name: string,
    description: string,
    assessments: AddTemplateAssessmentType[]
}