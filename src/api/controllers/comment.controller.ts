import { Request, Response } from "express";
import { createCommentService, updateCommentService, deleteCommentService } from "../services/comment.service";

export const createComment = async (req:Request, res:Response) => {
    const userId = parseInt(req.params.userId);
    const comment = await createCommentService(req.body, userId);

    if (comment.success) {
        res
        .status(201)
        .json(comment)
    }
    else {
        res
        .status(400)
        .json(comment)
    }
}

export const updateComment = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const comment = await updateCommentService(req.body, userId);

    console.log()

    if (comment.success) {
        res
        .status(200)
        .json(comment)
    }
    else {
        res
        .status(400)
        .json(comment)
    }
}

export const deleteComment = async (req: Request, res: Response) => {
    const comment = await deleteCommentService(req.body);

    if (comment.success) {
        res
        .status(200)
        .json(comment)
    }
    else {
        res
        .status(400)
        .json(comment)
    }
}