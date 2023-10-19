import { Sequelize } from 'sequelize';
import {databaseHost, databaseName, databasePassword, databaseUsername} from "../config";

const sequelize = new Sequelize(
  databaseName!,
  databaseUsername,
  databasePassword, {
    host: databaseHost,
    dialect: 'mysql'
  }
);

// Models initialization
import { User } from './User';
import { Workday } from './Workday';

// Relations setup
import './relations';

export {
  // Sequelize instance
  sequelize,

  // Models
  User,
  Workday
};
