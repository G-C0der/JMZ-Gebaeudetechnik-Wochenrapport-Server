const userFieldLengths = {
  title: { max: 64 },
  fname: { max: 64 },
  lname: { max: 64 },
  email: { max: 128 },
  password: { min: 8 }
};

const credFields = ['email', 'password'];
const editableUserFields = Object.keys(userFieldLengths).filter(field => !credFields.includes(field));

export {
  userFieldLengths,
  editableUserFields
};
