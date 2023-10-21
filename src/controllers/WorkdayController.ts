import {NextFunction, Request, Response} from "express";
import {workdayFormFields, serverError, workdayValidationSchema, editableWorkdayFields} from "../constants";
import {filterModelFields, getWeekDateRange, toDateOnly} from "../utils";
import {sequelize, Workday, Workweek} from "../models";
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

    // Get week date range
    const dateOnly = toDateOnly(new Date(otherFields.date));
    const { start, end } = getWeekDateRange(new Date(dateOnly));

    sequelize.transaction(async (transaction) => {
      // Find/create workweek
      const [{ id: workweekId }] = await Workweek.findOrCreate({
        where: { date: { [Op.between]: [start, end] } },
        defaults: { userId, start, end },
        transaction
      });

      // Update/create workday
      const workday = await Workday.findOne({
        where: { workweekId, date: dateOnly },
        transaction
      });
      if (workday) {
        const editableFields = filterModelFields(otherFields, editableWorkdayFields);
        await workday.update(editableFields, { transaction });
      } else {
        await Workday.create({
          workweekId,
          ...otherFields,
          date: dateOnly
        }, { transaction });
      }
    });

    // Send response
    res.status(200).send('Workday save succeeded.');
  } catch (err) {
    console.error(`${serverError} Error: ${err}`);
    res.status(500).send(serverError);
    next(err);
  }
};

export {
  save
};
