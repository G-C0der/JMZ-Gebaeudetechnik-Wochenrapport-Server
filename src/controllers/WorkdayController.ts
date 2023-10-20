import {NextFunction, Request, Response} from "express";
import {workdayFormFields, serverError, workdayValidationSchema} from "../constants";
import {filterModelFields} from "../utils";
import {Workday} from "../models";
import moment from "moment";

const save = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body, user: { id: userId } } = req as { body: any, user: { id: number } };

    // Only use allowed workday fields
    const otherFields = filterModelFields(body, workdayFormFields);

    // Validate fields
    try {
      await workdayValidationSchema.validate(otherFields, { abortEarly: false });
    } catch (err: any) {
      return res.status(400).send(err.errors[0]);
    }

    // Explicitly format date to dateonly to avoid any potential pitfalls related to timezones or format mismatches
    const date = new Date(otherFields.date);
    const formattedDate = moment(date).format('YYYY-MM-DD');

    // Create/update workday
    const existingWorkday = await Workday.findOne({ where: {
      userId,
      date: formattedDate
    } });
    if (existingWorkday) {
      const { date, ...editableFields } = otherFields;
      await existingWorkday.update({
        ...editableFields
      });
    } else {
      await Workday.create({
        userId,
        ...otherFields,
        date: formattedDate
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
