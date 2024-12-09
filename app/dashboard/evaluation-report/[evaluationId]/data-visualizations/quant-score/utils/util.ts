export const removeTrailingZeros = (number: string) => {
    let numString = number;

    while (numString[numString.length - 1] === "0" || numString[numString.length - 1] === ".") {
        if (numString[numString.length - 1] === ".") {
            numString = numString.slice(0, numString.length - 1);
            break;
        }
        numString = numString.slice(0, numString.length - 1);
    }

    return Number(numString);
}