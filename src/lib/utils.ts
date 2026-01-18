/**
 * Formats a date string to a human-readable format.
 * @param dateString - Date string in format "YYYY-MM-DD" or ISO format
 * @returns Formatted date string like "January 19, 2026"
 */
export function formatDate(dateString: string): string {
    const date = new Date(
        dateString.includes('T') ? dateString : `${dateString}T00:00:00`
    );
    return date.toLocaleDateString('en-us', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}
