

import express, { Application } from 'express';
import * as dotenv from 'dotenv';
import 'reflect-metadata';
import { Container } from 'typedi';
import { useExpressServer, useContainer } from 'routing-controllers';
import { AccountController } from './controller/account.controller';
import { TransactionController } from './controller/transaction.controller';
import 'express-async-errors';
import { CustomErrorHandler } from './middlewares/error';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { CheckIfUserIsBlacklisted } from './middlewares/check-if-user-is-blacklisted';
import bodyParser from 'body-parser';
import { UserController } from './controller/user.controller';

dotenv.config();

useContainer(Container);

const app: Application = express();
const port = process.env.PORT || 5000;

// Use the JSON body parser middleware globally
app.use(bodyParser.json());

// Create express server and register controllers
useExpressServer(app, {
  routePrefix: '/api',
  controllers: [UserController, AccountController],
  middlewares: [AuthMiddleware, CustomErrorHandler,CheckIfUserIsBlacklisted],
  defaultErrorHandler: false, // disable default error handler if using a custom one
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
