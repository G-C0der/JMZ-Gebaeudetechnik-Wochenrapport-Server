import { User, Workday } from './index';

User.hasMany(Workday, { as: 'userWorkdays', foreignKey: 'userId' });
Workday.belongsTo(User, { as: 'user', foreignKey: 'userid' });
