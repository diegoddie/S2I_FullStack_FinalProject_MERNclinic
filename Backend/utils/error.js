// Utility function to create an error object with a specific status code and message
export const errorHandler = (statusCode, message) => {
    const error = new Error();
    error.statusCode = statusCode
    error.message = message
    return error
}