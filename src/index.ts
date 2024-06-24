import express, { Application } from 'express';
import * as dotenv from 'dotenv';
import 'reflect-metadata';
import { Container } from 'typedi';
import { createExpressServer, useContainer } from 'routing-controllers';
import { AuthController } from './controller/AuthController';
import { AccountController } from './controller/AccountController';
import { TransactionController } from './controller/TransactionController';
import { errorHandler } from './middlewares/error';
// import { AuthMiddleware } from './middlewares/auth-middleware';

dotenv.config();

useContainer(Container);

const app: Application = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use(errorHandler)
// Create express server and register controllers
const routingControllersApp = createExpressServer({
  routePrefix: '/api',
  controllers: [AuthController, TransactionController, AccountController],
  // middlewares: [AuthMiddleware],
});

// Start the server
routingControllersApp.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
