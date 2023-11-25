import { Sequelize } from 'sequelize';
import {databaseHost, databaseName, databasePassword, databaseUsername} from "../config/env";

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
import { Workweek } from "./Workweek";
import { Workday } from './Workday';

// Relations setup
import './relations';

export {
  // Sequelize instance
  sequelize,

  // Models
  User,
  Workweek,
  Workday
};
