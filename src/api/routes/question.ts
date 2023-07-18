import { Router } from "express";
import { createQuestion, updateQuestion, deleteQuestion, viewQuestion } from "../controllers/question.controller";

var router = Router();

router.post('/question/add/:userId', createQuestion);
router.put('/question/update/:userId', updateQuestion);
router.delete('/question/delete', deleteQuestion);
router.get('/question/view/:questionId', viewQuestion);

export default router;