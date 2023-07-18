import { Op } from 'sequelize';
import { Answer, AnswerModel } from '../models/answer.model';
import { findUserById } from './user.service';
import { validateAnswerData } from '../validations/validateAnswerData';

// Fetches answer by answerId
// Returns false if not found or if isDeleted flag is true
// else provides that particular answer.
const getAnswerById = async (answerId:number) => {
    try {
        let getADetails = await Answer.findByPk(answerId);

        if (!getADetails) return {
            success: false,
            message: 'Answer does not exist!'
        };

        if (getADetails.dataValues.isDeleted == true) return {
            success: false,
            message: 'Answer has been deleted!'
        };

        return {
            success: true,
            message: 'Answer found!',
            data: getADetails.dataValues
        };
    }
    catch (error:any) {
        return {
            success: false,
            message: error.message
        };
    };
};

// add answer to the answer table.
const createNewAnswer = async (aData:any) => {
    try {
        let createAnswer = await Answer.create(aData);

        if (!createAnswer) return {
            success: false,
            message: 'Answer could not be created!'
        }

        return {
            success: true,
            message: 'Answer created!',
            data: createAnswer.dataValues
        };
    }
    catch (error:any) {
        return {
            success: false,
            message: error.message
        };
    };
};

// Updates the existing answer data
// Requires answerId, userId associated with the answer requested for update and whose delete flag is false.
// returns the updated answer data.
const updateExistingAnswer = async (aData: any, answerId: number, userId: number) => {
    try {
        let updateUserAnswer: any = await Answer.update(aData, {
            returning: true,
            where: {
                [Op.and]: [
                    {
                        [Op.and]: [
                            { id: answerId },
                            { userId: userId }
                        ]
                    },
                    { isDeleted: false }
                ]
            }
        });

        if (updateUserAnswer[1] < 1) return {
            success: false,
            message: 'Answer could not be updated!'
        };

        let updatedADetails = await getAnswerById(answerId);

        return updatedADetails;
    }
    catch (error: any) {
        return {
            success: false,
            message: error.message
        };
    };
};

// Updates the delete flag in answer table for provided answerId and userId associated with the requested answer deletion.
const deleteAnswer = async (answerId: number, userId: number) => {
    try {
        const updateA = { isDeleted: true };

        let deleteA: any = await Answer.update(updateA, {
            returning: true,
            where: {
                [Op.and]: [
                    { id: answerId },
                    { userId: userId }
                ]
            }
        });

        if (deleteA[1] < 1) return {
            success: false,
            message: 'Could not delete answer!'
        }

        return {
            success: true,
            message: 'Updated successfully!'
        };
    }
    catch (error: any) {
        return {
            success: false,
            message: error.message
        };
    };
};

// Gets one or all answer associated with provided questionID exist whose delete flag is false.
export const getAnswerByQuestionId = async (questionId: number) => {
    try {
        const getADetails = await Answer.findAll({
            where: {
                [Op.and]: [
                    { questionId: questionId },
                    { isDeleted: false }
                ]
            },
            order: [
                ["createdAt", 'DESC']
            ]
        });

        if (getADetails.length < 0) return {
            success: false,
            message: 'No Answer found!'
        }

        let listOfAnswer = getADetails.map((answer, index) => ({ index, ...answer.dataValues }));

        return {
            success: true,
            message: 'Answers for the question found!',
            data: listOfAnswer
        }
    }
    catch (error: any) {
        return {
            success: false,
            message: error.message
        };
    };
};

// Create answer service.
// Validates the answer req body for valid data.
// Verifies user creating the answer exist.
// Stores the answer data in Answer table
// Displays the answer along with user id and name
export const createAnswerService = async (answerData: any, userId: number) => {
    try {
        const { body, questionId } = answerData;

        let checkAnswerDetails = validateAnswerData(body, questionId);

        if (!checkAnswerDetails.success) return checkAnswerDetails;

        let verifyUserExist = await findUserById(userId);

        if (!verifyUserExist.success) return verifyUserExist;

        const userName = verifyUserExist.data!.name;

        const aData = {
            body: body,
            questionId: questionId,
            userId: userId
        };

        let createUserAnswer = await createNewAnswer(aData);

        if (!createUserAnswer.success) return createUserAnswer;

        return {
            success: true,
            message: 'Answer created!',
            data: {
                id: createUserAnswer.data!.id,
                body: createUserAnswer.data!.body,
                user: {
                    id: userId,
                    name: userName
                },
                accepted: createUserAnswer.data!.isAccepted,
            }
        };
    }
    catch (error: any) {
        return {
            success: false,
            message: error.message
        };
    };
};

// Update Answer Service.
// Validates update data for answer
// Validates the person requesting for answer update
// Only updates the answer in db if answerId and userId associated with the answer is correct and the isDeleted flag is false.
// Displays the updated data.
export const updateAnswerService = async (answerData: any, userId: number) => {
    try {
        const { body, questionId } = answerData;
        const answerId = answerData.id;

        if (!answerId) return {
            success: false,
            message: 'Provide with appropriate answer id to update the answer'
        }

        let checkAnswerDetails = validateAnswerData(body, questionId);

        if (!checkAnswerDetails.success) return checkAnswerDetails;

        const verifyUserExist = await findUserById(userId);

        if (!verifyUserExist.success) return verifyUserExist;

        let userName = verifyUserExist.data!.name;

        let aData = {
            body: body
        };

        let updateUserAnswer = await updateExistingAnswer(aData, answerId, userId);

        if (!updateUserAnswer.success) return updateUserAnswer;

        return {
            success: true,
            message: 'Answer updated!',
            data: {
                ...updateUserAnswer,
                user: {
                    id: userId,
                    name: userName
                }
            }
        }
    }
    catch (error: any) {
        return {
            success: false,
            message: error.message
        };
    };
};

// Delete answer service.
// Verifies user requesting to delete the answer exist in db.
// Does a soft delete in answer table
// Deletes a answer if answerId and userId associated with the answer is correct.
export const deleteAnswerService = async (aData: any) => {
    try {
        const { answerId, userId } = aData;

        if (!Number.isInteger(answerId)) return {
            success: false,
            message: 'Answer ID must be a number!'
        }

        if (!Number.isInteger(userId)) return {
            success: false,
            message: 'User ID must be a number!'
        }

        const verifyUserExist = await findUserById(userId);

        if (!verifyUserExist.success) return verifyUserExist;

        let aDelete = await deleteAnswer(answerId, userId);

        if (!aDelete.success) return aDelete;

        return {
            success: true,
            message: 'Answer deleted!'
        }
    }
    catch (error: any) {
        return {
            success: false,
            message: error.message
        };
    };
};