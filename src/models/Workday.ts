import { DataTypes, Model } from 'sequelize';
import {sequelize} from './';
import {workdayFieldLengths} from "../constants";

class Workday extends Model {
  public id!: number;
  public date!: Date;
  public from!: string;
  public to!: string;
  public from2!: string;
  public to2!: string;
  public project!: string;
  public code!: number;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Workday.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  workweekId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'workweeks',
      key: 'id'
    }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  from: {
    type: DataTypes.STRING(workdayFieldLengths.from.max)
  },
  to: {
    type: DataTypes.STRING(workdayFieldLengths.to.max)
  },
  from2: {
    type: DataTypes.STRING(workdayFieldLengths.from2.max)
  },
  to2: {
    type: DataTypes.STRING(workdayFieldLengths.to2.max)
  },
  project: {
    type: DataTypes.STRING(workdayFieldLengths.project.max),
    allowNull: false
  },
  code: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'workdays',
  indexes: [
    {
      fields: ['workweekId', 'date'],
      unique: true
    }
  ]
});

export {
  Workday
};
