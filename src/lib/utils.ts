/**
 * Formats a date string or Date object to a human-readable format.
 * @param dateInput - Date string in format "YYYY-MM-DD", ISO format, or Date object
 * @returns Formatted date string like "January 19, 2026"
 */
export function formatDate(dateInput: string | Date | { start: string } | null | undefined): string {
    if (!dateInput) {
        return 'Unknown date';
    }

    let dateString: string;

    // Handle Notion date object format { start: "YYYY-MM-DD" }
    if (typeof dateInput === 'object' && 'start' in dateInput) {
        dateString = dateInput.start;
    } else if (dateInput instanceof Date) {
        dateString = dateInput.toISOString();
    } else {
        dateString = dateInput;
    }

    const date = new Date(
        dateString.includes('T') ? dateString : `${dateString}T00:00:00`
    );

    return date.toLocaleDateString('en-us', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}
