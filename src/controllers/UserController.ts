import {NextFunction, Request, Response} from "express";
import {User} from "../models";
import bcrypt from "bcrypt";
import * as yup from 'yup';
import {mailer, userService} from "../services";
import validator from 'validator';
import {jmzEmail, passwordResetSecret, verificationSecret} from "../config/env";
import {
  serverError,
  emailValidationSchema,
  passwordValidationSchema,
  userAlreadyVerifiedError, editableUserFields
} from "../constants";
import {VerificationError} from "../errors";
import {filterModelFields} from "../utils";
import {ResponseSeverity} from "../enums";

const { SeveritySuccess, SeverityError, SeverityWarning } = ResponseSeverity;

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { email, password, ...rest } = req.body;

    // Only use allowed user fields
    rest = filterModelFields(rest, editableUserFields);

    // Validate email
    if (!validator.isEmail(email)) return res.status(400).send('Email is invalid.');

    // Validate email and password
    const validationSchema = yup.object({
      email: emailValidationSchema,
      password: passwordValidationSchema
    });
    try {
      await validationSchema.validate({ email, password }, { abortEarly: false });
    } catch (err: any) {
      return res.status(400).send(err.errors[0]);
    }

    // Check if user exists
    const user = await User.findOne({
      where: { email },
      attributes: ['id']
    });
    if (user) return res.status(400).send('A user with the specified email already exists.');

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Create user
    const { dataValues: { password: _, ...newUser } } = await User.create({
      email,
      password: hash,
      ...rest
    });

    // Create verification URL
    const verificationUrl = userService.generateVerificationUrl(
      'verification',
      newUser.id,
      '1d',
      verificationSecret
    );

    // Send registration done email
    await mailer.sendRegistrationDoneEmail(jmzEmail, email);

    // Send verification pending email
    const wasEmailSent = await mailer.sendVerificationPendingEmail(email, verificationUrl);

    // Send response
    res.status(200).send({
      severity: wasEmailSent ? SeveritySuccess : SeverityWarning,
      message: wasEmailSent ? 'Verification email was sent.' : 'Error sending verification email.'
    });
  } catch (err) {
    console.error(`${serverError} Error: ${err}`);
    res.status(500).send(serverError);
    next(err);
  }
};

const sendVerificationEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!validator.isEmail(email)) return res.status(400).send('Email is invalid.');

    // Check if user exists
    const user = await User.findOne({
      where: { email },
      attributes: ['id', 'verified']
    });
    if (!user) return res.status(400).send('A user with the specified email doesn\'t exist.');
    if (user.verified) return res.status(400).json({
      severity: SeverityWarning,
      message: userAlreadyVerifiedError
    });

    // Create verification URL
    const verificationUrl = userService.generateVerificationUrl(
        'verification',
        user.id,
        '1d',
        verificationSecret
    );

    // Send verification pending email
    const wasEmailSent = await mailer.sendVerificationPendingEmail(email, verificationUrl);

    // Send response
    res.status(200).json({
      severity: wasEmailSent ? SeveritySuccess : SeverityError,
      message: wasEmailSent ? 'Verification email was sent.' : 'Error sending verification email.'
    });
  } catch (err) {
    console.error(`${serverError} Error: ${err}`);
    res.status(500).send(serverError);
    next(err);
  }
};

const verify = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;

    // Validate token
    let user;
    try {
      user = await userService.verifyToken(token, verificationSecret, ['id', 'email', 'verified']);
    } catch (err: any) {
      if (err instanceof VerificationError) return res.status(err.code).send(err.message);
      throw err;
    }

    // Check if user already verified
    if (user!.verified) return res.status(400).json({
      severity: SeverityWarning,
      message: userAlreadyVerifiedError
    });

    // Set user verified
    await user.update({ verified: true });

    // Send response
    res.status(200).send('User verification succeeded.');
  } catch (err) {
    console.error(`${serverError} Error: ${err}`);
    res.status(500).send(serverError);
    next(err);
  }
};

const sendResetPasswordEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!validator.isEmail(email)) return res.status(400).send('Email is invalid.');

    // Check if user exists
    const user = await User.findOne({
      where: { email },
      attributes: ['id']
    });
    if (!user) return res.status(400).send('A user with the specified email doesn\'t exist.');

    // Create reset password URL
    const passwordResetUrl = userService.generateVerificationUrl(
      'reset-password',
      user.id,
      '1h',
      passwordResetSecret
    );

    // Send reset password pending email
    const wasEmailSent = await mailer.sendPasswordResetPendingEmail(email, passwordResetUrl);

    // Send response
    res.status(200).json({
      severity: wasEmailSent ? SeveritySuccess : SeverityError,
      message: wasEmailSent ? 'Password reset email was sent.' : 'Error sending password reset email.'
    });
  } catch (err) {
    console.error(`${serverError} Error: ${err}`);
    res.status(500).send(serverError);
    next(err);
  }
};

const verifyResetPasswordToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;

    // Validate token
    try {
      await userService.verifyToken(token, passwordResetSecret);
    } catch (err: any) {
      if (err instanceof VerificationError) return res.status(err.code).send(err.message);
      throw err;
    }

    // Send response
    res.status(200).send('Password reset succeeded.');
  } catch (err) {
    console.error(`${serverError} Error: ${err}`);
    res.status(500).send(serverError);
    next(err);
  }
};

const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { params: { token }, body: { password } } = req;

    // Validate token
    let id;
    try {
      ({ id } = await userService.verifyToken(token, passwordResetSecret));
    } catch (err: any) {
      if (err instanceof VerificationError) return res.status(err.code).send(err.message);
      throw err;
    }

    // Validate password
    const validationSchema = yup.object({
      password: passwordValidationSchema
    });
    try {
      await validationSchema.validate({ password }, { abortEarly: false });
    } catch (err: any) {
      return res.status(400).send(err.errors[0]);
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Set user password
    await User.update({ password: hash }, { where: { id } });

    // Send response
    res.status(200).send('Password reset succeeded.');
  } catch (err) {
    console.error(`${serverError} Error: ${err}`);
    res.status(500).send(serverError);
    next(err);
  }
};

const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Fetch all users
    const users = await User.findAll({
      attributes: {
        exclude: ['password', 'deletedAt'],
        include: ['active']
      },
      order: [
        ['fname', 'ASC'],
        ['lname', 'ASC']
      ]
    });

    // Send response
    res.status(200).json({
      users
    });
  } catch (err) {
    console.error(`${serverError} Error: ${err}`);
    res.status(500).send(serverError);
    next(err);
  }
};

const changeActiveState = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { params: { id } } = req;

    // Get user
    const user = await User.findByPk(id, { paranoid: false });
    if (!user) return res.status(400).send('User doesn\'t exist.');

    // Change user active state
    if (user.deletedAt) await user.restore();
    else await user.destroy();

    res.status(200).send('User state change succeeded.');
  } catch (err) {
    console.error(`${serverError} Error: ${err}`);
    res.status(500).send(serverError);
    next(err);
  }
};

export {
  register,
  sendVerificationEmail,
  verify,
  sendResetPasswordEmail,
  verifyResetPasswordToken,
  resetPassword,
  list,
  changeActiveState
};
