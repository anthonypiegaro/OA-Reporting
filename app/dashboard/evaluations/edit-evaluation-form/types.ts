export type EditEvalFormBaseAssessment = {
    id: number | undefined,
    assessmentId: number,
    name: string,
    orderNumber: number
}

export type EditEvalFormQuantAssessment = EditEvalFormBaseAssessment & {
    type: "quantitative",
    score: string,
    unit: string
}

export type EditEvalFormQualAssessmentOption = {
    id: number,
    score: string,
    description: string,
    isPassing: boolean
}

export type EditEvalFormQualAssessment = EditEvalFormBaseAssessment & {
    type: "qualitative"
    optionId: number,
    score: string,
    description: string,
    isPassing: boolean,
    options: EditEvalFormQualAssessmentOption[]
}

export type EditEvalFormPdfAssessment = EditEvalFormBaseAssessment & {
    type: "pdf",
    score: string | File
}

export type EditEvalFormAssessment = EditEvalFormQuantAssessment | EditEvalFormQualAssessment | EditEvalFormPdfAssessment;

export type EditEvalForm = {
    id: number,
    userId: number,
    date: Date,
    name: string,
    description: string,
    notes: string,
    assessments: EditEvalFormAssessment[]
};

// Types for the edit eval action

export type EditEvalTopLevelData = {
    id: number,
    userId: number,
    name?: string,
    description?: string,
    notes?: string,
    updatedAt: Date
};

export type EditEvalNewQuantScore = {
    assessmentId: number,
    name: string,
    orderNumber: number,
    type: "quantitative",
    score: string,
    unit: string
};

export type EditEvalNewQualScore = {
    assessmentId: number,
    name: string,
    orderNumber: number,
    type: "qualitative",
    optionId: number,
    score: string,
    description: string,
    isPassing: boolean,
};

export type EditEvalNewPdfScore = {
    assessmentId: number,
    name: string,
    orderNumber: number,
    type: "pdf",
    score: File
};

export type EditEvalEditedScore = { id: number } & (
    EditEvalNewQuantScore |
    EditEvalNewQualScore |
    EditEvalNewPdfScore
);

export type EditEvalEditedQuantScore = { id: number } & Partial<EditEvalNewQuantScore>;

export type EditEvalEditedQualScore = { id: number } & Partial<EditEvalNewQualScore>;

export type EditEvalEditedPdfScore = { id: number, orderNumber?: number };

export type EditEvalActionData = {
    topLevelData: EditEvalTopLevelData,
    deletedScoreIds: number[],
    newQuantScores: EditEvalNewQuantScore[],
    newQualScores: EditEvalNewQualScore[],
    newPdfScores: EditEvalNewPdfScore[],
    editedQuantScores: EditEvalEditedQuantScore[],
    editedQualScores: EditEvalEditedQualScore[],
    editedPdfScores: EditEvalEditedPdfScore[]
}