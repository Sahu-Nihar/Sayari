export const validateCommentData = (body:string, questionId:number) => {
    if (!body || !questionId) return {
        success: false,
        message: 'Required fields missing: body and questionId'
    }

    if (typeof body !== 'string') return {
        success: false,
        message: 'Body of comment should be of type string!'
    }

    if (!Number.isInteger(questionId)) return {
        success: false,
        message: 'Question Id must be a number'
    };

    return {
        success: true,
        message: 'Required details provided!'
    }
}