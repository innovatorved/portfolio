/**
 * Formats a date string or Date object to a human-readable format.
 * @param dateInput - Date string in format "YYYY-MM-DD", ISO format, or Date object
 * @returns Formatted date string like "January 19, 2026"
 */
export function formatDate(dateInput: string | number | Date | { start: string } | null | undefined): string {
    if (!dateInput) {
        return 'Unknown date';
    }

    let date: Date;

    // Handle Notion date object format { start: "YYYY-MM-DD" }
    if (typeof dateInput === 'object' && 'start' in dateInput) {
        const dateString = dateInput.start;
        date = new Date(dateString.includes('T') ? dateString : `${dateString}T00:00:00`);
    } else if (dateInput instanceof Date) {
        date = dateInput;
    } else if (typeof dateInput === 'number') {
        date = new Date(dateInput);
    } else {
        // Handle numeric strings just in case
        if (/^\d+$/.test(dateInput)) {
            date = new Date(Number.parseInt(dateInput));
        } else {
            date = new Date(dateInput.includes('T') ? dateInput : `${dateInput}T00:00:00`);
        }
    }

    if (isNaN(date.getTime())) {
        return 'Invalid date';
    }

    return date.toLocaleDateString('en-us', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}
