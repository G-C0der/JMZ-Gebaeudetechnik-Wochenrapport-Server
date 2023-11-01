import { DataTypes, Model } from 'sequelize';
import {sequelize} from './';
import {userFieldLengths} from "../constants";

class User extends Model {
  public id!: number;
  public email!: string;
  public password!: string;
  public verified!: boolean;
  public active!: boolean;
  public admin!: boolean;
  public title?: string;
  public fname?: string;
  public lname?: string;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

User.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: new DataTypes.STRING(userFieldLengths.email.max),
    allowNull: false,
    unique: true,
    set (value: string) {
      this.setDataValue('email', value.trim().toLowerCase());
    }
  },
  password: {
    type: new DataTypes.STRING(128),
    allowNull: false
  },
  verified: {
    type: new DataTypes.BOOLEAN(),
    allowNull: false,
    defaultValue: false
  },
  active: {
    type: new DataTypes.VIRTUAL,
    get() {
      return !this.getDataValue('deletedAt');
    }
  },
  admin: {
    type: new DataTypes.BOOLEAN(),
    allowNull: false,
    defaultValue: false
  },
  title: {
    type: new DataTypes.STRING(userFieldLengths.title.max),
    set (value: string) {
      this.setDataValue('title', value.trim());
    }
  },
  fname: {
    type: new DataTypes.STRING(userFieldLengths.fname.max),
    set (value: string) {
      this.setDataValue('fname', value.trim());
    }
  },
  lname: {
    type: new DataTypes.STRING(userFieldLengths.lname.max),
    set (value: string) {
      this.setDataValue('lname', value.trim());
    }
  }
}, {
  sequelize,
  tableName: 'users',
  paranoid: true
});

export {
  User
};
