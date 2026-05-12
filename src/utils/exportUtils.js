// src/utils/exportUtils.js

/**
 * Exports data to a CSV file with BOM for Excel compatibility.
 * @param {Array} data - The array of objects to export.
 * @param {string} fileName - The desired name of the CSV file (without extension).
 * @param {Array} headers - Optional array of header names.
 */
export const exportToCSV = (data, fileName, headers) => {
    if (!data || !data.length) {
        return;
    }

    const columnHeaders = headers || Object.keys(data[0]);
    
    const csvRows = [
        columnHeaders.join(','), // Header row
        ...data.map(row => 
            columnHeaders.map(fieldName => {
                const value = row[fieldName] ?? '';
                // Handle nested objects
                const stringValue = typeof value === 'object' ? (value?.name || JSON.stringify(value)) : String(value);
                const escaped = stringValue.replace(/"/g, '""'); // Escape double quotes
                return `"${escaped}"`;
            }).join(',')
        )
    ];

    const csvContent = csvRows.join('\n');
    // Prepend BOM for UTF-8 Excel compatibility
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${fileName}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
