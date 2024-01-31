import {CustomError} from "./CustomError";

class BadRequestError extends CustomError {
  constructor(message: string) {
    super(400, message);
  }
}

export {
  BadRequestError
};
