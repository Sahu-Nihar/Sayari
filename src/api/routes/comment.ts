import { Router } from "express";
import { createComment,updateComment, deleteComment } from "../controllers/comment.controller";

const router = Router();

router.post('/comment/add/:userId', createComment);
router.put('/comment/update/:userId', updateComment);
router.delete('/comment/delete', deleteComment);

export default router;