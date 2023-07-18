import { Op } from 'sequelize';
import { Comment } from '../models/comment.model';
import { findUserById } from './user.service';
import { validateCommentData } from '../validations/validateCommentData';

// Fetches comments by comment Id
// Returns false if isDeleted flag of comment is true
// else provides that particular comment.
const getCommentById = async (commentId:number) => {
    try {
        const getCDetails = await Comment.findByPk(commentId);

        if (!getCDetails) return {
            success: false,
            message: 'Comment does not exist!'
        }

        if (getCDetails.dataValues.isDeleted == true) return {
            success: false,
            message: 'Comment has been deleted!'
        }

        return {
            success: true,
            message: 'Comment found!',
            data: getCDetails.dataValues
        }
    }
    catch (error:any) {
        return {
            success: false,
            message: error.message
        };
    };
};

// Adds comment data in the comment table.
const createNewComment = async (cData:any) => {
    try {
        let createComment = await Comment.create(cData);

        if (!createComment) return {
            success: false,
            message: 'Comment could not be created!'
        }

        return {
            success: true,
            message: 'Comment created!',
            data: createComment.dataValues
        }
    }
    catch (error:any) {
        return {
            success: false,
            message: error.message
        }
    }
}

// Updates the existing comment data
// Requires commentId, userId associated with the comment requested for update and whose delete flag is false.
// returns the updated comment data.
const updateExistingComment = async (cData:any, commentId:number, userId:number) => {
    try {
        let updateUserComment:any = await Comment.update(cData, {
            returning: true,
            where: {
                [Op.and]: [
                    {
                        [Op.and]: [
                            { id: commentId },
                            { userId: userId }
                        ]
                    },
                    { isDeleted: false }
                ]
            }
        });

        if (updateUserComment[1] < 1) return {
            success: false,
            message: 'Comment could not be updated!'
        };

        let updatedCDetails = await getCommentById(commentId);

        return updatedCDetails;
    }
    catch (error:any) {
        return {
            success: false,
            message: error.message
        };
    };
};

// Updates the delete flag in comment table for provided commentId and userId associated with the requested comment deletion.
const deleteComment = async (commentId:number, userId:number) => {
    try {
        const updateC = {isDeleted:true};

        let deleteC:any = await Comment.update(updateC, {
            returning: true,
            where: {
                [Op.and]: [
                    {id: commentId},
                    {userId: userId}
                ]
            }
        });

        if (deleteC[1] < 1) return {
            success: false,
            message: 'Could not delete comment!'
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

// Gets one or all comments associated with provided questionID exist whose delete flag is false.
export const getCommentsByQuestionId = async (questionId:number) => {
    try {
        const getCDetails = await Comment.findAll({
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

        if (getCDetails.length < 0) return {
            success: false,
            message: 'No comments found!'
        }

        let listOfComments = getCDetails.map((comments, index) => ({index, ...comments.dataValues}));

        return {
            success: true,
            message: 'Comments for the question found!',
            data: listOfComments
        }
    }
    catch (error: any) {
        return {
            success: false,
            message: error.message
        };
    };
};

// Create comment service.
// Validates the comment req body for valid data.
// Verifies user creating the comment exist.
// Stores the comment data in Comment table
// Displays the comment along with user id and name
export const createCommentService = async (commentData:any, userId:number) => {
    try {
        const { body, questionId } = commentData;

        let checkCommentDetails = validateCommentData(body, questionId);

        if (!checkCommentDetails.success) return checkCommentDetails;

        let verifyUserExist = await findUserById(userId);

        if (!verifyUserExist.success) return verifyUserExist;

        const userName = verifyUserExist.data!.name;

        const cData = {
            body: body,
            questionId: questionId,
            userId: userId
        };

        let createUserComment = await createNewComment(cData);

        if (!createUserComment.success) return createUserComment;

        return {
            success: true,
            message: 'Comment created!',
            data: {
                id: createUserComment.data!.id,
                body: createUserComment.data!.body,
                user: {
                    id: userId,
                    name: userName
                }
            }
        };
    }
    catch(error:any) {
        return {
            success: false,
            message: error.message
        };
    };
};

// Update comment Service.
// Validates update data for comment
// Validates the person requesting for comment update
// Only updates the comment in db if commentId and userId associated with the comment is correct and the isDeleted flag is false.
// Displays the updated data.
export const updateCommentService = async (commentData: any, userId: number) => {
    try {
        const { body, questionId } = commentData;
        const commentId = commentData.id;

        if (!commentId) return {
            success: false,
            message: 'Provide with appropriate comment id to update comment'
        }

        let checkCommentDetails = validateCommentData(body, questionId);

        if (!checkCommentDetails.success) return checkCommentDetails;

        const verifyUserExist = await findUserById(userId);

        if (!verifyUserExist.success) return verifyUserExist;

        let userName = verifyUserExist.data!.name;

        let cData = {
            body: body
        };

        let updateUserComment = await updateExistingComment(cData, commentId, userId);

        if (!updateUserComment.success) return updateUserComment;

        return {
            success: true,
            message: 'Comment updated!',
            data: {
                ...updateUserComment,
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

// Delete comment service.
// Verifies user requesting to delete the comment exist in db.
// Does a soft delete in comment table
// Deletes a comment if commentId and userId associated with the comment is correct.
export const deleteCommentService = async (cData: any) => {
    try {
        const {commentId, userId} = cData;

        if (!Number.isInteger(commentId)) return {
            success: false,
            message: 'Comment ID must be a number!'
        }

        if (!Number.isInteger(userId)) return {
            success: false,
            message: 'User ID must be a number!'
        }

        const verifyUserExist = await findUserById(userId);

        if (!verifyUserExist.success) return verifyUserExist;

        let cDelete = await deleteComment(commentId, userId);

        if (!cDelete.success) return cDelete;

        return {
            success: true,
            message: 'Comment deleted!'
        }
    }
    catch (error: any) {
        return {
            success: false,
            message: error.message
        };
    };
};