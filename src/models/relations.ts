import { User, Workweek, Workday } from './index';

User.hasMany(Workweek, { as: 'workweeks', foreignKey: 'userId' });
Workweek.belongsTo(User, { as: 'user', foreignKey: 'userid' });

Workweek.hasMany(Workday, { as: 'workdays', foreignKey: 'workweekId' });
Workday.belongsTo(Workweek, { as: 'workweek', foreignKey: 'workweekId' });
