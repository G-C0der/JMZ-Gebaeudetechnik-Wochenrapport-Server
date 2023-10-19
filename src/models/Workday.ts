import { DataTypes, Model } from 'sequelize';
import {sequelize} from './';

class Workday extends Model {
  public id!: number;
  public userId!: number;
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
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  from: {
    type: DataTypes.STRING
  },
  to: {
    type: DataTypes.STRING
  },
  from2: {
    type: DataTypes.STRING
  },
  to2: {
    type: DataTypes.STRING
  },
  project: {
    type: DataTypes.STRING,
    allowNull: false
  },
  code: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'workdays'
});

export {
  Workday
};
