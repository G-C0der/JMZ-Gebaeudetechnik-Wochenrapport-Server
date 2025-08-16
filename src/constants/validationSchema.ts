import * as yup from "yup";
import {userFieldLengths} from "./user";
import {escapeForRegExp, timeStringToMinutes} from "../utils";
import {
  codes,
  workdayFieldLengths,
  workdayProjectFieldLengths
} from "./workday";

const passwordSpecialCharacters = '*.!@#$%^&(){}[\]:;<>,.?\/~_+\-=|\\';
const passwordSpecialCharactersDoubleEscaped = escapeForRegExp(passwordSpecialCharacters);

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

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
  date: yup.date().required('Date is required.'),
  projects: yup.array().of(
    yup.object({
      from: yup.string().nullable().matches(timeRegex),
      to: yup.string().nullable().matches(timeRegex),
      from2: yup.string().nullable().matches(timeRegex),
      to2: yup.string().nullable().matches(timeRegex),
      project: yup.string()
        .required('Project is required.')
        .max(workdayProjectFieldLengths.project.max, `Project too long - max ${workdayProjectFieldLengths.project.max} chars.`),
      code: yup.number()
        .required('Type is required.')
        .oneOf(codes, 'Type is invalid.')
    }).test('time-validation', 'Time validation failed', function (proj) {
      const { from, to, from2, to2 } = proj;

      if (to && !from) return this.createError({ path: `from`, message: 'From is required when To is set.' });
      if (from && !to) return this.createError({ path: `to`, message: 'To is required when From is set.' });

      if (to2 && !from2) return this.createError({ path: `from2`, message: 'From2 is required when To2 is set.' });
      if (from2 && !to2) return this.createError({ path: `to2`, message: 'To2 is required when From2 is set.' });

      if (from && to && timeStringToMinutes(from) >= timeStringToMinutes(to)) {
        return this.createError({ path: `to`, message: 'To must be after From.' });
      }

      if (to && from2 && timeStringToMinutes(to) >= timeStringToMinutes(from2)) {
        return this.createError({ path: `from2`, message: 'From2 must be after To.' });
      }

      if (from2 && to2 && timeStringToMinutes(from2) >= timeStringToMinutes(to2)) {
        return this.createError({ path: `to2`, message: 'To2 must be after From2.' });
      }

      return true;
    })
  ).min(workdayFieldLengths.projects.min).max(workdayFieldLengths.projects.max)
});

export {
  emailValidationSchema,
  passwordValidationSchema,
  workdayValidationSchema,

  timeRegex
};
