import codeMap from '../data/codes.json';

const workdayFieldLengths = {
  projects: { min: 1, max: 5 }
};

const workdayProjectFieldLengths = {
  from: { max: 5 },
  to: { max: 5 },
  from2: { max: 5 },
  to2: { max: 5 },
  project: { max: 200 }
};

const workdayFormFields = [
  'date',
  'projects',
];

const editableWorkdayFields = workdayFormFields.filter(field => field !== 'date');

const codes = Object.keys(codeMap).map(Number);

export {
  workdayFieldLengths,
  workdayProjectFieldLengths,
  workdayFormFields,
  editableWorkdayFields,

  codeMap,
  codes,
};
