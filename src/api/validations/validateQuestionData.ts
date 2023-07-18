export const validateQuestionData = (title:string, body:string) => {
    if (!title || !body) return {
        success: false,
        message: 'Provide required field: title, body.'
    };

    if (typeof title !== 'string') return {
        success: false,
        message: 'Title should be of type String'
    };

    if (typeof body !== 'string') return {
        success: false,
        message: 'Title should be of type String'
    };

    return {
        success: true,
        message: 'Required data provided!'
    };
}