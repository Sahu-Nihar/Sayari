import {Op} from 'sequelize';
import { Question } from '../models/question.model';
import { findUserById } from './user.service';
import { validateQuestionData } from '../validations/validateQuestionData';
import { getAnswerByQuestionId } from './answer.service';
import { getCommentsByQuestionId } from './comment.service';

// Get question by Id,
export const getQuestionById = async (questionId:number) => {
    try {
        let getQDetails = await Question.findByPk(questionId);

        if (!getQDetails) return {
            success: false,
            message: 'Question does not exist!'
        }

        if (getQDetails.dataValues.isDeleted == true) return {
            success: false,
            message: 'Question has been deleted!'
        }

        return {
            success: true,
            message: 'Question found!',
            data: getQDetails.dataValues
        }
    }
    catch (error:any) {
        return {
            success: false,
            message: error.message
        }
    }
};

// Create new questions and stores it in question table.
const createNewQuestion = async (qData:any) => {
    try {
        let createQuestion = await Question.create(qData);

        if (!createQuestion) return {
            success: false,
            message: 'Question could not be created!'
        }

        return {
            success: true,
            message: 'Question created!',
            data: createQuestion.dataValues
        };
    }
    catch (error:any) {
        return {
            success: false,
            message: error.message
        };
    };
};

const updateExistingQuestion = async (qData:any, questionId:number, userId:number) => {
    try {
        let updateUserQuestion:any = await Question.update(qData, {
            returning: true,
            where: {
                [Op.and]: [
                    {
                        [Op.and]: [
                            { id: questionId },
                            { userId: userId }
                        ]
                    },
                    { isDeleted: false }
                ]
            }
        });

        if (updateUserQuestion[1] < 1) return {
            success: false,
            message: 'Question could not be updated!'
        };

        let updatedQDetails = await getQuestionById(questionId);

        return updatedQDetails;
    }
    catch (error:any) {
        return {
            success: false,
            message: error.message
        };
    };
};

const deleteQuestion = async (questionId:number, userId:number) => {
    try {
        const updateQ = {isDeleted: true}

        let deleteQ:any = await Question.update(updateQ, {
            returning: true,
            where: {
                [Op.and]: [
                    {id: questionId},
                    {userId: userId}
                ]
            }
        });

        if (deleteQ[1] < 1) return {
            success: false,
            message: 'Could not delete question!'
        }

        return {
            success: true,
            message: 'Updated successfully!'
        }
    }
    catch (error:any) {
        return {
            success: false,
            message: error.message
        }
    }
}

// Created question service,
// Validates all required fields of question data
// Validates if the user creating exist in db
// Stores the user's question in DB.
export const createQuestionService = async (userId:number, questionData:any) => {
    try {
        const { title, body } = questionData;

        let checkQuestionData = validateQuestionData(title, body);

        if (!checkQuestionData.success) return checkQuestionData;
        
        const verifyUserExist = await findUserById(userId);

        if (!verifyUserExist.success) return verifyUserExist;

        const userName = verifyUserExist.data!.name;

        const qData = {
            title: title,
            body: body,
            userId: userId
        };

        let createUserQuestion = await createNewQuestion(qData);

        if (!createUserQuestion.success) return createUserQuestion;

        return {
            success: true,
            message: 'Question created!',
            data: {
                ...createUserQuestion.data,
                user: {
                    id: userId,
                    name: userName
                }
            }
        };
    }
    catch (error:any) {
        return {
            success: false,
            message: error.message
        };
    };
};

// Update question Service.
// Validates update data for question
// Validates the person requesting for question update
// Only updates the question in db if questionId and userId associated with the question is correct and the isDeleted flag is false.
// Displays the updated data.
export const updateQuestionService = async (updateData: any, userId:number) => {
    try {
        const { title, body } = updateData;
        const questionId = parseInt(updateData.id);

        const checkQuestionData = validateQuestionData(title, body);

        if (!checkQuestionData.success) return checkQuestionData;

        const verifyUserExist = await findUserById(userId);

        if (!verifyUserExist.success) return verifyUserExist;

        const userName = verifyUserExist.data!.name;

        const qData = {
            title: title,
            body: body
        }

        const updateUserQuestion = await updateExistingQuestion(qData, questionId, userId);

        if (!updateUserQuestion.success) return updateExistingQuestion;

        return {
            success: true,
            message: 'Question updated!',
            data: {
                ...updateUserQuestion.data,
                user: {
                    id: userId,
                    name: userName
                }
            }
        }
    }
    catch (error:any) {
        return {
            success: false,
            message: error.message
        };
    };
};

// Delete question service.
// Verifies user requesting to delete the question exist in db.
// Does a soft delete in question table
// Deletes a question if questionId and userId associated with the question is correct.
export const deleteQuestionService = async (qData:any) => {
    try {
        const { questionId, userId } = qData;

        const verifyUserExist = await findUserById(userId);

        if (!verifyUserExist.success) return verifyUserExist;

        let qDelete = await deleteQuestion(questionId, userId);

        if (!qDelete.success) return qDelete;

        return {
            success: true,
            message: 'Question deleted!'
        }
    }
    catch (error:any) {
        return {
            success: false,
            message: error.message
        }
    }
}

// View Question Service
// Fetches question through questionId
// Fetches all comments associated with the questionId or question: returns array of comments if present else empty []
// Fetches all answer associated with the questionId or question: returns array of answer if present else empty []
export const viewQuestionService = async (questionId:number) => {
    try {

        let questionDetails = await getQuestionById(questionId);

        if (!questionDetails.success) return questionDetails;

        let commentList:any = await getCommentsByQuestionId(questionId);

        let listOfComments:any = [];
        let listOfAnswers:any = [];

        if (commentList.success) {
            listOfComments = [...commentList.data]
        };

        let answerList:any = await getAnswerByQuestionId(questionId);

        if (answerList.success) {
            listOfAnswers = [...answerList.data];
        }

        return {
            success: true,
            message: 'Question, Comments and Answer found!',
            data: {
                ...questionDetails,
                comments: listOfComments,
                answers: listOfAnswers
            }
        }
    }
    catch (error:any) {
        return {
            success: false,
            message: error.message
        }
    }
}