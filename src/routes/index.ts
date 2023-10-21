import { Router } from 'express';
import authRouter from "./authRouter";
import userRouter from "./userRouter";
import workdayRouter from "./workdayRouter";
import workweekRouter from "./workweekRouter";

const router = Router();

router.use(authRouter);
router.use(userRouter);
router.use(workweekRouter);
router.use(workdayRouter);

export default router;
