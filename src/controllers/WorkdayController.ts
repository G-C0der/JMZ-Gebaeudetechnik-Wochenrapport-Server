import {NextFunction, Request, Response} from "express";
import {workdayFormFields, serverError, workdayValidationSchema, editableWorkdayFields} from "../constants";
import {filterModelFields, getWeekDateRange, toDateOnly} from "../utils";
import {sequelize, User, Workday, Workweek} from "../models";
import {ServerError} from "../errors";
import {BadRequestError} from "../errors/BadRequestError";

const save = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body, user: { id: userId } } = req as { body: Partial<Workday>, user: { id: number } };

    // Only use allowed workday fields
    const rest = filterModelFields(body, workdayFormFields);

    // Validate fields
    try {
      await workdayValidationSchema.validate(rest, { abortEarly: false });
    } catch (err: any) {
      return res.status(400).send(err.errors[0]);
    }

    // Get week date range
    const dateOnly = toDateOnly(new Date(rest.date));
    const { start, end } = getWeekDateRange(new Date(dateOnly));

    await sequelize.transaction(async (transaction) => {
      // Find/create workweek
      const user = await User.findByPk(userId);
      const [workweek] = await Workweek.findOrCreate({
        where: { userId, start, end },
        defaults: { userId, start, end, approved: user!.admin },
        transaction
      });

      // Abort on workweek fetch error
      if (!workweek || (workweek && !workweek.id)) throw new ServerError('Workweek operation failed.');

      // Abort if related workweek already approved
      if (!user!.admin && workweek.approved) throw new BadRequestError('Workday already approved.');

      // Update/create workday
      const workday = await Workday.findOne({
        where: { workweekId: workweek.id, date: dateOnly },
        transaction
      });
      if (workday) {
        const editableFields = filterModelFields(rest, editableWorkdayFields);
        const result = await workday.update(editableFields, { transaction });
        if (!result) throw new ServerError('Workday update failed.');
      } else {
        const result = await Workday.create({
          workweekId: workweek.id,
          ...rest,
          date: dateOnly
        }, { transaction });
        if (!result) throw new ServerError('Workday creation failed.');
      }
    });

    res.status(200).send('Workday save succeeded.');
  } catch (err: any) {
    if (err.code) return res.status(err.code).send(err.message);
    console.error(`${serverError} Error: ${err}`);
    res.status(500).send(serverError);
    next(err);
  }
};

export {
  save
};
