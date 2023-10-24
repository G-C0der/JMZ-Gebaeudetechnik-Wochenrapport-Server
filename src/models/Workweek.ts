import { DataTypes, Model } from 'sequelize';
import {sequelize} from './';

class Workweek extends Model {
  public id!: number;
  public userId!: number;
  public start!: Date;
  public end!: Date;
  public approved!: boolean;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Workweek.init({
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
  start: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  end: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  approved: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  sequelize,
  tableName: 'workweeks',
  indexes: [
    {
      fields: ['userId', 'start', 'end'],
      unique: true
    }
  ]
});

export {
  Workweek
};
