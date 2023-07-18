import { Request, Response } from "express";
import { createQuestionService, updateQuestionService, deleteQuestionService, viewQuestionService } from "../services/question.service";


export const createQuestion = async (req:Request, res: Response) => {
    const userId = parseInt(req.params.userId)
    const question = await createQuestionService(userId, req.body);

    if (question.success) {
        res
        .status(201)
        .json(question)
    }
    else {
        res
        .status(400)
        .json(question)
    }
};

export const updateQuestion = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId)
    
    const question = await updateQuestionService(req.body, userId);

    if (question.success) {
        res
        .status(200)
        .json(question)
    }
    else {
        res
        .status(400)
        .json(question)
    }
};

export const deleteQuestion = async (req:Request, res:Response) => {
    const question = await deleteQuestionService(req.body);

    if (question.success) {
        res
        .status(200)
        .json(question)
    }
    else {
        res
        .status(400)
        .json(question)
    }
};

export const viewQuestion = async (req:Request, res:Response) => {
    const questionId = parseInt(req.params.questionId);
    const question = await viewQuestionService(questionId);

    if (question.success) {
        res
        .status(200)
        .json(question)
    }
    else {
        res
        .status(400)
        .json(question)
    }
};