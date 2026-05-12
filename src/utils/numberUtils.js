export const formatNumber = (num) => {
    if (num === null || num === undefined) return 0;
    
    let parsed = parseFloat(num);
    if (isNaN(parsed)) return num;

    // If it's an integer, return it as is
    if (Number.isInteger(parsed)) return parsed;

    // Otherwise return with 2 decimal places
    return parseFloat(parsed.toFixed(2));
}
