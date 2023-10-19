import {Router} from "express";
import {authenticate, authorize, rateLimiter} from "../middlewares";
import {approve, create, list} from "../controllers/WorkdayController";

const workdayRouter = Router();

workdayRouter.post('/wordkays', rateLimiter, authenticate, create);
workdayRouter.get('/workdays', rateLimiter, authenticate, list);
workdayRouter.patch('/workdays', rateLimiter, authenticate, authorize, approve);

export default workdayRouter;
