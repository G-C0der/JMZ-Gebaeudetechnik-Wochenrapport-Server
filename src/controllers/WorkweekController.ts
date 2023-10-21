import {NextFunction, Request, Response} from "express";
import {getWeekDateRange, toDateOnly} from "../utils";
import {Workday, Workweek} from "../models";
import {editableWorkdayFields, serverError} from "../constants";

const fetch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { params: { date }, user: { id: userId } } = req as { params: any, user: { id: number } };

    // Get week date range
    const dateOnly = toDateOnly(new Date(date));
    const { start, end } = getWeekDateRange(new Date(dateOnly));

    // Query workweek
    const workweek = await Workweek.findOne({
      where: { userId, start, end },
      include: [{
        model: Workday,
        as: 'workday',
        attributes: editableWorkdayFields,
        order: [['date', 'ASC']]
      }]
    });

    // Send response
    res.status(200).json({
      workweek
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
};
