import express from 'express';
import cors from 'cors';
import router from './routes';
import { sequelize } from './models';
import {appPort} from "./config/env";
import './types/Express';
import './config/moment';

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/v1', router);

// start server
sequelize.sync().then(() => {
  app.listen(appPort, () => {
    console.log(`Server is running on port ${appPort}`);
  });
});
