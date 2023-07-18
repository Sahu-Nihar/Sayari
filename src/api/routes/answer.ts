import { Router } from "express";
import { createAnswer, updateAnswer, deleteAnswer } from "../controllers/answer.controller";

const router = Router();

router.post('/answer/add/:userId', createAnswer);
router.put('/answer/update/:userId', updateAnswer);
router.delete('/answer/delete', deleteAnswer);

export default router;