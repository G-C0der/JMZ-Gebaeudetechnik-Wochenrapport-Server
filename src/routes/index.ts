import { Router } from 'express';
import authRouter from "./authRouter";
import userRouter from "./userRouter";
import workdayRouter from "./workdayRouter";

const router = Router();

router.use(authRouter);
router.use(userRouter);
router.use(workdayRouter);

export default router;
