export type EditTemplateAssessmentType = {
    id: number,
    name: string
}

export type EditTemplateType = {
    id: number,
    name: string,
    description: string,
    assessments: EditTemplateAssessmentType[]
}