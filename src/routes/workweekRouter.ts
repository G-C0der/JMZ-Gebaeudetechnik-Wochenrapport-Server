import {Router} from "express";
import {authenticate, authorize, rateLimiter} from "../middlewares";
import {fetch, approve, list} from "../controllers/WorkweekController";

const workweekRouter = Router();

workweekRouter.get('/workweeks/:date', authenticate, fetch);
workweekRouter.get('/workweeks', authenticate, authorize, list);
workweekRouter.patch('/workweeks', rateLimiter, authenticate, authorize, approve);

export default workweekRouter;
