type simulateProcess = {
    resolveProbability?: number;
    processingTime?: number;
}

export const simulateProcess = ({ resolveProbability=0.5, processingTime=3000}: simulateProcess): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() < resolveProbability) {
                return resolve()
            }
            return reject(new Error("An error has occured"))
        }, processingTime);
    });
}