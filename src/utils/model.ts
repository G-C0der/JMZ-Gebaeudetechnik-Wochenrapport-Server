import {Model} from "sequelize";

const filterModelFields = (modelFields: Partial<Model>, selectedModelFields: string[]) => Object.fromEntries(
  Object.entries(modelFields).filter(([key]) => selectedModelFields.includes(key))
);

export {
  filterModelFields
};
