/**
 * a "Random" ID function that fakes random id generation by returning the current Date.getTime() as a string
 */
function generateId(): string {
    const date = new Date();
    return date.getTime().toString();
}

export { generateId };