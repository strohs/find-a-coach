import DateTimeFormatOptions = Intl.DateTimeFormatOptions;

function longDateFormat(unixEpochMs: number): string {
    const date = new Date(unixEpochMs);
    const options: DateTimeFormatOptions = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric"
    };
    return date.toLocaleDateString(undefined, options);
}

/**
 * takes a timestamp stored in unix-epoch milli-seconds and returns it as a string, formatted as:
 * YY-MM-DD HH:MM
 * @param unixEpochMs
 */
function shortDateFormat(unixEpochMs: number): string {
    const date = new Date(unixEpochMs);
    const options: DateTimeFormatOptions = {
        year: "2-digit",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    };
    return date.toLocaleDateString(undefined, options);
}

export { longDateFormat, shortDateFormat };