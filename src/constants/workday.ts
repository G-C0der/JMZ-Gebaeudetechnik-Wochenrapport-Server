const workdayFieldLengths = {
  from: { max: 5 },
  to: { max: 5 },
  from2: { max: 5 },
  to2: { max: 5 },
  project: { max: 200 }
};

const editableWorkdayFields = [
  'date',
  'from',
  'to',
  'from2',
  'to2',
  'project',
  'code'
];

export {
  workdayFieldLengths,
  editableWorkdayFields
};
