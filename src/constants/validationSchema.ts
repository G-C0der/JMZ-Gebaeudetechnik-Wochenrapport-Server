import * as yup from "yup";
import {userFieldLengths} from "./user";
import {escapeForRegExp, timeStringToMinutes} from "../utils";
import {codes, workdayFieldLengths} from "./workday";

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
    .oneOf(codes, 'Type is invalid.')
}).test('time-validation', 'Time validation failed', function(value) {
  const { from, to, from2, to2 } = value;

  if (to && !from) {
    return this.createError({ path: 'from', message: 'From is required when To is set.' });
  }

  if (from && !to) {
    return this.createError({ path: 'to', message: 'To is required when From is set.' });
  }

  if (to2 && !from2) {
    return this.createError({ path: 'from2', message: 'From2 is required when To2 is set.' });
  }

  if (from2 && !to2) {
    return this.createError({ path: 'to2', message: 'To2 is required when From2 is set.' });
  }

  if (from && to && timeStringToMinutes(from) >= timeStringToMinutes(to)) {
    return this.createError({ path: 'to', message: 'To has to be later than From.' });
  }

  if (to && from2 && timeStringToMinutes(to) >= timeStringToMinutes(from2)) {
    return this.createError({ path: 'from2', message: 'From2 has to be later than To.' });
  }

  if (from2 && to2 && timeStringToMinutes(from2) >= timeStringToMinutes(to2)) {
    return this.createError({ path: 'to2', message: 'To2 has to be later than From2.' });
  }

  return true;
});

export {
  emailValidationSchema,
  passwordValidationSchema,
  workdayValidationSchema
};
