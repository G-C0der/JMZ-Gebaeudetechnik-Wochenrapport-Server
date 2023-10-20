import {NextFunction, Request, Response} from "express";
import {workdayFormFields, serverError, workdayValidationSchema} from "../constants";
import {filterModelFields, getWeekDateRange, toDateOnly} from "../utils";
import {Workday} from "../models";
import {Op} from "sequelize";

const save = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body, user: { id: userId } } = req as { body: Partial<Workday>, user: { id: number } };

    // Only use allowed workday fields
    const otherFields = filterModelFields(body, workdayFormFields);

    // Validate fields
    try {
      await workdayValidationSchema.validate(otherFields, { abortEarly: false });
    } catch (err: any) {
      return res.status(400).send(err.errors[0]);
    }

    // Create/update workday
    const dateOnly = toDateOnly(new Date(otherFields.date));
    const existingWorkday = await Workday.findOne({
      where: {
        userId,
        date: dateOnly
      }
    });
    if (existingWorkday) {
      const { date, ...editableFields } = otherFields;
      await existingWorkday.update({
        ...editableFields
      });
    } else {
      await Workday.create({
        userId,
        ...otherFields,
        date: dateOnly
      });
    }

    // Send response
    res.status(200).send('Workday save succeeded.');
  } catch (err) {
    console.error(`${serverError} Error: ${err}`);
    res.status(500).send(serverError);
    next(err);
  }
};

const list = async (req: Request, res: Response, next: NextFunction) => {
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
  save,
  list,
  approve
};
