import { DataTypes, Model } from 'sequelize';
import {sequelize} from './';
import {codes, timeRegex, workdayFieldLengths, workdayProjectFieldLengths} from "../constants";

interface Project {
  from: string;
  to: string;
  from2: string;
  to2: string;
  project: string;
  code: number;
}

class Workday extends Model {
  public id!: number;
  public workweekId!: number;
  public date!: Date;
  public projects!: Project[];

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
  projects: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      isProjectListValid(projects: any) {
        const isProject = (obj: any): obj is Project => {
          // Check that value does only contain valid project fields
          const validKeys: Array<keyof Project> = ['from', 'to', 'from2', 'to2', 'project', 'code'];
          for (const key in obj) {
            if (!validKeys.includes(key as keyof Project)) return false;
          }

          return (
            obj.from === null || (typeof obj.from === 'string' && timeRegex.test(obj.from)) &&
            obj.to === null || (typeof obj.to === 'string' && timeRegex.test(obj.to)) &&
            obj.from2 === null || (typeof obj.from2 === 'string' && timeRegex.test(obj.from2)) &&
            obj.to2 === null || (typeof obj.to2 === 'string' && timeRegex.test(obj.to2)) &&
            typeof obj.project === 'string' && obj.project.length > 0 && obj.project.length <= workdayProjectFieldLengths.project.max &&
            typeof obj.code === 'number' && codes.includes(obj.code)
          );
        };

        // Check if projects is an actual array with valid item count
        if (!Array.isArray(projects) || projects.length < workdayFieldLengths.projects.min || projects.length > workdayFieldLengths.projects.max) {
          throw new Error('Invalid project list.');
        }

        // Check if all projects valid
        for (const project of projects) {
          if (!project || typeof project !== 'object' || !isProject(project)) throw new Error('Invalid project list.');
        }
      }
    }
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
