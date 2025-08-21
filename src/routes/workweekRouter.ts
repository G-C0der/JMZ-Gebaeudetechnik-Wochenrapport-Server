import {Router} from "express";
import {authenticate, authorize, rateLimiter} from "../middlewares";
import {fetch, approve, list} from "../controllers/WorkweekController";

const workweekRouter = Router();

workweekRouter.get('/workweeks/fetch/:date', authenticate, fetch);
workweekRouter.get('/workweeks/fetch/:date/:userId', authenticate, authorize, fetch);
workweekRouter.get('/workweeks/list/:userId/:year', authenticate, authorize, list);
workweekRouter.patch('/workweeks', rateLimiter, authenticate, authorize, approve);

export default workweekRouter;
