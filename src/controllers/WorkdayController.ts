import {NextFunction, Request, Response} from "express";
import {editableWorkdayFields, serverError, timePattern, workdayFieldLengths} from "../constants";
import {toEditableModelFields} from "../utils";
import * as yup from 'yup';
import {Workday} from "../models";

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body, user: { id: userId } } = req as { body: any, user: { id: number } };

    // Only use allowed user fields
    const otherFields = toEditableModelFields(body, editableWorkdayFields);

    // Validate fields
    const validationSchema = yup.object({
      date: yup
        .date()
        .required('Date is required.'),
      from: yup
        .string()
        .matches(new RegExp(timePattern)),
      to: yup
        .string()
        .matches(new RegExp(timePattern)),
      from2: yup
        .string()
        .matches(new RegExp(timePattern)),
      to2: yup
        .string()
        .matches(new RegExp(timePattern)),
      project: yup
        .string()
        .required('Project is required.')
        .max(workdayFieldLengths.project.max,
            `Project is too long - should be maximum ${workdayFieldLengths.project.max} characters.`),
      code: yup
        .number()
        .required('Code is required.')
        .min(3, 'Code has to be 3 digits long.')
        .max(3, 'Code has to be 3 digits long.')
    });
    try {
      await validationSchema.validate(otherFields, { abortEarly: false });
    } catch (err: any) {
      return res.status(400).send(err.errors[0]);
    }

    // Create workday
    await Workday.create({
      userId,
      ...otherFields
    });

    // Send response
    res.status(200).send('Workday creation succeeded.');
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
  create,
  list,
  approve
};
