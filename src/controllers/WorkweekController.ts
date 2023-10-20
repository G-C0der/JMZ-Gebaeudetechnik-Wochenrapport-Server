import {NextFunction, Request, Response} from "express";
import {getWeekDateRange, toDateOnly} from "../utils";
import {Workday} from "../models";
import {Op} from "sequelize";
import {serverError} from "../constants";

const fetch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { params: { date } } = req;

    // Get week date range
    const dateOnly = toDateOnly(new Date(date));
    const weekDateRange = getWeekDateRange(new Date(dateOnly));

    // Query work week
    const workWeek = await Workday.findAll({
      where: {
        date: {
          [Op.between]: [weekDateRange.start, weekDateRange.end]
        }
      }
    });

    // Send response
    res.status(200).json({
      workWeek
    });
  } catch (err) {
    console.error(`${serverError} Error: ${err}`);
    res.status(500).send(serverError);
    next(err);
  }
};

const approve = async (req: Request, res: Response, next: NextFunction) => {
  try {

  } catch (err) {
    console.error(`${serverError} Error: ${err}`);
    res.status(500).send(serverError);
    next(err);
  }
};

export {
  fetch,
  approve
}
