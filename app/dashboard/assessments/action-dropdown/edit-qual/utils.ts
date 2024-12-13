import { EditQualScoreOption, EditQualScoreOptionCertain, ProcessedOption, ProcessedOptionIdOptional, ProcessedQualAssessmentBase, QualAssessmentBase } from "../types/edit-qual-type"

export const getDeletedScoreOptionIds = (oldOptions: EditQualScoreOption[], newOptions: EditQualScoreOption[]): number[] => {
    const remainingIds = new Set();
    const deletedIds: number[] = [];

    newOptions.forEach(option => {
        if (option.id) remainingIds.add(option.id);
    });

    oldOptions.forEach(option => {
        if (option.id && !remainingIds.has(option.id)) deletedIds.push(option.id);
    });

    return deletedIds;
}

const getOptionDiff = (oldOption: EditQualScoreOptionCertain, newOption: EditQualScoreOptionCertain): ProcessedOption => {
    const optionDiff: ProcessedOption = {
        id: newOption.id
    };

    for (const [key, value] of Object.entries(newOption)) {
        if (value !== oldOption[key]) optionDiff[key] = value;
    }

    return optionDiff;
}

export const getScoreOptionDiffs = (oldOptions: EditQualScoreOption[], newOptions: EditQualScoreOption[]): ProcessedOptionIdOptional[] => {
    const optionsDiff: ProcessedOptionIdOptional[] = [];

    const oldOptionsHashmap: { [key: number]: EditQualScoreOptionCertain } = oldOptions.reduce((acc, option) => {
        if (option.id) acc[option.id] = option as EditQualScoreOptionCertain;
        return acc
    }, {} as { [key: number]: EditQualScoreOptionCertain });

    newOptions.forEach(option => {
        if (option.id) {
            const diff = getOptionDiff(oldOptionsHashmap[option.id], option as EditQualScoreOptionCertain);
            if (Object.entries(diff).length > 1) optionsDiff.push(diff)
        } else {
            optionsDiff.push(option);
        }
    });

    return optionsDiff;
}

export const getAssessmentDiffs = (oldData: QualAssessmentBase, newData: QualAssessmentBase): ProcessedQualAssessmentBase => {
    const processedData: ProcessedQualAssessmentBase = {
        id: newData.id
    }

    for (const [key, value] of Object.entries(newData)) {
        if (value !== oldData[key]) processedData[key] = value;
    }    

    return processedData
}