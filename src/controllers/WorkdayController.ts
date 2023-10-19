import {NextFunction, Request, Response} from "express";
import {serverError} from "../constants";

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body } = req;


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
