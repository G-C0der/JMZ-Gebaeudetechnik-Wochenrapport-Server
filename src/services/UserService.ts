import jwt from "jsonwebtoken";
import {clientAppName} from "../config/env";
import {User} from "../models";
import {ServerError, VerificationError} from "../errors";
import {urlExpiredError, urlInvalidError, urlNoUserAssociatedError} from "../constants";

class UserService {
  generateVerificationUrl = (
    action: string,
    userId: number,
    expiresIn: string,
    secret?: string
  ) => {
    if (!secret) throw new ServerError('Error generating URL. Secret not provided.');
    const token = jwt.sign({ id: userId }, secret, { expiresIn });
    return `${clientAppName}://${action}?token=${token}`;
  };

  verifyToken = async (
    token: string,
    secret?: string,
    userAttributes: string[] = ['id']
  ): Promise<User> => {
    // Verify token
    if (!secret) throw new ServerError('Error verifying token. Secret not provided.');
    let id;
    try {
      ({ id } = jwt.verify(token, secret) as jwt.JwtPayload);
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new VerificationError(400, urlExpiredError);
      } else {
        throw new VerificationError(400, urlInvalidError);
      }
    }

    // Check if user exists
    const user = await User.findOne({
      where: { id },
      attributes: userAttributes
    });
    if (!user) throw new VerificationError(400, urlNoUserAssociatedError);

    return user;
  };
}

export default new UserService();
