import codeMap from '../data/codes.json';

const workdayFieldLengths = {
  from: { max: 5 },
  to: { max: 5 },
  from2: { max: 5 },
  to2: { max: 5 },
  project: { max: 200 }
};

const workdayFormFields = [
  'date',
  'from',
  'to',
  'from2',
  'to2',
  'project',
  'code'
];

const editableWorkdayFields = workdayFormFields.filter(field => field !== 'date');

const codes = Object.keys(codeMap).map(Number);

export {
  workdayFieldLengths,
  workdayFormFields,
  editableWorkdayFields,

  codeMap,
  codes
};
