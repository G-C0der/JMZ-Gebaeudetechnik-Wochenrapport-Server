import {Router} from "express";
import {authenticate, authorize, rateLimiter} from "../middlewares";
import {fetch, approve} from "../controllers/WorkweekController";

const workweekRouter = Router();

workweekRouter.get('/workweeks/:date', authenticate, fetch);
workweekRouter.patch('/workweeks', rateLimiter, authenticate, authorize, approve);

export default workweekRouter;
