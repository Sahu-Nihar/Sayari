import { Request, Response } from "express";
import { createAnswerService, updateAnswerService, deleteAnswerService } from "../services/answer.service";

export const createAnswer = async (req:Request, res:Response) => {
    const userId = parseInt(req.params.userId);
    const answer = await createAnswerService(req.body, userId);

    if (answer.success) {
        res
        .status(201)
        .json(answer)
    }
    else {
        res
        .status(400)
        .json(answer)
    }
}

export const updateAnswer = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const answer = await updateAnswerService(req.body, userId);

    if (answer.success) {
        res
        .status(200)
        .json(answer)
    }
    else {
        res
        .status(400)
        .json(answer)
    }
}

export const deleteAnswer = async (req: Request, res: Response) => {
    const answer = await deleteAnswerService(req.body);

    if (answer.success) {
        res
        .status(200)
        .json(answer)
    }
    else {
        res
            .status(400)
            .json(answer)
    }
}