import {NextFunction, Request, Response} from "express";
import {getWeekDateRange, toDateOnly} from "../utils";
import {Workday, Workweek} from "../models";
import {serverError, workdayFormFields} from "../constants";

const fetch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { params: { date }, user: { id: userId } } = req as { params: any, user: { id: number } };

    // Get week date range
    const dateOnly = toDateOnly(new Date(date));
    const { start, end } = getWeekDateRange(new Date(dateOnly));

    // Query workweek
    const workweek = await Workweek.findOne({
      where: { userId, start, end },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [{
        model: Workday,
        as: 'workdays',
        attributes: workdayFormFields,
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

const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { params: { userId } } = req;

    // Query workweeks
    const workweeks = await Workweek.findAll({
      where: { userId },
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });

    // Send response
    res.status(200).json({
      workweeks
    });
  } catch (err) {
    console.error(`${serverError} Error: ${err}`);
    res.status(500).send(serverError);
    next(err);
  }
};

const approve = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body: { ids } } = req;

    // Approve workweek
    let affectedCount = 0;
    for (const id of ids) {
      const [affectedCnt] = await Workweek.update({ approved: true }, { where: { id } });
      affectedCount += affectedCnt;
    }

    // Send response
    if (affectedCount <= 0) return res.status(404).send('No matching workweek found for approval.');
    res.status(200).send('Workweek approval succeeded.');
  } catch (err) {
    console.error(`${serverError} Error: ${err}`);
    res.status(500).send(serverError);
    next(err);
  }
};

export {
  fetch,
  list,
  approve
};
