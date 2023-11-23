import * as yup from "yup";
import {userFieldLengths} from "./user";
import {escapeForRegExp} from "../utils";
import {workdayFieldLengths} from "./workday";

const passwordSpecialCharacters = '*.!@#$%^&(){}[\]:;<>,.?\/~_+\-=|\\';
const passwordSpecialCharactersDoubleEscaped = escapeForRegExp(passwordSpecialCharacters);

const timeRegex = new RegExp('^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$');

const emailValidationSchema = yup
  .string()
  .required('Email is required.')
  .max(userFieldLengths.email.max, `Email is too long - should be maximum ${userFieldLengths.email.max} characters.`)
  .email('Email is invalid.');

const passwordValidationSchema = yup
  .string()
  .required('Password is required.')
  .matches(new RegExp(`^[a-zA-Z0-9${passwordSpecialCharactersDoubleEscaped}]+$`),
    `Password can only contain Latin letters, numbers, and following special characters: ${passwordSpecialCharacters}`)
  .matches(/[A-Z]/, 'Password must contain at least one uppercase letter.')
  .matches(/[a-z]/, 'Password must contain at least one lowercase letter.')
  .matches(/[0-9]+/, 'Password must contain at least one digit.')
  .matches(new RegExp(`[${passwordSpecialCharactersDoubleEscaped}]+`),
    'Password must contain at least one special character.')
  .min(userFieldLengths.password.min, `Password is too short - should be minimum ${userFieldLengths.password.min} characters.`);

const workdayValidationSchema = yup.object({
  date: yup
    .date()
    .required('Date is required.'),
  from: yup
    .string()
    .nullable()
    .matches(timeRegex),
  to: yup
    .string()
    .nullable()
    .matches(timeRegex),
  from2: yup
    .string()
    .nullable()
    .matches(timeRegex),
  to2: yup
    .string()
    .nullable()
    .matches(timeRegex),
  project: yup
    .string()
    .required('Project is required.')
    .max(workdayFieldLengths.project.max,
      `Project is too long - should be maximum ${workdayFieldLengths.project.max} characters.`),
  code: yup
    .number()
    .required('Type is required.')
    .min(100, 'Type is required.')
    .max(999, 'Type is required.')
});

export {
  emailValidationSchema,
  passwordValidationSchema,
  workdayValidationSchema
};
