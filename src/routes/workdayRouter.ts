import {Router} from "express";
import {authenticate, rateLimiter} from "../middlewares";
import {save} from "../controllers/WorkdayController";

const workdayRouter = Router();

workdayRouter.post('/workdays', rateLimiter, authenticate, save);

export default workdayRouter;
