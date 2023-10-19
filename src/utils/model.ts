import {Model} from "sequelize";

const toEditableModelFields = (modelFields: Partial<Model>, editableModelFields: string[]) => Object.fromEntries(
  Object.entries(modelFields).filter(([key]) => editableModelFields.includes(key))
);

export {
  toEditableModelFields
};
