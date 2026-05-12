/**
 * Converts a raw MongoDB ObjectId to a readable format
 * e.g. "60b5...a1b2" -> "BATCH-A1B2"
 * 
 * @param {string} id - The MongoDB ObjectId
 * @param {string} prefix - The prefix to add (e.g. 'BATCH', 'ALLOC')
 * @returns {string} - The formatted ID
 */
export const formatId = (id, prefix) => {
    if (!id) return 'N/A';
    const strId = id.toString();
    if (strId.length < 6) return `${prefix}-${strId.toUpperCase()}`;
    const short = strId.slice(-4).toUpperCase();
    return `${prefix}-${short}`;
};
