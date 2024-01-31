import {NextFunction, Request, Response} from "express";
import {workdayFormFields, serverError, workdayValidationSchema, editableWorkdayFields} from "../constants";
import {filterModelFields, getWeekDateRange, toDateOnly} from "../utils";
import {sequelize, Workday, Workweek} from "../models";

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

    await sequelize.transaction(async (transaction) => {
      // Find/create workweek
      const [workweek] = await Workweek.findOrCreate({
        where: { userId, start, end },
        defaults: { userId, start, end },
        transaction
      });

      // Abort on workweek fetch error
      if (!workweek || (workweek && !workweek.id)) {
        return Promise.reject(res.status(500).send('Workweek operation failed.')); // Sequelize auto transaction rollback
      }

      // Abort if related workweek already approved
      if (workweek.approved) {
        return Promise.reject(res.status(400).send('Workday already approved.'));
      }

      // Update/create workday
      const workday = await Workday.findOne({
        where: { workweekId: workweek.id, date: dateOnly },
        transaction
      });
      if (workday) {
        const editableFields = filterModelFields(otherFields, editableWorkdayFields);
        const result = await workday.update(editableFields, { transaction });
        if (!result) return Promise.reject(res.status(500).send('Workday update failed.')); // Sequelize auto transaction rollback
      } else {
        const result = await Workday.create({
          workweekId: workweek.id,
          ...otherFields,
          date: dateOnly
        }, { transaction });
        if (!result) return Promise.reject(res.status(500).send('Workday creation failed.')); // Sequelize auto transaction rollback
      }
    });

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
