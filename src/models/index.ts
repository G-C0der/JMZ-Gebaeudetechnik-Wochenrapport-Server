import { Sequelize } from 'sequelize';
import {databaseHost, databaseName, databasePassword, databaseUsername, isProdEnv, jawsDbMariaUrl} from "../config/env";

const sequelize = isProdEnv
  ? new Sequelize(jawsDbMariaUrl!, {
    dialect: 'mysql',
    protocol: 'mysql',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  })
  : new Sequelize(
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
