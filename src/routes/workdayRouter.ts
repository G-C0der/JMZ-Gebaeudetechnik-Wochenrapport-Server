import {Router} from "express";
import {authenticate, authorize, rateLimiter} from "../middlewares";
import {approve, save, list} from "../controllers/WorkdayController";

const workdayRouter = Router();

workdayRouter.post('/workdays', rateLimiter, authenticate, save);
workdayRouter.get('/workdays/:date', rateLimiter, authenticate, list);
workdayRouter.patch('/workdays', rateLimiter, authenticate, authorize, approve);

export default workdayRouter;
